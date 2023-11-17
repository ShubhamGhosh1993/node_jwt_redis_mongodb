require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const httpErrors = require("http-errors");

//initializing application
const app = express();
//morgan logging
app.use(morgan("dev"));
//initiating json for express
app.use(express.json());
//initiating form data for express
app.use(express.urlencoded({ extended: true }));
//initiating JWT
const { verifyJWT } = require("./helpers/jwt_helper");

//initializing mongodb
require("./helpers/init_mongodb");

//initializing controllers
const authRoute = require("./routes/authRoute");

//authentication routes
app.use("/auth", authRoute);

app.get("/", verifyJWT, async (req, res, next) => {
  console.log(req.headers["authorization"]);
  console.log(req.payload);

  res.send("Hello from express");
});
//error handlers
app.use(async (req, res, next) => {
  const error = httpErrors(404, "Route not found.");
  next(error);
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      stauts: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening to ${process.env.APP_PORT}`);
});
