import UserModel from "../model/user.js";
import jwt from "jsonwebtoken";

// error handle function for routes (will reuse function)
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

  // hanlde login errors
  if (err.message.includes("incorrect email")) {
    errors["email"] = "Email does not exists";
  }

  if (err.message.includes("incorrect password")) {
    errors["password"] = "Password is incorrect";
  }

  return errors;
};

// create function to create web token (will reuse function)
// 3 days in seconds
const maxAge = 3 * 24 * 60 * 60; // 3days 24hrs 60min 60sec
const createToken = (id) => {
  // first argument ---> pass in the payload => data from backend server
  // second argument ---> create a secret to access & secure the jwt
  // third argument ---> optional object (can expire the jwt)
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// ===============================================================

// register user page
export const get_register_user_page = async (req, res) => {
  try {
    res.status(200).render("pages/register");
  } catch (error) {
    console.log(error.message);
  }
};

// handle user register
export const post_register_user = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    // create token for user upon register
    const token = createToken(user._id);
    //options -> {httpOnly: true} no can't access the cookie through js frontend
    // options -> {secure: true} cookies are only accessed on https sites
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error); // call error handler function then set to variable
    console.log(handleErrors(error));
    res.status(400).json({ errors }); // respond back to client with json data of errors
  }
};

// login user page
export const get_login_page = async (req, res) => {
  try {
    res.status(200).render("pages/login");
  } catch (error) {
    const errors = handleErrors(error); // call error handler function then set to variable
    console.log(handleErrors(error));
    res.status(400).json({ errors }); // respond back to client with json data of errors
  }
};

// log user in
export const post_login_user = async (req, res) => {
  const { email, password } = req.body;
  try {
    // use created "login" method to find user (method created in model folder)
    const user = await UserModel.login(email, password);
    // create token for user ---> will contain user data
    const token = createToken(user._id);
    // respond with found user and store in web cookie
    // options -> {httpOnly: true} no can't access the cookie through js frontend
    // options -> {secure: true} cookies are only accessed on https sites
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error); // call error handler function then set to variable
    console.log(handleErrors(error));
    res.status(400).json({ errors }); // respond back to client with json data of errors
  }
};

// log user out
export const logout_user = async (req, res) => {
  try {
    // overwrite the cookie value with empty string
    // this removes the jwt variable in cookie
    res.cookie("jwt", "", { maxAge: 1 }); // the cookie will expire in 1 millisecond
    res.redirect("/api/auth/login"); // redirect to login page
  } catch (error) {
    console.log(error.message);
  }
};
