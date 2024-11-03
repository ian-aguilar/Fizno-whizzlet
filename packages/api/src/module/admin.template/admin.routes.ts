/* eslint-disable prettier/prettier */
import express from "express";
import AdminControllerManageUsers from "./admin.controller/admin.controller.users";
import AdminControllerManageCategory from "./admin.controller/admin.controller.category";
import AdminControllerManageProduct from "./admin.controller/admin.controller.products";
import { singleUpload } from "../../utils/singleUpload";
import AdminControllerManageHomePage from "./admin.controller/admin.controller.homepage";
import AdminControllerManageOrders from "./admin.controller/admin.controller.order";
// import AuthMiddleware from "../../middleware/authMiddleware";

const adminRoute = express.Router();
// const authProtect = new AuthMiddleware();
const adminControllerManageUsers = new AdminControllerManageUsers();
const adminControllerManageCategories = new AdminControllerManageCategory();
const adminControllerManageProducts = new AdminControllerManageProduct();
const adminControllerManageHomePage = new AdminControllerManageHomePage();
const adminControllerManageOrders = new AdminControllerManageOrders();
adminRoute.get("/getAllUsers", adminControllerManageUsers.getAllUsers);
adminRoute.get("/getAllCustomers", adminControllerManageUsers.getAllCustomers);
adminRoute.post("/addNewUser", adminControllerManageUsers.addNewUser);
adminRoute.post("/updateUser", adminControllerManageUsers.updateUserById);
adminRoute.get("/getUserById", adminControllerManageUsers.getUserById);
adminRoute.get("/deleteUserById", adminControllerManageUsers.deleteUserById);
adminRoute.get("/getAllVendor", adminControllerManageUsers.getAllVenders);
adminRoute.get("/getBlockedVendor", adminControllerManageUsers.getBlockedVenders);
adminRoute.get(
  "/getAllVendorsForFilter",
  adminControllerManageUsers.getAllVendersForFilter,
);
adminRoute.get("/getAllProducts", adminControllerManageProducts.getAllProducts);
adminRoute.get(
  "/getAllCategories",
  adminControllerManageCategories.getAllCategories,
);
adminRoute.delete(
  "/deleteProductById",
  adminControllerManageCategories.deleteProductById,
);
adminRoute.post(
  "/updateCategoryById",
  singleUpload.any(),
  adminControllerManageCategories.updateCategory,
);
adminRoute.post("/addCategory", singleUpload.any(), adminControllerManageCategories.addCategory);
adminRoute.delete(
  "/deleteCategoryById",
  adminControllerManageCategories.deleteCategory,
);
adminRoute.get(
  "/parent-category",
  adminControllerManageCategories.parentCategories,
);
adminRoute.get(
  "/getAllConditions",
  adminControllerManageCategories.getAllConditions,
);
adminRoute.get(
  "/getAllProductTags",
  adminControllerManageCategories.getAllProductTags,
);
adminRoute.get(
  "/getAllProductType",
  adminControllerManageCategories.getAllProductType,
);
adminRoute.get(
  "/getAllBrands",
  adminControllerManageCategories.getAllBrands,
);
adminRoute.get(
  "/commission-type",
  adminControllerManageCategories.commissionType,
);
adminRoute.get("/category-id", adminControllerManageCategories.getCategoryById);
adminRoute.get("/getCategoryByParentId", adminControllerManageCategories.getCategoryByParentId);
adminRoute.get("/user-roles", adminControllerManageUsers.getUserRoles);
adminRoute.get("/getAllAttributes", adminControllerManageCategories.getAllAttributes);
adminRoute.get("/getAttributeDetailBySlug", adminControllerManageCategories.getAttributeDetailById);
adminRoute.post("/addProductAttributes", adminControllerManageCategories.addProductAttributes);
adminRoute.post("/editProductAttributes", adminControllerManageCategories.editProductAttributes);
adminRoute.post("/addTaxonomyInAttribute", adminControllerManageCategories.addTaxonomyInAttributes);
adminRoute.post("/searchProduct", adminControllerManageProducts.searchProducts);
adminRoute.post("/searchOtherProduct", adminControllerManageProducts.searchOtherProducts);
adminRoute.post("/searchProductByKeyword", adminControllerManageProducts.searchProductsByKeyword);
adminRoute.get("/deleteAttributesById", adminControllerManageCategories.deleteAttributesById);
adminRoute.get("/getPrivacyPolicyContent", adminControllerManageCategories.getPrivacyPolicyContent);
adminRoute.get("/getTermAndCondition", adminControllerManageCategories.getTermAndConditionContent);
adminRoute.post("/updatePrivacyPolicy", singleUpload.any(), adminControllerManageCategories.updatePrivacyPolicy);
adminRoute.post("/updateTermAndCondition", singleUpload.any(), adminControllerManageCategories.updateTermCondition);
adminRoute.post("/addNewBanner", singleUpload.any(), adminControllerManageHomePage.addHomePageBanner);
adminRoute.post("/updateBanner", singleUpload.any(), adminControllerManageHomePage.updateHomePageBanner);
adminRoute.get("/getAllBanners", adminControllerManageHomePage.getAllBanners);
adminRoute.get("/getAllfeatureProduct", adminControllerManageHomePage.getAllFeatureProduct);
adminRoute.get("/getAllPrmProduct", adminControllerManageHomePage.getAllPrmProduct);
adminRoute.get("/getAllNewlyListed", adminControllerManageHomePage.getAllNewlyListed);
adminRoute.get("/addNewRecentlyViewedProduct", adminControllerManageHomePage.addRecentlyViewed);
adminRoute.get("/getRecentlyViewedProduct",  adminControllerManageHomePage.getAllRecentlyViewed);
adminRoute.get("/getRecentlyViewedProductById",  adminControllerManageHomePage.getAllRecentlyViewedById);
adminRoute.get("/deleteHomePageBanner",  adminControllerManageHomePage.deleteHomePageBanner);
adminRoute.get("/getAllOrders",  adminControllerManageOrders.getAllOrders);
adminRoute.get("/getOrderById",  adminControllerManageOrders.getOrderById);
adminRoute.post("/addNewCoupon",  adminControllerManageOrders.addNewCoupon);
adminRoute.get("/getAllCoupons",  adminControllerManageOrders.getAllCoupons);
adminRoute.get("/getHighestPriceValue",  adminControllerManageProducts.getHighestPriceValue);
adminRoute.get("/getLowestPriceValue",  adminControllerManageProducts.getLowestPriceValue);
adminRoute.get("/getSocialMediaIcon",  adminControllerManageHomePage.getAllSocialMediaIcon);
adminRoute.post("/addSocialMediaIcon",singleUpload.any(), adminControllerManageHomePage.addSocialMediaIcons);
adminRoute.post("/updateSocialMediaIcon", singleUpload.any(), adminControllerManageHomePage.updateSocialMediaIcons);
adminRoute.get("/deleteSocialMediaIcon",  adminControllerManageHomePage.deleteSocialMedia);

adminRoute.get("/getAllFaqQuestions",  adminControllerManageHomePage.getAllFaqQuestions);
adminRoute.post("/addNewFaqQuestion", adminControllerManageHomePage.addFaqQuestions);
adminRoute.post("/updateFaqQuestion", adminControllerManageHomePage.updateFaqQuestion);
adminRoute.get("/deleteFaqQuestion",  adminControllerManageHomePage.deleteFaqQuestion);
adminRoute.get("/getFaqQuestionById",  adminControllerManageHomePage.getFaqQuestionById);
adminRoute.get("/getSocialMediaIconById",  adminControllerManageHomePage.getSocialMediaIconById);
adminRoute.post("/shareProduct",  adminControllerManageProducts.shareProduct);
adminRoute.post("/addNewOrderStatus",  adminControllerManageOrders.addNewOrderStatus);
adminRoute.post("/updateOrderStatus",  adminControllerManageOrders.updateOrderStatus);
adminRoute.get("/getAllOrderStatus",  adminControllerManageOrders.getAllOrderStatus);
adminRoute.get("/getAllOrderStatusById",  adminControllerManageOrders.getOrderStatusById);
adminRoute.get("/deleteOrderStatus",  adminControllerManageOrders.deleteOrderStatus);
adminRoute.post("/updateAdminCommission",  adminControllerManageOrders.updateAdminCommission);
adminRoute.get("/getAdminCommissionValue",  adminControllerManageOrders.getAdminCommissionValue);
adminRoute.get("/getAllSellersEarning",  adminControllerManageOrders.getAllEarningBySeller);
adminRoute.get("/getEarningBySellerId",  adminControllerManageOrders.getEarningBySellerId);
adminRoute.post("/updateUserStatus",  adminControllerManageUsers.updateUserStatus);
export default adminRoute;

