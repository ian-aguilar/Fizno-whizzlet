/* eslint-disable prettier/prettier */
import express from "express";
import SellerControllerManageProducts from "./seller.controller/seller.controller.products";
import AuthMiddleware from "../../middleware/authMiddleware";
import { multiUpload } from "../../utils/uploadImages";
import SellerControllerMessages from "./message.controller";
import ProductControllerManageOrder from "./product.controller/product.controller.order";
import { singleUpload } from "../../utils/singleUpload";

const userRoute = express.Router();

const sellerControllerManageProducts = new SellerControllerManageProducts();
const sellerControllerManageMessages = new SellerControllerMessages();
const productControllerManageOrder = new ProductControllerManageOrder();
const authProtect = new AuthMiddleware();
userRoute.get(
    "/seller/products",
    authProtect.protect,
    sellerControllerManageProducts.getAllProducts,
);
userRoute.post(
    "/seller/add-new-products",
    authProtect.protect,
    sellerControllerManageProducts.addNewProduct,
);
userRoute.get(
    "/seller/delete-product",
    authProtect.protect,
    sellerControllerManageProducts.deleteProductById,
);
userRoute.get(
    "/seller/get-product-by-id",
    sellerControllerManageProducts.getProductById,
);
userRoute.post(
    "/seller/update-product",
    authProtect.protect,
    sellerControllerManageProducts.updateProduct,
);
userRoute.get(
    "/seller",
    authProtect.protect,
    sellerControllerManageProducts.getUserDetail,
);
userRoute.post(
    "/seller/update-store-settings",
    authProtect.protect,
    sellerControllerManageProducts.updateStoreSettings,
);
userRoute.post(
    "/seller/update-seo-settings",
    authProtect.protect,
    sellerControllerManageProducts.updateSeoSettings,
);
userRoute.post(
    "/seller/update-policy-settings",
    authProtect.protect,
    sellerControllerManageProducts.updatePolicySettings,
);
userRoute.post(
    "/seller/update-general-profile",
    authProtect.protect,
    sellerControllerManageProducts.updateGeneralProfile,
);
userRoute.post(
    "/seller/update-user-password",
    authProtect.protect,
    sellerControllerManageProducts.updateUserPassword,
);
userRoute.post(
    "/seller/upload-product-image",
    authProtect.protect,
    multiUpload.any(),
    sellerControllerManageProducts.uploadProductImage,
);

userRoute.get(
    "/messages-groups",
    authProtect.protect,
    sellerControllerManageMessages.findAllMessages,
);
userRoute.get(
    "/messagesByParentId",
    authProtect.protect,
    sellerControllerManageMessages.findAllMessagesByParentId,
);

userRoute.get(
    "/getUsersByKeyword",
    authProtect.protect,
    sellerControllerManageMessages.getUsersByKeyword,
);
userRoute.post(
    "/createNewMessage",
    authProtect.protect,
    singleUpload.any(),
    sellerControllerManageMessages.createNewMessage,
);

userRoute.post(
    "/sendMessage",
    authProtect.protect,
    singleUpload.any(),
    sellerControllerManageMessages.sentMessage,
);

userRoute.get(
    "/getUnreadMessageCount",
    authProtect.protect,
    sellerControllerManageMessages.getAllUnreadCount,
);
userRoute.post(
    "/markAsRead",
    authProtect.protect,
    sellerControllerManageMessages.markAsRead,
);
userRoute.post(
    "/markAsUnread",
    authProtect.protect,
    sellerControllerManageMessages.markAsUnread,
);
userRoute.post(
    "/archiveMessage",
    authProtect.protect,
    sellerControllerManageMessages.archiveMessage,
);
userRoute.post(
    "/deleteMessage",
    authProtect.protect,
    sellerControllerManageMessages.deleteMessage,
);
userRoute.post(
    "/bulkAction",
    authProtect.protect,
    sellerControllerManageMessages.bulkAction,
);

userRoute.post(
    "/seller/upload-store-image",
    authProtect.protect,
    multiUpload.any(),
    sellerControllerManageProducts.uploadStoreImage,
);
userRoute.post(
    "/update-user-image",
    authProtect.protect,
    multiUpload.any(),
    sellerControllerManageProducts.updateUserImage,
);

userRoute.get(
    "/follow-user",
    authProtect.protect,
    sellerControllerManageMessages.followUser,
);
userRoute.get(
    "/un-follow-user",
    authProtect.protect,
    sellerControllerManageMessages.unfollowUser,
);
userRoute.get(
    "/all-followers",
    authProtect.protect,
    sellerControllerManageMessages.getAllFollowers,
);
userRoute.get(
    "/all-followings",
    authProtect.protect,
    sellerControllerManageMessages.getAllFollowing,
);

userRoute.get(
    "/add-to-favorite",
    authProtect.protect,
    productControllerManageOrder.addProductAsFav,
);
userRoute.get(
    "/remove-favorite",
    authProtect.protect,
    productControllerManageOrder.removeFromFav,
);
userRoute.get(
    "/get-all-favorite",
    authProtect.protect,
    productControllerManageOrder.getAllFavorite,
);

userRoute.post(
    "/add-to-cart",
    authProtect.protect,
    productControllerManageOrder.addProductOnCart,
);
userRoute.post(
    "/add-to-cart-bulk",
    authProtect.protect,
    productControllerManageOrder.bulkAddProductOnCart,
);
userRoute.post(
    "/update-cart-quantity",
    authProtect.protect,
    productControllerManageOrder.updateCartQuantity,
);
userRoute.get(
    "/remove-from-cart",
    authProtect.protect,
    productControllerManageOrder.removeFromCart,
);
userRoute.get(
    "/get-all-cart",
    authProtect.protect,
    productControllerManageOrder.getAllCartProduct,
);
userRoute.post(
    "/add-new-coupon",
    authProtect.protect,
    productControllerManageOrder.addNewCoupon,
);
userRoute.post(
    "/update-coupon",
    authProtect.protect,
    productControllerManageOrder.updateDiscountCoupon,
);

userRoute.get(
    "/get-all-coupon",
    authProtect.protect,
    productControllerManageOrder.getAllCoupon,
);

userRoute.get(
    "/delete-coupon",
    authProtect.protect,
    productControllerManageOrder.deleteCoupon,
);

userRoute.get(
    "/get-coupon-by-id",
    authProtect.protect,
    productControllerManageOrder.getCouponById,
);

userRoute.get(
    "/get-all-orders",
    authProtect.protect,
    productControllerManageOrder.getAllOrders,
);
userRoute.get(
    "/get-seller-orders",
    authProtect.protect,
    productControllerManageOrder.getSellerOrders,
);
userRoute.get(
    "/get-buyer-orders",
    authProtect.protect,
    productControllerManageOrder.getBuyerOrders,
);
userRoute.get(
    "/get-product-reviews",
    productControllerManageOrder.getProductReviews,
);

userRoute.post(
    "/add-new-comment",
    authProtect.protect,
    productControllerManageOrder.addNewComment,
);
userRoute.post(
    "/add-new-review",
    authProtect.protect,
    productControllerManageOrder.addNewReview,
);
userRoute.post(
    "/add-new-like",
    authProtect.protect,
    productControllerManageOrder.addNewLike,
);

userRoute.get(
    "/get-product-comments",
    productControllerManageOrder.getProductComments,
);
userRoute.get(
    "/get-product-likes",
    productControllerManageOrder.getProductLikes,
);

userRoute.get(
    "/all-messages-groups",
    authProtect.protect,
    sellerControllerManageMessages.findAllMessagesForAdmin,
);
userRoute.get(
    "/get-store-review",
    sellerControllerManageMessages.getUserReview,
);

userRoute.post(
    "/applyDiscountCoupon",
    authProtect.protect,
    productControllerManageOrder.ApplyCoupon,
);

userRoute.post(
    "/addUserAddress",
    authProtect.protect,
    sellerControllerManageProducts.addUserAddress,
);
userRoute.post(
    "/updateUserAddress",
    authProtect.protect,
    sellerControllerManageProducts.updateUserAddress,
);
userRoute.get(
    "/getUSerAddresses",
    authProtect.protect,
    sellerControllerManageProducts.getUserAddresses,
);
userRoute.get(
    "/deleteUserAddress",
    authProtect.protect,
    sellerControllerManageProducts.deleteUserAddresses,
);

userRoute.get(
    "/getBuyerAddressById",
    authProtect.protect,
    sellerControllerManageProducts.getBuyerAddressById,
);

userRoute.post(
    "/orderCheckout",
    authProtect.protect,
    productControllerManageOrder.orderCheckout,
);
userRoute.post(
    "/updateOrderStatus",
    authProtect.protect,
    productControllerManageOrder.updateOrderStatus,
);

userRoute.post(
    "/addNewOrderNote",
    authProtect.protect,
    singleUpload.any(),
    productControllerManageOrder.addNewOrderNote,
);

userRoute.get(
    "/getOrderNotesById",
    authProtect.protect,
    productControllerManageOrder.getOrderNotesById,
);

userRoute.post(
    "/addNewPaymentRequest",
    authProtect.protect,
    sellerControllerManageProducts.addNewPaymentRequest,
);

userRoute.get(
    "/orderDetailByParent",
    authProtect.protect,
    productControllerManageOrder.orderDetailByParent,
);

userRoute.get(
    "/getAllReviews",
    productControllerManageOrder.getAllReviews,
);
userRoute.get(
    "/getReviewDetailById",
    productControllerManageOrder.getReviewDetailById,
);
userRoute.get(
    "/deleteReviewById",
    productControllerManageOrder.deleteReviewById,
);




export default userRoute; 
