"use client";
import React from "react";
import InputComponent from "@/components/common/inputField/page";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import SingleUploadComponent from "@/components/common/fileUpload/editSingleFileUpload";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { useAppDispatch, useAppSelector } from "@fizno/ui-core/src/redux/hooks";
import {
  globalCacheStateSelector,
  setPreLoader,
} from "@fizno/ui-core/src/redux/slices/globaCache.slice";

export default function EditHomepageContent() {
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
  const bannerId = searchParams.get("id");

  /**
   * state management
   */
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const [bannerImage, setBannerImage] = useState<File | string>("");
  const [bannerText, setBannerText] = useState<string>("");
  const [errorData, setErrorData] = useState<{
    error: string;
    type: "BANNER" | "TEXT" | "";
  }>({
    error: "",
    type: "",
  });

  /**
   * handle add banner
   */

  const handleAddBanner = async () => {
    if (bannerImage === "") {
      setErrorData({
        error: "Please upload image.",
        type: "BANNER",
      });
    } else if (bannerText === "") {
      setErrorData({
        error: "Please add title",
        type: "TEXT",
      });
    } else {
      if (bannerId) {
        const payload = {
          bannerImage,
          bannerText,
          bannerId,
        };
        dispatch(setPreLoader(true));
        const response = await AdminApi.updateBannerAPI(payload);
        if (response.remote === "success") {
          dispatch(setPreLoader(false));
          setSnackbar({
            message: "Banner updated",
            open: true,
            severity: "success",
          });
          setBannerImage("");
          setBannerText("");
        } else {
          dispatch(setPreLoader(false));
          setSnackbar({
            message: response.error.errors.message || "An error occurred!",
            severity: "error",
            open: true,
          });
        }
      }
    }
  };

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Update Homepage Content
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
            <div className="">
              <div className="">
                <label className="block text-zinc-600 text-sm font-bold mb-1  w-full">
                  Banner Image
                </label>
                <SingleUploadComponent
                  handleImageChange={(e) => {
                    if (e.target.files) {
                      setErrorData({ error: "", type: "" });
                      setBannerImage(e?.target?.files[0]);
                    }
                  }}
                  component={{
                    isUploaded: bannerImage !== "" ? true : false,
                    item: bannerImage,
                  }}
                />
                {errorData.type === "BANNER" && (
                  <span className="text-sm text-red-500">
                    {errorData.error}
                  </span>
                )}
              </div>
            </div>
            <div className="w-12/12">
              <div className="mt-4">
                {" "}
                <InputComponent
                  className="w-full"
                  label="Title"
                  value={bannerText}
                  onChange={(e) => {
                    setErrorData({ error: "", type: "" });
                    setBannerText(e.target.value);
                  }}
                />
                {errorData.type === "TEXT" && (
                  <span className="text-sm text-red-500">
                    {errorData.error}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 text-end">
              <button
                disabled={preLoader}
                className="btn bg-primaryMain hover:bg-blueTwo text-white px-6"
                type="submit"
                onClick={() => handleAddBanner()}
              >
                {preLoader && <CircularProgress size={22} />}
                <span className="hidden xs:block ">Update</span>
              </button>
            </div>
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
