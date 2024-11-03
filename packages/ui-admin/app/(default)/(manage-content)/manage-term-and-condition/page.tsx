"use client";
import React, { useEffect } from "react";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";
import MultiselectDropdown from "@/components/common/multiselect/page";
// import MultiselectDropdown from "@/components/common/multiselect/page";
import SelectComponent from "@/components/common/select/page";
import TextEditor from "@/components/common/textEditor/page";
import { useState } from "react";
import DatePickerComponent from "@/components/common/datepicker/page";
// import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { useRouter } from "next/navigation";
import SVG from "@/public/svg";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Alert, Snackbar } from "@mui/material";
import { title } from "process";
import SingleUploadComponent from "@/components/common/fileUpload/editSingleFileUpload";

interface PolicyContent {
  title: string;
  content: string;
}

export default function ManagePrivacyPolicy() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [policyContent, setPolicyContent] = useState<any>();
  const [fileUploadComponents, setFileUploadComponents] = useState<
    JSX.Element[]
  >([<SingleUploadComponent key={0} type="add" />]);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  const [fileUploadComponent, setFileUploadComponent] = useState<any>();

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [showAddMediaInput, setShowAddMediaInput] = useState(false);

  const getPrivacyPolicy = async () => {
    try {
      const response = await categoriesService.getTermAndConditionContent();
      console.log(response);
      if (response.remote === "success") {
        setPolicyContent(response.data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik<PolicyContent>({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      content: Yup.string().required("Required"),
    }),
    onSubmit: async (
      values: PolicyContent,
      { setSubmitting }: FormikHelpers<PolicyContent>,
    ) => {
      console.log(values);
      let formdata = new FormData();
      formdata.append("title", values.title);
      formdata.append("content", values.content);
      if (fileUploadComponent.item) {
        formdata.append("image", fileUploadComponent.item);
      }
      const response: any =
        await categoriesService.updateTermAndConditionContent(formdata);
      if (response.remote === "success") {
        setSnackbar({
          message: "update successful!",
          severity: "success",
          open: true,
        });
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

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  useEffect(() => {
    getPrivacyPolicy();
  }, []);

  useEffect(() => {
    if (policyContent) {
      formik.setValues({
        title: policyContent.title,
        content: policyContent.content,
      });
      if (policyContent.image) {
        setFileUploadComponent({ isUploaded: true, url: policyContent.image });
      }
    }
  }, [policyContent]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedImage = selectedFiles[0];
      console.log(selectedImage);
      const uploadedData: { item?: any; isUploaded?: boolean; url?: string } =
        {};
      uploadedData.item = selectedImage;
      uploadedData.isUploaded = true;
      setFileUploadComponent(uploadedData);
      // setImage(selectedImage);
      // setPreview(URL.createObjectURL(selectedImage));
    }
  };

  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Manage Term and Condition
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
          <form onSubmit={formik.handleSubmit} className="gap-5">
            <div className="">
              <div className="">
                <label className="block text-zinc-600 text-sm font-bold mb-1  w-full">
                  Banner Image
                </label>
                <SingleUploadComponent
                  handleImageChange={(e) => handleImageChange(e)}
                  component={fileUploadComponent}
                />
              </div>
            </div>
            <div className="w-12/12">
              <div className="mt-4">
                {" "}
                <InputComponent
                  className="w-full"
                  label="Title"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-red-600">{formik.errors.title}</div>
                ) : null}
              </div>

              <div className="mt-4 product_page_description">
                <label
                  className={"block text-zinc-600 text-sm font-bold mb-1"}
                  htmlFor="date"
                >
                  Description
                </label>

                <TextEditor
                  onChange={(e) => formik.setFieldValue("content", e)}
                  className="w-full "
                  value={formik.getFieldProps("content").value}
                  label=""
                />
                {formik.touched.content && formik.errors.content ? (
                  <div className="text-red-600">{formik.errors.content}</div>
                ) : null}
              </div>
            </div>
            <div className="mt-4 text-end">
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white px-6"
                type="submit"
                // onClick={() => router.push("/add-products")}
              >
                <span className="hidden xs:block ">Save</span>
              </button>
            </div>
          </form>
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
