/* eslint-disable prettier/prettier */
"use client";
import React, { useState, useEffect } from "react";
import CounterCard, { CounterCardProps } from "./component/counterCard";
import { useRouter, useSearchParams } from "next/navigation";
import AccordionBasic from "@/components/accordion-basic";
import TextEditor from "@/components/common/textEditor/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import InputComponent from "@/components/common/inputField/page";
import Capabilities from "./component/capabilities";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import RoundedLoader from "@/components/common/loader/roundedLoader";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { Alert, Snackbar } from "@mui/material";

export default function CustomerDetails() {
  const cardData: CounterCardProps[] = [
    {
      iconSrc: "/images/money.svg",
      editMenuAlign: "right",
      title: "Gross sales in this month",
      amount: "$0",
      percentage: "+0%",
    },
    {
      iconSrc: "/images/order.svg",
      editMenuAlign: "left",
      title: "Earnings in this month",
      amount: "$0",
      percentage: "+0%",
    },
    {
      iconSrc: "/images/order.svg",
      editMenuAlign: "left",
      title: "Total products posted",
      amount: "0",
      // percentage: "+15%",
    },
    {
      iconSrc: "/images/order.svg",
      editMenuAlign: "left",
      title: "Sold in this month",
      amount: "0",
      // percentage: "+15%",
    },
  ];
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const getUserDetail = async () => {
    try {
      setLoading(true);
      const response = await AuthApi.getUserById(id as string);
      if (response.remote === "success") {
        console.log(response.data);
        setUser(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    getUserDetail();
  }, []);
  const upgradeArray = [
    { value: "join", label: "Join us Today" },
    { value: "enhanched", label: "Enhanched Membership" },
    { value: "basic", label: "Basic Membership" },
  ];

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const getMetaValue = (key: string) => {
    const value = user?.wp_nepaz2_usermeta.find(
      (meta: any) => meta.meta_key === key,
    )?.meta_value;
    return value;
  };

  const disableSeller = async () => {
    try {
      if (id) {
        const response = await AdminApi.updateUserStatus(
          { status: 1 },
          parseInt(id),
        );
        if (response.remote === "success") {
          setSnackbar({
            message: "update status Successfully",
            severity: "success",
            open: true,
          });
          router.back();
        } else {
          setSnackbar({
            message: "something went wrong",
            severity: "error",
            open: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <RoundedLoader />
  ) : (
    <>
      <div className="mt-8 mx-8 px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
        {" "}
        <div className="sm:flex sm:justify-between sm:items-center">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-md md:text-3xl text-primaryMain dark:text-slate-100 font-semibold">
              Seller Details Title
            </h1>
          </div>
          <div className="">
            {/* <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white"
              onClick={() => router.push("/add-customer")}
            >
              <span className="flex items-center">Add</span>
            </button>
            <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
              onClick={() => router.push("/edit-customer")}
            >
              <span className="flex items-center">Edit</span>
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
                  Store Admin
                </label>
                <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {getMetaValue("dokan_profile_settings")?.store_name}
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  Email
                </label>
                <p className="py-1 rounded-sm border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {user.user_email}
                </p>
              </div>
            </div>
            <div className="w-6/12">
              {" "}
              <div>
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  Phone
                </label>
                <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {getMetaValue("dokan_profile_settings")?.phone_number}
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                  Address
                </label>
                <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  {getMetaValue("dokan_profile_settings")?.address.street_1}{" "}
                  {", "}
                  {getMetaValue("dokan_profile_settings")?.address.city} {", "}
                  {getMetaValue("dokan_profile_settings")?.address.state} {", "}
                  {getMetaValue("dokan_profile_settings")?.address.country}
                </p>
              </div>
            </div>
          </div>
          <div className="text-end mt-4">
            {" "}
            <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
              onClick={() => disableSeller()}
            >
              <span className="flex items-center">Disable Account</span>
            </button>
          </div>
        </div>
        {/* <div className="bg-white mt-8">
          <AccordionBasic title="Profile">
            <div className="">
              {" "}
              <div className="flex gap-5">
                <div className="w-6/12">
                  <div className="">
                    {" "}
                    <div className="">
                      <InputComponent label="First Name" />
                    </div>
                  </div>
                </div>
                <div className="w-6/12">
                  {" "}
                  <div className="">
                    <InputComponent label="Last Name" />
                  </div>
                </div>
              </div>
              <h5 className="text-primaryMain font-bold mt-5">Capability</h5>
              <div className="mt-2 flex items-center">
                <label
                  className="`block text-zinc-600 text-sm font-bold  mr-5 items-center "
                  htmlFor="disable_purchase_during_vacation"
                >
                  Custom Capability
                </label>
                <input
                  type="checkbox"
                  className=" rounded-sm border border-slate-200 h-6 w-6 rounded-sm dark:bg-[rgb(18,18,18)]  dark:border-slate-700"
                  onChange={handleCheckboxChange}
                />
              </div>
              {isChecked && (
                <div className="mt-4 bg-white">
                  <AccordionBasic title="Capabilities">
                    <div className="">
                      <Capabilities />
                    </div>
                  </AccordionBasic>
                </div>
              )}
              <div className="text-end mt-4">
                {" "}
                <button
                  className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
                  onClick={() => router.push("#")}
                >
                  <span className="flex items-center">Update</span>
                </button>
              </div>
            </div>
          </AccordionBasic>
        </div>
        <div className="mt-8 bg-white">
          <AccordionBasic title="Membership">
            <div className="">
              <h5 className="text-primaryMain font-bold">
                Vendor not yet subscribed for membership!
              </h5>{" "}
              <h5 className="text-primaryMain font-bold mt-7">
                Additional Info
              </h5>{" "}
              <div className="mt-7 w-6/12">
                <SearchSingleSelect
                  label="Change or Upgrade"
                  Options={upgradeArray}
                />
              </div>
              <div className="text-end mt-4">
                {" "}
                <button
                  className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
                  onClick={() => router.push("#")}
                >
                  <span className="flex items-center">Update</span>
                </button>
              </div>
            </div>
          </AccordionBasic>
        </div>
        <div className="mt-8 bg-white">
          <AccordionBasic title="Verification">
            <div className="">
              <div className="flex gap-5 mt-4">
                <div className="w-6/12">
                  <h5 className="text-primaryMain font-bold">
                    Identity Details
                  </h5>{" "}
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      Store Admin
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – (#24 - 310BoltGuy)
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      Email
                    </label>
                    <p className="py-1 rounded-sm border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      301boltguy@gmail.com
                    </p>
                  </div>
                </div>
                <div className="w-6/12">
                  <h5 className="text-primaryMain font-bold">
                    Address Details
                  </h5>{" "}
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      Street
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – - -
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      Street 2
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – - -
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      City/Town
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – - -
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      Postcode/Zip
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – - -
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      Country
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – - -
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-zinc-600 text-sm font-bold mb-1 flex  w-[80%]">
                      State
                    </label>
                    <p className="py-1 rounded-sm  border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                      – – - -
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="flex text-zinc-600 text-sm font-bold mb-1">
                  Note to Vendor <span className=" ml-1 text-red-500">*</span>
                </label>
                <textarea
                  className="min-h-16 py-1 px-2 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                  rows={4}
                  placeholder="Add some note ..."
                />
              </div>
              <div className="text-end mt-4">
                {" "}
                <button
                  className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
                  onClick={() => router.push("#")}
                >
                  <span className="flex items-center">Mark Approved</span>
                </button>
              </div>
            </div>
          </AccordionBasic>
        </div>
        <div className="mt-8 bg-white">
          <AccordionBasic title="Badges">
            <div className="">
              <p>There is no custom yet for this Vendor!</p>
            </div>
            <div className="text-end mt-4">
              {" "}
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
                onClick={() => router.push("#")}
              >
                <span className="flex items-center">Update</span>
              </button>
            </div>
          </AccordionBasic>
        </div>
        <div className="mt-8 bg-white">
          <AccordionBasic title="Send Message">
            <div className="">
              <TextEditor label=" Message" />
            </div>
            <div className="text-end mt-4">
              {" "}
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white ml-3"
                onClick={() => router.push("#")}
              >
                <span className="flex items-center">Send</span>
              </button>
            </div>
          </AccordionBasic>
        </div> */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
