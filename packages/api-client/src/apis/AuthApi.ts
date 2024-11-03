import urlcat from "urlcat";
import {
  CreateUserRequestDto,
  LoginUserRequestDto,
  SocialLoginUserRequestDto,
} from "../models/CreateUserRequestDto";
import {
  CreateUserResponseDtoFromJSON,
  UserType,
} from "../models/CreateUserResponseDto";
import * as runetime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import {
  AccessTokensResponseDto,
  AccessTokensResponseDtoFromJSON,
} from "../models/AccessTokensResponseDto";
import { buyerSignupPayloadType } from "../models/messageTypes";

class _AuthApi extends runetime.BaseAPI {
  constructor() {
    super();
  }
  async createUser(
    requestParameters: CreateUserRequestDto
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/auth/create-user`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }

  async nextStep(
    requestParameters: any
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/auth/next-step`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }

  async switchToSeller(
    requestParameters: any
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/auth/switch-to-user`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }

  async loginUser(
    requestParameters: LoginUserRequestDto
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/auth/login`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data.data,
      };
    }
    return response as ErrorResult;
  }

  async adminLogin(
    requestParameters: LoginUserRequestDto
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/auth/adminLogin`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data.data,
      };
    }
    return response as ErrorResult;
  }

  async socialLoginUser(
    requestParameters: SocialLoginUserRequestDto
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/auth/socialAuth`,
      method: "POST",
      data: requestParameters,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data.data,
      };
    }
    return response as ErrorResult;
  }

  async logout(): Promise<SuccessResult<string> | ErrorResult> {
    const response = await this.request({
      url: `/auth/logout`,
      method: "PUT",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }

  async refreshAccessToken(
    token: string
  ): Promise<SuccessResult<AccessTokensResponseDto> | ErrorResult> {
    const response = await this.request({
      url: urlcat(`/auth/refresh-access-token`, { token }),
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }

  async getUsers(p0?: {
    pageIndex: number;
    pageSize: number;
    query: string;
  }): Promise<SuccessResult<UserType> | ErrorResult> {
    const { pageIndex = 1, pageSize = 10, query = "" } = p0 || {};
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      query,
    }).toString();

    const response = await this.request({
      url: `/admin/getAllUsers?${params}`,
      method: "get",
    });

    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  async getAllCustomer(p0?: {
    pageIndex: number;
    pageSize: number;
    query: string;
  }): Promise<SuccessResult<UserType> | ErrorResult> {
    const { pageIndex = 1, pageSize = 10, query = "" } = p0 || {};
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      query,
    }).toString();

    const response = await this.request({
      url: `/admin/getAllCustomers?${params}`,
      method: "get",
    });

    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  async addUser(p0?: {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    website: string;
    password: string;
    role: string;
  }): Promise<SuccessResult<UserType> | ErrorResult> {
    const { userName, email, firstName, lastName, website, password, role } =
      p0 || {};

    const response = await this.request({
      url: "/admin/addNewUser",
      method: "post",
      data: {
        userName,
        email,
        firstName,
        lastName,
        website,
        password,
        role,
      },
    });

    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }
  async getUserById(
    id: string
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getUserById?id=${id}`,
      method: "get",
    });

    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }
  async deleteUserById(
    id: number
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/admin/deleteUserById?id=${id}`,
      method: "get",
    });

    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }
  async updateUserById(
    id: string,
    data: any
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/admin/updateUser?id=${id}`,
      method: "post",
      data,
    });

    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }
  async getAllVendors(p0?: {
    pageIndex: number;
    pageSize: number;
    query: string;
  }): Promise<any> {
    try {
      const { pageIndex = 1, pageSize = 10, query = "" } = p0 || {};
      const params = new URLSearchParams({
        pageIndex: pageIndex.toString(),
        pageSize: pageSize.toString(),
        query,
      }).toString();

      const response = await this.request({
        url: `/admin/getAllVendor?${params}`,
        method: "GET",
      });

      if (response.remote === "success") {
        return {
          remote: "success",
          data: response.data,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch products",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching products:", error);
      return {
        remote: "error",
        message: "Failed to fetch products",
        data: error?.message,
      };
    }
  }

  async getAllVendorsForFilter(): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/getAllVendorsForFilter`,
        method: "GET",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response.data,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch products",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching products:", error);
      return {
        remote: "error",
        message: "Failed to fetch products",
        data: error?.message,
      };
    }
  }

  /**
   * buyer sign up API
   */

  async buyerSignupAPI(
    payload: buyerSignupPayloadType
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/auth/create-buyer",
      method: "POST",
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        userName: payload.userName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      },
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data,
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * buyer sign in API
   */

  async buyerSigninAPI(payload: {
    email: string;
    password: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/auth/buyer-login",
      method: "POST",
      data: {
        email: payload.email,
        password: payload.password,
      },
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data,
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * Social Auth
   */
  async socialAuth(payload: {
    token: string;
    role:string,
    provider:string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/auth/socialAuth",
      method: "POST",
      data: {
        accessToken: payload.token,
        role: payload.role,
        provider: payload.provider,
        profile: ''
      },
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data,
        },
      };
    }

    return response as ErrorResult;
  }
}

export const AuthApi = new _AuthApi();
