const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = "praveen1";
const REFRESH_SECRET = "praveen2";

function generateAccessToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "1m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_SECRET);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.headers["x-refresh-token"];

        if (!refreshToken) {
          return res.sendStatus(401);
        }

        jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
          if (err) {
            return res.sendStatus(403);
          }

          const accessToken = generateAccessToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.set("Authorization", `Bearer ${accessToken}`);
          req.user = { id: decoded.id, username: decoded.username };
          next();
        });
      } else {
        return res.sendStatus(403);
      }
    } else {
      req.user = user;
      next();
    }
  });
}
function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.sendStatus(400);
  }

  if (User.findByUsername(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const newUser = User.create({ username, password });

  res.status(201).json({ message: "User registered successfully" });
}

function login(req, res) {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || user.password !== password) {
    return res.sendStatus(401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    username: user.username,
  });

  res.json({ accessToken, refreshToken });
}

module.exports = {
  authenticateToken,
  login,
  register,
};
