import express,{Application} from "express"
import service from "./config/constant"
import {router} from"./routes/userRoute"
import {redisconnect} from"./config/redisconfig"
import {dbConnection} from "./config/dbconnect"

const app: Application = express();

app.use(express.json())
app.use("/user", router)

dbConnection();
redisconnect();

app.listen(service.PORT, () => {
  console.log("server is running");
});
