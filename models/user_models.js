const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.isValidPassword = async function(password){
  console.log(password)
  try{
    return await bcrypt.compare(password, this.password)
  }catch(err){next(err)}
}

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.post("save", async function (next) {
  try {
    console.log("Called after saving");
  } catch (err) {
    next(err);
  }
});



// console.log(userSchema.methods);

const User = mongoose.model("User", userSchema);

module.exports = User;
