const express = require("express");
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/isAuthenticated");

const userRouter = express.Router();

userRouter.get("/api/users/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((response) => {
      const { password, __v, ...rest } = response.toObject();
      res.status(200).json(rest);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

userRouter.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      image: req.body.image || "https://i.imgur.com/r8bo8u7.png",
      playerName: req.body.playerName,
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

userRouter.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((response) => {
      res.status(200).json({ message: "user deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = userRouter;
