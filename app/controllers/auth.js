const mongoose = require('mongoose');
// const bCrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authHelper = require('../helpers/authHelper');
const { jwtSecret } = require('../../config/app').jwt;

const User = mongoose.model('User');
const Token = mongoose.model('Token');


const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token,
  }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .exec()
    .then((user) => {
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
};
const getAllUsers = (req, res) => {
  User.find()
    .exec()
    .then((user) => {
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
};

const signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(208).json({ message: 'User does not exist!' });
      } else {
        crypto.scrypt(password, jwtSecret, 64, (err, dk) => {
          if (user.password === dk.toString('hex')) {
            updateTokens(user._id)
              .then(tokens => res.json({ ...tokens, userId: user._id, userEmail: user.email }));
          } else {
            res.status(208).json({ message: 'Invalid credentials!' });
          }
        });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

const registration = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user === null) {
        crypto.scrypt(password, jwtSecret, 64, (err, hash) => {
          if (err === null) {
            User.create({ email, password: hash.toString('hex') })
              .then(createdUser => res.json(createdUser))
              .catch(error => res.status(500).json(error));
          } else {
            res.status(500).json(err);
          }
        });
      } else {
        res.status(208).json({ message: 'User with this email exist!' });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, jwtSecret);
    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token!1' });
      return;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Refresh token expired!' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Invalid token!2' });
      return;
    }
  }

  Token.findOne({ tokenId: payload.id })
    .exec()
    .then(token => updateTokens(token.userId))
    .then(tokens => res.json(tokens))
    .catch(err => res.status(400).json({ message: err }));
};

module.exports = {
  signIn,
  refreshTokens,
  registration,
  getAllUsers,
  getUser,
};
