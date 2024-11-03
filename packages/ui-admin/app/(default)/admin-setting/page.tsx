"use client";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";
// import MultiselectDropdown from "@/components/common/multiselect/page";

import React, { useState } from "react";
import DatePickerComponent from "@/components/common/datepicker/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import { useRouter } from "next/navigation";

export default function AdminSetting() {
  const [isDisabled] = useState(false);

  const discountTypeArray = [
    { value: "percentage_discount", label: "Percentage Discount" },
    { value: "fixed_product_discount", label: "Fixed Product Discount" },
  ];

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Admin Setting
              <svg
                className="shrink-0 h-6 w-6 ms-2"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M262.29 192.31a64 64 0 1 0 57.4 57.4 64.13 64.13 0 0 0-57.4-57.4zM416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22 155.3 155.3 0 0 1-21.46-12.57 16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22 155.3 155.3 0 0 1 21.46 12.57 16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47z"
                ></path>
              </svg>
            </h1>
          </div>
          <button
            className="btn bg-primaryMain hover:bg-blueTwo text-white"
            onClick={() => handleBack()}
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
              </svg>
              Back
            </span>
          </button>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="flex gap-5">
            <div className="w-6/12">
              {" "}
              <div className="">
                <InputComponent className="w-[80%]" label="SMTP Host" />
              </div>
              <div className="mt-4">
                <InputComponent className="w-[80%]" label="SMTP Port" />
              </div>
            </div>
            <div className="w-6/12 ">
              <div className="">
                <InputComponent className="w-[80%]" label="SMTP User" />
              </div>
              <div className="mt-4">
                <InputComponent className="w-[80%]" label="SMTP Password" />
              </div>
            </div>
          </div>
          <div className="mt-4 text-end">
            {/* <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3"
            
            >
              <span className="hidden xs:block">Draft</span>
            </button> */}
            <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white"
              // onClick={() => router.push("/add-products")}
            >
              <span className="">Submit</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
