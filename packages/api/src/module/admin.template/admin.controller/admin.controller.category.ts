/* eslint-disable prettier/prettier */
import { type Request, type Response } from "express";
import { AdminService } from "../admin.service";
import logger from "../../../utils/logger";

class AdminControllerManageCategory {
  private readonly adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  public getAllCategories = async (
    req: Request<
      any,
      any,
      any,
      {
        pageSize?: string;
        pageIndex?: string;
        query?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { pageIndex = "", pageSize = "" } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10000000;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const filters: any = {};

      const brand = await this.adminService.findAllCategories({
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
      });
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("categories fetch successfully", brand);
    } catch (error) {
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public deleteProductById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const product = await this.adminService.deleteProductById(id);
      res.sendSuccess200Response("Product Deleted Successfully", product);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding product", error);
    }
  };

  public updateCategory = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const catgeory = await this.adminService.updateCategoryById({
        id,
        data: req.body,
        file: req.files
      });
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("categories fetch successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public addCategory = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const catgeory = await this.adminService.addCategory({
        data: req.body,
        file: req.files
      });
      res.sendSuccess200Response("category added successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error adding category", error);
    }
  };

  public parentCategories = async (_, res: Response) => {
    try {
      const category = await this.adminService.parentCategories();
      res.sendSuccess200Response(
        "parentCategories fetch successfully",
        category,
      );
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public getAllConditions = async (_, res: Response) => {
    try {
      const category = await this.adminService.getAllConditions();
      res.sendSuccess200Response(
        "parentCategories fetch successfully",
        category,
      );
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public getAllProductTags = async (_, res: Response) => {
    try {
      const category = await this.adminService.getAllProductTags();
      res.sendSuccess200Response(
        "parentCategories fetch successfully",
        category,
      );
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public getAllProductType = async (_, res: Response) => {
    try {
      const category = await this.adminService.getAllProductTypes();
      res.sendSuccess200Response(
        "parentCategories fetch successfully",
        category,
      );
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public getAllBrands = async (_, res: Response) => {
    try {
      const category = await this.adminService.getAllBrands();
      res.sendSuccess200Response(
        "parentCategories fetch successfully",
        category,
      );
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };


  // public deleteCategory = async (
  //   _: Request<any, any, any, any>,
  //   res: Response,
  // ) => {
  //   res.sendSuccess200Response("commissionType fetch successfully", "");
  // };
  public deleteCategory = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const catgeory = await this.adminService.deleteCategoryById(id);
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("Category Deleted Successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding category", error);
    }
  };

  public commissionType = async (_, res: Response) => {
    try {
      const category = await this.adminService.commissionType();
      res.sendSuccess200Response("commissionType fetch successfully", category);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories", error);
    }
  };

  public getCategoryById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const category = await this.adminService.getCategoryById(id);
      res.sendSuccess200Response(" fetch successfully", category);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories by id", error);
    }
  };

  public getCategoryByParentId = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const category = await this.adminService.getCategoryByParentId(id);
      res.sendSuccess200Response(" fetch successfully", category);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding categories by id", error);
    }
  };

  public getAllAttributes = async (_: Request<any, any, any, any>, res: Response) => {
    try {
      const attributes = await this.adminService.getAllAttributes();
      res.sendSuccess200Response(" fetch successfully", attributes);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding all attributes", error);
    }
  };

  public getAttributeDetailById = async (req: Request<any, any, any, any>, res: Response) => {
    try {
      const { id } = req.query;
      const attributes = await this.adminService.getAttributesDetail({ id });
      res.sendSuccess200Response(" fetch successfully", attributes);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding all attributes", error);
    }
  };

  public addProductAttributes = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const catgeory = await this.adminService.addProductAttributes({
        data: req.body,
      });
      res.sendSuccess200Response("attributes added successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error adding attributes", error);
    }
  };

  public editProductAttributes = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const catgeory = await this.adminService.editProductAttributes({
        data: req.body,
        id
      });
      res.sendSuccess200Response("attributes added successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error adding attributes", error);
    }
  };

  public addTaxonomyInAttributes = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const catgeory = await this.adminService.addTaxonomyInAttribute({
        taxonomy: req.body.taxonomy,
        id
      });
      res.sendSuccess200Response("attributes added successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error adding attributes", error);
    }
  };

  public deleteAttributesById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const catgeory = await this.adminService.deleteAttributesById(id);
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("Attribute Deleted Successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendErrorResponse("Error finding Attribute", error);
    }
  };

  public updatePrivacyPolicy = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const catgeory = await this.adminService.updatePrivacyPolicy({
        body: req.body,
        file: req.files
      });
      res.sendSuccess200Response("attributes added successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateTermCondition = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const catgeory = await this.adminService.updateTermAndCondition({
        body: req.body,
        file: req.files
      });
      res.sendSuccess200Response("attributes added successfully", catgeory);
    } catch (error) {
      logger.error(error);
      res.sendBadRequest400Response(error.message, null);
    }
  };

   public getPrivacyPolicyContent = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const content = await this.adminService.getPrivacyPolicyContent();
      res.sendSuccess200Response("attributes added successfully", content);
    } catch (error) {
      logger.error(error);
      res.sendBadRequest400Response(error.message, null);
    }
  };

   public getTermAndConditionContent = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const content = await this.adminService.getTermAndConditionContent();
      res.sendSuccess200Response("attributes added successfully", content);
    } catch (error) {
      logger.error(error);
      res.sendBadRequest400Response(error.message, null);
    }
  };

  

}

export default AdminControllerManageCategory;
