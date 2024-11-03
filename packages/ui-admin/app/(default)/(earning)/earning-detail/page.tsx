"use client";
import React, { useEffect, useState } from "react";
import MediumSizeModal from "@/components/common/modal/mediumSizeModal";
import EarningGraph from "./component/earningChart";
import SVG from "@/public/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { GetPaidCard } from "./component/getPaidCard";
import productPic from "@/public/images/fourBox.png";
import Image from "next/image";
import PaginationClassic from "@/components/pagination-classic";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
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

export default function EarningsDetail() {
  const [getPaidNowModalOpen, setGetPaidNowModalOpen] =
    useState<boolean>(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  const [pageIndex, setPageIndex] = useState(1);

  const [orders, setOrders] = useState([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Static values for demo purposes
  const pageSize = 10;
  const totalResults = 95; // Assume 95 items available

  // Sample array of data (could be fetched data)
  const data = Array.from({ length: totalResults }, (_, i) => `Item ${i + 1}`);

  // Get the current page's data
  const currentPageData = data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize,
  );

  const getAllEarnings = async () => {
    try {
      const response = await AdminApi.getSellerEarningById(id as string);
      if (response.remote === "success") {
        console.log(response.data);
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getAllEarnings();
    }
  }, [id]);

  const percentageAmount = (total: string, per: string) => {
    const result = (parseFloat(total) * parseFloat(per)) / 100;
    return result.toFixed(2);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto earning_detail_page">
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
              Robert Fox
            </h1>
          </div>

          {/* Right: Actions */}
        </div>
        <div className="p-5 mb-4 flex gap-5  items-center bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="w-4/12 mr-10 ">
            <GetPaidCard
              // className="h-56"
              availableAmount={234.5}
              pendingAmount={5434.0}
              onGetPaid={() => setGetPaidNowModalOpen(true)}
            />
          </div>
          <div className="w-8/12">
            <EarningGraph />
          </div>
        </div>

        {orders.map((item: any) => {
          return (
            <div
              key={item.id}
              className="mt-8 dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative"
            >
              <div className="bg-[#EDEFEF] flex justify-between py-2 px-3">
                <div className="">
                  <p className="text-[#121212] text-sm font-semibold mb-1">
                    Transaction ID
                  </p>
                  <p className="text-primaryMain text-base font-semibold">
                    #12345
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-[#121212] text-sm font-semibold mb-1">
                    Order ID
                  </p>
                  <p className="text-primaryMain text-base font-semibold">
                    {item.order.ID}
                  </p>
                </div>
              </div>
              <div className="py-2 px-3 ">
                <div className="flex">
                  <Image
                    src={productPic}
                    alt=""
                    height={68}
                    width={68}
                    className="w-[68px] h-[68px] border border-[#C7C7C7] rounded-[3px]"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-semibold  text-[#2B2B2B]">
                      Buyer
                    </p>
                    <p className="text-sm font-semibold  text-primaryMain">
                      {
                        item.order.wp_wc_order_product_lookup_order[0]?.user
                          .display_name
                      }
                    </p>

                    <p className="text-sm font-semibold  text-[#2B2B2B]">
                      {moment(item.order.post_date).format("DD-MMM-YYYY")}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-xs text-[#666666] py-2">
                  Delivery Date:
                  <span className="font-medium">
                    {" "}
                    {moment(item.order.post_date).format("DD-MMM-YYYY")}
                  </span>
                </p>
                <div className="rounded-[6px] border border-[#306CB580] p-3">
                  <h4 className="text-[#1D1F1F] font-bold text-sm">Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between w-full mt-2">
                      <div className="">
                        <p className="text-sm text-[#5D5F5F] font-semibold">
                          Order Total{" "}
                          <span className="text-primaryMain ml-1 font-normal">
                            (
                            {
                              item.order.wp_wc_order_product_lookup_order[0]
                                .product_qty
                            }{" "}
                            items)
                          </span>
                        </p>
                      </div>
                      <p className="text-sm text-[#1D1F1F] font-semibold">
                        ${item.order_total}
                      </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="">
                        <p className="font-bold text-black mb-1">
                          Fizno collected from Buyer
                        </p>
                        <p className="font-semibold text-[#5D5F5F] ">
                          Sales Tax
                        </p>
                      </div>
                      <p className="text-[#E54B4D] text-sm font-bold">-$0</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="">
                        <p className="font-bold text-black mb-1">Expenses</p>
                        <p className="font-semibold text-[#5D5F5F]">
                          Fizno fee ({item.commission_fee}%)
                        </p>
                      </div>
                      <p className="text-[#E54B4D] text-sm font-bold">
                        -$
                        {percentageAmount(
                          item.order_total,
                          item.commission_fee,
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="">
                        <p className="font-bold text-[#5D5F5F] mb-1">
                          Payment processing fee ({item.payment_fee})
                        </p>
                        <p className="font-semibold text-[#5D5F5F]">
                          Shipping label
                        </p>
                      </div>
                      <p className="text-[#E54B4D] text-sm font-bold">
                        -${" "}
                        {percentageAmount(item.order_total, item.payment_fee)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-[#E3E3E3] pt-2 mt-1">
                    <div className="flex justify-between w-full items-center">
                      <p className="text-[#5D5F5F] text-base font-normal">
                        Total earnings
                      </p>

                      <p className="font-bold text-[22px] text-primaryMain">
                        ${item.earning}
                      </p>
                    </div>{" "}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Pagination */}
        <div className="mt-8">
          <PaginationClassic
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalResults={totalResults}
            setPageIndex={setPageIndex}
          />
        </div>
      </div>
    </>
  );
}
