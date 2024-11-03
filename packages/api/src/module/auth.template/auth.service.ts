/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable prettier/prettier */
import {
  type JwtAccessTokenPayload,
  type CreateSessionType,
  type JwtRefreshTokenPayload,
  type JwtRefreshTokenClaims,
} from "./auth.types";
import { UserSessionModel } from "../../models";
import JwtService from "../../utils/jwt";
import { UserService } from "../user.template/user.service";
import jwt from "jsonwebtoken";
import hasher from "wordpress-hash-node";
import logger from "../../utils/logger";
import serialize from "locutus/php/var/serialize";
import { bigIntToJson } from "../../utils/bigIntToJson";
import phpUnserialize from "php-unserialize";
import JSONbig from "json-bigint";
// import {OAuth2Client} from "google-auth-library";
import axios from "axios";
import prismaClient from "../../utils/dbConnection";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export class AuthService {
  private readonly jwtService = new JwtService();
  private readonly userService = new UserService();
  private readonly prisma = prismaClient;
  public async createSession(payload: CreateSessionType) {
    const user = await this.userService.findOneWithOptions({
      email: payload.email,
    });

    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(payload.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    // create session
    const session = await UserSessionModel.create({
      userId: user._id,
      userAgent: payload.userAgent,
      ipAddress: payload.ip,
    });

    // create accessToken and refreshToken
    const accessTokenPayload: JwtAccessTokenPayload = {
      sessionId: session._id,
      userId: user._id,
      isVerifiedEmail: user.isVerifiedEmail,
      isLocked: user.isLocked,
    };

    const accessToken = this.createAccessToken(accessTokenPayload);

    const refreshTokenPayload: JwtRefreshTokenPayload = {
      sessionId: session._id,
      userId: user._id,
    };
    const refreshToken = this.createRefreshToken(refreshTokenPayload);
    return { accessToken, refreshToken };
  }

  private createAccessToken(payload: JwtAccessTokenPayload) {
    if (!process.env.JWT_ACCESS_TOKEN_TTL) {
      throw new Error("JWT_ACCESS_TOKEN_TTL is required");
    }
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
    });
  }

  private createRefreshToken(payload: JwtRefreshTokenPayload) {
    if (!process.env.JWT_REFRESH_TOKEN_TTL) {
      throw new Error("JWT_REFRESH_TOKEN_TTL is required");
    }
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_TTL,
    });
  }

  public async getUserSessionDetailsBySessionId(sessionId: string) {
    const session = await UserSessionModel.findById(sessionId);
    return session;
  }

  public async getAccessTokenFromRefreshToken(refreshToken: string) {
    // Verify refreshToken
    const decoded = this.jwtService.verify(
      refreshToken,
    ) as JwtRefreshTokenClaims;
    if (!decoded) {
      return null;
    }
    const { sessionId } = decoded;
    const userSession = await this.getUserSessionDetailsBySessionId(sessionId);
    if (!userSession || !userSession.isValidSession) {
      return null;
    }
    // Generate accessToken
    const userDetails = await this.userService.findById(userSession.id);
    if (userDetails) {
      const accessTokenPayload: JwtAccessTokenPayload = {
        sessionId: userSession.id,
        userId: userDetails.id,
        isVerifiedEmail: userDetails.isVerifiedEmail,
        isLocked: userDetails.isLocked,
      };
      const accessToken = this.createAccessToken(accessTokenPayload);
      return accessToken;
    }
    return null;
  }

  public async verifyAccessToken(token: string): Promise<any | null> {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public async loginService({ email, password }) {
    const user = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        OR: [{ user_login: email }, { user_email: email }],
      },
    });

    if (!user[0]) {
      throw new Error("username not found");
    }

    const checkRole = await this.prisma.wp_nepaz2_usermeta.findFirst({
      where: {
        user_id: user[0].id,
        meta_key: "wp_nepaz2_capabilities",
        meta_value: {
          contains: "seller",
        }
      }
    });
    if (!checkRole) {
      throw new Error("This user is not registered as a seller please login with buyer and switch to seller");
    }
    const checked = hasher.CheckPassword(password, user[0].user_pass);
    logger.info(checked);
    if (checked) {
      try {
        const accessToken = await this.generateAccessToken({
          id: user[0].id.toString(),
        });
        const refreshToken = await this.generateRefreshToken({
          id: user[0].id.toString(),
        });
        const userRole = await this.prisma.wp_nepaz2_usermeta.findFirst({
          where: {
            user_id: user[0].id,
            meta_key: "wp_nepaz2_capabilities",
          },
        });
        if (userRole) {
          const capabilities = phpUnserialize.unserialize(userRole.meta_value);
          const role = capabilities.seller
            ? "seller"
            : capabilities.administrator
              ? "admin"
              : "customer";
          const updateUser = JSONbig.stringify(user[0]);
          const detail = JSON.parse(updateUser);
          return { accessToken, refreshToken, user: { ...detail, role } };
        } else {
          const updateUser = JSONbig.stringify(user[0]);
          const detail = JSON.parse(updateUser);
          return { accessToken, refreshToken, user: detail };
        }
      } catch (error) {
        logger.error(error);
        throw new Error("oops..something went wrong");
      }
    } else {
      throw new Error("username and password does not matched");
    }
  }

  public async adminLogin({ email, password }) {
    const user = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        OR: [{ user_login: email }, { user_email: email }],
        wp_nepaz2_usermeta: {
          some: {
            meta_key: "wp_nepaz2_capabilities",
            meta_value: {
              contains: "administrator",
            },
          },
        },
      },
    });
    if (!user[0]) {
      throw new Error("username not found");
    }
    const checked = hasher.CheckPassword(password, user[0].user_pass);
    logger.info(checked);
    if (checked) {
      try {
        const accessToken = await this.generateAccessToken({
          id: user[0].id.toString(),
        });
        const refreshToken = await this.generateRefreshToken({
          id: user[0].id.toString(),
        });
        const updateUser = JSONbig.stringify(user[0]);
        return { accessToken, refreshToken, user: JSON.parse(updateUser) };
      } catch (error) {
        logger.error(error);
        throw new Error("oops..something went wrong");
      }
    } else {
      throw new Error("username and password does not matched");
    }
  }

  public async buyerLogin({ email, password }) {
    const user = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        OR: [{ user_login: email }, { user_email: email }],
      },
    });
    if (!user[0]) {
      throw new Error("username not found");
    }
    const checked = hasher.CheckPassword(password, user[0].user_pass);
    logger.info(checked);
    if (checked) {
      try {
        const accessToken = await this.generateAccessToken({
          id: user[0].id.toString(),
        });
        const refreshToken = await this.generateRefreshToken({
          id: user[0].id.toString(),
        });
        const userRole = await this.prisma.wp_nepaz2_usermeta.findFirst({
          where: {
            user_id: user[0].id,
            meta_key: "wp_nepaz2_capabilities",
          },
        });
        if (userRole) {
          const capabilities = phpUnserialize.unserialize(userRole.meta_value);
          const role = capabilities.seller
            ? "seller"
            : capabilities.administrator
              ? "admin"
              : "customer";
          const updateUser = JSONbig.stringify(user[0]);
          const detail = JSON.parse(updateUser);
          return { accessToken, refreshToken, user: { ...detail, role } };
        } else {
          const updateUser = JSONbig.stringify(user[0]);
          const detail = JSON.parse(updateUser);
          return { accessToken, refreshToken, user: detail };
        }
      } catch (error) {
        logger.error(error);
        throw new Error("oops..something went wrong");
      }
    } else {
      throw new Error("username and password does not matched");
    }
  }

  public async socialLoginService({ email }) {
    const user = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        OR: [{ user_login: email }, { user_email: email }],
      },
    });

    if (!user[0]) {
      throw new Error("user not found");
    }

    try {
      const accessToken = await this.generateAccessToken({
        id: user[0].id.toString(),
      });
      const refreshToken = await this.generateRefreshToken({
        id: user[0].id.toString(),
      });

      return { accessToken, refreshToken, user: user[0] };
    } catch (error) {
      logger.error(error);
      throw new Error("oops..something went wrong");
    }
  }

  public async addNewUser(options: any) {
    try {
      const {
        userName,
        email,
        firstName,
        lastName,
        websiteUrl,
        password,
        phoneNumber,
      } = options;
      const hash = hasher.HashPassword(password);

      const isEmailExist = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          user_email: email,
        },
      });
      const isUserExist = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          user_login: userName,
        },
      });
      if (isUserExist) {
        throw new Error("user name already exist please change the user name");
      }

      if (isEmailExist) {
        throw new Error("email already exist please change the email");
      }

      // const capabilities = phpUnserialize
      const user = await this.prisma.wp_nepaz2_users.create({
        data: {
          user_login: userName,
          user_email: email,
          user_nicename: userName,
          user_pass: hash,
          user_url: websiteUrl,
          display_name: `${firstName} ${lastName}`,
          user_registered: new Date(),
          user_status: 0,
          google_auth_token: "",
          facebook_auth_token: "",
        },
      });

      const userRole = serialize({
        seller: true,
      });

      await this.prisma.wp_nepaz2_usermeta.createMany({
        data: [
          {
            user_id: user.id,
            meta_key: "nickname",
            meta_value: userName,
          },
          {
            user_id: user.id,
            meta_key: "first_name",
            meta_value: firstName,
          },
          {
            user_id: user.id,
            meta_key: "last_name",
            meta_value: lastName,
          },
          {
            user_id: user.id,
            meta_key: "wp_nepaz2_capabilities",
            meta_value: userRole,
          },
          {
            user_id: user.id,
            meta_key: "phone_number",
            meta_value: phoneNumber,
          },
        ],
      });

      const accessToken = await this.generateAccessToken({
        id: user.id.toString(),
      });
      const refreshToken = await this.generateRefreshToken({
        id: user.id.toString(),
      });
      const updateUser = JSONbig.stringify(user);
      const detail = JSON.parse(updateUser);
      return { user: { ...detail, role: "seller" }, accessToken, refreshToken };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async addNewBuyer(options: any) {
    try {
      const {
        userName,
        email,
        firstName,
        lastName,
        websiteUrl,
        password,
        phoneNumber,
      } = options;
      const hash = hasher.HashPassword(password);

      const isEmailExist = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          user_email: email,
        },
      });
      const isUserExist = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          user_login: userName,
        },
      });
      if (isUserExist) {
        throw new Error("user name already exist please change the user name");
      }

      if (isEmailExist) {
        throw new Error("email already exist please change the email");
      }

      // const capabilities = phpUnserialize
      const user = await this.prisma.wp_nepaz2_users.create({
        data: {
          user_login: userName,
          user_email: email,
          user_nicename: userName,
          user_pass: hash,
          user_url: websiteUrl,
          display_name: `${firstName} ${lastName}`,
          user_registered: new Date(),
          user_status: 0,
          google_auth_token: "",
          facebook_auth_token: "",
        },
      });
      const userRole = serialize({
        customer: true,
      });

      await this.prisma.wp_nepaz2_usermeta.createMany({
        data: [
          {
            user_id: user.id,
            meta_key: "nickname",
            meta_value: userName,
          },
          {
            user_id: user.id,
            meta_key: "first_name",
            meta_value: firstName,
          },
          {
            user_id: user.id,
            meta_key: "last_name",
            meta_value: lastName,
          },
          {
            user_id: user.id,
            meta_key: "wp_nepaz2_capabilities",
            meta_value: userRole,
          },
          {
            user_id: user.id,
            meta_key: "phone_number",
            meta_value: phoneNumber,
          },
        ],
      });

      const accessToken = await this.generateAccessToken({
        id: user.id.toString(),
      });
      const refreshToken = await this.generateRefreshToken({
        id: user.id.toString(),
      });
      const updateUser = JSONbig.stringify(user);
      const detail = JSON.parse(updateUser);

      return {
        user: { ...detail, role: "customer" },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  // function to call for social logins
  public async addSocialBuyer(options: { profile: any, provider: 'google' | 'facebook', role: 'seller' | 'customer' }) {
    const { profile, provider, role } = options;
    try {
      const { email, name, id } = profile; // Adjust based on the provider's response structure

      const existingUser = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          user_email: email,
        },
      });

      if (existingUser) {
        // Update the auth token and return existing user details
        await this.prisma.wp_nepaz2_users.update({
          where: { user_email: email },
          data: {
            [`${provider}_auth_token`]: id, // e.g., google_auth_token or facebook_auth_token
          },
        });
        const accessToken = await this.generateAccessToken({ id: existingUser.id.toString() });
        const refreshToken = await this.generateRefreshToken({ id: existingUser.id.toString() });

        return {
          user: { ...existingUser, id: existingUser.id.toString(), role: role },
          accessToken,
          refreshToken,
        };
      }
      // Create a new user if not exists
      const user = await this.prisma.wp_nepaz2_users.create({
        data: {
          user_login: email.split('@')[0], // Create a username using the email prefix
          user_email: email,
          user_nicename: name || email,
          user_pass: '', // Leave blank as passwords are not used for social logins
          user_url: '', // Placeholder, can be updated later if needed
          display_name: name,
          user_registered: new Date(),
          user_status: 0,
          google_auth_token: provider === 'google' ? id : '',
          facebook_auth_token: provider === 'facebook' ? id : '',
        },
      });

      // Add user metadata as necessary
      await this.prisma.wp_nepaz2_usermeta.createMany({
        data: [
          {
            user_id: user.id,
            meta_key: 'nickname',
            meta_value: email.split('@')[0],
          },
          {
            user_id: user.id,
            meta_key: 'first_name',
            meta_value: name.split(' ')[0] || '',
          },
          {
            user_id: user.id,
            meta_key: 'last_name',
            meta_value: name.split(' ')[1] || '',
          },
          {
            user_id: user.id,
            meta_key: 'wp_nepaz2_capabilities',
            meta_value: serialize(role == "seller" ? { seller: true } : { customer: true }),
          },
        ],
      });

      const accessToken = await this.generateAccessToken({ id: user.id.toString() });
      const refreshToken = await this.generateRefreshToken({ id: user.id.toString() });

      return {
        user: { ...user, id: user.id.toString(), role: role },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log('ERROR::', error)
      throw new Error(`Failed to add social connection: ${error.message}`);
    }
  }

  // Function to verify Google token
  public async verifyGoogleToken(token: string) {
    try {
      const payload: any = await client.getTokenInfo(token);
      const { sub, email, name = '', picture = '' } = payload; // Extract the necessary fields
      return {
        id: sub,       // Google user ID
        email,        // User email
        name,         // User name
        picture,      // User profile picture URL
      };
    } catch (error) {
      console.log('Here is error', error)
      throw new Error('Invalid Google token');
    }
  }

  // Function to verify Facebook token
  public async verifyFacebookToken(token: string) {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,email,name,picture`);
      const { id, email, name, picture } = response.data; // Extract the necessary fields
      return {
        id,           // Facebook user ID
        email,        // User email
        name,         // User name
        picture,      // User profile picture URL
      };
    } catch (error) {
      throw new Error('Invalid Facebook token');
    }
  }
  public async secondStep(options: any) {
    try {
      const { storeAddress, storeName, sellerType, payment, id } = options;
      const settings = {
        store_name: storeName,
        payment,
        address: {
          street_1: storeAddress.street,
          street_2: storeAddress.street2,
          city: storeAddress.city,
          zip: storeAddress.postalCode,
          country: storeAddress.country,
          state: storeAddress.state,
          ein: storeAddress.ein,
          primaryPhoneNumber: storeAddress.primaryPhoneNumber,
          countryCode: storeAddress.countryCode,
          businessContactNumber: storeAddress.businessContactNumber,
        },
        phone_number: storeAddress.primaryPhoneNumber,
        country_code: storeAddress.countryCode,
        business_contact: storeAddress.businessContactNumber,
      };
      const phpSerializedString = serialize(settings);
      await this.prisma.wp_nepaz2_usermeta.createMany({
        data: [
          {
            user_id: parseInt(id),
            meta_key: "dokan_store_name",
            meta_value: storeName,
          },
          {
            user_id: parseInt(id),
            meta_key: "store_name",
            meta_value: storeName,
          },
          {
            user_id: parseInt(id),
            meta_key: "wcfmmp_store_name",
            meta_value: storeName,
          },
          {
            user_id: parseInt(id),
            meta_key: "seller_type",
            meta_value: sellerType,
          },
          {
            user_id: parseInt(id),
            meta_key: "dokan_profile_settings",
            meta_value: phpSerializedString,
          },
        ],
      });
      const users = await this.prisma.wp_nepaz2_users.findMany({
        where: {
          id: parseInt(id),
        },
        select: {
          id: true,
          user_login: true,
          user_nicename: true,
          user_url: true,
          user_registered: true,
          user_activation_key: true,
          user_status: true,
          display_name: true,
          user_email: true,
          wp_nepaz2_usermeta: true,
        },
      });
      const updateData = bigIntToJson(users)[0];
      const mapedData = updateData.wp_nepaz2_usermeta.map((item: any) => {
        return item;
      });
      const accessToken = await this.generateAccessToken({
        id: id.toString(),
      });
      const refreshToken = await this.generateRefreshToken({
        id: id.toString(),
      });
      return {
        user: { ...updateData, wp_nepaz2_usermeta: mapedData, role: "seller" },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  public async switchToSeller(options: any) {
    try {
      const { storeAddress, storeName, sellerType, payment, id } = options;
      const settings = {
        store_name: storeName,
        payment,
        address: {
          street_1: storeAddress.street,
          street_2: storeAddress.street2,
          city: storeAddress.city,
          zip: storeAddress.postalCode,
          country: storeAddress.country,
          state: storeAddress.state,
          ein: storeAddress.ein,
          primaryPhoneNumber: storeAddress.phoneNumber,
          countryCode: storeAddress.countryCode,
          businessContactNumber: storeAddress.businessContact,
        },
      };
      const existUser = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          user_login: true,
          user_nicename: true,
          user_url: true,
          user_registered: true,
          user_activation_key: true,
          user_status: true,
          display_name: true,
          user_email: true,
          wp_nepaz2_usermeta: true,
        },
      });
      const userRole = serialize({
        seller: true,
        customer: true,
      });
      const phpSerializedString = serialize(settings);
      const roleId = existUser?.wp_nepaz2_usermeta.find(
        meta => meta.meta_key === "wp_nepaz2_capabilities",
      )?.umeta_id;
      const role = existUser?.wp_nepaz2_usermeta.find(
        meta => meta.meta_key === "wp_nepaz2_capabilities",
      )?.meta_value;
      if (!role?.includes("seller")) {
        if (roleId) {
          await this.prisma.wp_nepaz2_usermeta.update({
            where: {
              umeta_id: roleId,
            },
            data: {
              meta_value: userRole,
            },
          });
        }
        await this.prisma.wp_nepaz2_usermeta.createMany({
          data: [
            {
              user_id: parseInt(id),
              meta_key: "dokan_store_name",
              meta_value: storeName,
            },
            {
              user_id: parseInt(id),
              meta_key: "store_name",
              meta_value: storeName,
            },
            {
              user_id: parseInt(id),
              meta_key: "wcfmmp_store_name",
              meta_value: storeName,
            },
            {
              user_id: parseInt(id),
              meta_key: "seller_type",
              meta_value: sellerType,
            },
            {
              user_id: parseInt(id),
              meta_key: "dokan_profile_settings",
              meta_value: phpSerializedString,
            },
          ],
        });
        const result = await this.prisma.wp_nepaz2_users.findUnique({
          where: {
            id: parseInt(id),
          },
          select: {
            id: true,
            user_login: true,
            user_nicename: true,
            user_url: true,
            user_registered: true,
            user_activation_key: true,
            user_status: true,
            display_name: true,
            user_email: true,
            wp_nepaz2_usermeta: true,
            follower: true,
            following: true,
          },
        });
        // console.log(result, id)
        const mapedData = await Promise.all(
          (result?.wp_nepaz2_usermeta || []).map(async (item: any) => {
            if (item.meta_key === "dokan_profile_settings") {
              const capabilities = phpUnserialize.unserialize(item.meta_value);
              // console.log(capabilities)

              const banner = capabilities.banner
                ? await this.prisma.wp_posts.findUnique({
                  where: {
                    ID: parseInt(capabilities.banner),
                  },
                })
                : "";
              const avatar = capabilities.gravatar
                ? await this.prisma.wp_posts.findUnique({
                  where: {
                    ID: parseInt(capabilities.gravatar),
                  },
                })
                : "";
              item.meta_value = {
                ...capabilities,
                bannerImage: banner,
                avatarImage: avatar,
              };
            }
            if (item.meta_key === "wp_nepaz2_capabilities") {
              // console.log(item.meta_value)
              const capabilities = phpUnserialize.unserialize(item.meta_value);
              item.meta_value = capabilities;
            }
            if (item.meta_key === "wp_nepaz2_user_avatar") {
              const avatar = await this.prisma.wp_posts.findUnique({
                where: {
                  ID: parseInt(item.meta_value),
                },
              });
              item.meta_value = avatar;
            }
            return item;
          }),
        );
        const role = mapedData.find(
          item => item.meta_key === "wp_nepaz2_capabilities",
        ).meta_value.seller
          ? "seller"
          : "customer";
        const userReview = await this.prisma.wp_postmeta.findMany({
          where: {
            meta_key: "store_id",
            meta_value: result?.id.toString(),
          },
          select: {
            meta_key: true,
            meta_value: true,
            post: {
              select: {
                post_author: true,
                wp_nepaz2_postmeta: {
                  where: {
                    meta_key: "rating",
                  },
                },
              },
            },
          },
        });
        const userImageId = result?.wp_nepaz2_usermeta.find(
          meta => meta.meta_key === "wp_nepaz2_user_avatar",
        );
        const avatar = userImageId?.meta_value;
        let totalRate = 0;
        for (let i = 0; i < userReview.length; i++) {
          const element = userReview[i];
          totalRate =
            totalRate +
            parseInt(element.post.wp_nepaz2_postmeta[0].meta_value || "0");
        }
        const avgRate = totalRate / userReview.length;
        const userData = {
          ...result,
          wp_nepaz2_usermeta: mapedData,
          role,
          userReview,
          avg_rate: avgRate,
          avatar,
        };
        const user = JSONbig.stringify(userData);
        return JSON.parse(user);
      } else {
        throw new Error("you are already seller");
      }
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  public generateAccessToken = async (payload: {
    id: string;
  }): Promise<string> => {
    const accessToken = jwt.sign(
      payload,
      (process.env.JWT_SECRETE_KEY as string) || "Test",
      {
        expiresIn: 31556926,
      },
    );
    return accessToken;
  };

  public generateRefreshToken = async (payload: {
    id: string;
  }): Promise<string> => {
    const accessToken = jwt.sign(
      payload,
      (process.env.JWT_SECRETE_KEY as string) || "Test",
      {
        expiresIn: "30d",
      },
    );
    return accessToken;
  };

  public async logoutSession(sessionId: string) {
    try {
      const session = await UserSessionModel.findById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }
      // Update session details
      session.isValidSession = false;
      session.expiredAt = new Date();
      await session.save();
      return session;
    } catch (error) {
      throw new Error(`Error updating session: ${error.message}`);
    }
  }

  public async signUpWithGoogle(token: string) {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = response.data;

      console.log('here is payload', response)
      if (payload) {
        const user = await this.prisma.wp_nepaz2_users.findFirst({
          where: {
            user_email: payload.email,
          },
        });

        if (user) {
          const accessToken = await this.generateAccessToken({
            id: user.id.toString(),
          });
          const refreshToken = await this.generateRefreshToken({
            id: user.id.toString(),
          });
          const userRole: any = await this.prisma.wp_nepaz2_usermeta.findFirst({
            where: {
              user_id: user.id,
              meta_key: "wp_nepaz2_capabilities",
            },
          });

          const role = userRole ? this.getUserRole(userRole.meta_value) : "customer";
          return { accessToken, refreshToken, user: { ...user, role } };
        } else {
          return {
            email: payload.email, // User's email address
            name: payload.name, // User's full name
          };
        }
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error('Error during Google sign up:', error.response?.data || error.message);
      throw new Error("Failed to sign up with Google: ", error);
    }
  }

  private getUserRole(metaValue: string) {
    const capabilities = phpUnserialize.unserialize(metaValue);
    if (capabilities.administrator) {
      return "admin";
    } else if (capabilities.seller) {
      return "seller";
    } else {
      return "customer";
    }
  }

  // public async signUpWithGoogle(token: string) {
  //   try {
  //     const response = await axios.get(
  //       "https://www.googleapis.com/oauth2/v3/userinfo",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     const payload = response.data;
  //     // console.log(payload);
  //     if (payload) {
  //       const user = await this.prisma.wp_nepaz2_users.findFirst({
  //         where: {
  //           user_email: payload.email,
  //         },
  //       });
  //       if (user) {
  //         const accessToken = await this.generateAccessToken({
  //           id: user.id.toString(),
  //         });
  //         const refreshToken = await this.generateRefreshToken({
  //           id: user.id.toString(),
  //         });
  //         const userRole = await this.prisma.wp_nepaz2_usermeta.findFirst({
  //           where: {
  //             user_id: user.id,
  //             meta_key: "wp_nepaz2_capabilities",
  //           },
  //         });
  //         if (userRole) {
  //           const capabilities = phpUnserialize.unserialize(
  //             userRole.meta_value,
  //           );
  //           const role = capabilities.seller
  //             ? "seller"
  //             : capabilities.administrator
  //               ? "admin"
  //               : "customer";
  //           const updateUser = JSONbig.stringify(user[0]);
  //           const detail = JSON.parse(updateUser);
  //           return { accessToken, refreshToken, user: { ...detail, role } };
  //         } else {
  //           const updateUser = JSONbig.stringify(user[0]);
  //           const detail = JSON.parse(updateUser);
  //           return { accessToken, refreshToken, user: detail };
  //         }
  //       } else {
  //         return {
  //           email: payload.email, // User's email address
  //           name: payload.name, // User's full name
  //         };
  //       }
  //     } else {
  //       throw new Error("invalid token");
  //     }
  //   } catch (error) {
  //     console.log('Here is data', error)
  //     throw new Error(error);
  //   }
  // }
}
