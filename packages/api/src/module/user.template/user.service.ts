/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type FilterQuery } from "mongoose";
import { UserModel } from "../../models";
import { type UserDocument } from "../../models/user.template";
// import logger from "../../utils/logger";
import { bigIntToJson } from "../../utils/bigIntToJson";
import serialize from "locutus/php/var/serialize";
import JSONbig from "json-bigint";
import phpUnserialize from "php-unserialize";
import hasher from "wordpress-hash-node";
import prismaClient from "../../utils/dbConnection";
export class UserService {
  private readonly prisma = prismaClient;

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
          post_likes: true,
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
              const userImageId = item.vender?.wp_nepaz2_usermeta[0]?.meta_value;
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

  public async findOneWithOptions(options: FilterQuery<UserDocument>) {
    const user = await UserModel.findOne(options);
    return user;
  }

  public async findAllProducts(options: {
    id: string;
    filters: any;
    pageIndex: number;
    pageSize: number;
    product: string;
    category: string;
    condition: string;
    query: string;
  }) {
    const { id, pageIndex, pageSize, category, condition, product, query } =
      options;
    try {
      const whereClause: any = {
        AND: [{ post_type: "product", post_author: parseInt(id), is_deleted:0 }],
      };
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
      if (product) {
        whereClause.AND.push({
          wp_term_relationships: {
            some: {
              term_taxonomy: {
                term_taxonomy_id: parseInt(product),
              },
            },
          },
        });
      }
      if (query) {
        whereClause.AND.push({
          post_title: {
            contains: query,
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
          wp_nepaz2_users: true,
          wp_nepaz2_postmeta: true,
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
          let totalRate = 0;
          for (let i = 0; i < userReview.length; i++) {
            const element = userReview[i];
            totalRate =
              totalRate +
              parseInt(element.post.wp_nepaz2_postmeta[0].meta_value || "0");
          }
          const avgRate = totalRate / userReview.length;
          return {
            ...item,
            attachment,
            wp_nepaz2_users: {
              ...item.wp_nepaz2_users,
              avgRate,
              totalReview: userReview.length,
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

  public async createProduct(options: {
    body: {
      attributes: any;
      category: any[];
      condition: number;
      description: string;
      price: string;
      salePrice: string;
      productName: string;
      productType: number;
      stocks: number;
      tags: any[];
      taxStatus: string;
      taxClass: string;
      metaKeyword: string;
      metaDescription: string;
      offer: string;
      minimumOffer: string;
      shipping: any;
    };
    user: any;
  }) {
    try {
      const { body, user } = options;
      const productAttributes = serialize(body.attributes);
      const shipping = serialize(body.shipping);
      const attributesTaxnonomy: any[] = [];
      Object.keys(body.attributes).forEach(key => {
        const attribute = body.attributes[key];
        if (attribute) {
          attributesTaxnonomy.push(...attribute.value);
        }
      });
      const product = await this.prisma.wp_posts.create({
        data: {
          post_author: user.id, // Ensure user.id is of type Int
          post_content: body.description, // Ensure body.description is of type String
          post_title: body.productName, // Ensure body.productName is of type String
          post_name: body.productName, // Ensure body.productName is of type String
          post_type: "product", // String, which is correct
          post_date: new Date(), // Providing current date
          post_date_gmt: new Date(), // Providing current date in GMT
          post_excerpt: "", // Providing default empty string
          post_status: "publish", // Providing default status
          comment_status: "open", // Providing default comment status
          ping_status: "open", // Providing default ping status
          post_password: "", // Providing default empty password
          to_ping: "", // Providing default empty string
          pinged: "", // Providing default empty string
          post_modified: new Date(), // Providing current date for modified
          post_modified_gmt: new Date(), // Providing current date in GMT for modified
          post_content_filtered: "", // Providing default empty string
          post_parent: 2, // Providing default parent ID
          guid: "", // Providing default empty GUID
          menu_order: 0, // Providing default menu order
          post_mime_type: "", // Providing default empty MIME type
          comment_count: 0,
        },
      });

      await this.prisma.wp_postmeta.createMany({
        data: [
          {
            post_id: product.ID,
            meta_key: "_price",
            meta_value: body.price,
          },
          {
            post_id: product.ID,
            meta_key: "_stock",
            meta_value: body.stocks,
          },
          {
            post_id: product.ID,
            meta_key: "sale_price",
            meta_value: body.salePrice,
          },
          {
            post_id: product.ID,
            meta_key: "_product_attributes",
            meta_value: productAttributes,
          },
          {
            post_id: product.ID,
            meta_key: "tax_status",
            meta_value: body.taxStatus,
          },
          {
            post_id: product.ID,
            meta_key: "tax_class",
            meta_value: body.taxClass,
          },
          {
            post_id: product.ID,
            meta_key: "meta_keyword",
            meta_value: body.metaKeyword,
          },
          {
            post_id: product.ID,
            meta_key: "meta_description",
            meta_value: body.metaDescription,
          },
          {
            post_id: product.ID,
            meta_key: "offer",
            meta_value: body.offer,
          },
          {
            post_id: product.ID,
            meta_key: "minimum_offer",
            meta_value: body.minimumOffer,
          },
          {
            post_id: product.ID,
            meta_key: "_shiping",
            meta_value: shipping,
          },
        ],
      });

      const attributesTerms = attributesTaxnonomy.map(item => {
        return {
          object_id: product.ID,
          term_taxonomy_id: item.value,
          term_order: 0,
        };
      });

      const cat = body.category.map(item => {
        return {
          object_id: product.ID,
          term_taxonomy_id: item.value,
          term_order: 0,
        };
      });

      const tags = body.tags.map(item => {
        return {
          object_id: product.ID,
          term_taxonomy_id: item.value,
          term_order: 0,
        };
      });

      cat.push(
        {
          object_id: product.ID,
          term_taxonomy_id: body.condition,
          term_order: 0,
        },
        {
          object_id: product.ID,
          term_taxonomy_id: body.productType,
          term_order: 0,
        },
      );
      // console.log(cat)
      const terms = cat.concat(attributesTerms).concat(tags);
      await this.prisma.wp_term_relationships.createMany({
        data: terms,
      });

      const productLookup: any[] = [];

      Object.keys(body.attributes).forEach(key => {
        const attribute = body.attributes[key];
        for (let i = 0; i < attribute.value.length; i++) {
          const element = attribute.value[i];
          productLookup.push({
            product_id: product.ID,
            product_or_parent_id: product.ID,
            taxonomy: key,
            term_id: element.value,
            is_variation_attribute: 0,
            in_stock: 1,
          });
        }
      });

      await this.prisma.wp_wc_product_attributes_lookup.createMany({
        data: productLookup,
      });
      const result = JSONbig.stringify(product);
      return JSON.parse(result);
      // return "success"
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateProduct(options: {
    body: {
      attributes: any;
      category: any[];
      condition: number;
      description: string;
      price: string;
      salePrice: string;
      productName: string;
      productType: number;
      stocks: number;
      tags: any[];
      taxStatus: string;
      taxClass: string;
      metaKeyword: string;
      metaDescription: string;
      offer: string;
      minimumOffer: string;
      shipping: any;
    };
    user: any;
    id: string;
  }) {
    try {
      const { body, user, id } = options;
      const productAttributes = serialize(body.attributes);
      const shipping = serialize(body.shipping);
      const attributesTaxnonomy: any[] = [];
      Object.keys(body.attributes).forEach(key => {
        const attribute = body.attributes[key];
        if (attribute) {
          attributesTaxnonomy.push(...attribute.value);
        }
      });
      const product = await this.prisma.wp_posts.updateMany({
        where: { ID: parseInt(id) },
        data: {
          post_author: user.id, // Ensure user.id is of type Int
          post_content: body.description, // Ensure body.description is of type String
          post_title: body.productName, // Ensure body.productName is of type String
          post_name: body.productName, // Ensure body.productName is of type String
        },
      });

      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "_price" },
        data: {
          meta_value: body.price,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "sale_price" },
        data: {
          meta_value: body.salePrice,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "_stock" },
        data: {
          meta_value: body.stocks.toString(),
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "_product_attributes" },
        data: {
          meta_value: productAttributes,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "_shiping" },
        data: {
          meta_value: shipping,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "tax_status" },
        data: {
          meta_value: body.taxStatus,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "tax_class" },
        data: {
          meta_value: body.taxClass,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "meta_keyword" },
        data: {
          meta_value: body.metaKeyword,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "meta_description" },
        data: {
          meta_value: body.metaDescription,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "offer" },
        data: {
          meta_value: body.offer,
        },
      });
      await this.prisma.wp_postmeta.updateMany({
        where: { post_id: parseInt(id), meta_key: "minimum_offer" },
        data: {
          meta_value: body.minimumOffer,
        },
      });

      const attributesTerms = attributesTaxnonomy.map(item => {
        return {
          object_id: parseInt(id),
          term_taxonomy_id: item.value,
          term_order: 0,
        };
      });

      const cat = body.category.map(item => {
        return {
          object_id: parseInt(id),
          term_taxonomy_id: item.value,
          term_order: 0,
        };
      });
      const tags = body.tags.map(item => {
        return {
          object_id: parseInt(id),
          term_taxonomy_id: item.value,
          term_order: 0,
        };
      });

      cat.push({
        object_id: parseInt(id),
        term_taxonomy_id: body.productType,
        term_order: 0,
      },{
        object_id: parseInt(id),
        term_taxonomy_id: body.condition,
        term_order: 0,
      });
      const terms = cat.concat(attributesTerms).concat(tags);
      await this.prisma.wp_term_relationships.deleteMany({
        where: {
          object_id: parseInt(id),
        },
      });
      await this.prisma.wp_term_relationships.createMany({
        data: terms,
      });

      const productLookup: any[] = [];

      Object.keys(body.attributes).forEach(key => {
        const attribute = body.attributes[key];
        for (let i = 0; i < attribute.value.length; i++) {
          const element = attribute.value[i];
          productLookup.push({
            product_id: parseInt(id),
            product_or_parent_id: parseInt(id),
            taxonomy: key,
            term_id: element.value,
            is_variation_attribute: 0,
            in_stock: 1,
          });
        }
      });

      await this.prisma.wp_wc_product_attributes_lookup.deleteMany({
        where: {
          product_id: parseInt(id),
        },
      });

      await this.prisma.wp_wc_product_attributes_lookup.createMany({
        data: productLookup,
      });
      const result = JSONbig.stringify(product);
      return JSON.parse(result);
      // return "success"
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteProduct(id: string) {
    try {
      await this.prisma.recently_viewed_product.deleteMany({
        where: {
          product_id: parseInt(id),
        },
      });
      await this.prisma.wp_add_product_cart.deleteMany({
        where: {
          product_id: parseInt(id),
        },
      });
      await this.prisma.wp_add_product_fav.deleteMany({
        where: {
          product_id: parseInt(id),
        },
      });
      await this.prisma.wp_posts.update({
        where: {
          ID: parseInt(id),
        },
        data:{
          is_deleted:1
        }
      });
      return "success";
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async getProductById(id: string) {
    try {
      const product = await this.prisma.wp_posts.findUnique({
        where: {
          ID: parseInt(id),
        },
        select: {
          ID: true,
          post_author: true,
          post_date: true,
          post_date_gmt: true,
          post_content: true,
          post_title: true,
          post_excerpt: true,
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
              wp_nepaz2_usermeta: true,
              follower: true,
              following: true,
            },
          },
          wp_nepaz2_postmeta: true,
          wp_term_relationships: {
            select: {
              object_id: true,
              term_taxonomy: {
                select: {
                  term_taxonomy_id: true,
                  taxonomy: true,
                  term: true,
                  parent: true,
                },
              },
            },
          },
          attribute_lookup: {
            select: {
              id: true,
              taxonomy: true,
              term_id: true,
              is_variation_attribute: true,
              in_stock: true,
              terms: true,
            },
          },
        },
      });
      if (product) {
        const postMeta = product.wp_nepaz2_postmeta.map((item: any) => {
          if (
            item.meta_key === "_product_attributes" ||
            item.meta_key === "_ebay_product_featured_image" ||
            item.meta_key === "_ebay_product_gallery_images" ||
            item.meta_key === "_shiping"
          ) {
            const capabilities = phpUnserialize.unserialize(item.meta_value);
            item.meta_value = capabilities;
          }
          return item;
        });
        const userMeta = product.wp_nepaz2_users.wp_nepaz2_usermeta.map(
          (item: any) => {
            if (item.meta_key === "dokan_profile_settings") {
              const capabilities = phpUnserialize.unserialize(item.meta_value);
              item.meta_value = capabilities;
            }
            return item;
          },
        );

        const attachment = await this.prisma.wp_posts.findMany({
          where: {
            post_type: "attachment",
            post_parent: product.ID,
          },
          select: {
            ID: true,
            guid: true,
            wp_nepaz2_postmeta: true,
          },
        });

        const userReview = await this.prisma.wp_postmeta.findMany({
          where: {
            meta_key: "store_id",
            meta_value: product.wp_nepaz2_users?.id.toString(),
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
        const userImageId = product.wp_nepaz2_users.wp_nepaz2_usermeta.find(
          meta => meta.meta_key === "wp_nepaz2_user_avatar",
        );
        const avatar = await this.prisma.wp_posts.findUnique({
          where: {
            ID: userImageId?.meta_value ? parseInt(userImageId?.meta_value) : 0,
            post_type: "attachment",
          },
        });
        const dokenSetting = product.wp_nepaz2_users.wp_nepaz2_usermeta.find(
          meta => meta.meta_key === "dokan_profile_settings",
        );
        // console.log(dokenSetting)
        const userSettings = dokenSetting?.meta_value;

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
        const totalListing = await this.prisma.wp_posts.count({
          where: {
            post_author: product.wp_nepaz2_users.id,
            post_type: "product",
          },
        });

        var categories: any[] = [];

        // Create a map to store the categories by their term_taxonomy_id for easy lookup
        var categoryMap = {};

        product.wp_term_relationships.forEach((item: any) => {
          const { term_taxonomy_id, term, taxonomy, parent } = item.term_taxonomy;

          if (parent === 0n) {
            // Create category object
            const category = {
              name: term.name,
              id: term_taxonomy_id,
              taxonomy,
              parent,
              subcategory: [],
            };
            // Store it in the result array and also in the map
            categories.push(category);
            categoryMap[term_taxonomy_id] = category;
          }
        });

        product.wp_term_relationships.forEach((item: any) => {
          const { term_taxonomy_id,taxonomy, term, parent } = item.term_taxonomy;
          if (parent !== 0n && categoryMap[parent]) {
            // If this item has a parent that exists in the category map, add it as a subcategory
            categoryMap[parent].subcategory.push({
              name: term.name,
              id: term_taxonomy_id,
              taxonomy,
              parent,
            });
          }
        });
        // const postAttchment = attchment.map(async item => {
        //   return {
        //     ...item,
        //     wp_nepaz2_postmeta: item.wp_nepaz2_postmeta.map(value => {
        //       if (
        //         value.meta_key === "_wp_attachment_metadata" ||
        //         value.meta_key === "_wp_attached_file"
        //       ) {
        //         value.meta_value = phpUnserialize.unserialize(value.meta_value);
        //       }
        //       return value;
        //     }),
        //   };
        // });
        const newProduct = {
          ...product,
          wp_nepaz2_postmeta: postMeta,
          attachment,
          isAttachment: attachment.length > 0,
          wp_nepaz2_users: {
            ...product.wp_nepaz2_users,
            wp_nepaz2_usermeta: userMeta,
            avatar,
            totalRate,
            avgRate,
            store: userSettings,
            totalListing,
          },
          wp_term_relationships: categories,
        };
        const result = JSONbig.stringify(newProduct);
        return JSON.parse(result);
      }
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  async updateStoreSetting(options: {
    body: {
      storeName?: string;
      storeProduct?: string;
      street?: string;
      street2?: string;
      city?: string;
      zipCode?: string;
      country?: string;
      state?: string;
      ein?: string;
      primaryPhoneNumber?: string;
      countryCode: string;
      businessContactNumber?: string;
      sellerType?: string;
    };
    id: string;
  }) {
    try {
      const { body, id } = options;
      const profileSetting = await this.prisma.wp_nepaz2_usermeta.findMany({
        where: { user_id: parseInt(id), meta_key: "dokan_profile_settings" },
      });
      const settings = phpUnserialize.unserialize(profileSetting[0].meta_value);
      settings.store_name = body.storeName;
      settings.store_ppp = body.storeProduct;
      settings.address.street_1 = body.street;
      settings.address.street_2 = body.street2;
      settings.address.city = body.city;
      settings.address.zip = body.zipCode;
      settings.address.country = body.country;
      settings.address.state = body.state;
      settings.address.primaryPhoneNumber = body.primaryPhoneNumber;
      settings.address.countryCode = body.countryCode;
      settings.address.businessContactNumber = body.businessContactNumber;
      settings.ein = body.ein;
      settings.phone_number = body.primaryPhoneNumber;
      settings.country_code = body.countryCode;
      settings.business_contact = body.businessContactNumber;
      // console.log(body, settings)
      const serializeSetting = serialize(settings);
      await this.prisma.wp_nepaz2_usermeta.updateMany({
        where: {
          user_id: parseInt(id),
          meta_key: "dokan_profile_settings",
        },
        data: {
          meta_value: serializeSetting,
        },
      });
      return settings;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSeoSetting(options: {
    body: {
      seoTitle?: string;
      metaKeywords?: string;
      metaDescription?: string;
      twitterUrl?: string;
      facebookUrl?: string;
      linkedinUrl?: string;
      youtubeUrl?: string;
    };
    id: string;
  }) {
    try {
      const { body, id } = options;
      const profileSetting = await this.prisma.wp_nepaz2_usermeta.findMany({
        where: { user_id: parseInt(id), meta_key: "dokan_profile_settings" },
      });
      const settings = phpUnserialize.unserialize(profileSetting[0].meta_value);
      const storeSeo = {
        "dokan-seo-meta-title": body.seoTitle,
        "dokan-seo-meta-keywords": body.seoTitle,
        "dokan-seo-meta-desc": body.metaDescription,
      };
      const social = {
        facebook: body.facebookUrl,
        twitter: body.twitterUrl,
        linkedin: body.linkedinUrl,
        youtube: body.youtubeUrl,
      };
      settings.store_seo = storeSeo;
      settings.social = social;
      const serializeSetting = serialize(settings);
      await this.prisma.wp_nepaz2_usermeta.updateMany({
        where: {
          user_id: parseInt(id),
          meta_key: "dokan_profile_settings",
        },
        data: {
          meta_value: serializeSetting,
        },
      });
      return settings;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  async updatePolicySetting(options: {
    body: {
      tabTitle?: string;
      shippingPolicy?: string;
      refundPolicy?: string;
      returnPolicy?: string;
    };
    id: string;
  }) {
    try {
      const { body, id } = options;
      const profileSetting = await this.prisma.wp_nepaz2_usermeta.findMany({
        where: { user_id: parseInt(id), meta_key: "dokan_profile_settings" },
      });
      const settings = phpUnserialize.unserialize(profileSetting[0].meta_value);
      settings.wcfm_policy_tab_title = body.tabTitle;
      settings.wcfm_shipping_policy = body.shippingPolicy;
      settings.wcfm_refund_policy = body.refundPolicy;
      settings.wcfm_cancellation_policy = body.returnPolicy;
      const serializeSetting = serialize(settings);
      await this.prisma.wp_nepaz2_usermeta.updateMany({
        where: {
          user_id: parseInt(id),
          meta_key: "dokan_profile_settings",
        },
        data: {
          meta_value: serializeSetting,
        },
      });
      return settings;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateGeneralSetting(options: {
    body: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      about?: string;
      sellerType?: string;
    };
    id: string;
  }) {
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
      const sellerMeta = await this.prisma.wp_nepaz2_usermeta.findFirst({
        where: {
          user_id: parseInt(id),
          meta_key: "seller_type",
        },
      });
      if (sellerMeta) {
        await this.prisma.wp_nepaz2_usermeta.update({
          where: {
            umeta_id: sellerMeta.umeta_id,
          },
          data: {
            meta_value: body.sellerType,
          },
        });
      } else {
        await this.prisma.wp_nepaz2_usermeta.create({
          data: {
            user_id: parseInt(id),
            meta_key: "seller_type",
            meta_value: body.sellerType,
          },
        });
      }
      return "success";
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserAddress(options: {
    body: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      about?: string;
    };
    id: string;
  }) {
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
      return "success";
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserPassword(options: {
    body: {
      oldPassword: string;
      newPassword?: string;
      confirmPassword?: string;
    };
    id: string;
  }) {
    try {
      const { body, id } = options;
      const user = await this.prisma.wp_nepaz2_users.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      const checked = hasher.CheckPassword(body.oldPassword, user?.user_pass);
      // console.log(checked)
      if (checked) {
        const hash = hasher.HashPassword(body.newPassword);
        await this.prisma.wp_nepaz2_users.update({
          where: {
            id: parseInt(id),
          },
          data: {
            user_pass: hash,
          },
        });
        return "success";
      } else {
        throw new Error("Old password not matched");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadProductAttachment(options: {
    body: any;
    files: any;
    id: string;
  }) {
    try {
      const { body, files, id } = options;
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        const product = await this.prisma.wp_posts.create({
          data: {
            post_author: parseInt(id), // Ensure user.id is of type Int
            post_content: "", // Ensure body.description is of type String
            post_title: `${i}-${files.length}`, // Ensure body.productName is of type String
            post_name: `${i}-${files.length}`, // Ensure body.productName is of type String
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
            post_parent: parseInt(body.id), // Providing default parent ID
            guid: `/${element.path}`, // Providing default empty GUID
            menu_order: 0, // Providing default menu order
            post_mime_type: element.mimetype, // Providing default empty MIME type
            comment_count: 0,
          },
        });
        const attchmentMetaData = serialize(element);
        await this.prisma.wp_postmeta.createMany({
          data: [
            {
              post_id: product.ID,
              meta_key: "_wp_attached_file",
              meta_value: element.filename,
            },
            {
              post_id: product.ID,
              meta_key: "_wp_attachment_metadata",
              meta_value: attchmentMetaData,
            },
          ],
        });
      }
      return "success";
    } catch (error) {
      throw new Error(error);
    }
  }

  async searchProduct(keyword: string) {
    try {
      const users = await this.prisma.wp_posts.findMany({
        where: {
          wp_nepaz2_users: {
            display_name: {
              contains: keyword,
            },
          },
        },
        orderBy: {
          ID: "desc",
        },
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
          wp_nepaz2_users: true,
          wp_nepaz2_postmeta: true,
          wp_term_relationships: {
            where: {
              OR: [
                {
                  term_taxonomy: {
                    taxonomy: "product_cat",
                  },
                },
                {
                  term_taxonomy: {
                    taxonomy: "pa_condition",
                  },
                },
              ],
            },
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
      });
      const products = await Promise.all(
        users.map(async item => {
          const attachment = await this.prisma.wp_posts.findMany({
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
      return { updateData };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async uploadStoreImages(options: any) {
    try {
      const { files, userId } = options;
      const avatarImage = files.find(item => item.fieldname === "avatar");
      const bannerImage = files.find(item => item.fieldname === "banner");
      if (avatarImage) {
        const avatar = await this.prisma.wp_posts.create({
          data: {
            post_author: userId, // Ensure user.id is of type Int
            post_content: "", // Ensure body.description is of type String
            post_title: `${userId}-avatar`, // Ensure body.productName is of type String
            post_name: `${userId}-avatar`, // Ensure body.productName is of type String
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
            guid: `/${avatarImage.path}`, // Providing default empty GUID
            menu_order: 0, // Providing default menu order
            post_mime_type: avatarImage.mimetype, // Providing default empty MIME type
            comment_count: 0,
            
          },
        });

        const storeSettings: any =
          await this.prisma.wp_nepaz2_usermeta.findFirst({
            where: {
              user_id: userId,
              meta_key: "dokan_profile_settings",
            },
          });
        const serialized = phpUnserialize.unserialize(
          storeSettings?.meta_value,
        );
        serialized.gravatar = avatar.ID.toString();
        const serializeSetting = serialize(serialized);
        if (storeSettings) {
          await this.prisma.wp_nepaz2_usermeta.update({
            where: {
              umeta_id: storeSettings.umeta_id,
            },
            data: {
              meta_value: serializeSetting,
            },
          });
        }
        const json = JSONbig.stringify(serialized);
        // console.log(files,serialized);
        return { settings: JSON.parse(json) };
      } else if (bannerImage) {
        const banner = await this.prisma.wp_posts.create({
          data: {
            post_author: userId, // Ensure user.id is of type Int
            post_content: "", // Ensure body.description is of type String
            post_title: `${userId}-banner`, // Ensure body.productName is of type String
            post_name: `${userId}-banner`, // Ensure body.productName is of type String
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
            guid: `/${bannerImage.path}`, // Providing default empty GUID
            menu_order: 0, // Providing default menu order
            post_mime_type: bannerImage.mimetype, // Providing default empty MIME type
            comment_count: 0,
          },
        });

        const storeSettings: any =
          await this.prisma.wp_nepaz2_usermeta.findFirst({
            where: {
              user_id: userId,
              meta_key: "dokan_profile_settings",
            },
          });
        const serialized = phpUnserialize.unserialize(
          storeSettings?.meta_value,
        );
        serialized.banner = banner.ID.toString();
        const serializeSetting = serialize(serialized);
        if (storeSettings) {
          await this.prisma.wp_nepaz2_usermeta.update({
            where: {
              umeta_id: storeSettings.umeta_id,
            },
            data: {
              meta_value: serializeSetting,
            },
          });
        }
        const json = JSONbig.stringify(serialized);
        // console.log(files,serialized);
        return { settings: JSON.parse(json) };
      } else {
        throw new Error("please upload any image");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async uploadUserImage(options: any) {
    try {
      const { files, userId } = options;
      const avatarImage = files.find(
        (item: any) => item.fieldname === "avatar",
      );
      const avatar = await this.prisma.wp_posts.create({
        data: {
          post_author: userId, // Ensure user.id is of type Int
          post_content: "", // Ensure body.description is of type String
          post_title: `${userId}-avatar`, // Ensure body.productName is of type String
          post_name: `${userId}-avatar`, // Ensure body.productName is of type String
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
          guid: `/${avatarImage.path}`, // Providing default empty GUID
          menu_order: 0, // Providing default menu order
          post_mime_type: avatarImage.mimetype, // Providing default empty MIME type
          comment_count: 0,
        },
      });
      const storeSettings: any = await this.prisma.wp_nepaz2_usermeta.findFirst(
        {
          where: {
            user_id: userId,
            meta_key: "wp_nepaz2_user_avatar",
          },
        },
      );
      const gravatar = avatar.ID.toString();
      if (storeSettings) {
        await this.prisma.wp_nepaz2_usermeta.update({
          where: {
            umeta_id: storeSettings.umeta_id,
          },
          data: {
            meta_value: gravatar,
          },
        });
      } else {
        await this.prisma.wp_nepaz2_usermeta.create({
          data: {
            user_id: userId,
            meta_key: "wp_nepaz2_user_avatar",
            meta_value: gravatar,
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addBuyerAddress(options: any) {
    try {
      const { body, id } = options;
      const addrress = await this.prisma.user_address.create({
        data: {
          user_id: id,
          street1: body.street1,
          street2: body.street2,
          country: body.country,
          state: body.state,
          city: body.city,
          zipcode: body.zipcode,
          lat: "",
          lng: "",
          default: 1,
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          company: body.company,
          phone_number: body.phoneNumber
        },
      });
        await this.prisma.user_address.updateMany({
          where: {
            default: 1,
            id: {
              not: addrress.id,
            },
          },
          data: {
            default: 0,
          },
        });      const result = JSONbig.stringify(addrress);
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllBuyerAddress(id: number) {
    try {
      const result = await this.prisma.user_address.findMany({
        where: {
          user_id: id,
        },
      });
      const address = bigIntToJson(result);
      return address;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteBuyerAddress(id: number) {
    try {
      await this.prisma.user_address.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getBuyerAddressId(id: number) {
    try {
      const address = await this.prisma.user_address.findUnique({
        where: {
          id,
        },
      });
      const result = JSONbig.stringify(address);
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateBuyerAddress(options: any) {
    try {
      const { body, id } = options;
      const addrress = await this.prisma.user_address.update({
        where: {
          id,
        },
        data: {
          street1: body.street1,
          street2: body.street2,
          country: body.country,
          state: body.state,
          city: body.city,
          zipcode: body.zipcode,
          default: body.default ? 1 : 0,
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          company: body.company,
          phone_number: body.phoneNumber
        },
      });
      if (body.default) {
        await this.prisma.user_address.updateMany({
          where: {
            default: 1,
            id: {
              not: addrress.id,
            },
          },
          data: {
            default: 0,
          },
        });
      }
      const result = JSONbig.stringify(addrress);
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewNotification(options: any) {
    try {
      const { body, userId } = options;
      const notification = await this.prisma.user_notifications.create({
        data: {
          user_id: body.userId,
          auther_id: userId,
          type: "test",
          content: body.content,
        },
      });
      const result = JSONbig(notification);
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewPaymentRequest(options: any) {
    try {
      const { sellerId, amount } = options;
      const request = await this.prisma.payment_request.create({
        data: {
          seller_id: sellerId,
          amount,
          status: "proccess",
        },
      });
      const result = JSONbig.stringify(request);
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }
}
