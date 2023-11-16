const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, { dbname: "demo" })
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.error(err.message);
  });
//connection from mongo db
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected again");
});

//error from mongo db
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

//disconnection from mongo db
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose is disconnected from the app");
});

//process events
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
