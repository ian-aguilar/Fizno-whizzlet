/* eslint-disable prettier/prettier */
import { bigIntToJson } from "../../utils/bigIntToJson";
import JSONbig from "json-bigint";
import prismaClient from "../../utils/dbConnection";
export class OrderService {
  private readonly prisma = prismaClient;
  public async getAllOrders(options: {
    pageSize: string;
    pageIndex: string;
    seller: string;
    customer: string;
  }) {
    try {
      const { pageIndex, pageSize, seller, customer } = options;
      const whereClause: any = {
        AND: [{ post_type: "shop_order", is_deleted:0 }],
      };
      if (seller) {
        whereClause.AND.push({
          wp_dokan_orders: {
            some: {
              seller_id: parseInt(seller),
            },
          },
        });
      }
      if (customer) {
        whereClause.AND.push({
          wp_wc_order_product_lookup_order: {
            some: {
              customer_id: parseInt(customer),
            },
          },
        });
      }
      const size = parseInt(pageSize);
      const index = parseInt(pageIndex);
      const results = await this.prisma.wp_posts.findMany({
        where: whereClause,
        orderBy: {
          ID: "desc",
        },
        skip: (index - 1) * size,
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
                select:{
                  ID: true,
                  post_author: true,
                  post_date: true,
                  post_content: true,
                  post_title: true,
                  post_status: true,
                  post_name: true,
                  post_parent: true,
                  post_type: true,
                  wp_nepaz2_users: true,
                  attachments:true
                }
              },
            },
          },
          wp_wc_order_product_lookup_product: true,
          wp_woocommerce_order_items: {
           where:{
             order_item_type:"line_item"
           },
           select:{
            order_id:true,
            order_item_name: true,
            order_item_type:true,
            wp_woocommerce_order_itemmeta:true 
          }
          },
          seller_earning:true
        },
      });
      const orders = bigIntToJson(results);
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getOrderById(id: number) {
    try {
      // const {pageIndex, pageSize, seller, customer}=options;
      const results = await this.prisma.wp_posts.findUnique({
        where: {
          ID: id,
        },
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
                  post_content: true,
                  post_title: true,
                  post_status: true,
                  post_name: true,
                  post_parent: true,
                  post_type: true,
                  wp_nepaz2_users: true,
                  attachments:true,
                  wp_nepaz2_postmeta:{
                    where:{
                      OR:[{meta_key:"_price"},{meta_key:"sale_price"}]
                    }
                  }
                },
              },
            },
          },
          seller_earning: true,
          wp_wc_order_product_lookup_product: true,
          wp_woocommerce_order_items: true,
        },
      });
      const orders = JSONbig.stringify(results);
      return JSON.parse(orders);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllCoupons() {
    try {
      const result = await this.prisma.coupon_code.findMany();
      const coupon = bigIntToJson(result);
      return coupon;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewCoupon(options: any) {
    try {
      const { body } = options;
      await this.prisma.coupon_code.create({
        data: {
          coupon_type: body.couponType,
          coupon_amount: parseInt(body.couponAmount),
          description: body.description,
          sellerId: body.sellerId ? parseInt(body.sellerId) : 23,
          uses: 0,
          minimum_spent: parseInt(body.minimumSpent),
          maximum_spent: parseInt(body.maximumSpent),
          limit: parseInt(body.limit),
          limit_per_item: parseInt(body.limitPerItem),
          limit_per_user: parseInt(body.limitPerUser),
          expire_at: body.expireAt,
          created_at: new Date(),
          code: body.couponCode,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteCouponCode(id: number) {
    try {
      // const { body } = options;
      await this.prisma.coupon_code.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async addNewOrderStatus(options: any) {
    try {
      const { name, slug, color, status } = options;

      const result = await this.prisma.order_status.create({
        data: {
          name,
          slug,
          color,
          status,
        },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateOrderStatus(options: any) {
    try {
      const { id, name, slug, color, status } = options;
      const result = await this.prisma.order_status.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
          color,
          status,
        },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllOrderStatus() {
    try {
      const result = await this.prisma.order_status.findMany();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllOrderStatusById(id: number) {
    try {
      const result = await this.prisma.order_status.findUnique({
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deteleOrderStatus(id: number) {
    try {
      const result = await this.prisma.order_status.delete({
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateAdminCommission(options: any) {
    try {
      const { commissionFee, paymentFee } = options;
      const comm = await this.prisma.fizno_commission.findFirst();
      if (comm) {
        await this.prisma.fizno_commission.update({
          where: {
            id: comm.id,
          },
          data: {
            commission_fee: parseInt(commissionFee),
            payment_fee: parseInt(paymentFee),
          },
        });
      } else {
        await this.prisma.fizno_commission.create({
          data: {
            commission_fee: parseInt(commissionFee),
            payment_fee: parseInt(paymentFee),
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAdminCommissionValue() {
    try {
      const commission = await this.prisma.fizno_commission.findFirst();
      const result = JSONbig.stringify(commission);
      return JSON.parse(result);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllEarnings() {
    try {
      const seller = await this.prisma.wp_nepaz2_users.findMany({
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
          seller_earning: true,
        },
      });
      const mapedData = seller.map(item => {
        let totalEarning = 0;
        for (let i = 0; i < item.seller_earning.length; i++) {
          const element = item.seller_earning[i];
          totalEarning = totalEarning + parseFloat(element.earning.toString());
        }
        return { ...item, totalEarning };
      });
      const result = bigIntToJson(mapedData);
      return result.filter((item: any) => item.totalEarning > 0);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getEarningsBySellerId(id: number) {
    try {
      const earnings = await this.prisma.seller_earning.findMany({
        where: {
          seller_id: id,
        },
        select: {
          id: true,
          order_id: true,
          seller_id: true,
          sale_tax: true,
          commission_fee: true,
          payment_fee: true,
          earning: true,
          order_total: true,
          order: {
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
                  product: true,
                },
              },
              wp_wc_order_product_lookup_product: true,
              wp_woocommerce_order_items: true,
            },
          },
          seller: true,
        },
      });
      const result = bigIntToJson(earnings);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
