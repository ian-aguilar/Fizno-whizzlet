/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/naming-convention */
// import logger from "../../utils/logger";
import JSONbig from "json-bigint";
import { bigIntToJson } from "../../utils/bigIntToJson";
import phpUnserialize from "php-unserialize";
// import hasher from "wordpress-hash-node";
import { slugify } from "../../utils/slugyfy";
import prismaClient from "../../utils/dbConnection";
export class AdminService {
  private readonly prisma = prismaClient;
  public async findAllBrand(options: {
    filters: any;
    pageIndex: number;
    pageSize: number;
  }) {
    const { pageIndex, pageSize } = options;
    try {
      const users = await this.prisma.wp_nepaz2_users.findMany({
        where: {
          is_delete: 0,
        },
        orderBy: {
          id: "desc", // Sort by post_date to get the latest first
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          user_login: true,
          user_pass: true,
          user_nicename: true,
          user_email: true,
          user_url: true,
          user_registered: true,
          user_activation_key: true,
          user_status: true,
          display_name: true,
          wp_nepaz2_usermeta: {
            where: {
              meta_key: "wp_nepaz2_capabilities",
            },
          },
        },
      });
      const totalCount = await this.prisma.wp_nepaz2_users.count();
      const jsonData = bigIntToJson(users);
      const updateData = jsonData.map((item: any) => {
        return {
          ...item,
          wp_nepaz2_usermeta: item.wp_nepaz2_usermeta.map((value: any) => {
            if (value.meta_key === "wp_nepaz2_capabilities") {
              value.meta_value = phpUnserialize.unserialize(value.meta_value);
            }
            return value;
          }),
        };
      });
      return { updateData, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findAllCustomer(options: {
    filters: any;
    pageIndex: number;
    pageSize: number;
  }) {
    const { pageIndex, pageSize } = options;
    try {
      const users = await this.prisma.wp_nepaz2_users.findMany({
        where: {
          wp_nepaz2_usermeta: {
            some: {
              meta_key: "wp_nepaz2_capabilities",
              meta_value: {
                contains: "customer",
              },
            },
          },
          is_delete: 0,
        },
        orderBy: {
          id: "desc", // Sort by post_date to get the latest first
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          user_login: true,
          user_pass: true,
          user_nicename: true,
          user_email: true,
          user_url: true,
          user_registered: true,
          user_activation_key: true,
          user_status: true,
          display_name: true,
          wp_nepaz2_usermeta: {
            where: {
              meta_key: "wp_nepaz2_capabilities",
            },
          },
        },
      });
      const totalCount = await this.prisma.wp_nepaz2_users.count({
        where: {
          wp_nepaz2_usermeta: {
            some: {
              meta_key: "wp_nepaz2_capabilities",
              meta_value: {
                contains: "customer",
              },
            },
          },
        },
      });
      const jsonData = bigIntToJson(users);
      const updateData = jsonData.map((item: any) => {
        return {
          ...item,
          wp_nepaz2_usermeta: item.wp_nepaz2_usermeta.map((value: any) => {
            if (value.meta_key === "wp_nepaz2_capabilities") {
              value.meta_value = phpUnserialize.unserialize(value.meta_value);
            }
            return value;
          }),
        };
      });
      return { updateData, totalCount };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findAllProducts(options: {
    filters: any;
    pageIndex: number;
    pageSize: number;
    seller: string;
    category: string;
    condition: string;
  }) {
    const { pageIndex, pageSize, seller, category, condition } = options;
    try {
      const whereClause: any = {
        AND: [{ post_type: "product", is_deleted: 0 }],
      };
      if (seller) {
        whereClause.AND.push({ post_author: parseInt(seller) });
      }
      if (category) {
        whereClause.AND.push({
          wp_term_relationships: {
            some: {
              term_taxonomy: {
                term_taxonomy_id: parseInt(category),
              },
            },
          },
        });
      }
      if (condition) {
        whereClause.AND.push({
          wp_term_relationships: {
            some: {
              term_taxonomy: {
                term_taxonomy_id: parseInt(condition),
              },
            },
          },
        });
      }

      whereClause.AND.push({
        wp_nepaz2_postmeta: {
          some: {
            meta_key: "_stock",
            meta_value: {
              not: "0",
            },
          },
        },
      });

      const totalResults = await this.prisma.wp_posts.count({
        where: whereClause,
      });
      const users = await this.prisma.wp_posts.findMany({
        where: whereClause,
        orderBy: {
          ID: "desc",
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
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
          post_comments: true,
          wp_add_product_fav: true,
          share_product: true,
        },
      });
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.wp_nepaz2_users?.id.toString(),
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
          const userImageId = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
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
          const doken_setting = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = phpUnserialize.unserialize(
            doken_setting?.meta_value,
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
          return {
            ...item,
            attachment,
            wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
              if (value.meta_key === "_ebay_product_featured_image") {
                // console.log(value.meta_value);
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
            wp_add_product_fav: item.wp_add_product_fav.length || 0,
            post_comments: item.post_comments.length || 0,
            post_share: item.share_product.length,
            wp_nepaz2_users: {
              ...item.wp_nepaz2_users,
              avgRate,
              totalReview: userReview.length,
              avatar,
              store: userSettings,
            },
          };
        }),
      );
      const updateData = bigIntToJson(products);
      return { updateData, totalResults };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async findProductById(id: string) {
    try {
      const product = await this.prisma.wp_posts.findMany({
        where: { ID: parseInt(id) },
      });
      const jsonData = bigIntToJson(product);
      return jsonData[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findById(id: string) {
    try {
      const result = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          id: parseInt(id),
        },
        select: {
          id: true,
          user_login: true,
          user_nicename: true,
          user_url: true,
          user_registered: true,
          user_activation_key: true,
          user_status: true,
          display_name: true,
          user_email: true,
          wp_nepaz2_usermeta: true,
          follower: {
            select: {
              id: true,
              vendor_id: true,
              follower_id: true,
              followed_at: true,
              unfollowed_at: true,
              follower: {
                select: {
                  user_login: true,
                  user_nicename: true,
                  user_url: true,
                  user_registered: true,
                  user_activation_key: true,
                  user_status: true,
                  display_name: true,
                  user_email: true,
                  wp_nepaz2_usermeta: {
                    where: {
                      meta_key: "wp_nepaz2_user_avatar",
                    },
                  },
                },
              },
            },
          },
          following: {
            select: {
              id: true,
              vendor_id: true,
              follower_id: true,
              followed_at: true,
              unfollowed_at: true,
              vender: {
                select: {
                  user_login: true,
                  user_nicename: true,
                  user_url: true,
                  user_registered: true,
                  user_activation_key: true,
                  user_status: true,
                  display_name: true,
                  user_email: true,
                  wp_nepaz2_usermeta: {
                    where: {
                      meta_key: "wp_nepaz2_user_avatar",
                    },
                  },
                },
              },
            },
          },
          // wp_posts:{
          //   where:{
          //     post_type:"product"
          //   }
          // }
        },
      });
      // console.log(result, id)
      const mapedData = await Promise.all(
        (result?.wp_nepaz2_usermeta || []).map(async (item: any) => {
          if (item.meta_key === "dokan_profile_settings") {
            const capabilities = phpUnserialize.unserialize(item.meta_value);
            // console.log(capabilities)

            const banner = capabilities.banner
              ? await this.prisma.wp_posts.findUnique({
                  where: {
                    ID: parseInt(capabilities.banner),
                  },
                })
              : "";
            const avatar = capabilities.gravatar
              ? await this.prisma.wp_posts.findUnique({
                  where: {
                    ID: parseInt(capabilities.gravatar),
                  },
                })
              : "";
            item.meta_value = {
              ...capabilities,
              bannerImage: banner,
              avatarImage: avatar,
            };
          }
          if (item.meta_key === "wp_nepaz2_capabilities") {
            // console.log(item.meta_value)
            const capabilities = phpUnserialize.unserialize(item.meta_value);
            item.meta_value = capabilities;
          }
          if (item.meta_key === "wp_nepaz2_user_avatar") {
            const avatar = await this.prisma.wp_posts.findUnique({
              where: {
                ID: parseInt(item.meta_value),
              },
            });
            item.meta_value = avatar;
          }
          return item;
        }),
      );

      const follower = await Promise.all(
        result?.follower
          ? result?.follower?.map(async (item: any) => {
              const userImageId =
                item.follower?.wp_nepaz2_usermeta[0]?.meta_value || "";
              const avatar = userImageId
                ? await this.prisma.wp_posts.findFirst({
                    where: {
                      ID: parseInt(userImageId),
                      post_type: "attachment",
                    },
                  })
                : "";
              return { ...item, avatar };
            })
          : [],
      );

      const following = await Promise.all(
        result?.following
          ? result?.following?.map(async (item: any) => {
              const userImageId =
                item.vender?.wp_nepaz2_usermeta[0]?.meta_value;
              const avatar = userImageId
                ? await this.prisma.wp_posts.findFirst({
                    where: {
                      ID: parseInt(userImageId),
                      post_type: "attachment",
                    },
                  })
                : "";
              return { ...item, avatar };
            })
          : [],
      );
      const role = mapedData.find(
        item => item.meta_key === "wp_nepaz2_capabilities",
      ).meta_value.seller
        ? "seller"
        : "customer";
      const userReview = await this.prisma.wp_postmeta.findMany({
        where: {
          meta_key: "store_id",
          meta_value: result?.id.toString(),
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
      const userImageId = result?.wp_nepaz2_usermeta.find(
        meta => meta.meta_key === "wp_nepaz2_user_avatar",
      );
      const avatar = userImageId?.meta_value;

      let totalRate = 0;
      for (let i = 0; i < userReview.length; i++) {
        const element = userReview[i];
        totalRate =
          totalRate +
          parseInt(element.post.wp_nepaz2_postmeta[0].meta_value || "0");
      }
      const avgRate = totalRate / userReview.length;
      const userData = {
        ...result,
        wp_nepaz2_usermeta: mapedData,
        role,
        userReview,
        avg_rate: avgRate,
        avatar,
        wp_posts: 0,
        follower,
        following,
      };
      const user = JSONbig.stringify(userData);
      return JSON.parse(user);
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async deleteUserById(id: string) {
    try {
      await this.prisma.wp_nepaz2_users.update({
        where: { id: parseInt(id) },
        data: {
          is_delete: 1,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async findAllVendors(options: {
    filters: any;
    pageIndex: number;
    pageSize: number;
  }) {
    const { pageIndex, pageSize } = options;
    const totalCount = await this.prisma.wp_nepaz2_users.count({
      where: {
        wp_nepaz2_usermeta: {
          some: {
            meta_key: "wp_nepaz2_capabilities",
            meta_value: {
              contains: "seller",
            },
          },
        },
        user_status:0,
        is_delete: 0,
      },
    });
    const users = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        wp_nepaz2_usermeta: {
          some: {
            meta_key: "wp_nepaz2_capabilities",
            meta_value: {
              contains: "seller",
            },
          },
        },
        is_delete: 0,
        user_status:0
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        user_login: true,
        user_nicename: true,
        user_url: true,
        user_registered: true,
        user_activation_key: true,
        user_status: true,
        display_name: true,
        wp_nepaz2_usermeta: true,
        follower: true,
        following: true,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    const newData = await Promise.all(
      users.map(async (item: any) => {
        const avatar_id = item.wp_nepaz2_usermeta.find(
          meta => meta.meta_key === "wp_nepaz2_user_avatar",
        );
        const avatar = avatar_id?.meta_value
          ? await this.prisma.wp_posts.findFirst({
              where: {
                post_type: "attachment",
                ID: parseInt(avatar_id?.meta_value),
              },
            })
          : "";
        const userReview = await this.prisma.wp_postmeta.findMany({
          where: {
            meta_key: "store_id",
            meta_value: item?.id.toString(),
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
          wp_nepaz2_usermeta: item.wp_nepaz2_usermeta.map((value: any) => {
            if (value.meta_key === "dokan_profile_settings") {
              value.meta_value = phpUnserialize.unserialize(value.meta_value);
            }
            return value;
          }),
          avatar,
          avgRate,
          totalReview: userReview.length,
        };
      }),
    );
    const updatedData = bigIntToJson(newData);
    return { newData: updatedData, totalCount };
  }

  public async findBlockedVendors(options: {
    filters: any;
    pageIndex: number;
    pageSize: number;
  }) {
    const { pageIndex, pageSize } = options;
    const totalCount = await this.prisma.wp_nepaz2_users.count({
      where: {
        wp_nepaz2_usermeta: {
          some: {
            meta_key: "wp_nepaz2_capabilities",
            meta_value: {
              contains: "seller",
            },
          },
        },
        user_status:1
      },
    });
    const users = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        wp_nepaz2_usermeta: {
          some: {
            meta_key: "wp_nepaz2_capabilities",
            meta_value: {
              contains: "seller",
            },
          },
        },
        is_delete: 0,
        user_status:1
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        user_login: true,
        user_nicename: true,
        user_url: true,
        user_registered: true,
        user_activation_key: true,
        user_status: true,
        display_name: true,
        wp_nepaz2_usermeta: true,
        follower: true,
        following: true,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    const newData = await Promise.all(
      users.map(async (item: any) => {
        const avatar_id = item.wp_nepaz2_usermeta.find(
          meta => meta.meta_key === "wp_nepaz2_user_avatar",
        );
        const avatar = avatar_id?.meta_value
          ? await this.prisma.wp_posts.findFirst({
              where: {
                post_type: "attachment",
                ID: parseInt(avatar_id?.meta_value),
              },
            })
          : "";
        const userReview = await this.prisma.wp_postmeta.findMany({
          where: {
            meta_key: "store_id",
            meta_value: item?.id.toString(),
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
          wp_nepaz2_usermeta: item.wp_nepaz2_usermeta.map((value: any) => {
            if (value.meta_key === "dokan_profile_settings") {
              value.meta_value = phpUnserialize.unserialize(value.meta_value);
            }
            return value;
          }),
          avatar,
          avgRate,
          totalReview: userReview.length,
        };
      }),
    );
    const updatedData = bigIntToJson(newData);
    return { newData: updatedData, totalCount };
  }

  public async findAllVendorsForFilters() {
    const users = await this.prisma.wp_nepaz2_users.findMany({
      where: {
        wp_nepaz2_usermeta: {
          some: {
            meta_key: "wp_nepaz2_capabilities",
            meta_value: {
              contains: "seller",
            },
          },
        },
      },
      select: {
        id: true,
        user_login: true,
        user_nicename: true,
        user_url: true,
        user_registered: true,
        user_activation_key: true,
        user_status: true,
        display_name: true,
      },
    });
    const updatedData = bigIntToJson(users);
    return updatedData;
  }

  public async findAllCategories(options: {
    filters: any;
    pageIndex: number;
    pageSize: number;
  }) {
    try {
      const { pageIndex, pageSize } = options;
      const totalResults = await this.prisma.wp_nepaz2_term_taxonomy.count();
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        where: {
          taxonomy: "product_cat",
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          description: true,
          term: {
            select: {
              term_id: true,
              name: true,
              slug: true,
              wp_termmeta: {
                where: {
                  meta_key: "thumbnail_id",
                },
              },
            },
          },
          count: true,
        },
      });
      const category = await Promise.all(
        cat.map(async item => {
          const thumbnailId = item.term.wp_termmeta.find(
            meta => meta.meta_key === "thumbnail_id",
          );
          if (thumbnailId) {
            const attachment = await this.prisma.wp_posts.findFirst({
              where: {
                post_type: "attachment",
                ID: parseInt(thumbnailId?.meta_value),
              },
            });
            return {
              ...item,
              attachment,
            };
          } else {
            return item;
          }
        }),
      );
      const updatedData = bigIntToJson(category);
      return { updatedData, totalResults };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async deleteProductById(id: number) {
    try {
      await this.prisma.wp_posts.update({
        where: {
          ID: id,
        },
        data: {
          is_deleted: 1,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async parentCategories() {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: "product_cat",
          parent: 0,
          count: { gt: 1 },
          term_id: { not: 15 },
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: {
            select: {
              term_id: true,
              name: true,
              slug: true,
              term_group: true,
              wp_termmeta: {
                where: {
                  meta_key: "thumbnail_id",
                },
              },
            },
          },
          count: true,
        },
      });

      const category = await Promise.all(
        cat.map(async item => {
          const thumbnailId = item.term.wp_termmeta.find(
            meta => meta.meta_key === "thumbnail_id",
          );
          if (thumbnailId) {
            const attachment = await this.prisma.wp_posts.findFirst({
              where: {
                post_type: "attachment",
                ID: parseInt(thumbnailId?.meta_value),
              },
            });
            return {
              ...item,
              attachment,
            };
          } else {
            return item;
          }
        }),
      );

      const updatedData = bigIntToJson(category);
      return updatedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllConditions() {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: "product_brand",
          count: { gt: 1 },
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: true,
          count: true,
        },
      });
      const updatedData = bigIntToJson(cat);
      return updatedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllProductTypes() {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: "product_type",
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: true,
          count: true,
        },
      });
      const updatedData = bigIntToJson(cat);
      return updatedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllProductTags() {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: "product_tag",
          count: { gt: 1 },
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: true,
          count: true,
        },
      });
      const updatedData = bigIntToJson(cat);
      return updatedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllBrands() {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: "pa_part-brand",
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: true,
          count: true,
        },
      });
      const updatedData = bigIntToJson(cat);
      return updatedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async commissionType() {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: "product_cat",
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: true,
        },
      });
      const updatedData = bigIntToJson(cat);
      return updatedData;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getCategoryById(id: string) {
    const result = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
      where: {
        term_id: parseInt(id),
      },
      select: {
        term_taxonomy_id: true,
        term_id: true,
        parent: true,
        description: true,
        term: {
          select: {
            term_id: true,
            name: true,
            slug: true,
            wp_termmeta: true,
          },
        },
      },
    });
    const updateData = JSONbig.stringify(result);
    return JSON.parse(updateData);
  }

  public async getCategoryByParentId(id: string) {
    const result = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
      where: {
        parent: parseInt(id),
      },
      select: {
        term_taxonomy_id: true,
        parent: true,
        term_id: true,
        term: true,
        count: true,
      },
    });
    const updateData = JSONbig.stringify(result);
    return JSON.parse(updateData);
  }

  public async updateCategoryById(options: {
    id: string;
    data: any;
    file: any;
  }) {
    try {
      const { id, data, file } = options;
      const newData: any = {};
      if (data.name) {
        newData.name = data.name;
      }

      if (data.slug) {
        newData.slug = data.slug;
      }

      if (data.description) {
        await this.prisma.wp_nepaz2_term_taxonomy.updateMany({
          where: {
            term_id: parseInt(id),
          },
          data: {
            description: data.description,
          },
        });
      }

      const result = await this.prisma.wp_nepaz2_terms.update({
        where: {
          term_id: parseInt(id),
        },
        data: newData,
      });
      if (file.length > 0) {
        const image = file[0];
        const banner = await this.prisma.wp_posts.create({
          data: {
            post_author: 23, // Ensure user.id is of type Int
            post_content: "", // Ensure body.description is of type String
            post_title: "category-banner", // Ensure body.productName is of type String
            post_name: "category-banner", // Ensure body.productName is of type String
            post_type: "attachment", // String, which is correct
            post_date: new Date(), // Providing current date
            post_date_gmt: new Date(), // Providing current date in GMT
            post_excerpt: "", // Providing default empty string
            post_status: "inherit", // Providing default status
            comment_status: "open", // Providing default comment status
            ping_status: "open", // Providing default ping status
            post_password: "", // Providing default empty password
            to_ping: "", // Providing default empty string
            pinged: "", // Providing default empty string
            post_modified: new Date(), // Providing current date for modified
            post_modified_gmt: new Date(), // Providing current date in GMT for modified
            post_content_filtered: "", // Providing default empty string
            post_parent: 2, // Providing default parent ID
            guid: `/${image.path}`, // Providing default empty GUID
            menu_order: 0, // Providing default menu order
            post_mime_type: image.mimetype, // Providing default empty MIME type
            comment_count: 0,
          },
        });
        const termMeta = await this.prisma.wp_termmeta.findFirst({
          where: {
            term_id: parseInt(id),
            meta_key: "thumbnail_id",
          },
        });
        if (termMeta) {
          await this.prisma.wp_termmeta.update({
            where: {
              meta_id: termMeta?.meta_id,
            },
            data: {
              meta_value: banner.ID.toString(),
            },
          });
        } else {
          await this.prisma.wp_termmeta.create({
            data: {
              meta_key: "thumbnail_id",
              meta_value: banner.ID.toString(),
              term_id: parseInt(id),
            },
          });
        }
      }
      const updateData = JSONbig.stringify(result);
      return JSON.parse(updateData);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addCategory(options: { data: any; file: any }) {
    try {
      const { data, file } = options;
      const newTerm = await this.prisma.wp_nepaz2_terms.create({
        data: {
          name: data.name,
          slug: data.slug,
          term_group: 0,
        },
      });
      const newTermTaxonomy = await this.prisma.wp_nepaz2_term_taxonomy.create({
        data: {
          term_id: newTerm.term_id,
          taxonomy: "product_cat",
          description: data.description,
          parent: data.parent ? data.parent : 0,
          count: 0,
        },
      });
      // console.log(file)
      if (file.length > 0) {
        const image = file[0];
        const banner = await this.prisma.wp_posts.create({
          data: {
            post_author: 23, // Ensure user.id is of type Int
            post_content: "", // Ensure body.description is of type String
            post_title: "category-banner", // Ensure body.productName is of type String
            post_name: "category-banner", // Ensure body.productName is of type String
            post_type: "attachment", // String, which is correct
            post_date: new Date(), // Providing current date
            post_date_gmt: new Date(), // Providing current date in GMT
            post_excerpt: "", // Providing default empty string
            post_status: "inherit", // Providing default status
            comment_status: "open", // Providing default comment status
            ping_status: "open", // Providing default ping status
            post_password: "", // Providing default empty password
            to_ping: "", // Providing default empty string
            pinged: "", // Providing default empty string
            post_modified: new Date(), // Providing current date for modified
            post_modified_gmt: new Date(), // Providing current date in GMT for modified
            post_content_filtered: "", // Providing default empty string
            post_parent: 2, // Providing default parent ID
            guid: `/${image.path}`, // Providing default empty GUID
            menu_order: 0, // Providing default menu order
            post_mime_type: image.mimetype, // Providing default empty MIME type
            comment_count: 0,
          },
        });

        await this.prisma.wp_termmeta.createMany({
          data: [
            {
              meta_key: "thumbnail_id",
              meta_value: banner.ID.toString(),
              term_id: newTerm.term_id,
            },
          ],
        });
      }

      const result = {
        term: newTerm,
        termTaxonomy: newTermTaxonomy,
      };
      const updateData = JSONbig.stringify(result);
      return JSON.parse(updateData);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteCategoryById(id: number) {
    try {
      const cat = await this.prisma.wp_nepaz2_term_taxonomy.findFirst({
        where: {
          term_id: id,
        },
      });
      // console.log(cat, id)
      if (cat) {
        await this.prisma.wp_term_relationships.deleteMany({
          where: {
            term_taxonomy_id: cat?.term_taxonomy_id,
          },
        });

        await this.prisma.wp_nepaz2_term_taxonomy.delete({
          where: {
            term_taxonomy_id: cat?.term_taxonomy_id,
          },
        });
        await this.prisma.wp_termmeta.deleteMany({
          where: {
            term_id: id,
          },
        });

        await this.prisma.wp_nepaz2_terms.delete({
          where: {
            term_id: id,
          },
        });
      } else {
        await this.prisma.wp_termmeta.deleteMany({
          where: {
            term_id: id,
          },
        });
        await this.prisma.wp_nepaz2_terms.delete({
          where: {
            term_id: id,
          },
        });
      }
      // const updateData = JSONbig.stringify(t);
      return true;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  public async getUserRoles() {
    const roles = await this.prisma.wp_options.findMany({
      where: {
        option_name: "wp_user_roles",
      },
    });

    const jsonData = bigIntToJson(roles)[0];

    jsonData.option_value = phpUnserialize.unserialize(jsonData.option_value);
    return jsonData;
  }

  public async addNewUser(options: any) {
    try {
      const { userName, email, firstName, lastName, website, password } =
        options;
      // const hash = hasher.HashPassword(password);
      // const capabilities = phpUnserialize
      // const user = await this.prisma.wp_nepaz2_users.create({
      //   data: {
      //     user_login: userName,
      //     user_email: email,
      //     user_nicename: userName,
      //     user_pass: hash,
      //     user_url: website,
      //     display_name: `${firstName} ${lastName}`,
      //     user_registered: new Date(),
      //     user_status: 0,
      //     user_activation_key:"",
      //   },
      // });

      // await this.prisma.wp_nepaz2_usermeta.createMany({
      //   data: [
      //     {
      //       user_id: user.id,
      //       meta_key: "nickname",
      //       meta_value: userName,
      //     },
      //     {
      //       user_id: user.id,
      //       meta_key: "first_name",
      //       meta_value: firstName,
      //     },
      //     {
      //       user_id: user.id,
      //       meta_key: "last_name",
      //       meta_value: lastName,
      //     },
      //     {
      //       user_id: user.id,
      //       meta_key: "wp_capabilities",
      //       meta_value: "a:1:{s:8:\"customer\";b:1;}",
      //     },
      //   ],
      // });
      return { userName, email, firstName, lastName, website, password };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async editUserById(options: any) {
    try {
      const { body, id } = options;
      await this.prisma.wp_nepaz2_usermeta.updateMany({
        where: {
          user_id: parseInt(id),
          meta_key: "first_name",
        },
        data: {
          meta_value: body.firstName,
        },
      });
      await this.prisma.wp_nepaz2_usermeta.updateMany({
        where: {
          user_id: parseInt(id),
          meta_key: "last_name",
        },
        data: {
          meta_value: body.lastName,
        },
      });
      const about = await this.prisma.wp_nepaz2_usermeta.findFirst({
        where: {
          user_id: parseInt(id),
          meta_key: "about",
        },
      });
      if (about) {
        await this.prisma.wp_nepaz2_usermeta.updateMany({
          where: {
            user_id: parseInt(id),
            meta_key: "about",
          },
          data: {
            meta_value: body.about,
          },
        });
      } else {
        await this.prisma.wp_nepaz2_usermeta.create({
          data: {
            user_id: parseInt(id),
            meta_key: "about",
            meta_value: body.about,
          },
        });
      }
      await this.prisma.wp_nepaz2_users.update({
        where: {
          id: parseInt(id),
        },
        data: {
          user_email: body.email,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllAttributes() {
    try {
      const attributeTaxonomies =
        await this.prisma.wp_woocommerce_attribute_taxonomies.findMany();
      const attributes = bigIntToJson(attributeTaxonomies);
      const attributeDetailsPromises = attributes.map(
        async (attribute: any) => {
          const results = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
            where: {
              taxonomy: {
                contains: attribute.attribute_name, // Assuming the attribute ID needs to be a string
              },
            },
            select: {
              term_taxonomy_id: true,
              parent: true,
              term_id: true,
              term: true,
            },
          });
          const details = bigIntToJson(results);
          return { ...attribute, details };
        },
      );
      const attributesWithDetails = await Promise.all(attributeDetailsPromises);
      return attributesWithDetails;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAttributesDetail(options: { id: string }) {
    try {
      const { id } = options;
      const attributeTaxonomies =
        await this.prisma.wp_woocommerce_attribute_taxonomies.findUnique({
          where: { attribute_id: parseInt(id) },
        });
      // const attributes = bigIntToJson(attributeTaxonomies);
      const results = await this.prisma.wp_nepaz2_term_taxonomy.findMany({
        where: {
          taxonomy: {
            contains: attributeTaxonomies?.attribute_name, // Assuming the attribute ID needs to be a string
          },
        },
        select: {
          term_taxonomy_id: true,
          parent: true,
          term_id: true,
          term: true,
        },
      });
      const details = bigIntToJson(results);
      const attribute = { ...attributeTaxonomies, details };

      const updateData = JSONbig.stringify(attribute);
      return JSON.parse(updateData);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addProductAttributes(options: {
    data: {
      name: string;
      slug: string;
      terms: string[];
    };
  }) {
    try {
      const { name, slug, terms } = options.data;
      // console.log(data)
      const attributes =
        await this.prisma.wp_woocommerce_attribute_taxonomies.create({
          data: {
            attribute_label: name,
            attribute_name: slug,
            attribute_type: "select",
            attribute_orderby: "menu_order",
            attribute_public: 0,
          },
        });
      for (let i = 0; i < terms.length; i++) {
        const element = terms[i];
        const category = await this.prisma.wp_nepaz2_terms.create({
          data: {
            name: element,
            slug: slugify(element),
            term_group: 0,
          },
        });
        await this.prisma.wp_nepaz2_term_taxonomy.create({
          data: {
            term_id: category.term_id,
            taxonomy: attributes.attribute_name,
            description: "",
            parent: 0,
            count: 0,
          },
        });
      }
      return true;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async editProductAttributes(options: {
    data: {
      name: string;
      slug: string;
      terms: string[];
      archive: boolean;
    };
    id: string;
  }) {
    try {
      const { name, slug, terms, archive } = options.data;
      const { id } = options;
      // console.log(data)
      await this.prisma.wp_woocommerce_attribute_taxonomies.updateMany({
        where: {
          attribute_id: parseInt(id),
        },
        data: {
          attribute_label: name,
          attribute_name: slug,
          attribute_type: "select",
          attribute_orderby: "menu_order",
          attribute_public: archive ? 0 : 1,
        },
      });
      for (let i = 0; i < terms.length; i++) {
        const element = terms[i];
        const cat = await this.prisma.wp_nepaz2_terms.findFirst({
          where: {
            name: element,
          },
        });
        if (!cat) {
          const category = await this.prisma.wp_nepaz2_terms.create({
            data: {
              name: element,
              slug: slugify(element),
              term_group: 0,
            },
          });
          await this.prisma.wp_nepaz2_term_taxonomy.create({
            data: {
              term_id: category.term_id,
              taxonomy: slug,
              description: "",
              parent: 0,
              count: 0,
            },
          });
        }
      }
      return true;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async addTaxonomyInAttribute(options: {
    taxonomy: string;
    id: string;
  }) {
    try {
      // const {  } = options.data;
      const { id, taxonomy } = options;
      // console.log(data)
      const attribute =
        await this.prisma.wp_woocommerce_attribute_taxonomies.findUnique({
          where: {
            attribute_id: parseInt(id),
          },
        });
      if (attribute) {
        const category = await this.prisma.wp_nepaz2_terms.create({
          data: {
            name: taxonomy,
            slug: slugify(taxonomy),
            term_group: 0,
          },
        });
        await this.prisma.wp_nepaz2_term_taxonomy.create({
          data: {
            term_id: category.term_id,
            taxonomy: attribute?.attribute_name,
            description: "",
            parent: 0,
            count: 0,
          },
        });
        const updateData = JSONbig.stringify(category);
        return JSON.parse(updateData);
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async deleteAttributesById(id: string) {
    try {
      await this.prisma.wp_woocommerce_attribute_taxonomies.delete({
        where: {
          attribute_id: parseInt(id),
        },
      });
      // const updateData = JSONbig.stringify(t);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async searchAllProducts(options: {
    keyword: any;
    minPrice: number;
    maxPrice: number;
    pageIndex: number;
    pageSize: number;
    brand: string[];
    category: string[];
    condition: string[];
    sort: string;
  }) {
    const {
      pageIndex,
      pageSize,
      category,
      condition,
      brand,
      keyword,
      minPrice,
      maxPrice,
      sort,
    } = options;
    try {
      const baseQuery = `
      SELECT p.*
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id 
      LEFT JOIN wp_term_relationships tr ON p.ID = tr.object_id
      WHERE p.post_type = 'product' AND p.is_deleted=0
      AND pm.meta_key = '_price'
      `;

      const baseCountQuery = `
      SELECT COUNT(*) as total
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
      LEFT JOIN wp_term_relationships tr ON p.ID = tr.object_id
      WHERE p.post_type = 'product' AND p.is_deleted=0
`;

      // Array to hold query conditions
      const conditions: string[] = [];
      const conditionQuery: string[] = [];
      // Category filter
      if (category.length > 0) {
        conditionQuery.push(...category);
        // conditions.push(`
        //   tr.term_taxonomy_id IN (${category.map(cat => parseInt(cat)).join(", ")})
        // `);
      }

      // Condition filter
      if (condition.length > 0) {
        conditionQuery.push(...condition);
      }

      // Brand filter
      if (brand.length > 0) {
        conditionQuery.push(...brand);
      }

      if (conditionQuery.length > 0) {
        conditions.push(`
    tr.term_taxonomy_id IN (${conditionQuery.map(cat => parseInt(cat)).join(", ")})
  `);
      }

      // Keyword search
      if (keyword) {
        conditions.push(`
  p.post_title LIKE '%${keyword}%'
`);
      }

      // Minimum price filter
      if (minPrice) {
        conditions.push(`
  pm.meta_key = '_price' AND CAST(pm.meta_value AS DECIMAL) > ${minPrice}
`);
      }

      // Maximum price filter
      if (maxPrice) {
        conditions.push(`
  pm.meta_key = '_price' AND CAST(pm.meta_value AS DECIMAL) < ${maxPrice}
`);
      }

      // Combine conditions into the base query
      const finalQuery = `${baseQuery} ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}
ORDER BY CAST(pm.meta_value AS DECIMAL) ${sort} 
LIMIT ${pageSize} OFFSET ${(pageIndex - 1) * pageSize}`;
      const finalCountQuery = `${baseCountQuery} ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}`;
      // Execute the raw query
      // console.log(finalQuery)
      const users = await this.prisma.$queryRawUnsafe<any[]>(finalQuery);
      const countResult =
        await this.prisma.$queryRawUnsafe<Array<{ total: number }>>(
          finalCountQuery,
        );
      const totalCount = countResult[0]?.total ?? 0;
      // console.log(users, )
      // const totalResults= await this.prisma.$queryRawUnsafe(finalQuery);
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          const wp_nepaz2_postmeta = await this.prisma.wp_postmeta.findMany({
            where: {
              post_id: item.ID,
              OR: [
                { meta_key: "_stock" },
                { meta_key: "_price" },
                { meta_key: "sale_price" },
              ],
            },
          });
          const post_comments = await this.prisma.post_comments.count({
            where: {
              product_id: item.ID,
            },
          });
          const post_share = await this.prisma.share_product.count({
            where: {
              product_id: item.ID,
            },
          });
          const wp_add_product_fav = await this.prisma.wp_add_product_fav.count(
            {
              where: {
                product_id: item.ID,
              },
            },
          );
          const wp_nepaz2_users = await this.prisma.wp_nepaz2_users.findUnique({
            where: {
              id: item.post_author,
            },
            select: {
              id: true,
              user_login: true,
              user_nicename: true,
              user_url: true,
              user_registered: true,
              user_activation_key: true,
              user_status: true,
              display_name: true,
              user_email: true,
              wp_nepaz2_usermeta: {
                where: {
                  OR: [
                    { meta_key: "dokan_profile_settings" },
                    { meta_key: "wp_nepaz2_user_avatar" },
                  ],
                },
              },
            },
          });
          const wp_term_relationships =
            await this.prisma.wp_term_relationships.findMany({
              where: {
                object_id: item.ID,
              },
              select: {
                term_taxonomy: {
                  select: {
                    taxonomy: true,
                    term: true,
                  },
                },
              },
            });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.wp_nepaz2_users?.id.toString(),
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
          const userImageId = wp_nepaz2_users?.wp_nepaz2_usermeta.find(
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
          const doken_setting = wp_nepaz2_users?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = phpUnserialize.unserialize(
            doken_setting?.meta_value,
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
          return {
            ...item,
            attachment,
            wp_nepaz2_users: {
              ...wp_nepaz2_users,
              avatar,
              store: userSettings,
              avgRate,
              totalReview: userReview.length,
            },
            wp_term_relationships,
            wp_nepaz2_postmeta: wp_nepaz2_postmeta.map(value => {
              if (
                value.meta_key === "_ebay_product_featured_image" ||
                value.meta_key === "_wp_attached_file"
              ) {
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
            post_comments,
            post_share,
            wp_add_product_fav,
          };
        }),
      );
      // const whereClause: any = {
      //   AND: [{ post_type: "product", }],
      // };
      // if (category.length > 0) {
      //   whereClause.AND.push({
      //     wp_term_relationships: {
      //       some: {
      //         term_taxonomy_id: {
      //           in: category.map(cat => parseInt(cat)),
      //         },
      //       },
      //     },
      //   });
      // }
      // if (condition.length > 0) {
      //   whereClause.AND.push({
      //     wp_term_relationships: {
      //       some: {
      //         term_taxonomy_id: {
      //           in: condition.map(cat => parseInt(cat)),
      //         },
      //       },
      //     },
      //   });
      // }
      // if (brand.length > 0) {
      //   whereClause.AND.push({
      //     wp_term_relationships: {
      //       some: {
      //         term_taxonomy_id: {
      //           in: brand.map(cat => parseInt(cat)),
      //         },
      //       },
      //     },
      //   });
      // }
      // if (keyword) {
      //   whereClause.AND.push({
      //     post_title: {
      //       contains: keyword
      //     }
      //   });
      // }
      // if (minPrice) {
      //   whereClause.AND.push({
      //     wp_nepaz2_postmeta: {
      //       some: {
      //         meta_key: "_price",
      //         meta_value: {
      //           gt: minPrice.toString()  // Since `meta_value` is typically stored as a string, ensure the comparison is done correctly.
      //         }
      //       }
      //     }
      //   });
      // }
      // if (maxPrice) {
      //   whereClause.AND.push({
      //     wp_nepaz2_postmeta: {
      //       some: {
      //         meta_key: "_price",
      //         meta_value: {
      //           lt: maxPrice.toString()  // Since `meta_value` is typically stored as a string, ensure the comparison is done correctly.
      //         }
      //       }
      //     }
      //   });
      // }
      // const totalResults = await this.prisma.wp_posts.count({
      //   where: whereClause,
      // });
      // const users = await this.prisma.wp_posts.findMany({
      //   where: whereClause,
      //   orderBy: {
      //     ID: "desc",
      //   },
      //   skip: (pageIndex - 1) * pageSize,
      //   take: pageSize,
      //   select: {
      //     ID: true,
      //     post_author: true,
      //     post_date: true,
      //     post_date_gmt: true,
      //     post_content: true,
      //     post_title: true,
      //     post_excerpt: true,
      //     post_status: true,
      //     comment_status: true,
      //     ping_status: true,
      //     post_password: true,
      //     post_name: true,
      //     to_ping: true,
      //     pinged: true,
      //     post_modified: true,
      //     post_modified_gmt: true,
      //     post_content_filtered: true,
      //     post_parent: true,
      //     guid: true,
      //     menu_order: true,
      //     post_type: true,
      //     post_mime_type: true,
      //     comment_count: true,
      //     wp_nepaz2_users: {
      //       select:{
      //         id: true,
      //         user_login: true,
      //         user_nicename: true,
      //         user_url: true,
      //         user_registered: true,
      //         user_activation_key: true,
      //         user_status: true,
      //         display_name: true,
      //         user_email: true,
      //         wp_nepaz2_usermeta: {
      //           where:{
      //             OR:[
      //               {meta_key:"dokan_profile_settings"},
      //               {meta_key:"wp_nepaz2_user_avatar"}
      //             ]
      //           }
      //         },
      //       }
      //     },
      //     wp_nepaz2_postmeta: {
      //       where:{
      //         OR:[
      //           {meta_key:"_stock"},
      //           {meta_key:"_price"}
      //         ]
      //       }
      //     },
      //     wp_term_relationships: {
      //       select: {
      //         term_taxonomy: {
      //           select: {
      //             taxonomy: true,
      //             term: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });
      // const products = await Promise.all(
      //   users.map(async item => {
      //     const attachment = await this.prisma.wp_posts.findMany({
      //       where: {
      //         post_type: "attachment",
      //         post_parent: item.ID,
      //       },
      //     });
      //     const userReview= await this.prisma.wp_postmeta.findMany({
      //     where:{
      //       meta_key:"store_id",
      //       meta_value:item.wp_nepaz2_users?.id.toString()
      //     },
      //     select:{
      //       meta_key:true,
      //       meta_value:true,
      //       post:{
      //         select:{
      //           post_author:true,
      //           wp_nepaz2_postmeta:{
      //             where:{
      //               meta_key:"rating"
      //             }
      //           },
      //         }
      //       }
      //     }
      //      });
      //   const userImageId= item.wp_nepaz2_users.wp_nepaz2_usermeta.find(meta=> meta.meta_key==="wp_nepaz2_user_avatar");
      //   const avatar= await this.prisma.wp_posts.findUnique({
      //     where:{
      //       ID:userImageId?.meta_value?parseInt(userImageId?.meta_value):0,
      //       post_type:"attachment"
      //     }
      //   });
      //   const doken_setting= item.wp_nepaz2_users.wp_nepaz2_usermeta.find(meta=> meta.meta_key==="dokan_profile_settings");
      //   const userSettings= phpUnserialize.unserialize(doken_setting?.meta_value);
      //   let totalRate=0;
      //   for (let i = 0; i < userReview.length; i++) {
      //     const element = userReview[i];
      //     totalRate= totalRate+parseInt(element.post.wp_nepaz2_postmeta[0]?.meta_value?element.post.wp_nepaz2_postmeta[0]?.meta_value : "0");
      //   }
      //   const avgRate= totalRate/userReview.length;
      //     return {
      //       ...item,
      //       attachment,
      //       wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
      //         if (
      //           value.meta_key === "_ebay_product_featured_image"
      //         ) {
      //           // console.log(value.meta_value);
      //           value.meta_value = phpUnserialize.unserialize(value.meta_value);
      //         }
      //         return value;
      //       }),
      //       wp_nepaz2_users:{...item.wp_nepaz2_users, avgRate, totalReview:userReview.length, avatar, store: userSettings }
      //     };
      //   }),
      // );
      // console.log(products)
      const updateData = bigIntToJson(products);
      const totalResults = parseInt(totalCount.toString());
      return { updateData, totalResults };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async searchOtherProducts(options: {
    keyword: any;
    minPrice: number;
    maxPrice: number;
    pageIndex: number;
    pageSize: number;
    brand: string[];
    category: string[];
    condition: string[];
    sort: string;
  }) {
    const {
      pageIndex,
      pageSize,
      category,
      condition,
      brand,
      keyword,
      minPrice,
      maxPrice,
      // sort,
    } = options;
    try {
      const baseQuery = `
      SELECT p.*
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id 
      LEFT JOIN wp_term_relationships tr ON p.ID = tr.object_id
      WHERE p.post_type = 'product' AND p.is_deleted=0
      AND pm.meta_key = '_price' 
      `;

      const baseCountQuery = `
      SELECT COUNT(*) as total
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
      LEFT JOIN wp_term_relationships tr ON p.ID = tr.object_id
      WHERE p.post_type = 'product' AND p.is_deleted=0
`;

      // Array to hold query conditions
      const conditions: string[] = [];
      const conditionQuery: string[] = [];
      // Category filter
      if (category.length > 0) {
        conditionQuery.push(...category);
        // conditions.push(`
        //   tr.term_taxonomy_id IN (${category.map(cat => parseInt(cat)).join(", ")})
        // `);
      }

      // Condition filter
      if (condition.length > 0) {
        conditionQuery.push(...condition);
      }

      // Brand filter
      if (brand.length > 0) {
        conditionQuery.push(...brand);
      }

      if (conditionQuery.length > 0) {
        conditions.push(`
    tr.term_taxonomy_id NOT IN (${conditionQuery.map(cat => parseInt(cat)).join(", ")})
  `);
      }

      // Keyword search
      if (keyword) {
        conditions.push(`
  p.post_title LIKE '%${keyword}%'
`);
      }

      // Minimum price filter
      if (minPrice) {
        conditions.push(`
  pm.meta_key = '_price' AND CAST(pm.meta_value AS DECIMAL) > ${minPrice}
`);
      }

      // Maximum price filter
      if (maxPrice) {
        conditions.push(`
  pm.meta_key = '_price' AND CAST(pm.meta_value AS DECIMAL) < ${maxPrice}
`);
      }

      // Combine conditions into the base query
      const finalQuery = `${baseQuery} ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}
ORDER BY RAND() 
LIMIT ${pageSize} OFFSET ${(pageIndex - 1) * pageSize}`;
      const finalCountQuery = `${baseCountQuery} ${conditions.length > 0 ? "AND " + conditions.join(" AND ") : ""}`;
      // Execute the raw query
      // console.log(finalQuery)
      const users = await this.prisma.$queryRawUnsafe<any[]>(finalQuery);
      const countResult =
        await this.prisma.$queryRawUnsafe<Array<{ total: number }>>(
          finalCountQuery,
        );
      const totalCount = countResult[0]?.total ?? 0;
      // console.log(users, )
      // const totalResults= await this.prisma.$queryRawUnsafe(finalQuery);
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          const wp_nepaz2_postmeta = await this.prisma.wp_postmeta.findMany({
            where: {
              post_id: item.ID,
              OR: [
                { meta_key: "_stock" },
                { meta_key: "_price" },
                { meta_key: "sale_price" },
              ],
            },
          });
          const post_comments = await this.prisma.post_comments.count({
            where: {
              product_id: item.ID,
            },
          });
          const post_share = await this.prisma.share_product.count({
            where: {
              product_id: item.ID,
            },
          });
          const wp_add_product_fav = await this.prisma.wp_add_product_fav.count(
            {
              where: {
                product_id: item.ID,
              },
            },
          );
          const wp_nepaz2_users = await this.prisma.wp_nepaz2_users.findUnique({
            where: {
              id: item.post_author,
            },
            select: {
              id: true,
              user_login: true,
              user_nicename: true,
              user_url: true,
              user_registered: true,
              user_activation_key: true,
              user_status: true,
              display_name: true,
              user_email: true,
              wp_nepaz2_usermeta: {
                where: {
                  OR: [
                    { meta_key: "dokan_profile_settings" },
                    { meta_key: "wp_nepaz2_user_avatar" },
                  ],
                },
              },
            },
          });
          const wp_term_relationships =
            await this.prisma.wp_term_relationships.findMany({
              where: {
                object_id: item.ID,
              },
              select: {
                term_taxonomy: {
                  select: {
                    taxonomy: true,
                    term: true,
                  },
                },
              },
            });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.wp_nepaz2_users?.id.toString(),
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
          const userImageId = wp_nepaz2_users?.wp_nepaz2_usermeta.find(
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
          const doken_setting = wp_nepaz2_users?.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = phpUnserialize.unserialize(
            doken_setting?.meta_value,
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
          return {
            ...item,
            attachment,
            wp_nepaz2_users: {
              ...wp_nepaz2_users,
              avatar,
              store: userSettings,
              avgRate,
              totalReview: userReview.length,
            },
            wp_term_relationships,
            wp_nepaz2_postmeta: wp_nepaz2_postmeta.map(value => {
              if (
                value.meta_key === "_ebay_product_featured_image" ||
                value.meta_key === "_wp_attached_file"
              ) {
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
            post_comments,
            post_share,
            wp_add_product_fav,
          };
        }),
      );
      // console.log(products)
      const updateData = bigIntToJson(products);
      const totalResults = parseInt(totalCount.toString());
      return { updateData, totalResults };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async getHigherPriceValue() {
    try {
      const highestPriceMeta = await this.prisma.$queryRawUnsafe(`
        SELECT * 
        FROM wp_postmeta
        WHERE meta_key = '_price'
        ORDER BY CAST(meta_value AS DECIMAL) DESC
        LIMIT 1;
      `);
      return bigIntToJson(highestPriceMeta)[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getLowerPriceValue() {
    try {
      const lowestPriceMeta = await this.prisma.$queryRawUnsafe(`
        SELECT * 
        FROM wp_postmeta
        WHERE meta_key = '_price'
        ORDER BY CAST(meta_value AS DECIMAL) ASC
        LIMIT 1;
      `);
      return bigIntToJson(lowestPriceMeta)[0];
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  public async searchAllProductsByKeyword(options: {
    keyword: any;
    pageIndex: number;
    pageSize: number;
  }) {
    const { pageIndex, pageSize, keyword } = options;
    try {
      const whereClause: any = {
        AND: [{ post_type: "product", is_deleted: 0 }],
      };
      if (keyword) {
        whereClause.AND.push({
          post_title: {
            contains: keyword,
          },
        });
      }
      const totalResults = await this.prisma.wp_posts.count({
        where: whereClause,
      });
      const users = await this.prisma.wp_posts.findMany({
        where: whereClause,
        orderBy: {
          ID: "desc",
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        select: {
          ID: true,
          post_author: true,
          post_date: true,
          post_title: true,
          post_name: true,
          guid: true,
          wp_nepaz2_postmeta: true,
        },
      });
      // console.log(users)
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findFirst({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          return {
            ...item,
            attachment,
            wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
              if (
                value.meta_key === "_ebay_product_featured_image" ||
                value.meta_key === "_wp_attached_file"
              ) {
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
          };
        }),
      );
      const updateData = bigIntToJson(products);
      // console.log(totalResults);
      return { updateData, totalResults };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async getPrivacyPolicyContent() {
    try {
      const result = await this.prisma.wp_privacy_policy.findFirst();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getTermAndConditionContent() {
    try {
      const result = await this.prisma.wp_term_condition.findFirst();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updatePrivacyPolicy(options: any) {
    try {
      const { title, content } = options.body;
      const data: { title: string; content: string; image?: string } = {
        title,
        content,
      };
      if (options.file) {
        data.image = options.file[0].path;
      }
      await this.prisma.wp_privacy_policy.update({
        where: {
          id: 1,
        },
        data,
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateTermAndCondition(options: any) {
    try {
      const { title, content } = options.body;
      const data: { title: string; content: string; image?: string } = {
        title,
        content,
      };
      if (options.file) {
        data.image = options.file[0].path;
      }

      await this.prisma.wp_term_condition.update({
        where: {
          id: 1,
        },
        data,
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewBanner(options: any) {
    try {
      const { body, file } = options;
      let image = "";
      if (options.file) {
        image = file[0].path;
      }
      const banner = await this.prisma.homepage_banner.create({
        data: {
          title: body.title,
          image,
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateBanner(options: any) {
    try {
      const { body, file } = options;
      const data: any = {
        title: body.title,
      };
      if (options.file) {
        data.image = file[0].path;
      }
      const banner = await this.prisma.homepage_banner.update({
        where: {
          id: parseInt(body.id),
        },
        data,
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteBanner(id: string) {
    try {
      const banner = await this.prisma.homepage_banner.delete({
        where: {
          id: parseInt(id),
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllBanner() {
    try {
      const banner = await this.prisma.homepage_banner.findMany();
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllFeatureproducts() {
    try {
      const whereClause: any = {
        AND: [{ post_type: "product", is_deleted: 0 }],
      };
      // whereClause.AND.push({
      //   wp_term_relationships: {
      //     some: {
      //       term_taxonomy: {
      //         term_taxonomy_id: 8924,
      //       },
      //     },
      //   },
      // });
      const users = await this.prisma.wp_posts.findMany({
        where: whereClause,
        orderBy: {
          ID: "desc",
        },
        take: 10,
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
          post_comments: true,
          wp_add_product_fav: true,
          share_product: true,
        },
      });
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.wp_nepaz2_users?.id.toString(),
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
          const userImageId = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
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
          const doken_setting = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = phpUnserialize.unserialize(
            doken_setting?.meta_value,
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
          return {
            ...item,
            attachment,
            wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
              if (value.meta_key === "_ebay_product_featured_image") {
                // console.log(value.meta_value);
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
            wp_add_product_fav: item.wp_add_product_fav.length || 0,
            post_comments: item.post_comments.length || 0,
            post_share: item.share_product.length,
            wp_nepaz2_users: {
              ...item.wp_nepaz2_users,
              avgRate,
              totalReview: userReview.length,
              avatar,
              store: userSettings,
            },
          };
        }),
      );
      const updateData = bigIntToJson(products);
      return { updateData };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async getAllPrmproducts() {
    try {
      const whereClause: any = {
        AND: [{ post_type: "product", is_deleted: 0 }],
      };
      whereClause.AND.push({
        wp_term_relationships: {
          some: {
            term_taxonomy: {
              term_taxonomy_id: 8924,
            },
          },
        },
      });
      const users = await this.prisma.wp_posts.findMany({
        where: whereClause,
        orderBy: {
          ID: "desc",
        },
        take: 10,
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
          post_comments: true,
          wp_add_product_fav: true,
          share_product: true,
        },
      });
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.wp_nepaz2_users?.id.toString(),
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
          const userImageId = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
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
          const doken_setting = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = phpUnserialize.unserialize(
            doken_setting?.meta_value,
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
          return {
            ...item,
            attachment,
            wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
              if (value.meta_key === "_ebay_product_featured_image") {
                // console.log(value.meta_value);
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
            wp_nepaz2_users: {
              ...item.wp_nepaz2_users,
              avgRate,
              totalReview: userReview.length,
              avatar,
              store: userSettings,
            },
            wp_add_product_fav: item.wp_add_product_fav.length || 0,
            post_comments: item.post_comments.length || 0,
            post_share: item.share_product.length,
          };
        }),
      );
      const updateData = bigIntToJson(products);
      return { updateData };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async addRecentlyViewedProduct({
    productId,
    userId,
  }: {
    productId: string;
    userId: number;
  }) {
    try {
      await this.prisma.recently_viewed_product.create({
        data: {
          product_id: parseInt(productId),
          user_id: userId || 23,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getRecentlyViewedProducts() {
    try {
      const recentlyViewed = await this.prisma.recently_viewed_product.findMany(
        {
          select: {
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
                post_comments: true,
                wp_add_product_fav: true,
              },
            },
          },
        },
      );
      const products = await Promise.all(
        recentlyViewed.map(async item => {
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
      const result = bigIntToJson(products);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getRecentlyViewedProductsByUserId(id: number) {
    try {
      const recentlyViewed = await this.prisma.recently_viewed_product.findMany(
        {
          where: {
            user_id: id,
          },
          select: {
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
                post_comments: true,
                wp_add_product_fav: true,
              },
            },
          },
        },
      );
      const products = await Promise.all(
        recentlyViewed.map(async item => {
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
      const result = bigIntToJson(products);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllNewlyListed() {
    try {
      const whereClause: any = {
        AND: [{ post_type: "product", is_deleted: 0 }],
      };
      const users = await this.prisma.wp_posts.findMany({
        where: whereClause,
        orderBy: {
          ID: "desc",
        },
        take: 8,
        select: {
          ID: true,
          post_content: true,
          post_title: true,
          post_name: true,
          guid: true,
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
          post_comments: true,
          wp_add_product_fav: true,
          share_product: true,
        },
      });
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
            where: {
              post_type: "attachment",
              post_parent: item.ID,
            },
          });
          const userReview = await this.prisma.wp_postmeta.findMany({
            where: {
              meta_key: "store_id",
              meta_value: item.wp_nepaz2_users?.id.toString(),
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
          const userImageId = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
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
          const doken_setting = item.wp_nepaz2_users.wp_nepaz2_usermeta.find(
            meta => meta.meta_key === "dokan_profile_settings",
          );
          const userSettings = phpUnserialize.unserialize(
            doken_setting?.meta_value,
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
          return {
            ...item,
            attachment,
            wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
              if (value.meta_key === "_ebay_product_featured_image") {
                // console.log(value.meta_value);
                value.meta_value = phpUnserialize.unserialize(value.meta_value);
              }
              return value;
            }),
            wp_nepaz2_users: {
              ...item.wp_nepaz2_users,
              avgRate,
              totalReview: userReview.length,
              avatar,
              store: userSettings,
            },
            wp_add_product_fav: item.wp_add_product_fav.length || 0,
            post_comments: item.post_comments.length || 0,
            post_share: item.share_product.length,
          };
        }),
      );
      const updateData = bigIntToJson(products);
      return { updateData };
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async addSocialMediaIcons(options: any) {
    try {
      const { body, file } = options;
      let image = "";
      if (options.file) {
        image = file[0].path;
      }
      const banner = await this.prisma.social_media.create({
        data: {
          name: body.name,
          url: body.url,
          icon: image,
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateSocialMedia(options: any) {
    try {
      const { body, file } = options;
      const data: any = {
        name: body.name,
        url: body.url,
      };
      // console.log(options.file)
      if (options.file.length > 0) {
        data.icon = file[0].path;
      }
      const banner = await this.prisma.social_media.update({
        where: {
          id: parseInt(body.id),
        },
        data,
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteSocialMediaIcon(id: string) {
    try {
      const banner = await this.prisma.social_media.delete({
        where: {
          id: parseInt(id),
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllSocialMedia() {
    try {
      const banner = await this.prisma.social_media.findMany();
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getSocialMediaIconById(id: string) {
    try {
      // console.log(id)
      const banner = await this.prisma.social_media.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addFaqQuestions(options: any) {
    try {
      const { title, heading, content } = options;
      const banner = await this.prisma.faq.create({
        data: {
          title,
          heading,
          content,
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateFAQ(options: any) {
    try {
      const { title, heading, content, id } = options;
      const banner = await this.prisma.faq.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title,
          heading,
          content,
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteFaqQuestion(id: string) {
    try {
      const banner = await this.prisma.faq.delete({
        where: {
          id: parseInt(id),
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllFaqQuestions() {
    try {
      const banner = await this.prisma.faq.findMany();
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getFaqQuestionById(id: string) {
    try {
      const banner = await this.prisma.faq.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return banner;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addFeedbackOfWebsite(options: any) {
    try {
      const result = await this.prisma.website_feedback.create({
        data: {
          user_name: options.userName,
          user_email: options.userEmail,
          rating: 0,
          content: options.content,
        },
      });
      const feedback = JSONbig.stringify(result);
      return JSON.parse(feedback);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async shareProduct(options: any) {
    try {
      const { productId, shareOn } = options;
      const result = await this.prisma.share_product.create({
        data: {
          product_id: productId,
          share_on: shareOn,
        },
      });
      // console.log(result);
      const share = JSONbig.stringify(result);
      return JSON.parse(share);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllPaymentRequest() {
    try {
      const paymentRequest = await this.prisma.payment_request.findMany();
      const result = bigIntToJson(paymentRequest);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateUserStatus(options: any) {
    try {
      const { status, userId } = options;
      await this.prisma.wp_nepaz2_users.update({
        where: {
          id: userId,
        },
        data: {
          user_status: status,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
