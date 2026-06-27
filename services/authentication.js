 require("dotenv").config();

const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    return jwt.sign(payload, secret);
}

function validateToken(token) {
    return jwt.verify(token, secret);
}

module.exports = {
    createTokenForUser,
    validateToken,
};