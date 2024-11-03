/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputComponent from "@/components/common/inputField/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import TooltipCustom from "@/components/common/tooltip/tooltip";
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { useSearchParams } from "next/navigation";
export default function EditProductCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [parentCategoryArray, setParentCategoryArray] = useState([]);
  const [commissionArray, setCommissionArray] = useState([]);
  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      const parentCategories = await categoriesService.getParentCategory();
      console.log(parentCategories.data);
      if (parentCategories.remote === "success") {
        setParentCategoryArray(parentCategories.data);
      }

      const commissionTypes = await categoriesService.getCommissionType();
      if (commissionTypes.remote === "success") {
        setCommissionArray(commissionTypes.data);
      }
    };
    fetchCategories();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const initialValues = {
    categoryName: "",
    parentCategory: 0,
    slug: "",
    commissionType: "",
    description: "",
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category Name is required"),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string(),
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    const payload = {
      name: values.categoryName,
      slug: values.slug,
      id,
      description: values.description,
    };
    const response = await categoriesService.updateCategoryById(payload);
    if (response.remote === "success") {
      router.push("/product-category");
    }
    setIsLoading(false);
    // Perform submit actions
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Add Product Category
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
          onClick={handleBack}
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, setValues }) => {
            useEffect(() => {
              if (id) {
                const getCategoryById = async (id: string) => {
                  const response = await categoriesService.getCategoryById(id);
                  console.log(response.data.data.data[0]);
                  if (response.remote === "success") {
                    const category = response.data.data.data[0];
                    setValues({
                      categoryName: category.term.name,
                      parentCategory: category.parent,
                      slug: category.term.slug,
                      commissionType: "", // Adjust this if you have the commission type in the response
                      description: "", // Adjust this if you have the description in the response
                    });
                  }
                };
                getCategoryById(id);
              }
            }, [id, setValues]);
            return (
              <Form>
                <div className="mt-4 profile_upload_div">
                  <label className="flex text-zinc-600 text-sm font-bold mb-1">
                    Image
                    <TooltipCustom bg="light" className="ms-2 ">
                      <div className="text-[10px] font-normal text-slate-900 min-w-52 ">
                        Upload a Profile, size is (150x150) pixels.
                      </div>
                    </TooltipCustom>
                  </label>
                  <SingleUploadComponent type="add" />
                  <p className="mt-1 text-red-500 font-medium text-xs">
                    Image size must be 100px * 100px
                  </p>
                </div>

                <div className="flex gap-5 mt-4">
                  <div className="w-6/12">
                    <div>
                      <Field
                        name="categoryName"
                        component={InputComponent}
                        className="w-[80%]"
                        label="Category Name"
                        tooltipMessage="The name is how it appears on your site."
                        showTooltip={true}
                        type="text"
                        onChange={(e: any) =>
                          setFieldValue("categoryName", e.target.value)
                        }
                        value={values.categoryName}
                      />
                      <ErrorMessage
                        name="categoryName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="mt-4">
                      <SearchSingleSelect
                        label="Parent Category"
                        isSearchable={true}
                        value={values.parentCategory}
                        Options={parentCategoryArray}
                        tooltipMessage="Assign a parent term to create a hierarchy. The term Jazz, for example, would be the parent of Bebop and Big Band."
                        showTooltip={true}
                        onChange={(value) =>
                          setFieldValue("parentCategory", value)
                        }
                        name={""}
                        onBlur={function (e: any): void {
                          throw new Error("Function not implemented.");
                        }}
                      />
                      <ErrorMessage
                        name="parentCategory"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                  <div className="w-6/12">
                    <div>
                      <Field
                        name="slug"
                        component={InputComponent}
                        className="w-[80%]"
                        label="Slug"
                        tooltipMessage='The "Slug" is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.'
                        showTooltip={true}
                        type="text"
                        onChange={(e: any) =>
                          setFieldValue("slug", e.target.value)
                        }
                        value={values.slug}
                      />
                      <ErrorMessage
                        name="slug"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    {/* <div className="mt-4">
                      <SearchSingleSelect
                        label="Commision Type"
                        isSearchable={true}
                        Options={commissionArray}
                        tooltipMessage="This is the commission type for admin fee."
                        showTooltip={true}
                        onChange={(value) =>
                          setFieldValue("commissionType", value)
                        }
                        // isDisabled={true}
                        value={undefined}
                        name={""}
                        onBlur={function (e: any): void {
                          throw new Error("Function not implemented.");
                        }}
                      />
                      <ErrorMessage
                        name="commissionType"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div> */}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex text-zinc-600 text-sm font-bold mb-1">
                    Description
                    <TooltipCustom bg="light" className="ms-2">
                      <div className="text-[10px] font-normal text-slate-900 min-w-52">
                        The description is not prominent by default; however,
                        some themes may show it.
                      </div>
                    </TooltipCustom>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="min-h-16 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                    rows={4}
                    value={values.description}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mt-4 text-end">
                  <button
                    type="submit"
                    className="btn bg-primaryMain hover:bg-blueTwo text-white"
                    disabled={loading}
                  >
                    <span>{loading ? "Updating..." : "Submit"}</span>
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
