/* eslint-disable prettier/prettier */
import { bigIntToJson } from "../../utils/bigIntToJson";
import JSONbig from "json-bigint";
import prismaClient from "../../utils/dbConnection";

export class MessageService {
  private readonly prisma = prismaClient;

  public async getAllMessages(options: {
    id: number;
    pageIndex: number;
    pageSize: number;
    keyword: string;
    type: string;
  }) {
    try {
      const { id, pageIndex, pageSize, keyword, type } = options;
      const messageClause: any = { AND: [{ mgs_parent: 0 }] };
      const whereClause: any = {
        mgs_participant: id,
        wp_fep_messages: messageClause,
        mgs_deleted: 0,
      };
      if (type === "read") {
        whereClause.mgs_read = {
          not: 0,
        };
      }
      if (type === "unread") {
        whereClause.mgs_read = 0;
      }
      if (type === "archive") {
        whereClause.mgs_archived = {
          not: 0,
        };
      }
      if (keyword) {
        messageClause.AND.push({
          mgs_title: {
            contains: keyword,
          },
        });
      }

      const messages = await this.prisma.wp_fep_participants.findMany({
        where: whereClause,
        orderBy: {
          mgs_id: "desc",
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        select: {
          per_id: true,
          mgs_id: true,
          mgs_participant: true,
          mgs_read: true,
          mgs_parent_read: true,
          mgs_deleted: true,
          mgs_archived: true,
          wp_fep_messages: true,
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
            },
          },
        },
      });

      // for (let i = 0; i < messages.length; i++) {
      //     const element = messages[i];

      // }
      const allMessages = await Promise.all(
        messages.map(async element => {
          const otherMessages = await this.prisma.wp_fep_participants.findMany({
            where: {
              mgs_id: element.mgs_id,
              per_id: { not: element.per_id }, // Exclude the current row by its ID
            },
            select: {
              per_id: true,
              mgs_id: true,
              mgs_participant: true,
              mgs_read: true,
              mgs_parent_read: true,
              mgs_deleted: true,
              mgs_archived: true,
              wp_fep_messages: true,
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
                },
              },
            },
          });

          const otherUser = await Promise.all(
            otherMessages.map(async msg => {
              const otherUserImageId = element.user?.wp_nepaz2_usermeta?.find(
                (meta: any) => meta.meta_key === "wp_nepaz2_user_avatar",
              )?.meta_value;
              const avatar = otherUserImageId
                ? await this.prisma.wp_posts.findFirst({
                    where: {
                      post_type: "attachment",
                      ID: parseInt(otherUserImageId),
                    },
                  })
                : "";

              return { ...msg, user: { ...msg.user, avatar } };
            }),
          );
          const userImageId = element.user?.wp_nepaz2_usermeta?.find(
            (meta: any) => meta.meta_key === "wp_nepaz2_user_avatar",
          )?.meta_value;
          const avatar = userImageId
            ? await this.prisma.wp_posts.findFirst({
                where: {
                  post_type: "attachment",
                  ID: parseInt(userImageId),
                },
              })
            : "";

          return { ...element, user:{...element.user, avatar}, other_user: otherUser };
        }),
      );
      // console.log(messages);
      const updatedMessage = bigIntToJson(allMessages);
      return updatedMessage;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  public async getAllMessagesForAdmin(options: {
    id: number;
    pageIndex: number;
    pageSize: number;
    keyword: string;
    type: string;
  }) {
    try {
      const { id, pageIndex, pageSize, keyword, type } = options;
      const messageClause: any = { AND: [{ mgs_parent: 0 }] };
      const whereClause: any = {
        wp_fep_messages: messageClause,
        mgs_deleted: 0,
      };
      if (id) {
        whereClause.mgs_participant = id;
      }
      if (type === "read") {
        whereClause.mgs_read = {
          not: 0,
        };
      }
      if (type === "unread") {
        whereClause.mgs_read = 0;
      }
      if (type === "archive") {
        whereClause.mgs_archived = {
          not: 0,
        };
      }
      if (keyword) {
        messageClause.AND.push({
          mgs_title: {
            contains: keyword,
          },
        });
      }
      const messages = await this.prisma.wp_fep_participants.findMany({
        where: whereClause,
        orderBy: {
          mgs_id: "desc",
        },
        skip: (pageIndex - 1) * pageSize,
        take: pageSize,
        select: {
          per_id: true,
          mgs_id: true,
          mgs_participant: true,
          mgs_read: true,
          mgs_parent_read: true,
          mgs_deleted: true,
          mgs_archived: true,
          wp_fep_messages: true,
          user: true,
        },
      });

      // for (let i = 0; i < messages.length; i++) {
      //     const element = messages[i];

      // }
      const allMessages = await Promise.all(
        messages.map(async element => {
          const otherMessages = await this.prisma.wp_fep_participants.findMany({
            where: {
              mgs_id: element.mgs_id,
              per_id: { not: element.per_id }, // Exclude the current row by its ID
            },
            select: {
              per_id: true,
              mgs_id: true,
              mgs_participant: true,
              mgs_read: true,
              mgs_parent_read: true,
              mgs_deleted: true,
              mgs_archived: true,
              wp_fep_messages: true,
              user: true,
            },
          });
          return { ...element, other_user: otherMessages };
        }),
      );
      // console.log(messages);
      const updatedMessage = bigIntToJson(allMessages);
      return updatedMessage;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  public async getAllMessagesByParentId(id: number) {
    try {
      const messages = await this.prisma.wp_fep_messages.findMany({
        where: {
          OR: [{ mgs_parent: id }, { mgs_id: id }],
        },
        select: {
          mgs_id: true,
          mgs_parent: true,
          mgs_author: true,
          mgs_created: true,
          mgs_title: true,
          mgs_content: true,
          mgs_type: true,
          mgs_status: true,
          mgs_last_reply_by: true,
          // mgs_last_reply_time :true,
          mgs_last_reply_excerpt: true,
          // wp_fep_participants :true,
          wp_fep_messagemeta: true,
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
            },
          },
          wp_fep_attachments: true,
        },
      });

      const allMessages= await Promise.all(
        messages.map(async (message)=>{
          const userImageId= message.wp_nepaz2_users.wp_nepaz2_usermeta.find(meta=> meta.meta_key==="wp_nepaz2_user_avatar")?.meta_value;
          const avatar= userImageId? await this.prisma.wp_posts.findFirst({
            where:{
              post_type:"attachment",
              ID: parseInt(userImageId)
            }
          }):"";
          return {...message, wp_nepaz2_users:{...message.wp_nepaz2_users, avatar}};
        })
      );

      const jsonMessage = bigIntToJson(allMessages);
      return jsonMessage;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async getUsersByKeyword(keyword: string) {
    try {
      const result = await this.prisma.wp_nepaz2_users.findMany({
        where: {
          display_name: {
            contains: keyword,
          },
        },
      });
      const user = bigIntToJson(result);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async createNewMessage(options: {
    body: any;
    files: any;
    id: number;
  }) {
    try {
      const { sentTo, subject, content } = options.body;
      const attachment = options.files.find(
        (item: any) => item.fieldname === "attachment",
      );
      const message = await this.prisma.wp_fep_messages.create({
        data: {
          mgs_parent: 0,
          mgs_author: options.id,
          mgs_title: subject,
          mgs_content: content,
          mgs_type: "message",
          mgs_status: "publish",
          mgs_created: new Date(),
          mgs_last_reply_by: options.id,
          mgs_last_reply_time: new Date(),
          mgs_last_reply_excerpt: content,
        },
      });

      await this.prisma.wp_fep_participants.createMany({
        data: [
          {
            mgs_id: message.mgs_id,
            mgs_participant: options.id,
            mgs_parent_read: 0,
            mgs_read: 0,
            mgs_deleted: 0,
            mgs_archived: 0,
          },
          {
            mgs_id: message.mgs_id,
            mgs_participant: sentTo,
            mgs_parent_read: 0,
            mgs_read: 0,
            mgs_deleted: 0,
            mgs_archived: 0,
          },
        ],
      });

      if (attachment) {
        await this.prisma.wp_fep_attachments.create({
          data: {
            mgs_id: message.mgs_id,
            att_file: `/${attachment.path}`,
            att_mime: attachment.mimetype,
            att_status: "publish",
          },
        });
      }

      return true;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async addMessage(options: { body: any; id: number; files: any }) {
    try {
      const { sentTo, subject, content, parent } = options.body;
      const attachment = options.files.find(
        (item: any) => item.fieldname === "attachment",
      );
      const message = await this.prisma.wp_fep_messages.create({
        data: {
          mgs_parent: parseInt(parent),
          mgs_author: options.id,
          mgs_title: subject,
          mgs_content: content,
          mgs_type: "message",
          mgs_status: "publish",
          mgs_created: new Date(),
          mgs_last_reply_by: options.id,
          mgs_last_reply_time: new Date(),
          mgs_last_reply_excerpt: content,
        },
      });
      await this.prisma.wp_fep_participants.createMany({
        data: [
          {
            mgs_id: message.mgs_id,
            mgs_participant: options.id,
            mgs_parent_read: 0,
            mgs_read: 0,
            mgs_deleted: 0,
            mgs_archived: 0,
          },
          {
            mgs_id: message.mgs_id,
            mgs_participant: sentTo,
            mgs_parent_read: 0,
            mgs_read: 0,
            mgs_deleted: 0,
            mgs_archived: 0,
          },
        ],
      });

      if (attachment) {
        await this.prisma.wp_fep_attachments.create({
          data: {
            mgs_id: message.mgs_id,
            att_file: `/${attachment.path}`,
            att_mime: attachment.mimetype,
            att_status: "publish",
          },
        });
      }

      return true;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  public async getAllUnreadMessage(id: number) {
    try {
      const count = await this.prisma.wp_fep_participants.count({
        where: {
          mgs_participant: id,
          mgs_read: 0,
        },
      });
      return count;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async folowUser({
    userId,
    vendorId,
  }: {
    userId: number;
    vendorId: number;
  }) {
    try {
      const follower =
        await this.prisma.wp_dokan_follow_store_followers.findFirst({
          where: {
            vendor_id: vendorId,
            follower_id: userId,
          },
        });
      //    console.log(userId, follower, vendorId);
      if (!follower) {
        const follow = await this.prisma.wp_dokan_follow_store_followers.create(
          {
            data: {
              vendor_id: vendorId,
              follower_id: userId,
              followed_at: new Date(),
              unfollowed_at: "0000-00-00 00:00:00.000",
            },
          },
        );
        const result = JSONbig.stringify(follow);
        return JSON.parse(result);
      } else {
        throw new Error("you already followed this user");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async unfollowUser({
    userId,
    vendorId,
  }: {
    userId: number;
    vendorId: number;
  }) {
    try {
      const follower =
        await this.prisma.wp_dokan_follow_store_followers.findFirst({
          where: {
            vendor_id: vendorId,
            follower_id: userId,
          },
        });

      if (follower) {
        await this.prisma.wp_dokan_follow_store_followers.delete({
          where: {
            id: follower.id,
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllFollowers(id: number) {
    try {
      const result = await this.prisma.wp_dokan_follow_store_followers.findMany(
        {
          where: {
            vendor_id: id,
            unfollowed_at: "0000-00-00 00:00:00.000",
          },
        },
      );
      const followers = bigIntToJson(result);
      return followers;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllFollowings(id: number) {
    try {
      const result = await this.prisma.wp_dokan_follow_store_followers.findMany(
        {
          where: {
            follower_id: id,
            unfollowed_at: "0000-00-00 00:00:00.000",
          },
        },
      );
      const followers = bigIntToJson(result);
      return followers;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async markAsRead(ids: number[]) {
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        await this.prisma.wp_fep_participants.update({
          where: {
            per_id: id,
          },
          data: {
            mgs_read: 1,
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async bulkAction({ ids, type }: { ids: number[]; type: string }) {
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const data: any = {};
        if (type === "read") {
          data.mgs_read = 1;
        }
        if (type === "unread") {
          data.mgs_read = 0;
        }
        if (type === "delete") {
          data.mgs_deleted = 1;
        }
        if (type === "archive") {
          data.mgs_archived = 1;
        }
        await this.prisma.wp_fep_participants.update({
          where: {
            per_id: id,
          },
          data,
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async markAsUnread(ids: number[]) {
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        await this.prisma.wp_fep_participants.update({
          where: {
            per_id: id,
          },
          data: {
            mgs_read: 0,
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async messageArchived(ids: number[]) {
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        await this.prisma.wp_fep_participants.update({
          where: {
            per_id: id,
          },
          data: {
            mgs_archived: 1,
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async messageDeleted(ids: number[]) {
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        await this.prisma.wp_fep_participants.update({
          where: {
            per_id: id,
          },
          data: {
            mgs_deleted: 1,
          },
        });
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllStoreReview(id: string) {
    try {
      const result = await this.prisma.wp_postmeta.findMany({
        where: {
          meta_key: "store_id",
          meta_value: id,
        },
        select: {
          meta_key: true,
          meta_value: true,
          post: {
            select: {
              post_author: true,
              post_content: true,
              post_title: true,
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
              post_date: true,
              wp_nepaz2_postmeta: {
                where: {
                  meta_key: "rating",
                },
              },
            },
          },
        },
      });

      const products = await Promise.all(
        result.map(async review => {
          const user = review.post.wp_nepaz2_users;
          const userImageId = user.wp_nepaz2_usermeta?.find(
            (meta: any) => meta.meta_key === "wp_nepaz2_user_avatar",
          )?.meta_value;
          const avatar = userImageId
            ? await this.prisma.wp_posts.findUnique({
                where: {
                  ID: parseInt(userImageId),
                  post_type: "attachment",
                },
              })
            : "";
          return { ...review, user: { ...user, avatar } };
        }),
      );

      const totalCount = await this.prisma.wp_postmeta.count({
        where: {
          meta_key: "store_id",
          meta_value: id,
        },
      });

      const ratingCounts = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };
      let ratingSum = 0;
      let totalRatings = 0;
      result.forEach(item => {
        const rating = item?.post?.wp_nepaz2_postmeta[0]?.meta_value
          ? parseInt(item?.post?.wp_nepaz2_postmeta[0]?.meta_value, 10)
          : 0;
        ratingSum += rating;
        totalRatings++;
      });

      const averageRating = ratingSum / totalRatings;

      result.forEach(item => {
        const rating = item.post.wp_nepaz2_postmeta[0].meta_value;
        if (rating && ratingCounts[rating] !== undefined) {
          ratingCounts[rating]++;
        }
      });
      const userReview = bigIntToJson(products);
      return { userReview, ratingCounts, totalCount, averageRating };
    } catch (error) {
      throw new Error(error);
    }
  }
}
