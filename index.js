import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
// middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser()); // allow use to create & read cookie data in header from request
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// connect to db
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to DB");
    // start application
    const PORT = process.env.PORT;
    app.listen(PORT || 5000, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
