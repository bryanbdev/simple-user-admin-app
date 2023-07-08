import UserModel from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const handleErrors = (err) => {
  console.log(`WAIT, ERROR: ${err}`, err.code);

  // create errors object ---> will update later if errors occur
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  // check for validation errors from schema
  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach((error) => {
      console.log(error.properties.path);
      // modifying object ---> target properties of object then changes value of error
      errors[error.properties.path] = error.properties.message;
      console.log(errors);
    });
  }

  // check for duplicate key error (user already exist) --> unique in schema
  if (
    err.code === 11000 ||
    err.message.includes("E11000 duplicate key error collection")
  ) {
    console.log(Object.keys(err.keyValue)[0]); // gives me the key/property of the object --> (username OR email)
    let duplicate = Object.keys(err.keyValue)[0]; // email OR password
    errors[duplicate] = `This ${duplicate} already exists`;
  }

  return errors;
};

//===========================
// USER CONTROLLERS
//===========================

// get user dashboard
export const get_user_dashboard = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).render("pages/dashboard", { users });
};

// get update page
export const get_edit_user_page = async (req, res) => {
  try {
    res.status(200).render("pages/edit");
  } catch (error) {
    console.log(error.message);
  }
};

// post update user account
export const put_edit_user = async (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            // set locals to null
            res.locals.user = null;
            next();
          } else {
            // console.log(decodedToken.id);

            // const salt = await bcrypt.genSalt();
            // hash user password
            // const userHashedPwd = await bcrypt.hash(req.body.password, salt);

            // find the user by id and update the specific user
            const user = await UserModel.findByIdAndUpdate(decodedToken.id, {
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
            });

            // grabs the updated user
            const updatedUser = await UserModel.findById(user._id);

            // save updated user
            // ---> once .save() method is called it automatically hashes password...we did setup in schema  <---
            // NO NEED TO REPEAT bcrypt hash code
            await updatedUser.save();
            res.status(201).json({ user: updatedUser });
            next();
          }
        }
      );
    } else {
      res.locals.user = null;
      next();
    }
  } catch (error) {
    const errors = handleErrors(error); // call error handler function then set to variable
    console.log(handleErrors(error));
    res.status(400).json({ errors }); // respond back to client with json data of errors
  }
};
