const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoute = require("./routes/auth");
const rootRoute = require("./util/Root");
const userRoute = require("./routes/user");
const dashBoardRoute = require("./routes/dashboard");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/image", express.static(path.join(rootRoute, "image")));
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use("/api/dashboard", dashBoardRoute);
app.use((error, req, res, next) => {
  const message = error.message;
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: message,
    code: statusCode,
  });
});
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.bhp9h.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
