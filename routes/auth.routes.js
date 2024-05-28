const express = require("express");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const isAuthenticated = require("../middleware/isAuthenticated");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const saltRounds = 10;

authRouter.post("/auth/signup", (req, res) => {
  const { email, password, name, playerName } = req.body;
  if (!email || !password || !name || !playerName) {
    res.status(400).json({ message: "Please fill all the fields" });
    return;
  }
  const salt = bcrypt.genSaltSync(saltRounds);

  bcrypt
    .hash(password, salt)
    .then((hashedPassword) => {
      User.create({
        email,
        password: hashedPassword,
        name,
        playerName,
      })
        .then((response) => {
          res
            .status(200)
            .json({ response: response, message: "user succesfully created" });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "something went wrong", error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error hashing password", error: error });
    });
});

authRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please fill all the fields" });
    return;
  }
  User.findOne({ email })
    .then((findUser) => {
      if (!findUser) {
        res.json({
          message: "user is not found, please sign up the platform",
        });
        return;
      }
      const isMatch = bcrypt.compareSync(password, findUser.password);

      if (!isMatch) {
        res.json({ message: "please correct password" });
        return;
      }
      console.log(findUser, "f");
      const { password: _, __v, ...payload } = findUser.toObject();
      //toOBject converts jsobject the moongoose document
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.json({ message: "succesfull login", authToken: token, payload });
    })
    .catch((error) => {
      res.json({ message: "a problem has been occured" });
    });
});

authRouter.post("/auth/logout", (req, res) => {
  // On the client side, remove the token to log the user out.
  res.status(200).json({ message: "Logout successful" });
});

authRouter.get("/auth/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = authRouter;
