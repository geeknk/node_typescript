var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as userServices from "../services/userservices";
export const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userServices.usersignup(req.body);
    if (data) {
        res.status(201).send({ success: true, msg: "User registered successfully", data: data });
    }
});
export const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedin = yield userServices.userlogin(req.body);
    if (!loggedin) {
        return res.status(401).send({ success: false, msg: "Email or Password is wrong" });
    }
    else {
        // Assigning refresh token in http-only cookie  
        res.cookie('refresh_token', loggedin.refreshToken, { httpOnly: true,
            sameSite: 'none', secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).send(loggedin.accessToken);
    }
});
export const changePass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validpass = yield userServices.matchpass(req.body);
    if (!validpass) {
        return res.status(401).send({ success: "failed", message: "password doesn't match" });
    }
    try {
        userServices.modifyPass(req.data.email, req.body.password);
        res.status(201).send({ success: "true", message: "password changed" });
    }
    catch (error) {
        res.status(401).send({ success: "false", message: "password is not changed" });
    }
});
export const verifyuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validuser = yield userServices.verifyemail(req.body.email);
    if (!validuser) {
        res.status(401).send({ success: "false", message: "user doesn't exist" });
    }
    else {
        res.status(201).send({ success: "true", message: "user exist", token: validuser });
    }
});
export const forgetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validpass = yield userServices.matchpass(req.body);
    if (!validpass) {
        return res.status(401).send({ success: "failed", message: "password doesn't match" });
    }
    try {
        userServices.modifyPass(req.data.email, req.body.password);
        res.status(201).send({ success: "true", message: "password updated" });
    }
    catch (error) {
        res.status(401).send({ success: "false", message: "password is not updated" });
    }
});
export const updateuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userServices.updateuser1(req.data.email, req.body);
        res.status(201).send({ success: "true", message: "user updated successfully", response });
    }
    catch (error) {
        res.status(402).send({ success: "false", message: "user not updated" });
    }
});
//get user data with the help of token (without body)
export const getuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userServices.getdata(req.data.id);
        res.send(userData);
    }
    catch (error) {
        console.log(error);
        res.status(402).send(error);
    }
});
//get user data with the help of token (without email)
export const deluser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userServices.deleteuser(req.data.id);
        res.status(201).send({ success: "true", message: "user deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(402).send(error);
    }
});
// get user in the form of list (page wise)
export const userlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userServices.user_list(+req.params.page);
        if (data) {
            res.status(201).send({ success: "true", message: data });
        }
    }
    catch (error) {
        res.status(401).send({ success: "false", message: "userdata not found", error });
    }
});
// user address
export const user_address = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userServices.useraddress(req.body, req.data.id);
        if (data) {
            res.status(201).send({ success: "true", message: "address saved" });
        }
        else {
            res.status(401).send({ success: "false", message: "address not saved" });
        }
    }
    catch (error) {
        res.status(401).send({ success: "false", message: error });
    }
});
export const profileImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        res.status(201).send({ success: "true", message: "image uploaded" });
    }
    else {
        res.status(401).send({ success: "false", message: "failed" });
    }
});
export const refreshuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield userServices.generateToken(req.data);
        res.cookie('refresh_token', token.refreshToken, { httpOnly: true,
            sameSite: 'none', secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).send(token.accessToken);
    }
    catch (error) {
        res.status(401).send({ success: "false", error });
    }
});
