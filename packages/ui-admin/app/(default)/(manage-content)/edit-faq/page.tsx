"use client";
import React, { useEffect } from "react";
import InputComponent from "@/components/common/inputField/page";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { useAppDispatch, useAppSelector } from "@fizno/ui-core/src/redux/hooks";
import {
  globalCacheStateSelector,
  setPreLoader,
} from "@fizno/ui-core/src/redux/slices/globaCache.slice";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";

interface FAQCONTENT {
  title: string;
  heading: string;
  content: string;
}

export default function EditFaqContent() {
  /**
   * redux
   */
  const dispatch = useAppDispatch();
  const { preLoader } = useAppSelector(globalCacheStateSelector);

  /**
   * router
   */

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  /**
   * state management
   */
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  const [faqQuestion, setFaqQuestion] = useState<any>();

  const [errorData, setErrorData] = useState<{
    error: string;
    type: "BANNER" | "TEXT" | "";
  }>({
    error: "",
    type: "",
  });

  const formik = useFormik<FAQCONTENT>({
    initialValues: {
      title: "",
      heading: "",
      content: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      content: Yup.string().required("Required"),
    }),
    onSubmit: async (
      values: FAQCONTENT,
      { setSubmitting }: FormikHelpers<FAQCONTENT>,
    ) => {
      console.log(values);
      const response: any = await AdminApi.updateFaqQuestions({
        ...values,
        id: id as string,
      });
      if (response.remote === "success") {
        setSnackbar({
          message: "add faq question successful!",
          severity: "success",
          open: true,
        });
        router.push("/manage-faq");
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

  /**
   * handle add banner
   */

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const getFaqQuestionById = async () => {
    if (id) {
      try {
        const response = await AdminApi.getFaqQuestionById(id);
        if (response.remote === "success") {
          setFaqQuestion(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      getFaqQuestionById();
    }
  }, [id]);

  useEffect(() => {
    if (faqQuestion) {
      formik.setValues({
        title: faqQuestion.title,
        content: faqQuestion.content,
        heading: "",
      });
    }
  }, [faqQuestion]);

  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Edit Faq Content
              <svg
                className="shrink-0 h-6 w-6 ms-2"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 320 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
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
            <form onSubmit={formik.handleSubmit}>
              <div className="w-12/12">
                <div className="mt-4">
                  {" "}
                  <InputComponent
                    className="w-full"
                    label="Question"
                    {...formik.getFieldProps("title")}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-600">{formik.errors.title}</div>
                  ) : null}
                </div>
                <div className="mt-4">
                  <label className="block text-zinc-600 text-sm font-bold mb-1  w-full">
                    Answer
                  </label>
                  <textarea
                    rows={6}
                    className=" px-2 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                    {...formik.getFieldProps("content")}
                  ></textarea>
                  {formik.touched.content && formik.errors.content ? (
                    <div className="text-red-600">{formik.errors.content}</div>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 text-end">
                <button
                  // disabled={preLoader}
                  className="btn bg-primaryMain hover:bg-blueTwo text-white px-6"
                  type="submit"
                  // onClick={() => handleAddBanner()}
                >
                  {preLoader && <CircularProgress size={22} />}
                  <span className="hidden xs:block ">Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
    </>
  );
}
