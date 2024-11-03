/* eslint-disable prettier/prettier */
import express from "express";
import {
  createRefreshTokenValidator,
  createUserBodyValidator,
  createUserSessionValidator,
  createSocialUserSessionValidator,
  createSocialUserSessionV2Validator,
} from "./auth.schema";
import AuthController from "./auth.controller";
import JoiValidator from "../../utils/joiValidator";
import AuthMiddleware from "../../middleware/authMiddleware";

const authRoute = express.Router();
const authController = new AuthController();
const joiValidator = new JoiValidator();
const authMiddleware = new AuthMiddleware();
authRoute.post(
  "/create-user",
  joiValidator.validate(createUserBodyValidator, "body"),
  authController.createUser,
);
authRoute.post(
  "/create-buyer",
  joiValidator.validate(createUserBodyValidator, "body"),
  authController.createBuyerUser,
);
authRoute.post("/next-step", authController.stepTwo);
authRoute.post(
  "/create-session",
  joiValidator.validate(createUserSessionValidator, "body"),
  authController.createUser,
);
authRoute.post(
  "/login",
  joiValidator.validate(createUserSessionValidator, "body"),
  authController.login,
);
authRoute.post(
  "/adminLogin",
  joiValidator.validate(createUserSessionValidator, "body"),
  authController.adminLogin,
);
authRoute.post(
  "/buyer-login",
  joiValidator.validate(createUserSessionValidator, "body"),
  authController.buyerLogin,
);

// social routes 
authRoute.post(
  "/socialAuth",
  joiValidator.validate(createSocialUserSessionV2Validator, "body"),
  authController.socialAuth,
);
authRoute.post(
  "/socialLoginV2",
  joiValidator.validate(createSocialUserSessionValidator, "body"),
  authController.socialAuth,
);

authRoute.post(
  "/signupWithGoogle",
  authController.signUpWithGoogle,
);

authRoute.post(
  "/refresh-access-token",
  joiValidator.validate(createRefreshTokenValidator, "body"),
  authController.refreshAccessToken,
);

authRoute.post(
  "/switch-to-user",
  authMiddleware.protect,
  authController.switchToUser,
);

authRoute.put("/logout", authMiddleware.protect, authController.logout);

export default authRoute;
