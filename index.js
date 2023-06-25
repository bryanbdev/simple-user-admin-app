import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import "dotenv/config";

const app = express();
// middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/api/auth", authRoute);

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
