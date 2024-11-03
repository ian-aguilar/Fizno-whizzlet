"use client";
import React, { useState, useEffect } from "react";
import MediumSizeModal from "@/components/common/modal/mediumSizeModal";
import SVG from "@/public/svg";
import { useRouter, useSearchParams } from "next/navigation";
import productPic from "@/public/images/fourBox.png";
import Image from "next/image";
import { Avatar } from "@mui/material";
import InputComponent from "@/components/common/inputField/page";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import RoundedLoader from "@/components/common/loader/roundedLoader";
import moment from "moment";
export interface Earning {
  id: number;
  orderId: string;
  transactionId: string;
  buyer: string;
  amount: string;
  netEarning: string;
  date: string;
  totalItems: number;
  salesTax: string;
  fiznoFees: string;
  processFees: string;
  orderTotal: string;
}

export default function ReviewDetail() {
  const [getPaidNowModalOpen, setGetPaidNowModalOpen] =
    useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [review, setReview] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(productPic);
  const getReviewDetail = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.getReviewDatailById(id as string);
      if (response.remote === "success") {
        console.log(response.data);
        setReview(response.data.data);
        setImage(
          response.data.data.posts.attachments[0]?.guid.includes("http")
            ? response.data.data.posts.attachments[0]?.guid
            : response.data.data.posts.attachments[0]?.guid
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.data.posts.attachments[0]?.guid}`
              : productPic,
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviewDetail();
  }, []);

  const handleBack = () => {
    router.back();
  };
  return loading ? (
    <RoundedLoader />
  ) : (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto earning_detail_page bg-white min-h-screen">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0 flex">
            <button
              className="bg-[#EFEFEF] h-[36px] w-[38px] mr-2 flex justify-center items-center"
              onClick={() => handleBack()}
            >
              <SVG.leftArrow />
            </button>
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Review Details
            </h1>
          </div>

          {/* Right: Actions */}
        </div>
        <div className="mt-8 dark:bg-slate-800 rounded-sm dark:border-slate-700 relative">
          <div className="py-2 border-b border-slate-200 flex justify-between">
            <div className="flex items-center">
              <Image
                src={image}
                alt=""
                height={68}
                width={68}
                className="w-[116px] h-[116px] border border-[#C7C7C7] rounded-[3px]"
                onError={() => setImage(productPic)}
              />
              <div className="ml-4">
                <p className="text-[18px] font-semibold  text-[#2B2B2B]">
                  {review.posts.post_title}
                </p>
                <p className="text-[16px] font-semibold  text-[#2b2b2b]">
                  Seller:
                  <span className="text-primaryMain">
                    {review.posts.wp_nepaz2_users.display_name}
                  </span>
                </p>
              </div>
            </div>
            {/* <ul className="flex items-center">
              <li className="border-r border-black text-[#666666] text-base font-semibold text-center px-3 normal-case">
                <p>1.3k</p>
                <p>Listings</p>
              </li>
              <li className="border-r border-black text-[#666666] text-base font-semibold text-center px-3 normal-case">
                <p>900</p>
                <p>Following</p>
              </li>
              <li className=" border-black text-[#666666] text-base font-semibold text-center px-3 normal-case">
                <p>500</p>
                <p>Items Sold</p>
              </li>
            </ul> */}
          </div>

          <div>
            {/* <h4 className="mt-6 font-bold text-2xl normal-case text-[#344054]">
              Reviews
            </h4>

            <div className="flex gap-5 mt-5">
              <div className="w-4/12 bg-gray-50 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl font-bold text-[#164C96] text-center">
                    4.8
                  </p>

                  <div className="flex gap-1 my-1 justify-center">
                    <SVG.yellowStar />
                    <SVG.yellowStar />
                    <SVG.yellowStar />
                    <SVG.yellowStar />
                    <SVG.yellowStar />
                  </div>
                  <p className="my-2 normal-case">Product Rating</p>
                </div>
              </div>
              <div className="w-8/12 bg-gray-50 rounded-md py-4 px-10 space-y-3">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-x-6 items-center justify-between"
                  >
                    <div className="w-9/12">
                      <div className="relative w-full h-[5px] bg-slate-200 rounded-md">
                        <div
                          className="absolute inset-0 bg-primaryMain rounded-md"
                          aria-hidden="true"
                          style={{ width: "20%" }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 my-1 justify-center">
                      {[1, 2, 3, 4, 5].map(
                        (item) => (
                          // item <= el.rating ? (
                          <SVG.yellowStar key={item} />
                        ),
                        // ) : (
                        //   <SVG.GreyStar key={item} />
                        // ),
                      )}
                    </div>
                    <div className="w-10 mb-0 text-primaryMain font-medium text-base text-end">
                      80%
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            <div className="mt-4">
              <h4 className="font-semibold text-2xl normal-case text-[#1D2939]">
                Review
              </h4>
              <div className="review_card gap-4 normal-case py-2 mt-4">
                {[1].map((item: any) => (
                  <div
                    className="flex mb-4 border-b border-slate-200 pb-4"
                    key={item?.comment_ID}
                  >
                    <div className=" mr-3">
                      <Avatar
                        s---rc={item?.user?.avatar?.guid}
                        style={{ width: "50px", height: "50px" }}
                      >
                        AK
                      </Avatar>
                    </div>
                    <div className="">
                      <div className="flex items-center">
                        <p className="font-semibold text-[#1D2939] text-[20px]">
                          {review.user.display_name}
                        </p>

                        <span className="font-normal text-xs text-gray-400 ml-3">
                          {/* {moment(item?.comment_date).format("MM-DD-YYYY")} */}
                          {moment(review.comment_date).format("MMM, DD YYYY")}
                        </span>
                      </div>
                      <div className="flex gap-1 my-1 ">
                        {[1, 2, 3, 4, 5]
                          .slice(
                            0,
                            parseInt(review.wp_commentmeta[0].meta_value),
                          )
                          .map(
                            (item) => (
                              // item <= el.rating ? (
                              <SVG.yellowStar key={item} />
                            ),
                            // ) : (
                            //   <SVG.GreyStar key={item} />
                            // ),
                          )}
                      </div>
                      <p className="font-medium text-primaryMain text-[18px] ">
                        {review.comment_title}
                      </p>
                      <p className="font-normal text-gray-500 text-[15px] ">
                        {review.comment_content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* <p className="cursor-pointer text-[#D94A27] text-base mt-2 normal-case underline">
          View All Reviews
        </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
