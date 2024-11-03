/* eslint-disable prettier/prettier */
import { MessageService } from "./message.service";
import { type Request, type Response } from "express";
class SellerControllerMessages {
  private readonly messageService: MessageService;
  // private readonly userService: UserService;
  constructor() {
    this.messageService = new MessageService();
    // this.userService = new UserService();
  }

  public findAllMessages = async (
    req: Request<
      any,
      any,
      any,
      {
        pageSize?: string;
        pageIndex?: string;
        keyword?: string;
        type?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        keyword = "",
        type = "",
      } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const user = req.user;
      const products = await this.messageService.getAllMessages({
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        id: user.id,
        keyword,
        type,
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public findAllMessagesForAdmin = async (
    req: Request<
      any,
      any,
      any,
      {
        pageSize?: string;
        pageIndex?: string;
        keyword?: string;
        type?: string;
        id?: string;
      }
    >,
    res: Response,
  ) => {
    try {
      const {
        pageIndex = "",
        pageSize = "",
        keyword = "",
        type = "",
        id = "",
      } = req.query;
      const parsedPageSize = pageSize !== "" ? parseInt(pageSize) : 10;
      const parsedPageIndex = pageIndex !== "" ? parseInt(pageIndex) : 1;
      const customerId = parseInt(id);
      const products = await this.messageService.getAllMessagesForAdmin({
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        id: customerId,
        keyword,
        type,
      });
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public findAllMessagesByParentId = async (
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
      const parsedId = parseInt(id);
      // const user = req.user;
      const products =
        await this.messageService.getAllMessagesByParentId(parsedId);
      res.sendSuccess200Response("products fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getUsersByKeyword = async (
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
      // const parsedId = parseInt(id);
      // const user = req.user;
      const products = await this.messageService.getUsersByKeyword(keyword);
      res.sendSuccess200Response("user fetch successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public createNewMessage = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const parsedId = parseInt(id);
      const user = req.user;
      const files= req.files?req.files:[];
      const products = await this.messageService.createNewMessage({
        body: req.body,
        files,
        id: user.id,
      });
      res.sendSuccess200Response("message sent successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public sentMessage = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const parsedId = parseInt(id);
      const user = req.user;
      const files= req.files?req.files:[];
      const products = await this.messageService.addMessage({
        body: req.body,
        files,
        id: user.id,
      });
      res.sendSuccess200Response("message sent successfully", products);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllUnreadCount = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      // const parsedId = parseInt(id);
      const user = req.user;
      const count = await this.messageService.getAllUnreadMessage(user.id);
      res.sendSuccess200Response("message sent successfully", count);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public followUser = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { venderId } = req.query;
      const user = req.user;
      const follow = await this.messageService.folowUser({
        vendorId: venderId,
        userId: user.id,
      });
      //    console.log(follow)
      res.sendSuccess200Response("user successfully followed bu you", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public unfollowUser = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { venderId } = req.query;
      const user = req.user;
      const follow = await this.messageService.unfollowUser({
        vendorId: venderId,
        userId: user.id,
      });
      res.sendSuccess200Response("user successfully followed bu you", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllFollowers = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.messageService.getAllFollowers(user.id);
      res.sendSuccess200Response("user successfully followed bu you", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllFollowing = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const user = req.user;
      const follow = await this.messageService.getAllFollowings(user.id);
      res.sendSuccess200Response("user successfully followed bu you", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public markAsRead = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { ids } = req.body;
      //    const user= req.user;
      const follow = this.messageService.markAsRead(ids);
      res.sendSuccess200Response("message mark as read", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public bulkAction = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { ids, type } = req.body;
      //    const user= req.user;
      const follow = this.messageService.bulkAction({ ids, type });
      res.sendSuccess200Response("message mark as read", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public markAsUnread = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { ids } = req.body;
      //    const user= req.user;
      const follow = this.messageService.markAsUnread(ids);
      res.sendSuccess200Response("message mark as read", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public archiveMessage = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { ids } = req.body;
      //    const user= req.user;
      const follow = this.messageService.messageArchived(ids);
      res.sendSuccess200Response("message mark as read", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteMessage = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const { ids } = req.body;
      //    const user= req.user;
      const follow = this.messageService.messageDeleted(ids);
      res.sendSuccess200Response("message mark as read", follow);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getUserReview = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
        const {id}= req.query;
        const review= await  this.messageService.getAllStoreReview(id);
        res.sendSuccess200Response("successfully fetched review", review);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };
}

export default SellerControllerMessages;
