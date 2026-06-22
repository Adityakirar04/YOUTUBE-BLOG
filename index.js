 const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));

// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});

  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server Started at PORT:${PORT}`);
});