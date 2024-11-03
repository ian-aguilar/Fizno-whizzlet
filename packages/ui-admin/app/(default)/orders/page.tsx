"use client";

// export const metadata = {
//   title: "Customers - Mosaic",
//   description: "Page description",
// };
import React, { useEffect, useState } from "react";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import PaginationClassic from "@/components/pagination-classic";

import Image01 from "@/public/images/product1.png";
// import Image02 from "@/public/images/product2.jpg";
// import Image03 from "@/public/images/product3.jpg";
import { useRouter } from "next/navigation";
import OrderTable from "./order-table";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import moment from "moment";

function OrderContent() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  // Some dummy customers data
  const [orders, setOrders] = useState([]);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [seller, setSeller] = useState<number | null>(null);
  const [customer, setCUstomer] = useState<number | null>(null);

  const getAllOrders = async () => {
    try {
      const response = await AdminApi.getAllOrdersApi({
        pageSize,
        pageIndex,
        seller,
        customer,
      });
      if (response.remote === "success") {
        const dto = response.data.data.map((order: any) => {
          return {
            id: order.ID,
            image: Image01,
            itemName: "YFZ 450R Shock 2014-2015",
            orderId: order.ID,
            purchased: order.wp_wc_order_product_lookup_order.length,
            orderItems: order.wp_wc_order_product_lookup_order,
            address: order.wp_nepaz2_postmeta.find(
              (meta: any) => meta.meta_key === "_shipping_address_index",
            )?.meta_value,
            sales: `$${
              order.wp_nepaz2_postmeta.find(
                (meta: any) => meta.meta_key === "_order_total",
              )?.meta_value
            }`,
            earning: `$${order.seller_earning[0]?.earning || 0}`,
            date: moment(order.post_date).format("MMM DD, YYYY"),
            status: order.post_status,
            shippedDate: "--",
          };
        });
        setOrders(dto);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Orders
            <svg
              className="shrink-0 h-6 w-6 ms-2"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M448 341.37V170.61A32 32 0 0 0 432.11 143l-152-88.46a47.94 47.94 0 0 0-48.24 0L79.89 143A32 32 0 0 0 64 170.61v170.76A32 32 0 0 0 79.89 369l152 88.46a48 48 0 0 0 48.24 0l152-88.46A32 32 0 0 0 448 341.37z"
              ></path>
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="m69 153.99 187 110 187-110m-187 310v-200"
              ></path>
            </svg>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Delete button */}
          <button
            className="btn  bg-primaryMain hover:bg-blueTwo text-white mr-3"
            onClick={() => handleBack()}
          >
            <span className="flex items-center">
              <svg
                className="mr-2"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="48"
                  d="M244 400 100 256l144-144M120 256h292"
                ></path>
              </svg>
              Back
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <OrderTable orders={orders} />

      {/* Pagination */}
      <div className="mt-8">
        <PaginationClassic
          pageIndex={0}
          pageSize={0}
          totalResults={0}
          setPageIndex={function (pageIndex: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}

export default function Orders() {
  return (
    <SelectedItemsProvider>
      <OrderContent />
    </SelectedItemsProvider>
  );
}
