const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const signupModal = mongoose.model("Usersignup", signupSchema);
module.exports = signupModal;
