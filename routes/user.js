 const { Router } = require("express");
const User = require("../models/user");

console.log("USER =", User);

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(
      email,
      password
    );

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.log(error);

    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
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

    return res.render("signup", {
      error: "Unable to create account",
    });
  }
});

module.exports = router;