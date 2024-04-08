import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router } from "./routes/index.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`DB connected ${process.env.MONGODB_URI}`))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // react app
  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    res.header("Access-Control-Allow-Origin", "http://localhost:5000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", [
      "X-Requested-With",
      "content-type",
      "credentials",
    ]);
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.status(200);
    next();
  });
}

server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
