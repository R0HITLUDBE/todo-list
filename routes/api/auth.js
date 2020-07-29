const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// USER MODEL
const User = require("../../models/User");

// @route   POST api/auth
// @desc    Auth user
// @access  Public

router.post("/", (req, res) => {
  const { email, password } = req.body;
  //   SIMPLE VALIDATION
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  //   CHECK FOR EXISTING USER
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exists" });
    //   VALIDATE PASSWORD
    bcrypt.compare(password, user.password).then((isMatched) => {
      if (!isMatched)
        return res.status(400).json({ msg: "invalid credentials" });

      jwt.sign({ id: user.id }, config.get("jwtSecret"), (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      });
    });
  });
});

//// @route   GET api/auth
// @desc    get user data
// @access  Private

router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
