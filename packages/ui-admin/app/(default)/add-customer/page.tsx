"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputComponent from "@/components/common/inputField/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import TooltipCustom from "@/components/common/tooltip/tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";

export default function AddCustomer() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<any>("success");
  const [loading, setLoading] = useState(false);

  const roleArray = [
    { value: "customer", label: "Customer" },
    { value: "seller", label: "Seller" },
  ];

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      website: "",
      password: "",
      role: "",
      sendNotification: false,
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      website: Yup.string().url("Invalid URL").required("Required"),
      password: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const response = await AuthApi.addUser({
        userName: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        website: values.website,
        password: values.password,
        role: values.role,
      });
      setLoading(false);

      if (response.remote === "success") {
        setSeverity("success");
        setMessage("User created successfully");
        setOpen(true);
        router.push("/customer");
      } else {
        setSeverity("error");
        setMessage("Error creating user");
        setOpen(true);
      }
    },
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Add Customer
            <svg
              className="shrink-0 h-6 w-6 ms-2"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
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
          <div className="grid grid-cols-2 gap-5 ">
            <div className="w-full">
              <InputComponent
                className="w-[80%]"
                label="User Name"
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && formik.errors.username}
              />
            </div>
            <div className="w-full">
              <InputComponent
                className="w-[80%]"
                label="Email"
                type="text"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />
            </div>
            <div className="w-full">
              <InputComponent
                className="w-[80%]"
                label="First Name"
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
              />
            </div>
            <div className="w-full">
              <InputComponent
                className="w-[80%]"
                label="Last Name"
                type="text"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
              />
            </div>
            <div className="w-full">
              <InputComponent
                className="w-[80%]"
                label="Website"
                type="text"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.website && formik.errors.website}
              />
            </div>
            <div className="w-full">
              <InputComponent
                className="w-[80%]"
                label="Password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
            </div>
            <div className="w-full">
              <SearchSingleSelect
                label="Role"
                Options={roleArray}
                name="role"
                value={formik.values.role}
                onChange={(option) => {
                  formik.setFieldValue("role", option);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.role && formik.errors.role}
              />
            </div>
            <div className="mt-4 flex items-center">
              <label
                className="flex text-zinc-600 text-sm font-bold mr-5 items-center"
                htmlFor="sendNotification"
              >
                Send User Notification
                <TooltipCustom bg="light" className="ms-2">
                  <div className="text-[10px] font-normal text-slate-900 min-w-52">
                    Send the new user an email about their account.
                  </div>
                </TooltipCustom>
              </label>
              <input
                type="checkbox"
                name="sendNotification"
                checked={formik.values.sendNotification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded-sm border border-slate-200 h-6 w-6 dark:bg-[rgb(18,18,18)] dark:border-slate-700"
              />
            </div>
          </div>
          <div className="mt-8 text-end">
            <button
              type="submit"
              className="btn bg-primaryMain hover:bg-blueTwo text-white"
              onClick={() => {
                formik.handleSubmit();
              }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity || "info"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
