/* eslint-disable prettier/prettier */
import { bigIntToJson } from "../../utils/bigIntToJson";
import JSONbig from "json-bigint";
import phpUnserialize from "php-unserialize";
import prismaClient from "../../utils/dbConnection";
import moment from "moment";
export class ProductService {
  private readonly prisma = prismaClient;

  public async addToFav({
    userId,
    productId,
  }: {
    userId: number;
    productId: number;
  }) {
    try {
      const favorite = await this.prisma.wp_add_product_fav.findFirst({
        where: {
          product_id: productId,
          user_id: userId,
        },
      });
      //    console.log(follower);
      if (!favorite) {
        const follow = await this.prisma.wp_add_product_fav.create({
          data: {
            product_id: productId,
            user_id: userId,
            created_at: new Date(),
          },
        });
        const result = JSONbig.stringify(follow);
        return JSON.parse(result);
      } else {
        throw new Error("you already added this product as favorite");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async removeFav({
    userId,
    productId,
  }: {
    userId: number;
    productId: number;
  }) {
    try {
      const favorite = await this.prisma.wp_add_product_fav.findFirst({
        where: {
          product_id: productId,
          user_id: userId,
        },
      });
      //    console.log(follower);
      await this.prisma.wp_add_product_fav.delete({
        where: {
          id: favorite?.id,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllFav(id: number) {
    try {
      const response = await this.prisma.wp_add_product_fav.findMany({
        where: {
          user_id: id,
        },
        select: {
          id: true,
          user: true,
          porduct: {
            select: {
              ID: true,
              post_author: true,
              post_date: true,
              post_date_gmt: true,
              post_content: true,
              post_title: true,
              post_excerpt: true,
              post_status: true,
              comment_status: true,
              ping_status: true,
              post_password: true,
              post_name: true,
              to_ping: true,
              pinged: true,
              post_modified: true,
              post_modified_gmt: true,
              post_content_filtered: true,
              post_parent: true,
              guid: true,
              menu_order: true,
              post_type: true,
              post_mime_type: true,
              comment_count: true,
              wp_nepaz2_users: {
                select: {
                  id: true,
                  display_name: true,
                  user_email: true,
                  user_nicename: true,
                  wp_nepaz2_usermeta: {
                    where: {
                      OR: [
                        { meta_key: "dokan_profile_settings" },
                        { meta_key: "wp_nepaz2_user_avatar" },
                      ],
                    },
                  },
                  follower: true,
                  following: true,
                },
              },
              wp_nepaz2_postmeta: {
                where: {
                  OR: [{ meta_key: "_stock" }, { meta_key: "_price" }],
                },
              },
              wp_term_relationships: {
                select: {
                  term_taxonomy: {
                    select: {
                      taxonomy: true,
                      term: true,
                    },
                  },
                },
              },
              wp_comments: true,
              wp_add_product_fav: true,
              share_product: true,
            },
          },
        },
      });

      const products = await Promise.all(
        response.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.porduct?.ID,
            },
          });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.porduct?.wp_nepaz2_users?.id.toString(),
            },
            select: {
              meta_key: true,
              meta_value: true,
              post: {
                select: {
                  post_author: true,
                  wp_nepaz2_postmeta: {
                    where: {
                      meta_key: "rating",
                    },
                  },
                },
              },
            },
          });
          const userImageId =
            item.porduct?.wp_nepaz2_users.wp_nepaz2_usermeta.find(
              meta => meta.meta_key === "wp_nepaz2_user_avatar",
            );
          const avatar = await this.prisma.wp_posts.findUnique({
            where: {
              ID: userImageId?.meta_value
                ? parseInt(userImageId?.meta_value)
                : 0,
              post_type: "attachment",
            },
          });
          const dokenSetting =
            item.porduct?.wp_nepaz2_users.wp_nepaz2_usermeta.find(
              meta => meta.meta_key === "dokan_profile_settings",
            );
          const userSettings = phpUnserialize.unserialize(
            dokenSetting?.meta_value,
          );
          let totalRate = 0;
          for (let i = 0; i < userReview.length; i++) {
            const element = userReview[i];
            totalRate =
              totalRate +
              parseInt(
                element.post.wp_nepaz2_postmeta[0]?.meta_value
                  ? element.post.wp_nepaz2_postmeta[0]?.meta_value
                  : "0",
              );
          }
          const avgRate = totalRate / userReview.length;
          const wpUser = {
            ...item.porduct?.wp_nepaz2_users,
            avatar,
            store: userSettings,
            avgRate,
            totalReview: userReview.length,
          };
          return {
            ...item,
            porduct: {
              ...item.porduct,
              attachment,
              wp_nepaz2_users: wpUser,
              wp_add_product_fav: item?.porduct?.wp_add_product_fav.length,
              wp_comments: item.porduct?.wp_comments.length,
              post_share: item.porduct?.share_product.length,
            },
          };
        }),
      );

      const fav = bigIntToJson(products);
      return fav;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addToCart({
    userId,
    productId,
    quantity,
  }: {
    userId: number;
    productId: number;
    quantity: number;
  }) {
    try {
      const favorite = await this.prisma.wp_add_product_cart.findFirst({
        where: {
          product_id: productId,
          user_id: userId,
        },
      });
      //    console.log(follower);
      if (!favorite) {
        const follow = await this.prisma.wp_add_product_cart.create({
          data: {
            product_id: productId,
            user_id: userId,
            created_at: new Date(),
            quantity,
          },
        });
        const result = JSONbig.stringify(follow);
        return JSON.parse(result);
      } else {
        throw new Error("this product already added in the basket");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async bulkAddToCart(options: {
    body: Array<{
      productId: number;
      quantity: number;
    }>;
    userId: number;
  }) {
    try {
      const { body, userId } = options;
      for (let i = 0; i < body.length; i++) {
        const element = body[i];
        const cart = await this.prisma.wp_add_product_cart.findFirst({
          where: {
            product_id: element.productId,
            user_id: userId,
          },
        });
        if (!cart) {
          const data = {
            product_id: element.productId,
            user_id: userId,
            created_at: new Date(),
            quantity: element.quantity,
          };
          await this.prisma.wp_add_product_cart.create({
            data,
          });
        }
      }
      // const data = body.map(item => {
      //   return {
      //     product_id: item.productId,
      //     user_id: userId,
      //     created_at: new Date(),
      //     quantity: item.quantity,
      //   };
      // });
      // await this.prisma.wp_add_product_cart.createMany({
      //   data,
      // });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateCartQuantity({
    userId,
    productId,
    quantity,
  }: {
    userId: number;
    productId: number;
    quantity: number;
  }) {
    try {
      const cart = await this.prisma.wp_add_product_cart.findFirst({
        where: {
          user_id: userId,
          product_id: productId,
        },
      });
      if (cart) {
        await this.prisma.wp_add_product_cart.update({
          where: {
            id: cart?.id,
          },
          data: {
            quantity,
          },
        });
        return true;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async removeFromCart({
    userId,
    productId,
  }: {
    userId: number;
    productId: number;
  }) {
    try {
      const favorite = await this.prisma.wp_add_product_cart.findFirst({
        where: {
          product_id: productId,
          user_id: userId,
        },
      });
      //    console.log(follower);
      await this.prisma.wp_add_product_cart.delete({
        where: {
          id: favorite?.id,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllCartProduct(id: number) {
    try {
      const response = await this.prisma.wp_add_product_cart.findMany({
        where: {
          user_id: id,
        },
        select: {
          id: true,
          user: true,
          product: {
            select: {
              ID: true,
              post_author: true,
              post_date: true,
              post_date_gmt: true,
              post_content: true,
              post_title: true,
              post_excerpt: true,
              post_status: true,
              comment_status: true,
              ping_status: true,
              post_password: true,
              post_name: true,
              to_ping: true,
              pinged: true,
              post_modified: true,
              post_modified_gmt: true,
              post_content_filtered: true,
              post_parent: true,
              guid: true,
              menu_order: true,
              post_type: true,
              post_mime_type: true,
              comment_count: true,
              wp_nepaz2_users: {
                select: {
                  id: true,
                  display_name: true,
                  user_email: true,
                  user_nicename: true,
                  wp_nepaz2_usermeta: {
                    where: {
                      OR: [
                        { meta_key: "dokan_profile_settings" },
                        { meta_key: "wp_nepaz2_user_avatar" },
                      ],
                    },
                  },
                  follower: true,
                  following: true,
                },
              },
              wp_nepaz2_postmeta: {
                where: {
                  OR: [
                    { meta_key: "_stock" },
                    { meta_key: "_price" },
                    { meta_key: "sale_price" },
                  ],
                },
              },
              wp_term_relationships: {
                select: {
                  term_taxonomy: {
                    select: {
                      taxonomy: true,
                      term: true,
                    },
                  },
                },
              },
            },
          },
          quantity: true,
        },
      });
      const product = await Promise.all(
        response.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.product?.ID,
            },
          });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.product?.wp_nepaz2_users?.id.toString(),
            },
            select: {
              meta_key: true,
              meta_value: true,
              post: {
                select: {
                  post_author: true,
                  wp_nepaz2_postmeta: {
                    where: {
                      meta_key: "rating",
                    },
                  },
                },
              },
            },
          });
          const userImageId =
            item.product?.wp_nepaz2_users.wp_nepaz2_usermeta.find(
              meta => meta.meta_key === "wp_nepaz2_user_avatar",
            );
          const avatar = await this.prisma.wp_posts.findUnique({
            where: {
              ID: userImageId?.meta_value
                ? parseInt(userImageId?.meta_value)
                : 0,
              post_type: "attachment",
            },
          });
          const dokenSetting =
            item.product?.wp_nepaz2_users.wp_nepaz2_usermeta.find(
              meta => meta.meta_key === "dokan_profile_settings",
            );
          const userSettings = phpUnserialize.unserialize(
            dokenSetting?.meta_value,
          );
          let totalRate = 0;
          for (let i = 0; i < userReview.length; i++) {
            const element = userReview[i];
            totalRate =
              totalRate +
              parseInt(
                element.post.wp_nepaz2_postmeta[0]?.meta_value
                  ? element.post.wp_nepaz2_postmeta[0]?.meta_value
                  : "0",
              );
          }
          const avgRate = totalRate / userReview.length;
          const wpUser = {
            ...item.product?.wp_nepaz2_users,
            avatar,
            store: userSettings,
            avgRate,
            totalReview: userReview.length,
          };
          return {
            ...item,
            product: { ...item.product, attachment, wp_nepaz2_users: wpUser },
          };
        }),
      );
      const fav = bigIntToJson(product);
      return fav;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewCoupon(options: any) {
    try {
      const { body, userId } = options;
      await this.prisma.coupon_code.create({
        data: {
          coupon_type: body.couponType,
          coupon_amount: body.couponAmount,
          description: body.description,
          sellerId: userId,
          uses: 0,
          minimum_spent: body.minimumSpent,
          maximum_spent: body.maximumSpent,
          limit: body.limit,
          limit_per_item: body.limitPerItem,
          limit_per_user: body.limitPerUser,
          expire_at: body.expireAt,
          created_at: new Date(),
          code: body.couponCode,
        },
      });
      return true;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async updateDiscountCoupon(options: any) {
    try {
      const { body, id } = options;
      await this.prisma.coupon_code.update({
        where: {
          id,
        },
        data: {
          coupon_type: body.couponType,
          coupon_amount: body.couponAmount,
          description: body.description,
          minimum_spent: body.minimumSpent,
          maximum_spent: body.maximumSpent,
          limit: body.limit,
          limit_per_item: body.limitPerItem,
          limit_per_user: body.limitPerUser,
          expire_at: body.expireAt,
          // code: body.couponCode,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async applyDiscountCoupon(options: any) {
    try {
      const { code, userId } = options;
      const coupon = await this.prisma.coupon_code.findFirst({
        where: {
          code,
        },
      });
      if (coupon) {
        const carts = await this.prisma.wp_add_product_cart.findMany({
          where: {
            user_id: userId,
          },
          select: {
            id: true,
            user_id: true,
            product_id: true,
            created_at: true,
            quantity: true,
            product: {
              select: {
                ID: true,
                post_author: true,
                post_name: true,
                wp_nepaz2_postmeta: {
                  where: {
                    OR: [
                      {
                        meta_key: "_price",
                      },
                      {
                        meta_key: "sale_price",
                      },
                    ],
                  },
                },
              },
            },
          },
        });
        let discountTotal = 0;
        let cartTotal = 0;
        for (let i = 0; i < carts.length; i++) {
          const cartItem = carts[i];
          const metaValue = cartItem.product?.wp_nepaz2_postmeta?.find(
            meta => meta.meta_key === "_price",
          )?.meta_value;

          const salePrice = cartItem.product?.wp_nepaz2_postmeta?.find(
            meta => meta.meta_key === "sale_price",
          )?.meta_value;
          const productPrice = salePrice ?? metaValue ?? "0";
          cartTotal += productPrice
            ? parseFloat(productPrice)
            : 0 * cartItem.quantity;
          //  console.log(cartTotal, coupon.minimum_spent, coupon.maximum_spent)
          // Check if product's post_author matches coupon sellerId
          if (
            cartItem.product?.post_author === coupon.sellerId ||
            coupon.sellerId === 23n
          ) {
            // Check if cart total meets minimum and maximum spend requirements
            if (
              cartTotal >= coupon.minimum_spent &&
              cartTotal <= coupon.maximum_spent
            ) {
              // Apply percentage discount
              if (coupon.coupon_type === "percentage_discount") {
                const discount =
                  (coupon.coupon_amount / 100) *
                  parseFloat(productPrice) *
                  cartItem.quantity;
                discountTotal += discount;
              }
              // Apply fixed amount discount
              else if (coupon.coupon_type === "fix_amount") {
                discountTotal += coupon.coupon_amount;
              }
            }
          }
        }
        return {
          cartTotal,
          discountTotal,
          totalAfterDiscount: cartTotal - discountTotal,
        };
      } else {
        throw new Error("Invalid coupon code");
      }
      // console.log(coupon, JSONbig.stringify(carts));
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllCoupon(id: number) {
    try {
      const result = await this.prisma.coupon_code.findMany({
        where: {
          sellerId: id,
        },
      });
      const coupon = bigIntToJson(result);
      return coupon;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteCoupon(id: number) {
    try {
      await this.prisma.coupon_code.delete({
        where: {
          id,
        },
      });
      // const coupon= bigIntToJson(result);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getCouponById(id: number) {
    try {
      const result = await this.prisma.coupon_code.findUnique({
        where: {
          id,
        },
      });
      const coupon = JSONbig.stringify(result);
      return JSON.parse(coupon);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllOrders() {
    try {
      const results = await this.prisma.wp_posts.findMany({
        where: {
          post_type: "shop_order",
        },
        orderBy: {
          ID: "desc",
        },
        take: 10,
        select: {
          ID: true,
          // post_date:true,
          wp_nepaz2_postmeta: true,
          // wp_nepaz2_users:true,
          wp_dokan_orders: {
            select: {
              id: true,
              order_id: true,
              seller_id: true,
              order_total: true,
              net_amount: true,
              order_status: true,
              seller: true,
            },
          },
          wp_wc_order_product_lookup_order: {
            select: {
              order_item_id: true,
              order_id: true,
              product_id: true,
              variation_id: true,
              customer_id: true,
              date_created: true,
              product_qty: true,
              product_net_revenue: true,
              product_gross_revenue: true,
              coupon_amount: true,
              tax_amount: true,
              shipping_amount: true,
              shipping_tax_amount: true,
              user: true,
            },
          },
          wp_wc_order_product_lookup_product: true,
          wp_woocommerce_order_items: true,
        },
      });
      const orders = bigIntToJson(results);
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllSellerOrders(options: {
    id: number;
    pageSize: number;
    pageIndex: number;
  }) {
    try {
      const { id, pageSize, pageIndex } = options;
      const size = pageSize || 10;
      const page = pageIndex || 1;
      const results = await this.prisma.wp_posts.findMany({
        where: {
          post_type: "shop_order",
          is_deleted: 0,
          wp_dokan_orders: {
            some: {
              seller_id: id,
            },
          },
        },
        orderBy: {
          ID: "desc",
        },
        skip: (page - 1) * size,
        take: size,
        select: {
          ID: true,
          post_author: true,
          post_date: true,
          post_content: true,
          post_title: true,
          post_status: true,
          post_name: true,
          post_parent: true,
          post_type: true,
          // post_date:true,
          wp_nepaz2_postmeta: true,
          // wp_nepaz2_users:true,
          wp_dokan_orders: {
            select: {
              id: true,
              order_id: true,
              seller_id: true,
              order_total: true,
              net_amount: true,
              order_status: true,
              seller: true,
            },
          },
          wp_wc_order_product_lookup_order: {
            select: {
              order_item_id: true,
              order_id: true,
              product_id: true,
              variation_id: true,
              customer_id: true,
              date_created: true,
              product_qty: true,
              product_net_revenue: true,
              product_gross_revenue: true,
              coupon_amount: true,
              tax_amount: true,
              shipping_amount: true,
              shipping_tax_amount: true,
              user: true,
              product: {
                select: {
                  ID: true,
                  post_author: true,
                  post_date: true,
                  post_date_gmt: true,
                  post_content: true,
                  post_title: true,
                  post_excerpt: true,
                  post_status: true,
                  comment_status: true,
                  ping_status: true,
                  post_password: true,
                  post_name: true,
                  to_ping: true,
                  pinged: true,
                  post_modified: true,
                  post_modified_gmt: true,
                  post_content_filtered: true,
                  post_parent: true,
                  guid: true,
                  menu_order: true,
                  post_type: true,
                  post_mime_type: true,
                  comment_count: true,
                  attachments: {
                    where: {
                      post_type: "attachment",
                    },
                  },
                  wp_nepaz2_users: {
                    select: {
                      id: true,
                      display_name: true,
                      user_email: true,
                      user_nicename: true,
                      wp_nepaz2_usermeta: {
                        where: {
                          OR: [
                            { meta_key: "dokan_profile_settings" },
                            { meta_key: "wp_nepaz2_user_avatar" },
                          ],
                        },
                      },
                      follower: true,
                      following: true,
                    },
                  },
                  wp_nepaz2_postmeta: {
                    where: {
                      OR: [{ meta_key: "_stock" }, { meta_key: "_price" }],
                    },
                  },
                  wp_term_relationships: {
                    select: {
                      term_taxonomy: {
                        select: {
                          taxonomy: true,
                          term: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          wp_wc_order_product_lookup_product: true,
          wp_woocommerce_order_items: true,
        },
      });
      const orders = bigIntToJson(results);
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllBuyerOrders(options: {
    id: number;
    pageSize: number;
    pageIndex: number;
  }) {
    const { id, pageSize, pageIndex } = options;
    const size = pageSize || 10;
    const page = pageIndex || 1;
    try {
      const results = await this.prisma.wp_posts.findMany({
        where: {
          post_type: "shop_order",
          post_author: id,
          is_deleted: 0,
          wp_wc_order_product_lookup_order: {
            some: {
              customer_id: id,
            },
          },
        },
        orderBy: {
          ID: "desc",
        },
        skip: (page - 1) * size,
        take: size,
        select: {
          ID: true,
          post_author: true,
          post_date: true,
          post_content: true,
          post_title: true,
          post_status: true,
          post_name: true,
          post_parent: true,
          post_type: true,
          // post_date:true,
          wp_nepaz2_postmeta: true,
          // wp_nepaz2_users:true,
          wp_dokan_orders: {
            select: {
              id: true,
              order_id: true,
              seller_id: true,
              order_total: true,
              net_amount: true,
              order_status: true,
              seller: true,
            },
          },
          wp_wc_order_product_lookup_order: {
            select: {
              order_item_id: true,
              order_id: true,
              product_id: true,
              variation_id: true,
              customer_id: true,
              date_created: true,
              product_qty: true,
              product_net_revenue: true,
              product_gross_revenue: true,
              coupon_amount: true,
              tax_amount: true,
              shipping_amount: true,
              shipping_tax_amount: true,
              user: true,
              product: {
                select: {
                  ID: true,
                  post_author: true,
                  post_date: true,
                  post_date_gmt: true,
                  post_content: true,
                  post_title: true,
                  post_excerpt: true,
                  post_status: true,
                  comment_status: true,
                  ping_status: true,
                  post_password: true,
                  post_name: true,
                  to_ping: true,
                  pinged: true,
                  post_modified: true,
                  post_modified_gmt: true,
                  post_content_filtered: true,
                  post_parent: true,
                  guid: true,
                  menu_order: true,
                  post_type: true,
                  post_mime_type: true,
                  comment_count: true,
                  attachments: {
                    where: {
                      post_type: "attachment",
                    },
                  },
                  wp_nepaz2_postmeta: {
                    where: {
                      OR: [
                        { meta_key: "_stock" },
                        { meta_key: "_price" },
                        { meta_key: "sale_price" },
                      ],
                    },
                  },
                  wp_comments: {
                    select: {
                      wp_commentmeta: true,
                    },
                  },
                },
              },
            },
          },
          wp_wc_order_product_lookup_product: true,
          wp_woocommerce_order_items: true,
        },
      });

      const mapped = results.map(order => {
        let totalRatings = 0;
        let avgRating = 0;
        return {
          ...order,
          wp_wc_order_product_lookup_order:
            order.wp_wc_order_product_lookup_order.map(prod => {
              return {
                ...prod,
                product: {
                  ...prod.product,
                  wp_comments: prod.product?.wp_comments?.map(review => {
                    totalRatings += parseInt(
                      review.wp_commentmeta[0].meta_value,
                    );
                    avgRating =
                      totalRatings / (prod.product?.wp_comments?.length ?? 0);
                    return review;
                  }),
                },
              };
            }),
          avgRating,
        };
      });
      const orders = bigIntToJson(mapped);
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getCommentsByProductId(id: number) {
    try {
      // console.log(id)
      const results = await this.prisma.wp_comments.findMany({
        where: {
          comment_post_ID: id,
          comment_type: "review",
        },
        select: {
          comment_ID: true,
          comment_post_ID: true,
          comment_author: true,
          comment_author_email: true,
          comment_date: true,
          comment_content: true,
          comment_parent: true,
          comment_title: true,
          user_id: true,
          wp_commentmeta: {
            where: {
              meta_key: "rating",
            },
          },
          user: {
            select: {
              id: true,
              display_name: true,
              user_email: true,
              user_nicename: true,
              wp_nepaz2_usermeta: {
                where: {
                  OR: [
                    { meta_key: "dokan_profile_settings" },
                    { meta_key: "wp_nepaz2_user_avatar" },
                  ],
                },
              },
              follower: true,
              following: true,
            },
          },
        },
      });

      let ratingSum = 0;
      let totalRatings = 0;
      results.forEach(item => {
        const rating = item?.wp_commentmeta[0]?.meta_value
          ? parseInt(item?.wp_commentmeta[0]?.meta_value, 10)
          : 0;
        ratingSum += rating;
        totalRatings++;
      });
      const averageRating = ratingSum / totalRatings;
      const ratingCounts = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };
      results.forEach(item => {
        const rating = item.wp_commentmeta[0].meta_value;
        if (rating && ratingCounts[rating] !== undefined) {
          ratingCounts[rating]++;
        }
      });
      const products = await Promise.all(
        results.map(async item => {
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.user?.id.toString(),
            },
            select: {
              meta_key: true,
              meta_value: true,
              post: {
                select: {
                  post_author: true,
                  wp_nepaz2_postmeta: {
                    where: {
                      meta_key: "rating",
                    },
                  },
                },
              },
            },
          });
          const userImageId = item.user?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "wp_nepaz2_user_avatar",
          );
          const avatar = await this.prisma.wp_posts.findUnique({
            where: {
              ID: userImageId?.meta_value
                ? parseInt(userImageId?.meta_value)
                : 0,
              post_type: "attachment",
            },
          });
          const dokenSetting = item.user?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = dokenSetting
            ? phpUnserialize.unserialize(dokenSetting?.meta_value)
            : "";
          let totalRate = 0;
          for (let i = 0; i < userReview.length; i++) {
            const element = userReview[i];
            totalRate =
              totalRate +
              parseInt(
                element.post.wp_nepaz2_postmeta[0]?.meta_value
                  ? element.post.wp_nepaz2_postmeta[0]?.meta_value
                  : "0",
              );
          }
          const avgRate = totalRate / userReview.length;
          return {
            ...item,
            user: {
              ...item.user,
              avgRate,
              totalReview: userReview.length,
              avatar,
              store: userSettings,
            },
          };
        }),
      );
      // const avg= total/results.length;
      const comments = bigIntToJson(products);
      return {
        review: comments,
        total: results.length,
        avg: averageRating,
        ratingCounts,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllReviews() {
    try {
      // console.log(id)
      const results = await this.prisma.wp_comments.findMany({
        where: {
          comment_type: "review",
        },
        select: {
          comment_ID: true,
          comment_post_ID: true,
          comment_author: true,
          comment_author_email: true,
          comment_date: true,
          comment_content: true,
          comment_parent: true,
          comment_title: true,
          user_id: true,
          wp_commentmeta: {
            where: {
              meta_key: "rating",
            },
          },
          user: {
            select: {
              id: true,
              display_name: true,
              user_email: true,
              user_nicename: true,
              wp_nepaz2_usermeta: {
                where: {
                  OR: [
                    { meta_key: "dokan_profile_settings" },
                    { meta_key: "wp_nepaz2_user_avatar" },
                  ],
                },
              },
              follower: true,
              following: true,
            },
          },
          posts: {
            select: {
              ID: true,
              post_author: true,
              post_date: true,
              post_date_gmt: true,
              post_content: true,
              post_title: true,
              post_excerpt: true,
              post_status: true,
              comment_status: true,
              ping_status: true,
              post_password: true,
              post_name: true,
              to_ping: true,
              pinged: true,
              post_modified: true,
              post_modified_gmt: true,
              post_content_filtered: true,
              post_parent: true,
              guid: true,
              menu_order: true,
              post_type: true,
              post_mime_type: true,
              comment_count: true,
              attachments: true,
              wp_nepaz2_users: {
                select: {
                  id: true,
                  display_name: true,
                  user_email: true,
                  user_nicename: true,
                  wp_nepaz2_usermeta: {
                    where: {
                      OR: [
                        { meta_key: "dokan_profile_settings" },
                        { meta_key: "wp_nepaz2_user_avatar" },
                      ],
                    },
                  },
                  follower: true,
                  following: true,
                },
              },
              wp_nepaz2_postmeta: {
                where: {
                  OR: [{ meta_key: "_stock" }, { meta_key: "_price" }],
                },
              },
            },
          },
        },
      });

      const products = await Promise.all(
        results.map(async item => {
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.user?.id.toString(),
            },
            select: {
              meta_key: true,
              meta_value: true,
              post: {
                select: {
                  post_author: true,
                  wp_nepaz2_postmeta: {
                    where: {
                      meta_key: "rating",
                    },
                  },
                },
              },
            },
          });
          const userImageId = item.user?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "wp_nepaz2_user_avatar",
          );
          const avatar = await this.prisma.wp_posts.findUnique({
            where: {
              ID: userImageId?.meta_value
                ? parseInt(userImageId?.meta_value)
                : 0,
              post_type: "attachment",
            },
          });
          let totalRate = 0;
          for (let i = 0; i < userReview.length; i++) {
            const element = userReview[i];
            totalRate =
              totalRate +
              parseInt(
                element.post.wp_nepaz2_postmeta[0]?.meta_value
                  ? element.post.wp_nepaz2_postmeta[0]?.meta_value
                  : "0",
              );
          }
          const avgRate = totalRate / userReview.length;
          return {
            ...item,
            user: {
              ...item.user,
              avgRate,
              totalReview: userReview.length,
              avatar,
            },
          };
        }),
      );

      const comments = bigIntToJson(products);
      return comments;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getReviewDetailById(id: number) {
    try {
      // console.log(id)
      const results = await this.prisma.wp_comments.findUnique({
        where: {
          comment_ID: id,
        },
        select: {
          comment_ID: true,
          comment_post_ID: true,
          comment_author: true,
          comment_author_email: true,
          comment_date: true,
          comment_content: true,
          comment_parent: true,
          comment_title: true,
          user_id: true,
          wp_commentmeta: {
            where: {
              meta_key: "rating",
            },
          },
          user: {
            select: {
              id: true,
              display_name: true,
              user_email: true,
              user_nicename: true,
              wp_nepaz2_usermeta: {
                where: {
                  OR: [
                    { meta_key: "dokan_profile_settings" },
                    { meta_key: "wp_nepaz2_user_avatar" },
                  ],
                },
              },
              follower: true,
              following: true,
            },
          },
          posts: {
            select: {
              ID: true,
              post_author: true,
              post_date: true,
              post_date_gmt: true,
              post_content: true,
              post_title: true,
              post_excerpt: true,
              post_status: true,
              comment_status: true,
              ping_status: true,
              post_password: true,
              post_name: true,
              to_ping: true,
              pinged: true,
              post_modified: true,
              post_modified_gmt: true,
              post_content_filtered: true,
              post_parent: true,
              guid: true,
              menu_order: true,
              post_type: true,
              post_mime_type: true,
              comment_count: true,
              attachments: true,
              wp_nepaz2_users: {
                select: {
                  id: true,
                  display_name: true,
                  user_email: true,
                  user_nicename: true,
                  wp_nepaz2_usermeta: {
                    where: {
                      OR: [
                        { meta_key: "dokan_profile_settings" },
                        { meta_key: "wp_nepaz2_user_avatar" },
                      ],
                    },
                  },
                  follower: true,
                  following: true,
                },
              },
              wp_nepaz2_postmeta: {
                where: {
                  OR: [{ meta_key: "_stock" }, { meta_key: "_price" }],
                },
              },
            },
          },
        },
      });

      if (results) {
        const userReview = await this.prisma.wp_postmeta.findMany({
          where: {
            meta_key: "store_id",
            meta_value: results.user?.id.toString(),
          },
          select: {
            meta_key: true,
            meta_value: true,
            post: {
              select: {
                post_author: true,
                wp_nepaz2_postmeta: {
                  where: {
                    meta_key: "rating",
                  },
                },
              },
            },
          },
        });
        const userImageId = results.user?.wp_nepaz2_usermeta.find(
          meta => meta.meta_key === "wp_nepaz2_user_avatar",
        );
        const avatar = await this.prisma.wp_posts.findUnique({
          where: {
            ID: userImageId?.meta_value ? parseInt(userImageId?.meta_value) : 0,
            post_type: "attachment",
          },
        });
        let totalRate = 0;
        for (let i = 0; i < userReview.length; i++) {
          const element = userReview[i];
          totalRate =
            totalRate +
            parseInt(
              element.post.wp_nepaz2_postmeta[0]?.meta_value
                ? element.post.wp_nepaz2_postmeta[0]?.meta_value
                : "0",
            );
        }
        const avgRate = totalRate / userReview.length;
        const user = {
          ...results.user,
          avgRate,
          totalReview: userReview.length,
          avatar,
        };
        const comments = JSONbig.stringify({ ...results, user });
        return JSON.parse(comments);
      } else {
        throw new Error("Comment not found");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteReviewById(id: number) {
    try {
      // console.log(id)
      await this.prisma.wp_commentmeta.deleteMany({
        where: {
          comment_id: id,
        },
      });
      await this.prisma.wp_comments.delete({
        where: {
          comment_ID: id,
        },
      });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewComment(options: any) {
    try {
      const { body, userId } = options;
      const response = await this.prisma.post_comments.create({
        data: {
          product_id: body.productId,
          content: body.content,
          parent: 0,
          user_id: userId,
          created_at: new Date(),
        },
      });
      const likes = JSONbig.stringify(response);
      return JSON.parse(likes);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewLike(options: any) {
    try {
      const { body, userId } = options;
      const exist = await this.prisma.post_likes.findFirst({
        where: {
          product_id: body.productId,
          user_id: userId,
        },
      });
      if (!exist) {
        const response = await this.prisma.post_likes.create({
          data: {
            product_id: body.productId,
            user_id: userId,
            created_at: new Date(),
          },
        });
        const likes = JSONbig.stringify(response);
        return JSON.parse(likes);
      } else {
        throw new Error("product allready liked bu you");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getProductLikes(productId: number) {
    try {
      const response = await this.prisma.post_likes.findMany({
        where: {
          product_id: productId,
        },
      });
      const likes = bigIntToJson(response);
      return likes;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getProductComments(productId: number) {
    try {
      const response = await this.prisma.post_comments.findMany({
        where: {
          product_id: productId,
        },
        select: {
          id: true,
          product_id: true,
          user_id: true,
          created_at: true,
          content: true,
          parent: true,
          user: {
            select: {
              id: true,
              display_name: true,
              user_email: true,
              user_nicename: true,
              wp_nepaz2_usermeta: {
                where: {
                  OR: [
                    { meta_key: "dokan_profile_settings" },
                    { meta_key: "wp_nepaz2_user_avatar" },
                  ],
                },
              },
              follower: true,
              following: true,
            },
          },
        },
      });

      const products = await Promise.all(
        response.map(async item => {
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.user?.id.toString(),
            },
            select: {
              meta_key: true,
              meta_value: true,
              post: {
                select: {
                  post_author: true,
                  wp_nepaz2_postmeta: {
                    where: {
                      meta_key: "rating",
                    },
                  },
                },
              },
            },
          });
          const userImageId = item.user?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "wp_nepaz2_user_avatar",
          );
          const avatar = await this.prisma.wp_posts.findUnique({
            where: {
              ID: userImageId?.meta_value
                ? parseInt(userImageId?.meta_value)
                : 0,
              post_type: "attachment",
            },
          });
          const dokenSetting = item.user?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = dokenSetting
            ? phpUnserialize.unserialize(dokenSetting?.meta_value)
            : "";
          // console.log(userSettings);
          let totalRate = 0;
          for (let i = 0; i < userReview.length; i++) {
            const element = userReview[i];
            totalRate =
              totalRate +
              parseInt(
                element.post.wp_nepaz2_postmeta[0]?.meta_value
                  ? element.post.wp_nepaz2_postmeta[0]?.meta_value
                  : "0",
              );
          }
          const avgRate = totalRate / userReview.length;
          return {
            ...item,
            user: {
              ...item.user,
              avgRate,
              totalReview: userReview.length,
              avatar,
              store: userSettings,
            },
          };
        }),
      );
      const likes = bigIntToJson(products);
      return likes;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewReview(options: any) {
    try {
      const { body, user } = options;

      const response = await this.prisma.wp_comments.create({
        data: {
          comment_post_ID: body.productId,
          comment_author: 0,
          comment_author_email: user.user_email,
          user_id: user.id,
          comment_author_url: "",
          comment_author_IP: "",
          comment_agent: "",
          comment_approved: "",
          comment_content: body.content,
          comment_date: new Date(),
          comment_date_gmt: new Date(),
          comment_karma: 0,
          comment_parent: 0,
          comment_type: "review",
          comment_title: body.title,
        },
      });
      await this.prisma.wp_commentmeta.create({
        data: {
          comment_id: response.comment_ID,
          meta_key: "rating",
          meta_value: body.rating.toString(),
        },
      });
      const likes = JSONbig.stringify(response);
      return JSON.parse(likes);
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async orderCheckOut(options: any) {
    try {
      const {
        shippingAddress,
        billingAddress,
        discountCoupon,
        taxes,
        shipping,
        paymentType,
      } = options.body;
      const { user } = options;

      const carts = await this.prisma.wp_add_product_cart.findMany({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          user_id: true,
          product_id: true,
          created_at: true,
          quantity: true,
          product: {
            select: {
              ID: true,
              post_author: true,
              post_name: true,
              wp_nepaz2_postmeta: {
                where: {
                  OR: [
                    {
                      meta_key: "_price",
                    },
                    {
                      meta_key: "sale_price",
                    },
                  ],
                },
              },
            },
          },
        },
      });
      let coupon: any = null;

      if (discountCoupon) {
        coupon = await this.prisma.coupon_code.findFirst({
          where: {
            code: discountCoupon,
          },
        });
      }

      const order = await this.prisma.wp_posts.create({
        data: {
          post_author: user.id, // Ensure user.id is of type Int
          post_content: "", // Ensure body.description is of type String
          post_title: `Order-${moment().format("MMM-DD-YYYY-HHmm a")}`, // Ensure body.productName is of type String
          post_name: `Order-${moment().format("MMM-DD-YYYY-HHmm a")}`, // Ensure body.productName is of type String
          post_type: "order", // String, which is correct
          post_date: new Date(), // Providing current date
          post_date_gmt: new Date(), // Providing current date in GMT
          post_excerpt: "", // Providing default empty string
          post_status: "wc-processing", // Providing default status
          comment_status: "open", // Providing default comment status
          ping_status: "open", // Providing default ping status
          post_password: "", // Providing default empty password
          to_ping: "", // Providing default empty string
          pinged: "", // Providing default empty string
          post_modified: new Date(), // Providing current date for modified
          post_modified_gmt: new Date(), // Providing current date in GMT for modified
          post_content_filtered: "", // Providing default empty string
          guid: "", // Providing default empty GUID
          menu_order: 0, // Providing default menu order
          post_mime_type: "", // Providing default empty MIME type
          comment_count: 0,
          post_parent: 2,
        },
      });

      // const orderItems=[]

      for (let i = 0; i < carts.length; i++) {
        const cart = carts[i];
        const metaValue = cart.product?.wp_nepaz2_postmeta?.find(
          meta => meta.meta_key === "_price",
        )?.meta_value;

        const salePrice = cart.product?.wp_nepaz2_postmeta?.find(
          meta => meta.meta_key === "sale_price",
        )?.meta_value;
        const productPrice = salePrice ?? metaValue ?? "0";
        const cartTotal = productPrice
          ? parseFloat(productPrice)
          : 0 * cart.quantity;
        let discountTotal = 0;

        if (coupon) {
          if (
            cart.product?.post_author === coupon.sellerId ||
            coupon.sellerId === 23n
          ) {
            // Check if cart total meets minimum and maximum spend requirements
            if (
              cartTotal >= coupon.minimum_spent &&
              cartTotal <= coupon.maximum_spent
            ) {
              // Apply percentage discount
              if (coupon.coupon_type === "percentage_discount") {
                const discount =
                  (coupon.coupon_amount / 100) *
                  parseFloat(productPrice) *
                  cart.quantity;
                discountTotal += discount;
              }
              // Apply fixed amount discount
              else if (coupon.coupon_type === "fix_amount") {
                discountTotal = coupon.coupon_amount;
              }
            }
          }
        }
        const postOrder = await this.prisma.wp_posts.create({
          data: {
            post_author: user.id, // Ensure user.id is of type Int
            post_content: "", // Ensure body.description is of type String
            post_title: `Order-${moment().format("MMM-DD-YYYY-HHmm a")}`, // Ensure body.productName is of type String
            post_name: `Order-${moment().format("MMM-DD-YYYY-HHmm a")}`, // Ensure body.productName is of type String
            post_type: "shop_order", // String, which is correct
            post_date: new Date(), // Providing current date
            post_date_gmt: new Date(), // Providing current date in GMT
            post_excerpt: "", // Providing default empty string
            post_status: "wc-processing", // Providing default status
            comment_status: "open", // Providing default comment status
            ping_status: "open", // Providing default ping status
            post_password: "", // Providing default empty password
            to_ping: "", // Providing default empty string
            pinged: "", // Providing default empty string
            post_modified: new Date(), // Providing current date for modified
            post_modified_gmt: new Date(), // Providing current date in GMT for modified
            post_content_filtered: "", // Providing default empty string
            guid: "", // Providing default empty GUID
            menu_order: 0, // Providing default menu order
            post_mime_type: "", // Providing default empty MIME type
            comment_count: 0,
            post_parent: order.ID,
          },
        });
        await this.prisma.wp_dokan_orders.create({
          data: {
            order_id: postOrder.ID,
            seller_id: cart.product?.post_author ?? 23,
            order_total: cartTotal - discountTotal,
            net_amount: cartTotal - discountTotal,
            order_status: "wc-processing",
          },
        });
        await this.prisma.wp_wc_order_product_lookup.create({
          data: {
            order_id: postOrder.ID,
            product_id: cart.product?.ID ?? 0,
            variation_id: 0,
            customer_id: user.id,
            date_created: new Date(),
            product_qty: cart.quantity,
            product_net_revenue: cartTotal,
            product_gross_revenue: cartTotal,
            coupon_amount: discountTotal,
            tax_amount: 0,
            shipping_amount: 0,
            shipping_tax_amount: 0,
          },
        });
        const orderItem = await this.prisma.wp_woocommerce_order_items.create({
          data: {
            order_id: postOrder.ID,
            order_item_name: cart.product?.post_name ?? "",
            order_item_type: "line_item",
          },
        });
        await this.prisma.wp_woocommerce_order_itemmeta.createMany({
          data: [
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_product_id",
              meta_value: cart.product?.ID.toString() ?? "",
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_variation_id",
              meta_value: "0",
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_qty",
              meta_value: cart.quantity.toString(),
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_tax_class",
              meta_value: "",
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_line_subtotal",
              meta_value: productPrice,
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_line_subtotal_tax",
              meta_value: "0",
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_line_total",
              meta_value: (cartTotal - discountTotal).toString(),
            },
            {
              order_item_id: orderItem.order_item_id,
              meta_key: "_line_tax",
              meta_value: "0",
            },
          ],
        });
        await this.prisma.wp_postmeta.createMany({
          data: [
            {
              post_id: postOrder.ID,
              meta_key: "_payment_method",
              meta_value: paymentType,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_created_via",
              meta_value: "checkout",
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_first_name",
              meta_value: billingAddress.firstName,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_last_name",
              meta_value: billingAddress.lastName,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_address_1",
              meta_value: billingAddress.address,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_city",
              meta_value: billingAddress.city,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_state",
              meta_value: billingAddress.state,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_postcode",
              meta_value: billingAddress.zipcode,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_country",
              meta_value: billingAddress.country,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_email",
              meta_value: billingAddress.email,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_phone",
              meta_value: billingAddress.phoneNumber,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_first_name",
              meta_value: shippingAddress.firstName,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_last_name",
              meta_value: shippingAddress.lastName,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_address_1",
              meta_value: shippingAddress.address,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_city",
              meta_value: shippingAddress.city,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_state",
              meta_value: shippingAddress.state,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_postcode",
              meta_value: shippingAddress.zipcode,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_country",
              meta_value: shippingAddress.country,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_email",
              meta_value: shippingAddress.email,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_phone",
              meta_value: shippingAddress.phoneNumber,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_order_currency",
              meta_value: "USD",
            },
            {
              post_id: postOrder.ID,
              meta_key: "_cart_discount",
              meta_value: discountTotal.toString(),
            },
            {
              post_id: postOrder.ID,
              meta_key: "_cart_discount_counpon",
              meta_value: discountCoupon,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_order_tax",
              meta_value: taxes.toString(),
            },
            {
              post_id: postOrder.ID,
              meta_key: "_order_shipping",
              meta_value: shipping.toString(),
            },
            {
              post_id: postOrder.ID,
              meta_key: "_order_total",
              meta_value: (cartTotal - discountTotal).toString(),
            },
            {
              post_id: postOrder.ID,
              meta_key: "_billing_address_index",
              meta_value: `${billingAddress.address} ${billingAddress.city} ${billingAddress.state} ${billingAddress.zipcode} ${billingAddress.country} ${billingAddress.email} ${billingAddress.phoneNumber}`,
            },
            {
              post_id: postOrder.ID,
              meta_key: "_shipping_address_index",
              meta_value: `${shippingAddress.address} ${shippingAddress.city} ${shippingAddress.state} ${shippingAddress.zipcode} ${shippingAddress.country} ${shippingAddress.email} ${shippingAddress.phoneNumber}`,
            },
          ],
        });
        const productStock = await this.prisma.wp_postmeta.findFirst({
          where: {
            post_id: cart.product?.ID,
            meta_key: "_stock",
          },
        });
        if (productStock?.meta_value) {
          await this.prisma.wp_postmeta.update({
            where: {
              meta_id: productStock?.meta_id,
            },
            data: {
              meta_value: (
                parseInt(productStock?.meta_value) - cart.quantity
              ).toString(),
            },
          });
        }
        await this.getEarningTotal({
          orderId: postOrder.ID,
          sellerId: cart.product?.post_author,
          orderTotal: cartTotal,
        });
      }
      await this.prisma.wp_add_product_cart.deleteMany({
        where: {
          user_id: user.id,
        },
      });

      const orders = await this.prisma.wp_posts.findMany({
        where: {
          post_parent: order.ID,
        },
        select: {
          ID: true,
          post_date: true,
          wp_wc_order_product_lookup_order: {
            select: {
              order_item_id: true,
              order_id: true,
              product_id: true,
              variation_id: true,
              customer_id: true,
              date_created: true,
              product_qty: true,
              product_net_revenue: true,
              product_gross_revenue: true,
              coupon_amount: true,
              tax_amount: true,
              shipping_amount: true,
              shipping_tax_amount: true,
              user: true,
              product: {
                select: {
                  ID: true,
                  post_author: true,
                  post_date: true,
                  post_date_gmt: true,
                  post_content: true,
                  post_title: true,
                  post_excerpt: true,
                  post_status: true,
                  comment_status: true,
                  ping_status: true,
                  post_password: true,
                  post_name: true,
                  to_ping: true,
                  pinged: true,
                  post_modified: true,
                  post_modified_gmt: true,
                  post_content_filtered: true,
                  post_parent: true,
                  guid: true,
                  menu_order: true,
                  post_type: true,
                  post_mime_type: true,
                  comment_count: true,
                  attachments: true,
                  wp_nepaz2_users: {
                    select: {
                      id: true,
                      display_name: true,
                      user_email: true,
                      user_nicename: true,
                      wp_nepaz2_usermeta: {
                        where: {
                          OR: [
                            { meta_key: "dokan_profile_settings" },
                            { meta_key: "wp_nepaz2_user_avatar" },
                          ],
                        },
                      },
                      follower: true,
                      following: true,
                    },
                  },
                  wp_nepaz2_postmeta: {
                    where: {
                      OR: [{ meta_key: "_stock" }, { meta_key: "_price" }],
                    },
                  },
                  wp_term_relationships: {
                    select: {
                      term_taxonomy: {
                        select: {
                          taxonomy: true,
                          term: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const orderMap = orders.map(item => {
        return {
          ...item,
          orderItem: item.wp_wc_order_product_lookup_order[0],
          wp_wc_order_product_lookup_order: [],
          createdAt: order.post_date,
        };
      });
      // const json = JSONbig.stringify(order);
      const json2 = bigIntToJson(orderMap);
      return {
        orderId: order.ID.toString(),
        shippingAddress,
        orderItem: json2,
      };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async ordersByParent(id: number) {
    try {
      const orders = await this.prisma.wp_posts.findMany({
        where: {
          post_parent: id,
        },
        select: {
          ID: true,
          post_date: true,
          wp_nepaz2_postmeta: true,
          wp_wc_order_product_lookup_order: {
            select: {
              order_item_id: true,
              order_id: true,
              product_id: true,
              variation_id: true,
              customer_id: true,
              date_created: true,
              product_qty: true,
              product_net_revenue: true,
              product_gross_revenue: true,
              coupon_amount: true,
              tax_amount: true,
              shipping_amount: true,
              shipping_tax_amount: true,
              user: true,
              product: {
                select: {
                  ID: true,
                  post_author: true,
                  post_date: true,
                  post_date_gmt: true,
                  post_content: true,
                  post_title: true,
                  post_excerpt: true,
                  post_status: true,
                  comment_status: true,
                  ping_status: true,
                  post_password: true,
                  post_name: true,
                  to_ping: true,
                  pinged: true,
                  post_modified: true,
                  post_modified_gmt: true,
                  post_content_filtered: true,
                  post_parent: true,
                  guid: true,
                  menu_order: true,
                  post_type: true,
                  post_mime_type: true,
                  comment_count: true,
                  attachments: true,
                  wp_nepaz2_users: {
                    select: {
                      id: true,
                      display_name: true,
                      user_email: true,
                      user_nicename: true,
                      wp_nepaz2_usermeta: {
                        where: {
                          OR: [
                            { meta_key: "dokan_profile_settings" },
                            { meta_key: "wp_nepaz2_user_avatar" },
                          ],
                        },
                      },
                      follower: true,
                      following: true,
                    },
                  },
                  wp_nepaz2_postmeta: {
                    where: {
                      OR: [{ meta_key: "_stock" }, { meta_key: "_price" }],
                    },
                  },
                  wp_term_relationships: {
                    select: {
                      term_taxonomy: {
                        select: {
                          taxonomy: true,
                          term: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const getMetaValue = (postMeta: any, key: string) => {
        const meta = postMeta.find(item => item.meta_key === key)?.meta_value;
        return meta;
      };

      const orderMap = orders.map(item => {
        const shippingAddress = {
          firstName: getMetaValue(
            item.wp_nepaz2_postmeta,
            "_shipping_first_name",
          ),
          lastName: getMetaValue(
            item.wp_nepaz2_postmeta,
            "_shipping_last_name",
          ),
          address: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_address_1"),
          city: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_city"),
          state: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_state"),
          zipcode: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_postcode"),
          country: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_country"),
          email: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_email"),
          phoneNumber: getMetaValue(item.wp_nepaz2_postmeta, "_shipping_phone"),
        };
        return {
          ...item,
          orderItem: item.wp_wc_order_product_lookup_order[0],
          wp_wc_order_product_lookup_order: [],
          shippingAddress,
        };
      });

      const orderItem = bigIntToJson(orderMap);
      // console.log(orderMap)
      return {
        orderId: id,
        shippingAddress: orderItem[0].shippingAddress,
        orderItem,
        createdAt: orderItem[0].post_date,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateOrderStatus(options: any) {
    try {
      const { productId, status } = options;
      await this.prisma.wp_posts.update({
        where: {
          ID: productId,
        },
        data: {
          post_status: status,
        },
      });
      await this.prisma.wp_dokan_orders.updateMany({
        where: {
          order_id: productId,
        },
        data: {
          order_status: status,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewOrderNotes(options: any) {
    try {
      const { orderId, content, files, userId } = options;
      const attachment = files.find(
        (item: any) => item.fieldname === "attachment",
      );
      const result = await this.prisma.order_notes.create({
        data: {
          post_id: parseInt(orderId),
          comment_author: userId,
          content,
          attachment: attachment?.path || "",
          comment_title: "",
        },
      });
      const notes = JSONbig.stringify(result);
      return JSON.parse(notes);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getOrderNotesById(id: number) {
    try {
      const notes = await this.prisma.order_notes.findMany({
        where: {
          post_id:id,
        },
        select: {
          id: true,
          post_id: true,
          comment_author: true,
          content: true,
          attachment: true,
          user: true,
          comment_date:true
        },
      });
      const orderNotes = JSONbig.stringify(notes);
      return JSON.parse(orderNotes);
    } catch (error) {
      throw new Error(error);
    }
  }

  private async getEarningTotal(payload: any) {
    try {
      const { orderId, sellerId, orderTotal } = payload;
      const commission = await this.prisma.fizno_commission.findFirst();
      if (commission) {
        const totalCommission =
          commission?.commission_fee + commission?.payment_fee;
        const earning = orderTotal - (orderTotal * totalCommission) / 100;
        await this.prisma.seller_earning.create({
          data: {
            order_id: orderId,
            seller_id: sellerId,
            sale_tax: 0,
            payment_fee: commission.payment_fee,
            commission_fee: commission.payment_fee,
            order_total: orderTotal,
            earning,
          },
        });
        return earning;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
