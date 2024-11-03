"use client";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";
// import MultiselectDropdown from "@/components/common/multiselect/page";

import React, { useEffect, useState } from "react";
import DatePickerComponent from "@/components/common/datepicker/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import Limit from "./limit";
import Restriction from "./restriction";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import { Label } from "@headlessui/react/dist/components/label/label";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { Alert, Snackbar } from "@mui/material";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";
export default function EditCoupons() {
  // const tabs = ;
  const [isDisabled] = useState(false);

  const discountTypeArray = [
    { value: "percentage_discount", label: "Percentage Discount" },
    { value: "fixed_product_discount", label: "Fixed Product Discount" },
  ];
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  const [sellerArray, setSellerArray] = useState([]);

  const [couponDetail, setCouponDetail] = useState<any>();

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const getAllSeller = async () => {
    try {
      const response = await AuthApi.getAllVendorsForFilter();
      console.log(response);
      if (response.remote === "success") {
        const dto = response.data.data.map((item: any) => {
          return { label: item.display_name, value: item.id };
        });
        setSellerArray(dto);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSeller();
  }, []);

  const [initialValues, setInitialValue] = useState({
    couponType: "",
    couponCode: "",
    couponAmount: "",
    description: "",
    sellerId: 0,
    minimumSpent: "",
    maximumSpent: "",
    limit: "",
    limitPerItem: "",
    limitPerUser: "",
    expireAt: "",
  });

  const validationSchema = Yup.object({
    couponType: Yup.string().required("Coupon type is required"),
    couponCode: Yup.string().required("Coupon code is required"),
    couponAmount: Yup.string().required("Coupon amount is required"),
    description: Yup.string().required("Description Category is required"),
    minimumSpent: Yup.string().required("Minimum spent is required"),
    maximumSpent: Yup.string().required("Maximum spent is required"),
    limit: Yup.string().required("limit is required"),
    limitPerItem: Yup.string().required("limit per item is required"),
    limitPerUser: Yup.string().required("limit per user is required"),
    expireAt: Yup.string().required("select expire date"),
  });

  const onSubmit = async (values: any) => {
    console.log({ values });
    const payload = {
      couponType: values.couponType,
      couponCode: values.couponCode,
      couponAmount: values.couponAmount,
      description: values.description,
      sellerId: values.sellerId,
      minimumSpent: values.minimumSpent,
      maximumSpent: values.maximumSpent,
      limit: values.limit,
      limitPerItem: values.limitPerItem,
      limitPerUser: values.limitPerUser,
      expireAt: values.expireAt,
      //commission: values.commisionType,
    };
    const response = await UserApi.updateDiscountCouponAPI({
      ...payload,
      id: parseInt(id as string),
    });
    if (response.remote === "success") {
      router.push("/coupons");
      setSnackbar({
        message: "Coupon update Successfully",
        severity: "success",
        open: true,
      });
    } else {
      setSnackbar({
        message: response.error.errors.message || "An error occurred!",
        severity: "error",
        open: true,
      });
    }
  };

  const getCouponDetailById = async () => {
    try {
      const response = await UserApi.getCouponDetailsAPI({
        couponId: parseInt(id as string),
      });
      if (response.remote === "success") {
        console.log(response.data);
        setCouponDetail(response.data.data);
        setInitialValue({
          couponType: response.data.data.coupon_type,
          couponCode: response.data.data.code,
          couponAmount: response.data.data.coupon_amount,
          description: response.data.data.description,
          sellerId: response.data.data.sellerId,
          minimumSpent: response.data.data.minimum_spent,
          maximumSpent: response.data.data.maximum_spent,
          limit: response.data.data.limit,
          limitPerItem: response.data.data.limit_per_item,
          limitPerUser: response.data.data.limit_per_user,
          expireAt: response.data.data.expire_at,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCouponDetailById();
  }, []);

  useEffect(() => {
    if (couponDetail) {
    }
  }, [couponDetail]);

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Add Coupon
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                <div className="flex gap-5">
                  <div className="w-6/12">
                    {" "}
                    <div className="">
                      {" "}
                      {/* <InputComponent className="w-[80%]" label="Code"  /> */}
                      <Field
                        name="couponCode"
                        component={InputComponent}
                        className="w-[80%]"
                        label="Code"
                        // tooltipMessage="The name is how it appears on your site."
                        showTooltip={true}
                        value={values.couponCode}
                        type="text"
                        onChange={(e: any) =>
                          setFieldValue("couponCode", e.target.value)
                        }
                      />
                      <ErrorMessage
                        name="couponCode"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="mt-4">
                      {/* <InputComponent
                        className="w-[80%]"
                        label="Coupon Amount"
                      /> */}
                      <Field
                        name="couponAmount"
                        component={InputComponent}
                        className="w-[80%]"
                        label="Amount"
                        // tooltipMessage="The name is how it appears on your site."
                        showTooltip={true}
                        value={values.couponAmount}
                        type="text"
                        onChange={(e: any) =>
                          setFieldValue("couponAmount", e.target.value)
                        }
                      />
                      <ErrorMessage
                        name="couponAmount"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    {/* <div className="mt-4">
                <div className=" flex items-center">
                  <label
                    className={`block w-44 text-zinc-600 text-sm font-bold  mr-5 items-center `}
                    htmlFor="disable_shipping"
                  >
                    Allow free shipping
                  </label>
                  <input
                    type="checkbox"
                    className=" rounded-sm border text-primaryMain border-slate-200 h-6 w-6 rounded-sm"
                  />
                </div>
                <div className="mt-4 flex items-center">
                  <label
                    className={`block w-44 text-zinc-600 text-sm font-bold  mr-5 items-center `}
                    htmlFor="disable_shipping"
                  >
                    Show on store
                  </label>
                  <input
                    type="checkbox"
                    className=" rounded-sm border text-primaryMain border-slate-200 h-6 w-6 rounded-sm"
                  />
                </div>
              </div> */}
                    <div className="mt-4">
                      <label className="block text-zinc-600 text-sm font-bold mb-1">
                        Description
                      </label>
                      {/* <textarea
                        placeholder="Separate Product Tags with commas"
                        className="min-h-16 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                        rows={3}
                      ></textarea> */}
                      <Field
                        as="textarea"
                        name="description"
                        className="min-h-16 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                        rows={4}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                  <div className="w-6/12 ">
                    {" "}
                    <div className="">
                      <SearchSingleSelect
                        label="Discount Type"
                        isSearchable={true}
                        value={values.couponType}
                        isDisabled={isDisabled}
                        Options={discountTypeArray}
                        onChange={(value) =>
                          setFieldValue("couponType", value.value)
                        }
                      />
                      <ErrorMessage
                        name="couponType"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        className={"block text-zinc-600 text-sm font-bold mb-1"}
                        htmlFor="date"
                      >
                        Coupon Expiry Date
                      </label>
                      <DatePickerComponent
                        handleDateChange={(e: string) => {
                          console.log(e);
                          setFieldValue("expireAt", e);
                        }}
                        value={values.expireAt}
                      />
                      <ErrorMessage
                        name="expireAt"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="mt-4">
                      <SearchSingleSelect
                        label="Seller"
                        isSearchable={true}
                        isDisabled={isDisabled}
                        Options={sellerArray}
                        placeholder="Select Seller"
                        onChange={(value) =>
                          setFieldValue("sellerId", value.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                <TabComponent
                  tabs={[
                    {
                      id: "tab1",
                      label: "Restriction",
                      content: (
                        <div>
                          <Restriction
                            handleMaximumSpendChange={(e: any) =>
                              setFieldValue("maximumSpent", e.target.value)
                            }
                            handleMinimumSpendChnage={(e: any) =>
                              setFieldValue("minimumSpent", e.target.value)
                            }
                            minimumSpent={values.minimumSpent}
                            maximumSpent={values.maximumSpent}
                          />
                        </div>
                      ),
                    },
                    {
                      id: "tab2",
                      label: "Limit",
                      content: (
                        <div>
                          <Limit
                            handleLimit={(e: any) =>
                              setFieldValue("limit", e.target.value)
                            }
                            handleLimitPerItem={(e: any) =>
                              setFieldValue("limitPerItem", e.target.value)
                            }
                            handleLimitPerUser={(e: any) =>
                              setFieldValue("limitPerUser", e.target.value)
                            }
                            limit={values.limit}
                            limitPerItem={values.limitPerItem}
                            limitPerUser={values.limitPerUser}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
                <div className="mt-4 text-end">
                  {/* <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3"
            
            >
              <span className="hidden xs:block">Draft</span>
            </button> */}
                  <button
                    className="btn bg-primaryMain hover:bg-blueTwo text-white"
                    type="submit"
                    // onClick={() => router.push("/add-products")}
                  >
                    <span className="">Submit</span>
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
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
