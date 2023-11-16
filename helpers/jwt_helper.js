const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve,reject) => {
      const payload = {
        aud: userId
      };
      const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
      const options = {
        expiresIn:"1h",
        issuer : "abcd.com",
        // audience: userId
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  }
}
