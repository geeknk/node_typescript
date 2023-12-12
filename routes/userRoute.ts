import express from "express";
export const router = express.Router();
import * as mid from "../middleware/usermiddle";
import * as controller from "../controllers/userController";

router.get("/register",mid.verifyEmail, controller.signup);
router.get("/get", mid.checkAuth, controller.getuser);
router.get("/list/:page", controller.userlist);
router.post("/auth/signin",mid.loginMiddileware, controller.signin);
router.post("/address", mid.checkAuth, controller.userAddress);
router.put("/changePassword", mid.checkAuth, controller.changePass);
router.put("/verify-reset-password", mid.checkAuth, controller.forgetPass);
router.put("/updateuser", mid.checkAuth, controller.updateuser);
router.put("/delete", mid.checkAuth, controller.deluser);
router.post("/forgot-password", controller.verifyuser);
router.put("/profile-image", mid.upload, controller.profileImg);
router.put("/refresh",mid.verifyRT,controller.refreshuser);