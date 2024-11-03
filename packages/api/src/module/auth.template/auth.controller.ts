/* eslint-disable prettier/prettier */
import { type Request, type Response } from "express";
import { UserService } from "../user.template/user.service";
import { AuthService } from "./auth.service"; // Import AuthService
class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService; // Add AuthService

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService(); // Initialize AuthService
  }

  private readonly setAccessTokenToHeader = (
    res: Response,
    accessToken: string,
  ) => {
    res.setHeader("x-access", accessToken);
  };

  private readonly setRefreshTokenToHeader = (
    res: Response,
    accessToken: string,
  ) => {
    res.setHeader("x-refresh", accessToken);
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const loggedIn = await this.authService.loginService({
        email,
        password,
      });
      res.sendSuccess200Response("success", loggedIn);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const loggedIn = await this.authService.adminLogin({
        email,
        password,
      });
      res.sendSuccess200Response("success", loggedIn);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public buyerLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const loggedIn = await this.authService.buyerLogin({
        email,
        password,
      });
      res.sendSuccess200Response("success", loggedIn);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public socialAuth = async (req: Request, res: Response) => {
    const { provider, accessToken ,role} = req.body;
    try {

      let verifiedProfile;
      
      if (provider === 'google') {
        verifiedProfile = await this.authService.verifyGoogleToken(accessToken);
      } else if (provider === 'facebook') {
        verifiedProfile = await this.authService.verifyFacebookToken(accessToken);
      } else {
        throw new Error('Unsupported provider');
      }
      const loggedIn = await this.authService.addSocialBuyer({
        profile: verifiedProfile,
        provider,
        role
      });
      res.sendSuccess200Response("success", loggedIn);
    } catch (error) {
      console.log('Error', error)
      res.sendBadRequest400Response(error.message, null);
    }
  };

  // not in use any more will replace that after testing and verification
  public socialLoginV2 = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const loggedIn = await this.authService.socialLoginService({
        email,
      });
      res.sendSuccess200Response("success", loggedIn);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public createUser = async (req: Request, res: Response) => {
    try {
      const { userName, email, firstName, lastName, websiteUrl, password, phoneNumber } =
        req.body;
      // console.log(req.body);
      const newUser = await this.authService.addNewUser({
        userName,
        email,
        firstName,
        lastName,
        websiteUrl,
        password,
        phoneNumber
      });
      res.sendSuccess200Response("fetch roles successfully", newUser);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public createBuyerUser = async (req: Request, res: Response) => {
    try {
      const { userName, email, firstName, lastName, websiteUrl, password, phoneNumber } =
        req.body;
      // console.log(req.body);
      const newUser = await this.authService.addNewBuyer({
        userName,
        email,
        firstName,
        lastName,
        websiteUrl,
        password,
        phoneNumber
      });
      res.sendSuccess200Response("User register successfully", newUser);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public signUpWithGoogle = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      // console.log(req.body);
      const newUser = await this.authService.signUpWithGoogle(token);
      res.sendSuccess200Response("User register successfully", newUser);
    } catch (error) {
      console.log('Error', error)
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public stepTwo = async (req: Request, res: Response) => {
    try {
      // const { id } = req.body;

      const newUser = await this.authService.secondStep(req.body);
      res.sendSuccess200Response("fetch roles successfully", newUser);
    } catch (error) {
      res.sendErrorResponse(error.message, null);
    }
  };

  public switchToUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.user;
      const newUser = await this.authService.switchToSeller({ ...req.body, id });
      res.sendSuccess200Response("fetch roles successfully", newUser);
    } catch (error) {
      res.sendErrorResponse(error.message, null);
    }
  };

  public createSession = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findOneWithOptions({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }

      const { accessToken, refreshToken } =
        await this.authService.createSession({
          email,
          password,
          ip: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
        });

      this.setAccessTokenToHeader(res, accessToken);
      this.setRefreshTokenToHeader(res, refreshToken);
      res.sendSuccess200Response("User logged in successfully", { user });
    } catch (error) {
      res.sendUnauthorized401Response(
        "Email address or password is incorrect",
        error,
      );
    }
  };

  public refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const accessToken =
        await this.authService.getAccessTokenFromRefreshToken(refreshToken);

      if (!accessToken) {
        throw new Error("Invalid refresh token");
      }

      this.setAccessTokenToHeader(res, accessToken);
      res.sendSuccess200Response("Access token refreshed successfully", {
        accessToken,
      });
    } catch (error) {
      res.sendUnauthorized401Response("Error refreshing access token", error);
    }
  };

  public logout = async (req: Request, res: Response) => {
    if (!req.sessionId) {
      return;
    }
    try {
      await this.authService.logoutSession(req.sessionId);
      res.sendNoContent204Response();
    } catch (error) {
      res.sendBadRequest400Response("Error logging out user", error);
    }
  };
}

export default AuthController;
