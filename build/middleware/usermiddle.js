var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import config from "../config/constant";
import multer from "multer";
import { con } from "../config/dbconnect";
import { client } from "../config/redisconfig";
import jwt from "jsonwebtoken";
export const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    con.query(`SELECT * FROM users WHERE email ='${req.body.email}'`, (err, result) => {
        if (err) {
            res.send(err);
        }
        else if (result == null) {
            console.log("email does not exist ");
            next();
        }
        else {
            console.log(result);
            return res.status(409).send({ success: false, msg: "Email already exist" });
        }
    });
});
export const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        const { email, id } = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        req.data = { email, token, id };
        next();
    }
    else {
        return res.status(409).send({ success: false, msg: "invalid token" });
    }
});
export const verifyRT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token) {
        // Destructuring refreshToken from cookie
        const refreshToken = req.cookies.refresh_token;
        // Verifying refresh token
        const tokenData = yield client.hGetAll(refreshToken);
        req.data = tokenData;
        client.del(refreshToken);
        next();
    }
    else {
        return res
            .status(406)
            .json({ message: "Unauthorized ! Refresh token not found" });
    }
});
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
