/* eslint-disable prettier/prettier */
"use client";
import React, { useEffect, useState } from "react";
import CounterCard, { CounterCardProps } from "./component/counterCard";
import InputComponent from "@/components/common/inputField/page";
import CustomerOrderPage from "./component/orderComponent";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";

export default function CustomerDetails() {
  const cardData: CounterCardProps[] = [
    {
      iconSrc: "/images/money.svg",
      editMenuAlign: "right",
      title: "Total Money Spent",
      amount: "$0",
      percentage: "0%",
    },
    {
      iconSrc: "/images/order.svg",
      editMenuAlign: "left",
      title: "Total Order Placed",
      amount: "0",
      percentage: "0%",
    },
  ];
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<any>({});
  const handleGetUserById = async (id: string) => {
    setLoading(true);
    const response = await AuthApi.getUserById(id);
    if (response.remote === "success") {
      console.log(response);
      setUserDetail(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(id);
    if (id) {
      handleGetUserById(id);
    }
  }, [id]);
  return (
    <>
      <div className="mt-8 mx-8 px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
        {" "}
        <div className="sm:flex sm:justify-between sm:items-center">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-md md:text-3xl text-primaryMain dark:text-slate-100 font-semibold">
              Customer Details
            </h1>
          </div>
          <div className="">
            {/* <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white"
              onClick={() => router.push("/add-customer")}
            >
              <span className="flex items-center">Add</span>
            </button> */}
            <button
              className="ml-3 btn bg-primaryMain hover:bg-blueTwo text-white"
              onClick={() => router.back()}
            >
              <span className="flex items-center">
                <svg
                  className="mr-1"
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path>
                </svg>{" "}
                Back
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="my-8 mx-8">
        <div className="flex justify-center gap-8 ">
          {cardData.map((card, index) => (
            <div className="w-3/12" key={index}>
              <CounterCard key={index} {...card} />
            </div>
          ))}
        </div>
      </div>
      <div className="my-8 mx-8">
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="flex gap-5 mt-4">
            <div className="w-6/12">
              {" "}
              <div>
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  First Name
                </label>
                <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {
                    userDetail.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key === "first_name",
                    ).meta_value
                  }
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  Email
                </label>
                <p className="py-1 rounded-sm border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {userDetail.user_email}
                </p>
              </div>
            </div>
            <div className="w-6/12">
              {" "}
              <div>
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  Last Name
                </label>
                <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {
                    userDetail.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key === "last_name",
                    ).meta_value
                  }
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  Company Name
                </label>
                <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  amazon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <CustomerOrderPage />
      </div>
    </>
  );
}
