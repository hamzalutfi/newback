const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    type: String,
    required: false,
  },
  file: {
    type: String,
    required: false,
  },
  disabilityType: {
    type: String,
    required: false,
  },
  donationType: {
    type: String,
    required: false,
  },

  caseDescription: {
    type: String,
    required: false,
  },
  needDescription: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  userDisabled: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  userDoner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
const needs = mongoose.model("need", needSchema);
module.exports = needs;
