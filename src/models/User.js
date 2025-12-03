const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
  {
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
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // 10-digit mobile number
    },

    role: {
      type: String,
      enum: ["user", "CERT"],
      default: "user",
    },

    user_id: {
      type: String,
      required: true,
      unique: true,
    },

    serviceId: {
      type: String,
      default: null,
    },

    mfaMethod: {
      type: String,
      enum: ["none", "totp", "sms", "email"],
      default: "none",
    },

    totpSecret: {
      type: String,
      default: null,
    },

    backupCodes: {
      type: [String],
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    accountLocked: {
      type: Boolean,
      default: false,
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// userSchema.pre('save', async function() {
//   if (!this.isModified('password')) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });


// userSchema.methods.comparePassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword,this.password);
// }


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema, "user_credentials_table");
