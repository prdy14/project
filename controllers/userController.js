const User = require("../models/user");

function getAllUsers(req, res) {
  const users = User.getAll();
  res.json(users);
}

function getUserById(req, res) {
  const { id } = req.params;
  const user = User.getById(id);

  if (!user) {
    return res.sendStatus(404);
  }

  res.json(user);
}

function createUser(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.sendStatus(400);
  }

  const newUser = User.create({ username, password });
  res.status(201).json(newUser);
}

function updateUser(req, res) {
  const { id } = req.params;
  const { username, password } = req.body;
  const updatedUser = User.update(id, { username, password });

  if (!updatedUser) {
    return res.sendStatus(404);
  }

  res.json(updatedUser);
}

function deleteUser(req, res) {
  const { id } = req.params;
  const deletedUser = User.remove(id);

  if (!deletedUser) {
    return res.sendStatus(404);
  }

  res.json(deletedUser);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
