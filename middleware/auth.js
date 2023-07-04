import jwt from "jsonwebtoken";
import UserModel from "../model/user.js";

// create a middleware that will handle user auth for private routes
export const requireAuth = (req, res, next) => {
  // grab the token that's saved in the cookie named "jwt" when the user log in
  // req.cookies.[name_of_cookie] ---> get access to cookie value
  const token = req.cookies.jwt;
  console.log(token);

  // check if jwt exist & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      // check if error, if so redirect to login page
      // if token can't be verified or has been modified
      // token exists but is not valid
      // redirect to login page
      if (err) {
        console.log(err.message);
        res.redirect("/api/auth/login");
      }
      // go to the next middleware ---> which is the login page
      // log user in
      console.log(decodedToken);
      next();
    });
  } else {
    // if we don't have a token then redirect to login page
    res.redirect("/api/auth/login");
  }
};

// create a middleware to check if valid user exists in the cookie we created
// allow us to get the current user information
export const doUserExist = async (req, res, next) => {
  // get token from cookies
  const token = req.cookies.jwt;
  try {
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            // res.local --> allow us to add request scoped variables that contain data we can later access in views (which is our front end pages)
            // set locals to null OR this will throw an error if no user exists on locals
            // created method on locals called "user"
            res.locals.user = null;
            next(); //if token is not valid meaning no user is logged in ... goes to next middleware
          } else {
            // decodedToken contains payload which is the data (in this case the user id)
            console.log(decodedToken);
            let user = await UserModel.findById(decodedToken.id); // finding specific user by id
            // allow use to use/inject data inside our views on frontend
            res.locals.user = user;
            next();
          }
        }
      );
    } else {
      res.locals.user = null;
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};
