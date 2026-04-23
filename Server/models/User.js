const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true
    },
    nid: {
      type: String,
      required: [true, "NID is required"],
      unique: true,
      trim: true
    },
    address: {
      type: String,
      required: [true, "Address is required"]
    },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);