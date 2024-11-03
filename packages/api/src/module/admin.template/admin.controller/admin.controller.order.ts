/* eslint-disable prettier/prettier */
import { OrderService } from "../order.service";
import { type Request, type Response } from "express";
class AdminControllerManageOrders {
  private readonly orderService: OrderService;
  constructor() {
    this.orderService = new OrderService();
  }

  public getAllOrders = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { pageSize, pageIndex, seller, customer } = req.query;
      // const user = req.user;
      const follow = await this.orderService.getAllOrders({
        pageSize,
        pageIndex,
        seller,
        customer,
      });
      //    console.log(follow)
      res.sendSuccess200Response("orders", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getOrderById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { orderId } = req.query;
      const id = parseInt(orderId);
      // const user = req.user;
      const follow = await this.orderService.getOrderById(id);
      //    console.log(follow)
      res.sendSuccess200Response("orders", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllCoupons = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const coupon = await this.orderService.getAllCoupons();
      res.sendSuccess200Response("orders", coupon);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewCoupon = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const user = req.user;
      const follow = await this.orderService.addNewCoupon({
        body: req.body,
      });
      //    console.log(follow)
      res.sendSuccess200Response("add coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteCoupon = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const coupon = await this.orderService.deleteCouponCode(parseInt(id));
      res.sendSuccess200Response("coupon  delete successfully", coupon);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewOrderStatus = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const user = req.user;
      const orderStatus = await this.orderService.addNewOrderStatus(req.body);
      //    console.log(follow)
      res.sendSuccess200Response("add order status successfully", orderStatus);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateOrderStatus = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const user = req.user;
      const orderStatus = await this.orderService.updateOrderStatus(req.body);
      //    console.log(follow)
      res.sendSuccess200Response(
        "update order status successfully",
        orderStatus,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllOrderStatus = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const user = req.user;
      const orderStatus = await this.orderService.getAllOrderStatus();
      //    console.log(follow)
      res.sendSuccess200Response(
        "update order status successfully",
        orderStatus,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getOrderStatusById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const user = req.user;
      const { id } = req.query;
      const orderStatus = await this.orderService.getAllOrderStatusById(
        parseInt(id),
      );
      //    console.log(follow)
      res.sendSuccess200Response(
        "update order status successfully",
        orderStatus,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteOrderStatus = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const user = req.user;
      const { id } = req.query;
      const orderStatus = await this.orderService.deteleOrderStatus(
        parseInt(id),
      );
      //    console.log(follow)
      res.sendSuccess200Response(
        "update order status successfully",
        orderStatus,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateAdminCommission = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const commission = await this.orderService.updateAdminCommission(
        req.body,
      );
      res.sendSuccess200Response(
        "update admin commission successfully",
        commission,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAdminCommissionValue = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const commission = await this.orderService.getAdminCommissionValue();
      res.sendSuccess200Response("fetch commission successfully", commission);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllEarningBySeller = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const seller = await this.orderService.getAllEarnings();
      res.sendSuccess200Response("fetch earning successfully", seller);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getEarningBySellerId = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const seller = await this.orderService.getEarningsBySellerId(
        parseInt(id),
      );
      res.sendSuccess200Response("fetch earning successfully", seller);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };
}

export default AdminControllerManageOrders;
