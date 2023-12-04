import jwt from "jsonwebtoken";
import config from "../config/constant.js";
import multer from "multer";
import { dbConnection } from "../config/dbconnect.js";
import { client } from "../config/redisconfig.js";

export const verifyEmail = async (req, res, next) => {
  const userData = await dbConnection.findOne({ where: { email: req.body.email } });

  if (userData) {
    return res.status(409).send({ success: false, msg: "Email already exist" });
  } else {
    next();
  }
};

export const checkAuth = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    const { email, id } = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.data = { email, token, id };
    next();
  } else {
    next();
  }
};

export const verifyRT = async (req, res, next) => {
  if (req.cookies?.refresh_token) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.refresh_token;

    // Verifying refresh token
    const tokenData = await client.hGetAll(refreshToken);
    req.data = tokenData;
    client.del(refreshToken);
    next();
  } else {
    return res
      .status(406)
      .json({ message: "Unauthorized ! Refresh token not found" });
  }
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single("user_file");
