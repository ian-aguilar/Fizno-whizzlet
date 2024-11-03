import * as runetime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _HomeApi extends runetime.BaseAPI {
  constructor() {
    super();
  }
  /**
   * Gets banners API
   */
  async getAllHomeBanner(): Promise<SuccessResult<any> | ErrorResult> {
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

  /**
   * Gets all featured products API
   */
  async getAllFeaturedProducts(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllfeatureProduct`,
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

  /**
   * Gets all prm products API
   */
  async getAllPrmProducts(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllPrmProduct`,
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

  /**
   * Gets all recently viewed products API
   */
  async getAllRecentlyViewedProducts(): Promise<
    SuccessResult<any> | ErrorResult
  > {
    const response = await this.request({
      url: `/admin/getRecentlyViewedProduct`,
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

  /**
   * Gets all popular category API
   */
  async getAllPopularCategoryAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/parent-category`,
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

  /**
   * Gets all newly listed products API
   */
  async getAllNewlyListedProductsAPI(): Promise<
    SuccessResult<any> | ErrorResult
  > {
    const response = await this.request({
      url: `/admin/getAllNewlyListed`,
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

  /**
   * Gets all sellers API
   */
  async getAllSellersAPI(): Promise<SuccessResult<any> | ErrorResult> {
    const response = await this.request({
      url: `/admin/getAllVendor`,
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
}

export const HomeApi = new _HomeApi();
