"use client";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";
// import MultiselectDropdown from "@/components/common/multiselect/page";

import React, { useEffect, useState } from "react";
import DatePickerComponent from "@/components/common/datepicker/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import { useRouter } from "next/navigation";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { Alert, Snackbar } from "@mui/material";
interface COMMISSION {
  commissionFee: string;
  paymentFee: string;
}

export default function CommissionSetting() {
  const [isDisabled] = useState(false);

  const discountTypeArray = [
    { value: "percentage_discount", label: "Percentage Discount" },
    { value: "fixed_product_discount", label: "Fixed Product Discount" },
  ];

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  const [commissionSetting, setCommissionSettings] = useState<any>();

  const formik = useFormik<COMMISSION>({
    initialValues: {
      commissionFee: "",
      paymentFee: "",
    },
    validationSchema: Yup.object({
      commissionFee: Yup.string().required("Required"),
      paymentFee: Yup.string().required("Required"),
    }),
    onSubmit: async (
      values: COMMISSION,
      { setSubmitting }: FormikHelpers<COMMISSION>,
    ) => {
      console.log(values);
      const response: any = await AdminApi.commissionSettings(values);
      if (response.remote === "success") {
        setSnackbar({
          message: "udpate successful!",
          severity: "success",
          open: true,
        });
        // router.push("/manage-faq");
      } else {
        setSnackbar({
          message: response.error.errors.message || "An error occurred!",
          severity: "error",
          open: true,
        });
        console.log({ response });
      }
      setSubmitting(false);
    },
  });

  const getAdminCommissionSetting = async () => {
    try {
      const response = await AdminApi.getAdminCommissionSetting();
      if (response.remote === "success") {
        setCommissionSettings(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminCommissionSetting();
  }, []);

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  useEffect(() => {
    if (commissionSetting) {
      formik.setValues({
        commissionFee: commissionSetting.commission_fee,
        paymentFee: commissionSetting.payment_fee,
      });
    }
  }, [commissionSetting]);

  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Commission Setting
              <svg
                className="shrink-0 h-6 w-6 ms-2"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.445 20.913a1.665 1.665 0 0 1 -1.12 -1.23a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.31 .318 1.643 1.79 .997 2.694"></path>
                <path d="M15 19l2 2l4 -4"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
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
          <form onSubmit={formik.handleSubmit}>
            <div className="flex gap-5">
              <div className="w-6/12">
                {" "}
                <div className="">
                  <InputComponent
                    className="w-[80%]"
                    label="Payment Processing Fee"
                    {...formik.getFieldProps("paymentFee")}
                  />
                  {formik.touched.paymentFee && formik.errors.paymentFee ? (
                    <div className="text-red-600">
                      {formik.errors.paymentFee}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="w-6/12 ">
                <div className="">
                  <InputComponent
                    className="w-[80%]"
                    label="Fizno Commission Fees"
                    {...formik.getFieldProps("commissionFee")}
                  />
                  {formik.touched.commissionFee &&
                  formik.errors.commissionFee ? (
                    <div className="text-red-600">
                      {formik.errors.commissionFee}
                    </div>
                  ) : null}
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
                type="submit"
                // onClick={() => router.push("/add-products")}
              >
                <span className="">Submit</span>
              </button>
            </div>
          </form>
        </div>
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
