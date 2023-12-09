var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import config from "../config/constant.js";
import { con } from "../config/dbconnect.js";
import { client } from "../config/redisconfig.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import randToken from "rand-token";
const oAuth2Client = new google.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECERET, config.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });
const accessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const accesstoken = yield oAuth2Client.getAccessToken();
    return accesstoken;
});
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: config.USER,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECERET,
        refreshToken: config.REFRESH_TOKEN,
        accessToken: accessToken()
    },
});
export const getdata = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield con.findOne({ include: address }, { where: { id } });
    }
    catch (error) {
        console.error("Error retrieving data:", error);
        throw error;
    }
});
export const deleteuser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   const data = await User.destroy({where:{id: id}},{
    //     include: [{
    //     model: address,
    //     where: { user_id: id },
    //   }]
    // });/
    const data = yield address.destroy({ where: { user_id: id } }, {
        include: [{
                model: User,
                where: { id: id },
            }]
    });
    yield User.destroy({ where: { id: id } });
    if (data) {
        return true;
    }
});
export const updateuser1 = (email, body_data) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.update(body_data, { where: { email } });
});
export const matchpass = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return data.password === data.new_password;
});
export const verifyemail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const emailexist = yield User.findOne({ where: { email } });
    if (emailexist) {
        const token = jwt.sign({ email: emailexist.email, id: emailexist._id, username: emailexist.username }, config.ACCESS_TOKEN_SECRET, { expiresIn: config.FPASS_EXPIRESIN });
        const mailOption = {
            from: config.EMAIL_FROM,
            to: "ernitish26@gmail.com",
            subject: "Password Reset Link",
            html: `<a href = "www.google.com">${token}</a>`,
        };
        transport.sendMail(mailOption);
        return token;
    }
    else {
        return false;
    }
});
export const modifyPass = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.update({ password }, {
        where: { email }
    });
    const mailOption = {
        from: config.EMAIL_FROM,
        to: "ernitish26@gmail.com",
        subject: "Password Reset",
        text: "Password Reset successfully",
    };
    transport.sendMail(mailOption);
});
export const userlogin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield User.findOne({ where: { email: data.email } });
    const pass = yield bcrypt.compare(userData.password, data.password);
    if (pass && userData) {
        const accessToken = jwt.sign({ email: userData.email, id: userData.id }, config.ACCESS_TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRES });
        const refreshToken = randToken.uid(256);
        yield client.hSet(refreshToken, {
            id: userData.id,
            email: userData.email,
            username: userData.username
        });
        return { accessToken, refreshToken };
    }
    else {
        return false;
    }
});
export const usersignup = (data) => {
    let user;
    const sql = `INSERT INTO users VALUES(?)`;
    con.query(sql, data, (err, result) => {
        if (err) {
            return err;
        }
        else {
            user = result;
        }
    });
    if (user) {
        const mailOption = {
            from: config.EMAIL_FROM,
            to: 'rajaryan232326@gmail.com',
            subject: "Registration",
            text: "Registeration successful",
        };
        transport.sendMail(mailOption);
        return user;
    }
    else {
        return false;
    }
};
export const user_list = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const firstindex = (page - 1) * 10;
    const lastindex = page * 10;
    const data = yield User.findAll();
    const sliced_data = data.slice(firstindex, lastindex);
    return sliced_data;
});
export const useraddress = (data, ID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userAdd = yield address.create({
            user_id: ID,
            address: data.address,
            city: data.city,
            state: data.state,
            pin_code: data.pin_code,
            phone: data.phone,
        });
        return userAdd;
    }
    catch (error) {
        console.error(error);
    }
});
export const generateToken = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jwt.sign({ email: userData.email, id: userData.id }, config.ACCESS_TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRES });
    const refreshToken = randToken.uid(256);
    yield client.hSet(refreshToken, {
        id: userData.id,
        email: userData.email,
        username: userData.username
    });
    return { accessToken, refreshToken };
});
