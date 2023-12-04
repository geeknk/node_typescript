import express from "express";
import service from "./config/constant.js";
const app = express();

app.listen(service.PORT, () => {
  console.log("server is running");
});
