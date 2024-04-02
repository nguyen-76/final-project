import express from "express";
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
