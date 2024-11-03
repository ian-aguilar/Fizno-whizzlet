import {
  CreateUserResponseDtoFromJSON,
  UserType,
} from "../models/CreateUserResponseDto";
import { sendToUserResponseType, sendToUserType } from "../models/messageTypes";
import * as runetime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformSendToUser } from "../transform/messageTransform";

class _UserApi extends runetime.BaseAPI {
  constructor() {
    super();
  }
  public getCurrentUserPath = "/api/user/current-user";
  /**
   * Gets the current authenticated user
   */
  async getCurrentUser(): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/user/current-user`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: CreateUserResponseDtoFromJSON(response.data.data),
        },
      };
    }
    return response as ErrorResult;
  }

  async getAllProducts(
    pageIndex: number,
    pageSize: number,
    query: any
  ): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/products?pageIndex=${pageIndex}&pageSize=${pageSize}&product=${query.product}&category=${query.category}&condition=${query.condition}&query=${query.search}`,
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

  async getSimilarProducts(query: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/products?&product=${query.product}&category=${query.category}?pageIndex=1&pageSize=5`,
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

  async deleteProducts(id: number): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/delete-product?id=${id}`,
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

  async getProductById(id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/get-product-by-id?id=${id}`,
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

  async getUserDetail(): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller`,
        method: "GET",
      });

      if (response.remote === "success") {
        return {
          remote: "success",
          data: response.data.data,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch user",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching user:", error);
      return {
        remote: "error",
        message: "Failed to fetch user",
        data: error?.message,
      };
    }
  }

  async addNewProducts(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/add-new-products`,
        method: "POST",
        data,
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

  async updateProducts(data: any, id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/update-product?id=${id}`,
        method: "POST",
        data,
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

  async updateStoreSetting(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/update-store-settings`,
        method: "POST",
        data,
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

  async updateSeoSetting(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/update-seo-settings`,
        method: "POST",
        data,
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

  async updatePolicySetting(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/update-policy-settings`,
        method: "POST",
        data,
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

  async updateGeneralProfile(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/update-general-profile`,
        method: "POST",
        data,
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

  async updateProfileImage(data: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("avatar", data.image);
      const response = await this.request({
        url: `/user/update-user-image`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
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

  async updateUserPassword(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/update-user-password`,
        method: "POST",
        data,
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
  async uploadProductAttachment(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/seller/upload-product-image`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
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

  async getAllMessageGroup(payload: {
    type?: "all" | "read" | "unread" | "archive";
    keyword?: string;
  }): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/messages-groups?type=${payload.type || "all"}&keyword=${payload.keyword || ""}`,
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

  async getMessagesById(id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/user/messagesByParentId?id=${id}`,
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
   * get send to user for new messages
   */

  async getSendToUsersAPI(): Promise<
    SuccessResult<sendToUserType[]> | ErrorResult
  > {
    const response = await this.request({
      url: "/user/getUsersByKeyword",
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data.map((user: sendToUserResponseType) =>
            transformSendToUser(user)
          ),
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * send new messages
   */

  async sendNewMessage(payload: {
    subject: string;
    message: string;
    sendTo: number;
    fileData: File | null;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    payload.fileData && formData.append("attachment", payload.fileData || "");
    formData.append("sentTo", payload.sendTo.toString());
    formData.append("subject", payload.subject);
    formData.append("content", payload.message);
    const response = await this.request({
      url: "/user/createNewMessage",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data,
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * get unread messages
   */

  async getUnreadMessageAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/getUnreadMessageCount",
      method: "GET",
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
   * send reply messages API
   */

  async sendReplyMessageAPI(payload: {
    groupId: number;
    subject: string;
    toUserId: number;
    message: string;
    fileData: File | null;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    payload.fileData && formData.append("attachment", payload.fileData || "");
    formData.append("sentTo", payload.toUserId.toString());
    formData.append("subject", payload.subject);
    formData.append("content", payload.message);
    formData.append("parent", payload.groupId.toString());

    const response = await this.request({
      url: "/user/sendMessage",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data,
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * bulk action API
   */
  async bulkActionAPI(payload: {
    msgIds: number[];
    type: "read" | "unread" | "delete" | "archive";
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/bulkAction",
      method: "POST",
      data: { ids: payload.msgIds, type: payload.type },
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data,
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * store image upload API
   */
  async storeImageUploadAPI(payload: {
    imageFile: File;
    type: "profile" | "banner";
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formdata = new FormData();

    if (payload.type === "profile") {
      formdata.append("avatar", payload.imageFile);
    }

    if (payload.type === "banner") {
      formdata.append("banner", payload.imageFile);
    }

    const response = await this.request({
      url: "/user/seller/upload-store-image",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formdata,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          status: response.data.status,
          message: response.data.message,
          data: response.data,
        },
      };
    }

    return response as ErrorResult;
  }

  /**
   * follow user API
   */

  async followUserAPI(payload: {
    userId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/follow-user?venderId=${payload.userId}`,
      method: "GET",
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
   * get all follower/following API
   */

  async getAllFollowingAPI(payload: {
    userId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/seller/get-product-by-id?id=${payload.userId}`,
      method: "GET",
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
   * add to favorite API
   */

  async addToFavoriteAPI(payload: {
    productId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/add-to-favorite?productId=${payload.productId}`,
      method: "GET",
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
   * get all favorite API
   */

  async allFavoriteAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/get-all-favorite",
      method: "GET",
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
   * get all favorite API
   */

  async removeFavoriteAPI(payload: {
    productId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/remove-favorite?productId=${payload.productId}`,
      method: "GET",
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
   * add to Cart API
   */

  async addToCartAPI(payload: {
    productId: number;
    quantity: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/add-to-cart",
      method: "POST",
      data: {
        productId: payload.productId,
        quantity: payload.quantity,
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
   * update to Cart API
   */

  async updateCartAPI(payload: {
    productId: number;
    quantity: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/update-cart-quantity",
      method: "POST",
      data: {
        productId: payload.productId,
        quantity: payload.quantity,
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
   * remove from cart API
   */

  async removeFromCartAPI(payload: {
    productId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/remove-from-cart?productId=${payload.productId}`,
      method: "GET",
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
   * get all cart product API
   */

  async getAllCartProdAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/get-all-cart",
      method: "GET",
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
   * get all product comments API
   */

  async getAllProdCommentsAPI(
    prodId: number
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/get-product-comments?productId=${prodId}`,
      method: "GET",
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
   * get all product review API
   */

  async getAllProdReviewAPI(
    prodId: string
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/get-product-reviews?productId=${prodId}`,
      method: "GET",
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
   * send product comments API
   */

  async sendProdCommentsAPI(payload: {
    productId: string;
    comment: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/add-new-comment",
      method: "POST",
      data: {
        productId: payload.productId,
        content: payload.comment,
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
   * send product review API
   */

  async sendProdReviewAPI(payload: {
    productId: string;
    content: string;
    title: string;
    rating: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "/user/add-new-review",
      method: "POST",
      data: {
        productId: payload.productId,
        content: payload.content,
        title: payload.title,
        rating: payload.rating,
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
   * add recently view product API
   */

  async addRecentlyViewProductAPI(payload: {
    productId: number;
    userId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `admin/addNewRecentlyViewedProduct?productId=${payload.productId}&userId=${payload.userId}`,
      method: "GET",
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
   * get all store review API
   */

  async getAllStoreReview(
    storeId: string
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/get-store-review?id=${storeId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get all recently viewed product API
   */

  async getAllRecentlyViewedProducsAPI(payload: {
    userId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `admin/getRecentlyViewedProductById?userId=${payload.userId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get all recently viewed product API
   */

  async applyDiscountCouponAPI(payload: {
    couponCode: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/applyDiscountCoupon",
      method: "POST",
      data: {
        code: payload.couponCode,
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

  /**
   * add new Coupon API
   */

  async addDiscountCouponAPI(
    payload: any
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/add-new-coupon",
      method: "POST",
      data: payload,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * update Coupon API
   */

  async updateDiscountCouponAPI(
    payload: any
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/update-coupon?id=${payload.id}`,
      method: "POST",
      data: payload.data,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * add new address API
   */

  async addNewAddressAPI(
    payload: any
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/addUserAddress",
      method: "POST",
      data: payload,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * update address API
   */

  async updateAddressAPI(
    payload: any
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/updateUserAddress?id=${payload?.id}`,
      method: "POST",
      data: payload.data,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * delete address API
   */

  async deleteAddressAPI(
    addressId: number
  ): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/deleteUserAddress?id=${addressId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get all buyer order API
   */

  async getAllBuyerOrderAPI(payload: {
    pageSize: number;
    pageIndex: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/get-buyer-orders?pageSize=${payload.pageSize}&pageIndex=${payload.pageIndex}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get all seller order API
   */

  async getAllSellerOrderAPI(payload: {
    pageSize: number;
    pageIndex: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/get-seller-orders?pageSize=${payload.pageSize}&pageIndex=${payload.pageIndex}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get all address API
   */

  async getAllAddressAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/getUSerAddresses",
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get all Coupon API
   */

  async getAllCouponAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/get-all-coupon",
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * delete Coupon API
   */

  async deleteCouponAPI(payload: {
    couponId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/delete-coupon?id=${payload.couponId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get Coupon details API
   */

  async getCouponDetailsAPI(payload: {
    couponId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/get-coupon-by-id?id=${payload.couponId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * get Coupon details API
   */

  async getOrderDetailsAPI(payload: {
    orderId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `admin/getOrderById?orderId=${payload.orderId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * unFollow user API
   */

  async unFollowUserAPI(payload: {
    venderId: number;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/un-follow-user?venderId=${payload.venderId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * checkout API
   */

  async checkoutOrdersAPI(payload: {
    data: any;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/orderCheckout",
      method: "POST",
      data: payload.data,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * bulk cart API
   */

  async bulkCartAPI(payload: {
    data: any;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: "user/add-to-cart-bulk",
      method: "POST",
      data: payload.data,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  /**
   * confirm order API
   */

  async confirmOrderAPI(payload: {
    orderId: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `user/orderDetailByParent?id=${payload.orderId}`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }

    return response as ErrorResult;
  }

  async addOrderNotes(payload: {
    attachment: File | string;
    content: string;
    orderId: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    formData.append("content", payload.content);
    formData.append("attachment", payload.attachment);
    formData.append("orderId", payload.orderId);

    const response = await this.request({
      url: `/user/addNewOrderNote`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data,
        },
      };
    }
    return response as ErrorResult;
  }

  /**
   * add order note API
   */

  async addOrderNotesAPI(payload: {
    attachment: File | string;
    content: string;
    orderId: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    formData.append("content", payload.content);
    formData.append("attachment", payload.attachment);
    formData.append("orderId", payload.orderId);

    const response = await this.request({
      url: `/user/addNewOrderNote`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data,
        },
      };
    }
    return response as ErrorResult;
  }

  /**
   * get order note API
   */

  async getOrderNotesAPI(payload: {
    orderId: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/user/getOrderNotesById?id=${payload.orderId}`,
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data,
        },
      };
    }
    return response as ErrorResult;
  }
}

export const UserApi = new _UserApi();
