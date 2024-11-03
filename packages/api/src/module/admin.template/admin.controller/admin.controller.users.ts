/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { type Request, type Response } from "express";
import { AdminService } from "../admin.service";

class AdminControllerManageUsers {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }
  public getAllUsers = async (
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
      const brand = await this.adminService.findAllBrand({
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
      });
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("Brand found successfully", brand);
    } catch (error) {
      res.sendErrorResponse("Error finding Brand", error);
    }
  };

  public getAllCustomers = async (
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
      const brand = await this.adminService.findAllCustomer({
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
      });
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("Customer found successfully", brand);
    } catch (error) {
      res.sendErrorResponse("Error finding Brand", error);
    }
  };

  public getUserById = async (
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
      const { id } = req.query;

      const brand = await this.adminService.findById(id);
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("Brand found successfully", brand);
    } catch (error) {
      res.sendErrorResponse("Error finding Brand", error);
    }
  };
  public deleteUserById = async (
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
      const { id } = req.query;

      const brand = await this.adminService.deleteUserById(id);
      // const total = await this.adminService.countAllBrands();
      res.sendSuccess200Response("Brand found successfully", brand);
    } catch (error) {
      res.sendErrorResponse("Error deleting user", error);
    }
  };

  public getAllVenders = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { pageIndex = "", pageSize = "" } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const filters: any = {};
      const users = await this.adminService.findAllVendors({
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
      });

      res.sendSuccess200Response("fetch vendor successfully", users);
    } catch (error) {
      res.sendErrorResponse("Error finding vendor", error);
    }
  };

  public getBlockedVenders = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { pageIndex = "", pageSize = "" } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const filters: any = {};
      const users = await this.adminService.findBlockedVendors({
        filters,
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
      });

      res.sendSuccess200Response("fetch vendor successfully", users);
    } catch (error) {
      res.sendErrorResponse("Error finding vendor", error);
    }
  };

  public getAllVendersForFilter = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const users = await this.adminService.findAllVendorsForFilters();
      res.sendSuccess200Response("fetch vendor successfully", users);
    } catch (error) {
      res.sendErrorResponse("Error finding vendor", error);
    }
  };

  public getUserRoles = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const roles = await this.adminService.getUserRoles();
      res.sendSuccess200Response("fetch roles successfully", roles);
    } catch (error) {
      res.sendErrorResponse("Error finding roles", error);
    }
  };

  public addNewUser = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { userName, email, firstName, lastName, website, password, role } =
        req.body;
      const newUser = await this.adminService.addNewUser({
        userName,
        email,
        firstName,
        lastName,
        website,
        password,
        role,
      });
      res.sendSuccess200Response("fetch roles successfully", newUser);
    } catch (error) {
      res.sendErrorResponse("Error when user added", error);
    }
  };

  public updateUserById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const user = await this.adminService.editUserById({ body: req.body, id });
      res.sendSuccess200Response("successfully update user", user);
    } catch (error) {
      res.sendErrorResponse("Error on updating user", error);
    }
  };

  public getAllPaymentRequest = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const paymentRequest = await this.adminService.getAllPaymentRequest();
      res.sendSuccess200Response(
        "fetch payment request successfully",
        paymentRequest,
      );
    } catch (error) {
      res.sendErrorResponse("Error when user added", error);
    }
  };

  public updateUserStatus = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const user = await this.adminService.updateUserStatus({...req.body, userId: parseInt(id)});
      res.sendSuccess200Response("successfully update user", user);
    } catch (error) {
      res.sendErrorResponse("Error on updating user", error);
    }
  };
}

export default AdminControllerManageUsers;
