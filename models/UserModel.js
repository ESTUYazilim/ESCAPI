const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 64,
      min: 2,
    },
    studentNumber: {
      type: String,
      required: true,
      max: 32,
      min: 1,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6,
    },
    department: {
      type: String,
      required: true,
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    contacts: {
      github: {
        type: String,
        max: 1024,
        min: 6,
      },
      linkedin: {
        type: String,
        max: 1024,
        min: 6,
      },
      personalWebsite: {
        type: String,
        max: 1024,
        min: 6,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSchema", UserSchema);
