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
        expiresIn:"10s",
        issuer : "abcd.com",
        // audience: userId
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },
  verifyJWT: (req,res,next)=>{
    if(!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeaderToken = req.headers["authorization"];
    const bearerToken = authHeaderToken.split(" ");
    token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, payload)=>{
      if(err) return next(createError.Unauthorized());
      req.payload = payload;
      next();
    })
  }
}
