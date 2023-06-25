import UserModel from "../model/user.js";
import jwt from "jsonwebtoken";

// error handle function for routes
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

// register user page
export const get_register_user_page = async (req, res) => {
  try {
    res.status(200).render("pages/register");
  } catch (error) {
    console.log(error.message);
  }
};

export const post_register_user = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
  } catch (error) {
    const errors = handleErrors(error); // call error hanlder function then set to variable
    console.log(handleErrors(error));
    res.status(400).json({ errors }); // respond back to client with json data of errors
  }
};
