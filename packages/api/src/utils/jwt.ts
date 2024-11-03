import * as jwt from "jsonwebtoken";
import logger from "./logger";
class JwtService {
  private readonly secret: string;
  constructor() {
    const secret = process.env.JWT_SECRETE_KEY ?? "Fizno@321"; // TODO: need to fix JWT_SECRET from .env currently not working from .env
    if (!secret) {
      logger.error("'JWT_SECRET is required in .env");
      return;
    }
    this.secret = secret;
  }

  sign(payload: any, options?: Omit<jwt.SignOptions, "algorithm">) {
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error(error);
    }
  }
}
export default JwtService;
