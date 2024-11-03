/* eslint-disable prettier/prettier */
import { type Request, type Response } from "express";
import { AdminService } from "../admin.service";

class AdminControllerManageProduct {
  private readonly adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  public getAllProducts = async (
    req: Request<
      any,
      any,
      any,
      {
        pageSize?: string;
        pageIndex?: string;
        seller?: string;
        category?: string;
        condition?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        seller = "",
        category = "",
        condition = "",
      } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const filters: any = {};
      const products = await this.adminService.findAllProducts({
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        seller,
        category,
        condition,
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error, null);
    }
  };

  public getProductById = async (
    req: Request<
      any,
      any,
      any,
      {
        id;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const product = await this.adminService.findProductById(id);
      res.sendSuccess200Response("products fetch successfully", product);
    } catch (error) {
      res.sendErrorResponse("Error finding products", error);
    }
  };

  public searchProducts = async (req: Request<
    any,
    any,
    any,
    any
  >,
    res: Response,) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        brand = [],
        category = [],
        condition = [],
        keyword = "",
        minPrice,
        maxPrice,
        sort
      } = req.body;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const products = await this.adminService.searchAllProducts({
        keyword,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        brand,
        category,
        condition,
        minPrice,
        maxPrice,
        sort
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error,null);
    }
  };


  public searchOtherProducts = async (req: Request<
    any,
    any,
    any,
    any
  >,
    res: Response,) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        brand = [],
        category = [],
        condition = [],
        keyword = "",
        minPrice,
        maxPrice,
        sort
      } = req.body;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const products = await this.adminService.searchOtherProducts({
        keyword,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        brand,
        category,
        condition,
        minPrice,
        maxPrice,
        sort
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error,null);
    }
  };

  public getHighestPriceValue=async(_: Request<
    any,
    any,
    any,
    any
  >,
    res: Response,)=>{
      try {
        const highValue= await this.adminService.getHigherPriceValue();
        res.sendSuccess200Response("high Value", highValue);
      } catch (error) {
        res.sendBadRequest400Response(error, null);
      }
  };

  public getLowestPriceValue=async(_: Request<
    any,
    any,
    any,
    any
  >,
    res: Response,)=>{
      try {
        const highValue= await this.adminService.getLowerPriceValue();
        res.sendSuccess200Response("low Value", highValue);
      } catch (error) {
        res.sendBadRequest400Response(error, null);
      }
  };


  public searchProductsByKeyword = async (req: Request<
    any,
    any,
    any,
    any
  >,
    res: Response,) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        keyword = ""
      } = req.body;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const products = await this.adminService.searchAllProductsByKeyword({
        keyword,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendErrorResponse("Error finding products", error);
    }
  };

  public shareProduct=async(req: Request<
    any,
    any,
    any,
    any
  >,
    res: Response,)=>{
    try {
      const share= await this.adminService.shareProduct(req.body);
      res.sendSuccess200Response("share successfully", share);
    } catch (error) {
      res.sendBadRequest400Response(error, null);
    }
  };
}

export default AdminControllerManageProduct;
