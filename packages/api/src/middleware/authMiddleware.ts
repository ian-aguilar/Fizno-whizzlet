/* eslint-disable prettier/prettier */
import { type NextFunction, type Request, type Response } from "express";
import { AuthService } from "../module/auth.template/auth.service";
import { PrismaClient } from "@prisma/client";

class AuthMiddleware {
  private readonly authService = new AuthService();
  private readonly prisma = new PrismaClient();
  public protect = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    const accessToken = authorization?.split("Bearer ")[1];

    if (!accessToken) {
      res.sendUnauthorized401Response("Invalid access token");
      return;
    }
    // veriy accessToken
    const decoded = await this.authService.verifyAccessToken(accessToken);
    if (decoded?.id) {
      const user = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          id: parseInt(decoded.id),
        },
      });

      // const user = await this.userService.findById(session.userId);
      if (!user) {
        res.sendUnauthorized401Response("Invalid Access Token");
        return;
      }
      req.user = user;
      // req.sessionId = session._id;
      next();
    }
  };
}

export default AuthMiddleware;
