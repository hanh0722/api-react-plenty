const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const authRoute = require("./routes/auth");
const rootRoute = require("./util/Root");
const userRoute = require("./routes/user");
const dashBoardRoute = require("./routes/dashboard");
const imageUploadRoute = require('./routes/image-upload');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const app = express();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(8, (err, buffer) => {
      if (err) {
        const error = new Error("cannot random");
        error.statusCode = 500;
        throw error;
      }
      const id = buffer.toString("hex");
      cb(null, id + file.originalname);
    });
  },
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

app.use(multer({ storage: fileStorageEngine }).array("images", 5));
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
app.use('/api/upload', imageUploadRoute);
app.use("/api/dashboard", dashBoardRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
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
