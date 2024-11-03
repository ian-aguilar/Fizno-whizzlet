"use client";
import React, { useEffect, useState } from "react";

// export const metadata = {
//   title: "Customers - Mosaic",
//   description: "Page description",
// };

import { SelectedItemsProvider } from "@/app/selected-items-context";
import PaginationClassic from "@/components/pagination-classic";
import { useRouter } from "next/navigation";
import CouponsTable from "./coupons-table";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import moment from "moment";

function CouponsContent() {
  const router = useRouter();
  // Some dummy customers data
  const [coupons, setCoupons] = useState([]);

  const getAllCoupons = async () => {
    try {
      const response = await AdminApi.getAllCoupons();
      if (response.remote === "success") {
        console.log(response);
        const dto = response.data.data.map((item: any) => {
          return {
            id: item.id,
            code: item.code,
            type: item.coupon_type,
            amount: item.coupon_amount,
            expiryDate: moment(item.expire_at).format("MMM DD, YYYY"),
            usageLimit: item.limit,
          };
        });
        setCoupons(dto);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Coupons
            <svg
              className="shrink-0 h-6 w-6 ms-2"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeWidth="2"
                d="M3,11 L21,11 L21,23 L3,23 L3,11 Z M2,11 L2,7 L22,7 L22,11 L2,11 Z M12,23 L12,7 L12,23 Z M7,7 L12,7 C12,7 10,2 7,2 C3.5,2 3,7 7,7 Z M17.1843819,7 L12.1843819,7 C12.1843819,7 14,2 17.1843819,2 C20.5,2 21.1843819,7 17.1843819,7 Z"
              ></path>
            </svg>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Delete button */}
          <button
            className="btn bg-primaryMain hover:bg-blueTwo text-white"
            onClick={() => router.push("/add-coupons")}
          >
            <span className="hidden xs:block ">Add Coupon</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <CouponsTable coupons={coupons} />

      {/* Pagination */}
      <div className="mt-8">{/* <PaginationClassic /> */}</div>
    </div>
  );
}

export default function Coupons() {
  return (
    <SelectedItemsProvider>
      <CouponsContent />
    </SelectedItemsProvider>
  );
}
