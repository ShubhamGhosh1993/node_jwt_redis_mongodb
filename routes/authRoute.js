const express = require("express");
const routers = express.Router();
const createError = require("http-errors");
const User = require("../models/user_models");
const {authSchema} = require("../helpers/validation_schema");

routers.post("/register", async (req, res, next) => {
  try {
    //request is validated
    const result = await authSchema.validateAsync(req.body);
    const {email, password} = result;
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
    //send a response
    res.send(saveduser);
  } catch (err) {
    if (err.isJoi === true) {err.status = 422;}
    //handle if any error is found
    next(err);
  }
});

routers.post("/login", async (req, res, next) => {
  res.send("Login route");
});

routers.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token route");
});

routers.delete("/logout", async (req, res, next) => {
  res.send("Logout route");
});

module.exports = routers;
