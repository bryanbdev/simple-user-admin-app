import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide an valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be longer than 6 characters"],
    },
  },
  { timestamps: true }
);

// Mongoose Hook

// function fires before save
UserSchema.pre("save", async function (next) {
  console.log("new user is about to be created & saved", this);
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error.message);
  }
  next();
});

// function fires after save
UserSchema.post("save", function (doc, next) {
  console.log("New user has finally been created & saved", doc);
  next();
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
