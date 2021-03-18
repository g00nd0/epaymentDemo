const mongoose = require("mongoose");

const txSchema = new mongoose.Schema(
  {
    // sender: { type: mongoose.Schema.Types.ObjectID, required: true },
    // recipient: { type: mongoose.Schema.Types.ObjectID, required: true },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    txAmount: { type: Number, required: true },
    description: { type: String, default: "nil" },
  },
  { timestamps: true }
);

module.exports = txSchema;