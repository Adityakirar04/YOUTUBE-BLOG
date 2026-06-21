 const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    await User.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
});

module.exports = router;