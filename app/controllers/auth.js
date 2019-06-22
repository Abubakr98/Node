const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require('../helpers/authHelper');
const { jwtSecret } = require('../../config/app').jwt;


const User = mongoose.model('User');
const Token = mongoose.model('Token');

const updateTokens = (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};

const getUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec()
        .then(user => {
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
            }
            const isValid = bCrypt.compareSync(password, user.password);
            if (isValid) {
                updateTokens(user._id).then(tokens => res.json({ ...tokens, userId: user._id, userEmail: user.email }));
            } else {
                res.status(208).json({ message: 'Invalid credentials!' });
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
                bCrypt.hash(password, 10, (err, hash) => {
                    User.create({ email: email, password: hash })
                        .then(createdUser => res.json(createdUser))
                        .catch(err => res.status(500).json(err));
                });
            } else {
                res.status(208).json({ message: "User with this email exist!" });
            }
        })
        .catch(err => res.status(500).json({ message: err.message }));
};

const refreshTokens = (req, res) => {
    const { refreshToken } = req.body;
    let payload;
    console.log(jwtSecret);
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
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: 'Invalid token!2' });
            return;
        }
    }

    Token.findOne({ tokenId: payload.id })
        .exec()
        .then((token) => {
            console.log(token);
            
            return updateTokens(token.userId);
        })
        .then(tokens => res.json(tokens))
        .catch(err => res.status(400).json({ message: "err.message" }));
};

module.exports = {
    signIn,
    refreshTokens,
    registration,
    getUser
};
