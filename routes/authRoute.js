const express = require("express");
const routers = express.Router();
const createError = require("http-errors");
const User = require("../models/user_models");
const { authSchema } = require("../helpers/validation_schema");
const { signAccessToken } = require("../helpers/jwt_helper");

routers.post("/register", async (req, res, next) => {
  try {
    //request is validated
    const result = await authSchema.validateAsync(req.body);
    const { email, password } = result;
    // return
    //check for data missing
    if (!email || !password) throw createError.BadRequest("Data missing");
    //check for data already exists or not
    const doesExist = await User.findOne({ email: email });
    if (doesExist) throw createError.Conflict(`${email} already exists`);
    //create a new entry in database
    const user = new User({ email: email, password: password });
    // save the entry
    const saveduser = await user.save();
    const accessToken = await signAccessToken(saveduser.id);
    //send a response
    res.json({ accessToken: accessToken });
  } catch (err) {
    if (err.isJoi === true) {
      err.status = 422;
    }
    //handle if any error is found
    next(err);
  }
});

//login route
routers.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    //check if user exists
    if(!user) throw createError.NotFound("User not found!");
    //check if user exists
    const isMatch = await user.isValidPassword(result.password);
    if(!isMatch) throw createError.Unauthorized("Invalid user credentials!");
    const accessToken = await signAccessToken(user.id);
    res.send({login_token: accessToken});
  } catch (err) {
    if (err.isJoi == true) {
      return next(createError.BadRequest("Invalid UserID/password"));
    }
  }
});

routers.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token route");
});

routers.delete("/logout", async (req, res, next) => {
  res.send("Logout route");
});

module.exports = routers;
