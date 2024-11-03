/* eslint-disable prettier/prettier */
import { type Request, type Response } from "express";
import { AdminService } from "../admin.service";

class AdminControllerManageHomePage {
  private readonly adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  public addHomePageBanner = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const body = req.body;
      const file = req.files;
      const banner = await this.adminService.addNewBanner({ body, file });
      res.sendSuccess200Response("banner added successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateHomePageBanner = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const body = req.body;
      const file = req.files;
      const banner = await this.adminService.updateBanner({ body, file });
      res.sendSuccess200Response("banner update successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteHomePageBanner = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const {id} = req.query;
      const banner = await this.adminService.deleteBanner(id);
      res.sendSuccess200Response("banner delete successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllBanners = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
     
      const banner = await this.adminService.getAllBanner();
      res.sendSuccess200Response("banner fetch successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllFeatureProduct = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
     
      const product = await this.adminService.getAllFeatureproducts();
      res.sendSuccess200Response("product fetch successfully", product);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllPrmProduct = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
     
      const product = await this.adminService.getAllPrmproducts();
      res.sendSuccess200Response("product fetch successfully", product);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllNewlyListed = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
     
      const product = await this.adminService.getAllNewlyListed();
      res.sendSuccess200Response("product fetch successfully", product);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addRecentlyViewed = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
     const {productId, userId}= req.query;
    //  const user= req.user;
      const product = await this.adminService.addRecentlyViewedProduct({productId, userId: parseInt(userId)});
      res.sendSuccess200Response("product add successfully", product);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllRecentlyViewed = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
    // const user= req.user;
      const product = await this.adminService.getRecentlyViewedProducts();
      res.sendSuccess200Response("product fetch successfully", product);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllRecentlyViewedById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
    // const user= req.user;
      const {userId}= req.query;
      const id= parseInt(userId);
      const product = await this.adminService.getRecentlyViewedProductsByUserId(id);
      res.sendSuccess200Response("product fetch successfully", product);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addSocialMediaIcons = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const body = req.body;
      const file = req.files;
      const banner = await this.adminService.addSocialMediaIcons({ body, file });
      res.sendSuccess200Response("social media added successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateSocialMediaIcons = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const body = req.body;
      const file = req.files;
      const banner = await this.adminService.updateSocialMedia({ body, file });
      res.sendSuccess200Response("social media update successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteSocialMedia = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const {id} = req.query;
      const banner = await this.adminService.deleteSocialMediaIcon(id);
      res.sendSuccess200Response("social media delete successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllSocialMediaIcon = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const banner = await this.adminService.getAllSocialMedia();
      res.sendSuccess200Response("social media fetch successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public addFaqQuestions = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const body = req.body;
      const banner = await this.adminService.addFaqQuestions(body);
      res.sendSuccess200Response("faq added successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public updateFaqQuestion = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const body = req.body;
      const banner = await this.adminService.updateFAQ(body);
      res.sendSuccess200Response("question update successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public deleteFaqQuestion = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const {id} = req.query;
      const banner = await this.adminService.deleteFaqQuestion(id);
      res.sendSuccess200Response("question delete successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getAllFaqQuestions = async (
    _: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const banner = await this.adminService.getAllFaqQuestions();
      res.sendSuccess200Response("social media fetch successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getFaqQuestionById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const {id} = req.query;
      const banner = await this.adminService.getFaqQuestionById(id);
      res.sendSuccess200Response("question delete successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };

  public getSocialMediaIconById = async (
    req: Request<any, any, any, any>,
    res: Response,
  ) => {
    try {
      const {id} = req.query;
      const banner = await this.adminService.getSocialMediaIconById(id);
      res.sendSuccess200Response("question delete successfully", banner);
    } catch (error) {
      res.sendBadRequest400Response(error.message, null);
    }
  };
  
}

export default AdminControllerManageHomePage;
