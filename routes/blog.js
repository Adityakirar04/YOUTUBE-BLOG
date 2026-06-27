 const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  console.log("GET /blog/add-new");
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    const comments = await Comment.find({
      blogId: req.params.id,
    }).populate("createdBy");

    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});

router.post("/comment/:blogId", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    return res.redirect("/blog/" + req.params.blogId);
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log("POST /blog HIT");
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  console.log("USER:", req.user);

  try {
    if (!req.user) {
      return res.send("User not logged in");
    }

    if (!req.file) {
      return res.send("Please upload image");
    }

    const blog = await Blog.create({
      title: req.body.title,
      body: req.body.body,
      createdBy: req.user._id,
      coverImageURL: "/uploads/" + req.file.filename,
    });

    console.log("BLOG CREATED:", blog);

    return res.redirect("/blog/" + blog._id);
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});

module.exports = router;