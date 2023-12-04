import express from "express"
import service from "./config/constant.js"
import cookieparser from "cookie-parser"
import {router} from"./routes/userRoute.js"
import {redisconnect} from"./config/redisconfig.js"
import {dbConnection} from "./config/dbconnect.js"

const app = express();

app.use(express.json())
app.use(cookieparser())
app.use("/user", router)

dbConnection();
redisconnect();

app.listen(service.PORT, () => {
  console.log("server is running");
});
