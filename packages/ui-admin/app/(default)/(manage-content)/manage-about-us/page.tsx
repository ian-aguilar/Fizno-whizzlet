"use client";
import React from "react";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";
import MultiselectDropdown from "@/components/common/multiselect/page";
// import MultiselectDropdown from "@/components/common/multiselect/page";
import SelectComponent from "@/components/common/select/page";
import TextEditor from "@/components/common/textEditor/page";
import { useState } from "react";
import DatePickerComponent from "@/components/common/datepicker/page";
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { useRouter } from "next/navigation";
import SVG from "@/public/svg";

export default function ManageAboutUs() {
  const categoriesArray = [
    { cat: "ATV", key: "ATV" },
    { cat: "Dirt Bike", key: "Dirt Bike" },
    { cat: "Motorcycle", key: "Motorcycle" },
    { cat: "Other", key: "Other" },
    { cat: "Toys & Hobbies", key: "Toys & Hobbies" },
    { cat: "Uncategorized", key: "Uncategorized" },
    { cat: "Utility ATV", key: "Utility ATV" },
    { cat: "UTV", key: "UTV" },
  ];
  const subCategoriesArray = [
    { cat: "ATV", key: "ATV" },
    { cat: "Dirt Bike", key: "Dirt Bike" },
    { cat: "Motorcycle", key: "Motorcycle" },
    { cat: "Other", key: "Other" },
    { cat: "Toys & Hobbies", key: "Toys & Hobbies" },
    { cat: "Uncategorized", key: "Uncategorized" },
    { cat: "Utility ATV", key: "Utility ATV" },
    { cat: "UTV", key: "UTV" },
  ];
  const conditionArray = [
    { cat: "NEW", key: "NEW" },
    { cat: "OPEN BOX", key: "NEW - OPEN BOX" },
    { cat: "USED", key: "USED" },
    { cat: "REPAIR", key: "USED - PARTS/REPAIR" },
  ];
  const productArray = [
    { cat: "simple_product", key: "Simple Product" },
    { cat: "variable_product", key: "Variable Product" },
    // { cat: "external_product", key: "External/Affliate Product" },
    // { cat: "REPAIR", key: "USED - PARTS/REPAIR" },
  ];
  const brandsArray = [
    { cat: "brandOne", key: "BrandOne" },
    { cat: "brandTwo", key: "BrandTwo" },
    { cat: "brandThree", key: "BrandThree" },
    { cat: "brandFour", key: "BrandFour" },
  ];

  const [showSchedule, setShowSchedule] = useState(false);
  const [fileUploadComponents, setFileUploadComponents] = useState<
    JSX.Element[]
  >([<SingleUploadComponent key={0} type="add" />]);

  const handleAddFileUpload = () => {
    // Add a new instance of FileUploadComponent to the array
    setFileUploadComponents([
      ...fileUploadComponents,
      <SingleUploadComponent key={fileUploadComponents.length} type="add" />,
    ]);
  };

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [showAddMediaInput, setShowAddMediaInput] = useState(false);
  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Manage About Us
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
          <div className="gap-5">
            <div className="flex gap-5">
              <div className="">
                <label className="block text-zinc-600 text-sm font-bold mb-1  w-full">
                  Banner Image
                </label>
                <SingleUploadComponent />
              </div>
              <div className="">
                <label className="block text-zinc-600 text-sm font-bold mb-1  w-full">
                  About Us Image
                </label>
                <SingleUploadComponent />
              </div>
            </div>
            <div className="w-12/12">
              <div className="mt-4">
                {" "}
                <InputComponent className="w-full" label="Title" />
              </div>

              <div className="mt-4">
                <label
                  className={"block text-zinc-600 text-sm font-bold mb-1"}
                  htmlFor="date"
                >
                  Our Mission
                </label>

                <TextEditor className="w-full " label="" />
              </div>
              <div className="mt-4">
                <label
                  className={"block text-zinc-600 text-sm font-bold mb-1"}
                  htmlFor="date"
                >
                  Why Fizno?
                </label>

                <TextEditor className="w-full " label="" />
              </div>
              <div className="mt-4">
                <label
                  className={"block text-zinc-600 text-sm font-bold mb-1"}
                  htmlFor="date"
                >
                  How Does It Work?
                </label>

                <TextEditor className="w-full " label="" />
              </div>
            </div>
            <div className="mt-4 text-end">
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white px-6"
                // onClick={() => router.push("/add-products")}
              >
                <span className="hidden xs:block ">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
