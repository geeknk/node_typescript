import { Request, Response, NextFunction, RequestHandler } from "express";
import config from "../config/constant";
import multer from "multer";
import { con } from "../config/dbconnect";
import { client } from "../config/redisconfig";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { reqInterface, user } from "../interfaces.td";
import { fetchUserData } from "../services/userservices";
import bcrypt from "bcryptjs"

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  con.query(
    `SELECT * FROM users WHERE email ='${req.body.email}'`,
    (err, result) => {
      if (err) {
        res.send(err);
      } else if (result == null) {
        console.log("email does not exist ");
        next();
      } else {
        console.log(result);
        return res
          .status(409)
          .send({ success: false, msg: "Email already exist" });
      }
    }
  );
};

export const checkAuth = async (
  req: reqInterface,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token =  bearer[1];
    const { email,id } = jwt.verify(
      token,
      config.ACCESS_TOKEN_SECRET as Secret
    ) as JwtPayload;
    // req["data" as key of typeof Request] = { email, token, id };
    req.data = {email,token,id}
    next();
  } else {
    return res.status(409).send({ success: false, msg: "invalid token" });
  }
};

export const verifyRT = async (
  req: reqInterface,
  res: Response,
  next: NextFunction
) => {
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

export const loginMiddileware =async (req:Request, res:Response, next:NextFunction) => {
  const userData = await fetchUserData(req.body.email);

  if(userData==null) return res.status(403).send("user not found please register first")

  if(! await bcrypt.compare(req.body.password , userData.password)) 
    res.status(404).send("email or password does not match")
  req.body.id = userData.id
  req.body.username = userData.username

  next()
}
