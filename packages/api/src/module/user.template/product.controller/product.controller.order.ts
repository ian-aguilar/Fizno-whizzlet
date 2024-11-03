/* eslint-disable prettier/prettier */
import { type Request, type Response } from "express";
// import { UserService } from "../user.service";
import { ProductService } from "../product.service";

class ProductControllerManageOrder {
  private readonly productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  public addProductAsFav = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId } = req.query;
      const user = req.user;
      const follow = await this.productService.addToFav({
        productId,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("product successfully added to fav", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public removeFromFav = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId } = req.query;
      const user = req.user;
      const follow = await this.productService.removeFav({
        productId,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response(
        "product successfully remove from fav",
        follow,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllFavorite = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const {productId}= req.query;
      const user = req.user;

      const follow = await this.productService.getAllFav(user.id);
      //    console.log(follow)
      res.sendSuccess200Response(
        "product successfully remove from fav",
        follow,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addProductOnCart = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId, quantity } = req.body;
      const user = req.user;
      const follow = await this.productService.addToCart({
        productId,
        userId: user.id,
        quantity,
      });
      //    console.log(follow)
      res.sendSuccess200Response("product successfully added to fav", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public bulkAddProductOnCart = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.productService.bulkAddToCart({
        body: req.body,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("product successfully added to fav", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateCartQuantity = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId, quantity } = req.body;
      const user = req.user;
      const follow = await this.productService.updateCartQuantity({
        productId,
        userId: user.id,
        quantity,
      });
      //    console.log(follow)
      res.sendSuccess200Response("product successfully added to fav", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public removeFromCart = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId } = req.query;
      const user = req.user;
      const follow = await this.productService.removeFromCart({
        productId,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response(
        "product successfully remove from fav",
        follow,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllCartProduct = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const {productId}= req.query;
      const user = req.user;
      const follow = await this.productService.getAllCartProduct(user.id);
      //    console.log(follow)
      res.sendSuccess200Response(
        "product successfully remove from fav",
        follow,
      );
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewCoupon = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.productService.addNewCoupon({
        body: req.body,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("add coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateDiscountCoupon = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;

      const follow = await this.productService.updateDiscountCoupon({
        body: req.body,
        id: parseInt(id),
      });
      //    console.log(follow)
      res.sendSuccess200Response("update coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllCoupon = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.user;
      const follow = await this.productService.getAllCoupon(id);
      //    console.log(follow)
      res.sendSuccess200Response("fetch coupon successfully", follow);
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
      const follow = await this.productService.deleteCoupon(parseFloat(id));
      //    console.log(follow)
      res.sendSuccess200Response("delete coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getCouponById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const follow = await this.productService.getCouponById(parseFloat(id));
      //    console.log(follow)
      res.sendSuccess200Response("get coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public ApplyCoupon = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.productService.applyDiscountCoupon({
        code: req.body.code,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("add coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllOrders = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const {productId}= req.query;
      // const user = req.user;
      const follow = await this.productService.getAllOrders();
      //    console.log(follow)
      res.sendSuccess200Response("orders", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getSellerOrders = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { pageSize, pageIndex } = req.query;
      const user = req.user;
      const orders = await this.productService.getAllSellerOrders({
        id: user.id,
        pageSize: parseInt(pageSize),
        pageIndex: parseInt(pageIndex),
      });
      //    console.log(follow)
      res.sendSuccess200Response("orders", orders);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getBuyerOrders = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const {productId} = req.query;
      const { pageSize, pageIndex } = req.query;
      const user = req.user;
      const orders = await this.productService.getAllBuyerOrders({
        id: user.id,
        pageSize: parseInt(pageSize),
        pageIndex: parseInt(pageIndex),
      });
      //    console.log(follow)
      res.sendSuccess200Response("orders", orders);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getProductReviews = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId } = req.query;
      const id = parseInt(productId);
      // const user = req.user;
      const comments = await this.productService.getCommentsByProductId(id);
      //    console.log(follow)
      res.sendSuccess200Response("orders", comments);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getProductLikes = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId } = req.query;
      const id = parseInt(productId);
      const likes = await this.productService.getProductLikes(id);
      res.sendSuccess200Response("likes", likes);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getProductComments = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { productId } = req.query;
      const id = parseInt(productId);
      const likes = await this.productService.getProductComments(id);
      res.sendSuccess200Response("likes", likes);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewComment = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.productService.addNewComment({
        body: req.body,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("add coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewReview = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.productService.addNewReview({
        body: req.body,
        user,
      });
      //    console.log(follow)
      res.sendSuccess200Response("add coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewLike = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.productService.addNewLike({
        body: req.body,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("add coupon successfully", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public orderCheckout = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const order = await this.productService.orderCheckOut({
        body: req.body,
        user,
      });
      //    console.log(follow)
      res.sendSuccess200Response("order successfully placed", order);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public orderDetailByParent = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const order = await this.productService.ordersByParent(parseInt(id));
      res.sendSuccess200Response("order detail successfully", order);
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
      const order = await this.productService.updateOrderStatus(req.body);
      //    console.log(follow)
      res.sendSuccess200Response("status update successfully", order);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addNewOrderNote = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // console.log("Hello")
      const user = req.user;
      const files = req.files ? req.files : [];
      const order = await this.productService.addNewOrderNotes({
        ...req.body,
        userId: user.id,
        files,
      });
      //    console.log(follow)
      res.sendSuccess200Response("status update successfully", order);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getOrderNotesById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const review = await this.productService.getOrderNotesById(parseInt(id));
      res.sendSuccess200Response("fetch order notes successfully", review);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllReviews = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const review = await this.productService.getAllReviews();
      res.sendSuccess200Response("fetch review successfully", review);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getReviewDetailById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const review = await this.productService.getReviewDetailById(parseInt(id));
      res.sendSuccess200Response("fetch review successfully", review);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteReviewById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { id } = req.query;
      const review = await this.productService.deleteReviewById(parseInt(id));
      res.sendSuccess200Response("fetch review successfully", review);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };
}

export default ProductControllerManageOrder;
