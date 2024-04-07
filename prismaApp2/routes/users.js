var express = require("express");
var router = express.Router();
const { getAllUsers, getUserById, createUser } = require("../models/users.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  getAllUsers().then((users) => res.json(users));
});

router.get("/:id", function (req, res, next) {
  getUserById(+req.params.id).then((user) => res.json(user));
});

router.post("/", function (req, res, next) {
  const userData = req.body;
  createUser(userData)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
