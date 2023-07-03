let users = [
  {
    id: 1,
    username: "john",
    password: "password",
  }, // password: "password"
  {
    id: 2,
    username: "jane",
    password: "password",
  }, // password: "password"
];

function getAll() {
  return users;
}

function getById(id) {
  return users.find((user) => user.id === Number(id));
}

function findByUsername(username) {
  return users.find((user) => user.username === username);
}

function create(user) {
  const newUser = { id: users.length + 1, ...user };
  users.push(newUser);
  return newUser;
}

function update(id, updatedUser) {
  const index = users.findIndex((user) => user.id === Number(id));
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    return users[index];
  }
  return null;
}

function remove(id) {
  const index = users.findIndex((user) => user.id === Number(id));
  if (index !== -1) {
    const deletedUser = users[index];
    users.splice(index, 1);
    return deletedUser;
  }
  return null;
}

module.exports = {
  getAll,
  getById,
  findByUsername,
  create,
  update,
  remove,
};
