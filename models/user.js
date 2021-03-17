const mongoose = require("mongoose");
const txSchema = require("./tx");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNum: { type: Number, required: true, min: 10000000, max: 99999999 },
    username: { type: String, required: true, unique: true, minlength: 8 },
    password: { type: String, required: true },
    currentBalance: { type: Number, required: false, default: 0},
    txHistory: [txSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;