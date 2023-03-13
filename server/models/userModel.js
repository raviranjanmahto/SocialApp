const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "A user must have a first name"],
      trim: true,
      min: 2,
      max: 40,
    },
    lastName: {
      type: String,
      required: [true, "A user must have a last name"],
      trim: true,
      min: 2,
      max: 40,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      max: 70,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 40,
      select: false,
    },
    picture: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

// PASSWORD HASHING BEFORE SAVING WORKED ONLY ON CREATE OR ON SAVE
userSchema.pre("save", async function (next) {
  // Only run this function when password is actually modified!
  if (!this.isModified("password")) return next();

  //   Hash the password with cost of 11
  this.password = await bcrypt.hash(this.password, 11);
});

// dfg
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
