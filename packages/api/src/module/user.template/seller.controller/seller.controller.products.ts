/* eslint-disable prettier/prettier */
import { UserService } from "../user.service";
import { type Request, type Response } from "express";

class SellerControllerManageProducts {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  public getAllProducts = async (
    req: Request<
      any,
      any,
      any,
      {
        pageSize?: string;
        pageIndex?: string;
        product?: string;
        category?: string;
        condition?: string;
        query?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        product = "",
        category = "",
        condition = "",
        query = "",
      } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const filters: any = {};
      const user = req.user;
      const products = await this.userService.findAllProducts({
        id: user.id,
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        product,
        category,
        condition,
        query,
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendErrorResponse("Error finding products", error);
    }
  };

  public addNewProduct = async (
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
      // const { productType, productName, price, description, category, condition, tags, inventory, shipping, tax, attibutes, linked, seo } = req.body;
      const user = req.user;
      const newProduct = await this.userService.createProduct({
        body: req.body,
        user,
      });
      res.sendSuccess200Response("products add successfully", newProduct);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateProduct = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      // const { productType, productName, price, description, category, condition, tags, inventory, shipping, tax, attibutes, linked, seo } = req.body;
      const user = req.user;
      const { id } = req.query;
      const newProduct = await this.userService.updateProduct({
        body: req.body,
        user,
        id,
      });
      res.sendSuccess200Response("products update successfully", newProduct);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteProductById = async (
    req: Request<
      any,
      any,
      any,
      {
        id?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id = "" } = req.query;

      const products = await this.userService.deleteProduct(id);
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getProductById = async (
    req: Request<
      any,
      any,
      any,
      {
        id?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id = "" } = req.query;

      const products = await this.userService.getProductById(id);
      res.sendSuccess200Response("product fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getUserDetail = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.findById(id);
      res.sendSuccess200Response("product fetch successfully", user);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateStoreSettings = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.updateStoreSetting({
        body: req.body,
        id,
      });
      res.sendSuccess200Response("successfully updated store setting", user);
    } catch (error) {
      res.sendErrorResponse("Error updating user", error);
    }
  };

  public updateSeoSettings = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.updateSeoSetting({
        body: req.body,
        id,
      });
      res.sendSuccess200Response("successfully updated store setting", user);
    } catch (error) {
      res.sendErrorResponse("Error updating user", error);
    }
  };

  public updatePolicySettings = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.updatePolicySetting({
        body: req.body,
        id,
      });
      res.sendSuccess200Response("successfully updated store setting", user);
    } catch (error) {
      res.sendErrorResponse("Error updating user", error);
    }
  };

  public updateGeneralProfile = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.updateGeneralSetting({
        body: req.body,
        id,
      });
      res.sendSuccess200Response("successfully updated store setting", user);
    } catch (error) {
      res.sendErrorResponse("Error updating user", error);
    }
  };

  public updateUserPassword = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.updateUserPassword({
        body: req.body,
        id,
      });
      res.sendSuccess200Response("successfully updated store setting", user);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public uploadProductImage = async (
    req: Request<
      any,
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const user = await this.userService.uploadProductAttachment({
        body: req.body,
        files: req.files,
        id,
      });
      res.sendSuccess200Response("successfully updated store setting", user);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public searchProduct = async (
    req: Request<
      any,
      any,
      any,
      {
        keyword: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const { keyword } = req.query;
      const products = await this.userService.searchProduct(keyword);
      res.sendSuccess200Response("successfully find products", products);
    } catch (error) {
      res.sendErrorResponse("Error finding products", error);
    }
  };

  public uploadStoreImage = async (
    req: Request<
      any,
      any,
      any,
      {
        keyword: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const files = req.files;
      const images = await this.userService.uploadStoreImages({
        userId: user.id,
        files,
      });
      res.sendSuccess200Response("upload image successfully", images);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateUserImage = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const files = req.files;
      const images = await this.userService.uploadUserImage({
        userId: user.id,
        files,
      });
      res.sendSuccess200Response("upload image successfully", images);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addUserAddress = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const address = await this.userService.addBuyerAddress({
        body: req.body,
        id: user.id,
      });
      res.sendSuccess200Response("add address successfully", address);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateUserAddress = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const address = await this.userService.updateBuyerAddress({
        body: req.body,
        id: parseInt(id),
      });
      res.sendSuccess200Response("add address successfully", address);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getUserAddresses = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
       const user= req.user;
      const address = await this.userService.getAllBuyerAddress(user.id);
      res.sendSuccess200Response("add address successfully", address);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteUserAddresses = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
       const {id}= req.query;
      const address = await this.userService.deleteBuyerAddress(parseInt(id));
      res.sendSuccess200Response("add address successfully", address);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getBuyerAddressById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
       const {id}= req.query;
      const address = await this.userService.getBuyerAddressId(parseInt(id));
      res.sendSuccess200Response("add address successfully", address);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewNotification = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const notification = await this.userService.addNewNotification({
        body: req.body,
        id: parseInt(id),
      });
      res.sendSuccess200Response("add notification successfully", notification);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewPaymentRequest=async (req: Request<any, any, any, any>,
    res: Response,)=>{
    try {
       const user= req.user;
       const payment= await this.userService.addNewPaymentRequest({...req.body, sellerId: user.id});
       res.sendSuccess200Response("add payment request successfully", payment);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };
}

export default SellerControllerManageProducts;
