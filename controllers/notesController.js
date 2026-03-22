const Note = require("../models/Note");
const User = require("../models/User");

function parsePositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return n;
}

function buildDateRange(fromStr, toStr) {
  if (!fromStr && !toStr) return undefined;
  const range = {};
  if (fromStr) range.$gte = new Date(fromStr);
  if (toStr) {
    const d = new Date(toStr);
    // include full 'to' date in user's timezone approximation
    d.setHours(23, 59, 59, 999);
    range.$lte = d;
  }
  return range;
}

module.exports = {
  dashboard: async (req, res, next) => {
    try {
      const q = (req.query.q || "").trim();
      const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

      const page = parsePositiveInt(req.query.page, 1);
      const limit = Math.min(parsePositiveInt(req.query.limit, 10), 20);
      const skip = (page - 1) * limit;

      const filter = { userId: req.userId };

      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
        ];
      }

      const createdAtRange = buildDateRange(req.query.from, req.query.to);
      if (createdAtRange) filter.createdAt = createdAtRange;

      const [notes, total] = await Promise.all([
        Note.find(filter).sort(sort).skip(skip).limit(limit),
        Note.countDocuments(filter),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return res.render("dashboard", {
        notes,
        total,
        page,
        totalPages,
        limit,
        query: {
          q,
          sort: req.query.sort || "latest",
          from: req.query.from || "",
          to: req.query.to || "",
        },
      });
    } catch (err) {
      return next(err);
    }
  },

  newForm: (req, res) => res.render("createNote", { title: "", content: "" }),

  create: async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const note = await Note.create({
        title,
        content: content || "",
        userId: req.userId,
      });

      req.flash("success", "Note created successfully.");
      return res.redirect("/notes/dashboard");
    } catch (err) {
      return next(err);
    }
  },

  editForm: async (req, res, next) => {
    try {
      const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
      if (!note) {
        req.flash("error", "Note not found.");
        return res.redirect("/notes/dashboard");
      }
      return res.render("editNote", { note });
    } catch (err) {
      return next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { title, content } = req.body;

      const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { $set: { title, content: content || "" } },
        { new: true }
      );

      if (!note) {
        req.flash("error", "Note not found.");
        return res.redirect("/notes/dashboard");
      }

      req.flash("success", "Note updated successfully.");
      return res.redirect("/notes/dashboard");
    } catch (err) {
      return next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const deleted = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });

      if (!deleted) {
        req.flash("error", "Note not found.");
        return res.redirect("/notes/dashboard");
      }

      req.flash("success", "Note deleted successfully.");
      return res.redirect("/notes/dashboard");
    } catch (err) {
      return next(err);
    }
  },
};

