const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// require("dotenv").config();

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      User: {
        type: Number,
        default: 7971,
      },
      Editor: Number,
      Admin: Number,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
