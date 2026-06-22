const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },

    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    addresses: [
      {
        label: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
        },

        fullName: String,
        phone: String,

        addressLine1: String,
        addressLine2: String,

        city: String,
        state: String,
        country: String,
        pincode: String,

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);




const User = mongoose.model("User", userSchema);

module.exports = User;