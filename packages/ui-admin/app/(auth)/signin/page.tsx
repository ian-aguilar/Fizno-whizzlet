"use client";
import Link from "next/link";
import AuthHeader from "../auth-header";
import AuthImage from "../auth-image";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@fizno/ui-core/src/redux/hooks";
import {
  globalCacheStateSelector,
  setAlertMessage,
  setPreLoader,
} from "@fizno/ui-core/src/redux/slices/globaCache.slice";
import { ButtonLoader } from "@/components/common/loader/buttonLoader";
interface SignInValues {
  email: string;
  password: string;
}

function SignIn() {
  /**
   * router
   */

  const router = useRouter();

  /**
   * redux
   */

  const dispatch = useAppDispatch();
  const { preLoader } = useAppSelector(globalCacheStateSelector);

  // reset alert message
  const handleResetAlert = () =>
    setTimeout(() => {
      dispatch(
        setAlertMessage({ open: false, message: "", severity: "error" }),
      );
    }, 5000);

  /**
   * formik
   */

  const formik = useFormik<SignInValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required"),
      password: Yup.string()
        .required("Required")
        .min(8, "Password must be at least 8 characters"),
    }),
    onSubmit: async (
      values: SignInValues,
      { setSubmitting }: FormikHelpers<SignInValues>,
    ) => {
      dispatch(setPreLoader(true));
      const response: any = await AuthApi.adminLogin(values);
      if (response.remote === "success") {
        dispatch(setPreLoader(false));
        dispatch(
          setAlertMessage({
            message: "Login successful!",
            severity: "success",
            open: true,
          }),
        );

        Cookies.set("accessToken", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("access-token", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        router.push("/dashboard");
      } else {
        dispatch(setPreLoader(false));
        dispatch(
          setAlertMessage({
            message: response.error.errors.message || "An error occurred!",
            severity: "error",
            open: true,
          }),
        );
      }
      handleResetAlert();
      setSubmitting(false);
    },
  });

  return (
    <main className="bg-white dark:bg-slate-900">
      <div className="relative md:flex">
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <AuthHeader />
            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">
                Welcome back! ✨
              </h1>
              <form onSubmit={formik.handleSubmit}>
                <div
                  className="space-y-4"
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      formik.handleSubmit();
                    }
                  }}
                >
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="email"
                    >
                      Email/Username
                    </label>
                    <input
                      id="email"
                      className="form-input w-full"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      className="form-input w-full"
                      type="password"
                      autoComplete="on"
                      {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-600">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <Link
                      className="text-sm hidden underline hover:no-underline"
                      href="/reset-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <button
                    className="btn relative px-8 bg-primaryMain hover:bg-blueTwo text-white ml-3"
                    type="submit"
                    disabled={formik.isSubmitting || preLoader}
                    style={{
                      background: formik.isSubmitting ? "grey" : "",
                    }}
                  >
                    {preLoader && (
                      <>
                        <span className="absolute left-[7%] top-[35%]">
                          <ButtonLoader />
                        </span>
                      </>
                    )}
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <AuthImage />
      </div>
    </main>
  );
}

SignIn.guest = true;
export default SignIn;
