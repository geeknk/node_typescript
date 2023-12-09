import express from "express";
import service from "./config/constant";
import cookieparser from "cookie-parser";
import { router } from "./routes/userRoute";
import { redisconnect } from "./config/redisconfig";
import { dbConnection } from "./config/dbconnect";
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use("/user", router);
dbConnection();
redisconnect();
app.listen(service.PORT, () => {
    console.log("server is running");
});
