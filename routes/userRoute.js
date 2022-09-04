const router = require("express").Router();
const { json } = require("express");
const fs = require("fs");

//common function
function getAllUser() {
  const users = fs.readFileSync("./data.json");
  return JSON.parse(users);
}

const users = getAllUser();

//get all user
router.get("/all", (req, res) => {
  const limit = req.query.limit;
  if (limit) {
    const sliceUser = users.slice(0, limit);
    res.status(200).send(sliceUser);
  } else {
    res.status(200).send(users);
  }
});

//get user by id
router.get("single/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = users.find((user) => user.id === id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(401).json({ message: "user not found" });
  }
});

//get random user
router.get("/random", (req, res) => {
  const randomId = Math.round(Math.random() * (users.length - 1) + 1);
  const randomUser = users.find((user) => parseInt(user.id) === randomId);
  res.status(200).send(randomUser);
});

//post a user
router.post("/", (req, res) => {
  const newUser = req.body;
  const newUserId = parseInt(Math.floor(newUser.id));
  const existingUser = users.find((user) => parseInt(user.id) === newUserId);
  const { id, name, address, gender, contact, photo } = newUser;
  if (id && name && address && gender && contact && photo) {
    if (existingUser) {
      res
        .status(401)
        .json({
          message: `user id already registered please input more then ${users.length} as id`,
        });
    }
    if (newUserId !== users.length + 1) {
      res.json({ message: `new user id is must be ${users.length + 1}` });
    } else {
      users.push({ id, name, address, contact, gender, photo });
      fs.writeFileSync("./data.json", JSON.stringify(users), "utf-8");
      res.status(200).json({ message: "user registered successfully" });
    }
  } else {
    res
      .status(400)
      .json({
        message: `user object must be need id, name, address, gender, contact, photo`,
      });
  }
});

//update an user
router.put("/update", (req, res) => {
  const { id, contact } = req.body;
  const existingUser = users.find(
    (user) => parseInt(user.id) === parseInt(Math.floor(id))
  );
  fs.readFile(
    "./data.json",
    null,
    (err, data) => {
      if (!err) {
        existingUser.contact = contact;
        res.send(`contact number with id ${existingUser.id} has been updated`);
      } else {
        res.json({ error: err.message });
      }
    },
    true
  );
});

//delete user
router.delete("/delete", (req, res) => {
  const { id } = req.body;
  const existingUser = users.find(
    (user) => parseInt(user.id) === parseInt(Math.floor(id))
  );
  if (existingUser) {
    fs.readFile(
      "./data.json",
      null,
      (err, data) => {
        if (!err) {
          const currentUsers = users.filter(
            (user) => parseInt(user.id) !== parseInt(Math.floor(id))
          );
          fs.writeFileSync(
            "./data.json",
            JSON.stringify(currentUsers),
            "utf-8"
          );
          res.send(`user with id ${existingUser.id} has been deleted`);
        } else {
          res.json({ error: err.message });
        }
      },
      true
    );
  } else {
    res.status(401).json({ message: "user not found" });
  }
});

module.exports = router;
