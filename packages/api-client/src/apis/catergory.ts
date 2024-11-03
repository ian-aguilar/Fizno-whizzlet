import { BaseAPI } from "../runtime"; // Adjust the path based on your project structure
import urlcat from "urlcat";
export interface GetCategoriesParams {
  pageSize?: number;
  pageIndex?: number;
  query?: string;
  search: string;
}
export class CategoriesService extends BaseAPI {
  constructor() {
    super();
  }

  async getCategories(params: GetCategoriesParams): Promise<any> {
    try {
      const { pageSize, pageIndex, query, search } = params;
      const url = urlcat("/admin/getAllCategories", {
        pageSize,
        pageIndex,
        query,
        search,
      });
      const response = await this.request({
        url,
        method: "GET",
      });

      // Assuming your backend responds with a structured success response
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response.data,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getParentCategory(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/parent-category",
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            count: number;
            term_taxonomy_id: number;
            term_id: any;
            term: { name: any };
            parent: string;
          }) => ({
            value: category.term_taxonomy_id, // or category.term.slug if you want slug
            label: category.term.name,
            parent: category.parent,
            count: category.count,
          })
        );
        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getAllConditions(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/getAllConditions",
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            count: number;
            term_taxonomy_id: number;
            term_id: any;
            term: { name: any };
          }) => ({
            value: category.term_taxonomy_id, // or category.term.slug if you want slug
            label: category.term.name,
            count: category.count,
          })
        );
        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getAllProductTypes(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/getAllProductType",
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            count: number;
            term_taxonomy_id: number;
            term_id: any;
            term: { name: any };
          }) => ({
            value: category.term_taxonomy_id, // or category.term.slug if you want slug
            label: category.term.name,
            count: category.count,
          })
        );
        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getAllProductTags(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/getAllProductTags",
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            term_taxonomy_id: number;
            term_id: any;
            term: { name: any };
          }) => ({
            value: category.term_taxonomy_id, // or category.term.slug if you want slug
            label: category.term.name,
          })
        );
        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getAllBrands(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/getAllBrands",
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            count: number;
            term_taxonomy_id: number;
            term_id: any;
            term: { name: any };
          }) => ({
            value: category.term_taxonomy_id, // or category.term.slug if you want slug
            label: category.term.name,
            count: category.count,
          })
        );
        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getAllAttributes(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/getAllAttributes",
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        return {
          remote: "success",
          data: response.data.data,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getCommissionType(): Promise<any> {
    try {
      const response = await this.request({
        url: "/admin/commission-type",
        method: "GET",
      });

      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            term_id: any;
            term: { name: any };
            parent: string;
          }) => ({
            value: category.term_id, // or category.term.slug if you want slug
            label: category.term.name,
            parent: category.parent,
          })
        );

        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getCategoryById(id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/category-id?id=${id}`,
        method: "GET",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async getCategoryByParentId(id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/getCategoryByParentId?id=${id}`,
        method: "GET",
      });
      if (response.remote === "success") {
        // Transform the response data into the desired format
        const parentCategories = response.data.data.map(
          (category: {
            count: number;
            term_taxonomy_id: number;
            term_id: any;
            term: { name: any };
          }) => ({
            value: category.term_taxonomy_id, // or category.term.slug if you want slug
            label: category.term.name,
            count: category.count,
          })
        );
        return {
          remote: "success",
          data: parentCategories,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }
  async updateCategoryById(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/updateCategoryById?id=${data.id}`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to fetch categories",
        data: error?.message,
      };
    }
  }

  async deleteCategoryById(id: number): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/deleteCategoryById?id=${id}`,
        method: "DELETE",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to delete category",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error deleting categories:", error);
      return {
        remote: "error",
        message: "Failed to delete category",
        data: error?.message,
      };
    }
  }

  async addCategory(payload: any): Promise<any> {
    try {
      const data = new FormData();
      data.append("name", payload.name);
      data.append("slug", payload.slug);
      data.append("parent", payload.parent?payload.parent:0);
      data.append("description", payload.description);
      data.append("image", payload.image);
      const response = await this.request({
        url: `/admin/addCategory`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      return {
        remote: "error",
        message: "Failed to add category",
        data: response.error,
      };
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to add category",
        data: error?.message,
      };
    }
  }
  async addProductAttributes(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/addProductAttributes`,
        method: "POST",
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      return {
        remote: "error",
        message: "Failed to add category",
        data: response.error,
      };
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return {
        remote: "error",
        message: "Failed to add category",
        data: error?.message,
      };
    }
  }
  async getAllProducts(
    pageIndex: number,
    pageSize: number,
    query: any
  ): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/getAllProducts?pageIndex=${pageIndex}&pageSize=${pageSize}&seller=${query.seller}&category=${query.category}&condition=${query.condition}`,
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
  async deleteProductById(id: number): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/deleteProductById?id=${id}`,
        method: "DELETE",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to delete category",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error deleting categories:", error);
      return {
        remote: "error",
        message: "Failed to delete category",
        data: error?.message,
      };
    }
  }
  async deleteAttributesById(id: number): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/deleteAttributesById?id=${id}`,
        method: "GET",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to delete category",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error deleting categories:", error);
      return {
        remote: "error",
        message: "Failed to delete category",
        data: error?.message,
      };
    }
  }
  async getAttributesById(id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/getAttributeDetailBySlug?id=${id}`,
        method: "GET",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get attributes:", error);
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: error?.message,
      };
    }
  }
  async updateAttributesById(data: any, id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/editProductAttributes?id=${id}`,
        method: "POST",
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get attributes:", error);
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: error?.message,
      };
    }
  }
  async addTaxonomyInAttribute(data: any, id: string): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/addTaxonomyInAttribute?id=${id}`,
        method: "POST",
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }

      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get attributes:", error);
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: error?.message,
      };
    }
  }

  async searchProducts(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/searchProduct`,
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
        message: "Failed to get attributes",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get attributes:", error);
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: error?.message,
      };
    }
  }

  async searchOtherProducts(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/searchOtherProduct`,
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
        message: "Failed to get attributes",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get attributes:", error);
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: error?.message,
      };
    }
  }

  async searchProductsByKeyword(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/searchProductByKeyword`,
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
        message: "Failed to get attributes",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get attributes:", error);
      return {
        remote: "error",
        message: "Failed to get attributes",
        data: error?.message,
      };
    }
  }

  async getPrivacyPolicyContent(): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/getPrivacyPolicyContent`,
        method: "GET",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }
      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get privacy policy:", error);
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: error?.message,
      };
    }
  }

  async getTermAndConditionContent(): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/getTermAndCondition`,
        method: "GET",
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }
      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get privacy policy:", error);
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: error?.message,
      };
    }
  }

  async updateTermAndConditionContent(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/updateTermAndCondition`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }
      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get privacy policy:", error);
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: error?.message,
      };
    }
  }

  async updatePrivacyPolicyContent(data: any): Promise<any> {
    try {
      const response = await this.request({
        url: `/admin/updatePrivacyPolicy`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
      });
      if (response.remote === "success") {
        return {
          remote: "success",
          data: response,
        };
      }
      // Handle error response if necessary
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: response.error,
      };
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Error get privacy policy:", error);
      return {
        remote: "error",
        message: "Failed to get privacy policy",
        data: error?.message,
      };
    }
  }
}

export const categoriesService = new CategoriesService();
