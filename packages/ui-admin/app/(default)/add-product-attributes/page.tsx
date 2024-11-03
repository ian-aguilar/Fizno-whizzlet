/* eslint-disable prettier/prettier */
"use client";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";

import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import TooltipCustom from "@/components/common/tooltip/tooltip";
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { FormikHelpers, useFormik } from "formik";
import TagInput from "@/components/common/inputField/tagInput";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { Alert, Snackbar } from "@mui/material";
interface AttributesValue {
  name: string;
  slug: string;
  archive: string;
  ordering: string;
  terms: any[];
}

export default function AddProductAttributes() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const parentCategoryArray = [
    { value: "category_one", label: "Category One" },
    { value: "category_two", label: "Category Two" },
  ];
  const OrderBy = [
    { value: "custom_ordering", label: "Custom ordering" },
    { value: "order_with", label: "Order with" },
  ];

  const formik = useFormik<AttributesValue>({
    initialValues: {
      name: "",
      slug: "",
      archive: "",
      ordering: "",
      terms: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      slug: Yup.string().required("Required"),
      terms: Yup.array().required("Required"),
    }),
    onSubmit: async (
      values: AttributesValue,
      { setSubmitting }: FormikHelpers<AttributesValue>,
    ) => {
      // router.push("/products")
      setSubmitting(true);
      const response = await categoriesService.addProductAttributes(values);
      if (response.remote === "success") {
        router.push("/product-attributes");
        setSnackbar({
          message: "Attribute Added Successfully",
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
      console.log(response);
      setSubmitting(false);
    },
  });

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    formik.setFieldValue("terms", tags);
  }, [tags]);

  return (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Add Product Attributes
              <svg
                className="shrink-0 h-6 w-6 ms-2"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
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

        <form
          onSubmit={formik.handleSubmit}
          className="px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative"
        >
          <div className="flex gap-5 mt-4">
            <div className="w-6/12">
              {" "}
              <div className="">
                {" "}
                <InputComponent
                  className="w-[80%]"
                  label="Name"
                  tooltipMessage="The name for the attributes (shown on the front-end)"
                  showTooltip={true}
                  type="text"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-600">{formik.errors.name}</div>
                ) : null}
              </div>
              <div className="mt-4 ">
                <label
                  className={
                    "flex text-zinc-600 text-sm font-bold  mr-5 items-center "
                  }
                  htmlFor="enable_vacation_mode"
                >
                  Enable Archives?{" "}
                  <TooltipCustom bg="light" className="ms-2 ">
                    <div className="text-[10px] font-normal text-slate-900 min-w-52 ">
                      The description is not prominent by default; however ,
                      some themes may show it.
                    </div>
                  </TooltipCustom>
                </label>
                <input
                  type="checkbox"
                  className=" rounded-sm border border-slate-200 h-6 w-6 rounded-sm dark:bg-[rgb(18,18,18)]  dark:border-slate-700"
                />
              </div>
            </div>
            <div className="w-6/12 ">
              <div className="">
                <InputComponent
                  className="w-[80%]"
                  label="Slug"
                  tooltipMessage="Unique slug/refrence for the attribute; must be no more than 28 characters."
                  showTooltip={true}
                  type="text"
                  {...formik.getFieldProps("slug")}
                />
                {formik.touched.slug && formik.errors.slug ? (
                  <div className="text-red-600">{formik.errors.slug}</div>
                ) : null}
              </div>
              <div className="mt-4">
                <SearchSingleSelect
                  label="Order By"
                  isSearchable={true}
                  // isDisabled={isDisabled}
                  Options={OrderBy}
                  tooltipMessage="This is the commission type for admin fee."
                  showTooltip={true}
                  onChange={(data) => console.log(data)}
                  value={undefined}
                  name={""}
                  // onBlur={function (e: any): void {
                  //   throw new Error("Function not implemented.");
                  // }}
                />
              </div>
            </div>
          </div>
          {/* <div className="mt-4">
            <label className="flex text-zinc-600 text-sm font-bold mb-1">
              Terms
            </label>
            <textarea
              className="min-h-16 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
              rows={4}
            ></textarea>
          </div> */}
          <div className="mt-4">
            <label className="flex text-zinc-600 text-sm font-bold mb-1">
              Terms
            </label>
            <TagInput
              tags={tags}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
            {/* {formik.touched.terms && formik.errors.terms ? (
              <div className="text-red-600">
                {formik.errors.terms}
              </div>
            ) : null} */}
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
