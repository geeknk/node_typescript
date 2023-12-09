import express from "express";
export const router = express.Router();
import * as mid from "../middleware/usermiddle.js";
import * as controller from "../controllers/userController.js";

router.get("/register",mid.verifyEmail, controller.signup);
router.get("/get", mid.checkAuth, controller.getuser);
router.get("/list/:page", controller.userlist);
router.post("/auth/signin",mid.loginMiddileware, controller.signin);
router.post("/address", mid.checkAuth, controller.user_address);
router.put("/changePassword", mid.checkAuth, controller.changePass);
router.put("/verify-reset-password", mid.checkAuth, controller.forgetPass);
router.put("/updateuser", mid.checkAuth, controller.updateuser);
router.put("/delete", mid.checkAuth, controller.deluser);
router.post("/forgot-password", controller.verifyuser);
router.put("/profile-image", mid.upload, controller.profileImg);