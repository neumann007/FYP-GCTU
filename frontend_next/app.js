import { createServer } from "http";
import next from "next";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

const nextServer = next({
  dev: process.env.NODE_ENV !== "production",
});

import routes from "./routes.js";

const handler = routes.getRequestHandler(nextServer);

nextServer.prepare().then(() => {
  createServer(handler).listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on localhost:${port}`);
  });
});
