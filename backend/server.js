import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import productsRoutes from "./routes/products-routes.js";
import usersRoutes from "./routes/users-routes.js";
import storesRoutes from "./routes/stores-routes.js";
import HttpError from "./models/http-error.js";

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/store", storesRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An Unknown error occured" });
});

mongoose
  .connect("mongodb://localhost:27017/doshDB")
  .then(() => {
    app.listen(port, (req, res) => {
      console.log(`Ready on port ${port}.`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
