import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import mongoose from "mongoose";
import BaseRouter from "./routes";
var cors = require("cors");

// Init express
const app = express();
app.use(cors());

// Add middleware/settings/routes to express.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", BaseRouter);

/**
 * Only serves an index file since this is an api for a react SPA>
 */
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

/**
 * Build db uri and connect
 */
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Export express instance
export default app;
