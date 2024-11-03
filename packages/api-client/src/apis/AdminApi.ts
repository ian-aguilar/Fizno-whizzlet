import * as runetime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _AdminApi extends runetime.BaseAPI {
  constructor() {
    super();
  }
  /**
   * Add Banner API
   */
  async addBannerAPI(payload: {
    bannerImage: File | string;
    bannerText: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    formData.append("title", payload.bannerText);
    formData.append("image", payload.bannerImage);

    const response = await this.request({
      url: `/admin/addNewBanner`,
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
   * Update Banner API
   */
  async updateBannerAPI(payload: {
    bannerImage: File | string;
    bannerText: string;
    bannerId: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    formData.append("title", payload.bannerText);
    formData.append("image", payload.bannerImage);
    formData.append("id", payload.bannerId);

    const response = await this.request({
      url: `/admin/updateBanner`,
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
   * get all Banner API
   */
  async getAllBannerAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllBanners`,
      method: "GET",
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
  async getAllOrdersApi(payload:{
    pageSize:number,
    pageIndex:number,
    seller:number|null,
    customer:number|null
  }): Promise<SuccessResult<any> | ErrorResult> {
    const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getAllOrders?pageSize=${pageSize}&pageIndex=${pageIndex}&seller=${seller||""}&customer=${customer||""}`,
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
  async getOrderById(id:string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getOrderById?orderId=${id}`,
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
  async addNewCoupon(payload: any): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/addNewCoupon`,
      method: "POST",
      data: payload,
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
  async getAllCoupons(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllCoupons`,
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

  async getHighestPriceValue(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getHighestPriceValue`,
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

  async getLowestPriceValue(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getLowestPriceValue`,
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

  async addSocialMediaIcon(payload: {
    image: File | string;
    name: string;
    url: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("url", payload.url);
    formData.append("image", payload.image);

    const response = await this.request({
      url: `/admin/addSocialMediaIcon`,
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
    return response as ErrorResult;
  }

  async getSocialMediaIcon(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getSocialMediaIcon`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data:response.data,
      };
    }
    return response as ErrorResult;
  }

  async updateSocialMediaIcon(payload: {
    image: File | string;
    name: string;
    url: string;
    id:string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("id", payload.id);
    formData.append("url", payload.url);
    if(payload.image){
      formData.append("image", payload.image);
    }

    const response = await this.request({
      url: `/admin/updateSocialMediaIcon`,
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

  async getSocialMediaById(id:string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getSocialMediaIconById?id=${id}`,
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

  async deleteSocialMediaIcon(id:string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/deleteSocialMediaIcon?id=${id}`,
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

  async getAllFaqQuestions(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllFaqQuestions`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data:response.data,
      };
    }
    return response as ErrorResult;
  }

  async addFaqQuestions(payload: {
    title: string;
    content: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/addNewFaqQuestion`,
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

  async updateFaqQuestions(payload: {
    title: string;
    content: string;
    id:string
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/updateFaqQuestion`,
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

  async getFaqQuestionById(id:string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getFaqQuestionById?id=${id}`,
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

  async deleteFaqQuestion(id:number): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/deleteFaqQuestion?id=${id}`,
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

  async getAllOrderStatus(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllOrderStatus`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data:response.data,
      };
    }
    return response as ErrorResult;
  }

  async addNewOrderStatus(payload: {
    name: string;
    color: string;
    slug: string;
    status: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/addNewOrderStatus`,
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

  async updateOrderStatus(payload: {
    id: number,
    name: string;
    color: string;
    slug: string;
    status: string;
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/updateOrderStatus`,
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

  async getOrderStatusById(id:string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getAllOrderStatusById?id=${id}`,
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

  async getAllSellerEarning(): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getAllSellersEarning`,
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

  async getSellerEarningById(id: string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getEarningBySellerId?id=${id}`,
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

  async commissionSettings(payload: {
    commissionFee: string,
    paymentFee: string
  }): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/updateAdminCommission`,
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

  async getAdminCommissionSetting(): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/getAdminCommissionValue`,
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

  async deleteuserById(id: number): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/deleteUserById?id=${id}`,
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

  async getAllReview(): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/user/getAllReviews`,
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

  async getReviewDatailById(id: string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/user/getReviewDetailById?id=${id}`,
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

  async deleteReviewById(id: number): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/user/deleteReviewById?id=${id}`,
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

  async updateUserStatus(data:{status: number}, id: number): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/admin/updateUserStatus?id=${id}`,
      method: "POST",
      data
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: response.data,
      };
    }
    return response as ErrorResult;
  }

  async getBlockedVendors(p0?: {
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
        url: `/admin/getBlockedVendor?${params}`,
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

  async getOrderNotesById(id: string): Promise<SuccessResult<any> | ErrorResult> {
    // const {pageSize, pageIndex, seller, customer}=payload;
    const response = await this.request({
      url: `/user/getOrderNotesById?id=${id}`,
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

}

export const AdminApi = new _AdminApi();
