/* eslint-disable prettier/prettier */
"use client";
import TabComponent from "@/components/common/basicTab/page";
import InputComponent from "@/components/common/inputField/page";
import MultiselectDropdown from "@/components/common/multiselect/page";
// import MultiselectDropdown from "@/components/common/multiselect/page";
import SelectComponent from "@/components/common/select/page";
import TextEditor from "@/components/common/textEditor/page";
import Inventory from "./inventory";
import Shipping from "./shipping";
import Tax from "./tax";
import Linked from "./linked";
import SEO from "./seo";
import Attributes from "./attributes";
import FileUploadComponent from "@/components/common/fileUpload/page";
import { useEffect, useState } from "react";
import DatePickerComponent from "@/components/common/datepicker/page";
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { useRouter, useSearchParams } from "next/navigation";
import Offers from "./offers";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";
import { Alert, Snackbar } from "@mui/material";
interface ProductValues {
  productType: string;
  productName: string;
  price: string;
  description: string;
  category: any[];
  condition?: string;
  stocks: string;
  attributes: any;
}
export default function EditProduct() {
  const [categoriesArray, setAllCategories] = useState([]);
  // const [conditionArray, setAllConditions] = useState([])
  const [productArray, setAllProductTypes] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const id: string | null = searchParams.get("id");
  const [reload, setReload] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [fileUploadComponents, setFileUploadComponents] = useState<any>([]);
  const [taxStatus, setTaxStatus] = useState("");
  const [taxClass, setTaxClass] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [minimumOffer, setMinimumOffer] = useState("");
  const [offer, setOffer] = useState("not-now");
  const handleAddFileUpload = () => {
    // Add a new instance of FileUploadComponent to the array
    setFileUploadComponents([...fileUploadComponents, { isUploaded: false }]);
  };

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const fetchCatgories = async () => {
    const response = await categoriesService.getParentCategory();
    console.log({ response }, "dbhbd");
    if (response.remote === "success") {
      setAllCategories(response.data);
    }
  };
  // const fetchConditions = async () => {
  //   const response = await categoriesService.getAllConditions();
  //   console.log({ response });
  //   if (response.remote === "success") {
  //     setAllConditions(response.data);
  //   }
  // };
  const fetchProductTypes = async () => {
    const response = await categoriesService.getAllProductTypes();
    console.log({ response });
    if (response.remote === "success") {
      setAllProductTypes(response.data);
    }
  };

  const fetchAllAttributes = async () => {
    const response = await categoriesService.getAllAttributes();
    console.log({ response });
    if (response.remote === "success") {
      setAllAttributes(response.data);
    }
  };

  useEffect(() => {
    fetchCatgories();
    fetchProductTypes();
    fetchAllAttributes();
  }, []);

  const formik = useFormik<ProductValues>({
    initialValues: {
      productType: "",
      productName: "",
      price: "",
      description: "",
      category: [],
      stocks: "",
      attributes: {},
    },
    validationSchema: Yup.object({
      productType: Yup.string().required("Required"),
      productName: Yup.string().required("Required"),
      price: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      // condition: Yup.string().required("Required"),
    }),
    onSubmit: async (
      values: ProductValues,
      { setSubmitting }: FormikHelpers<ProductValues>,
    ) => {
      setLoading(true);
      const response: any = await UserApi.updateProducts(values, id as string);
      if (response.remote === "success") {
        uploadImages();
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

  const handleSelect = (selectedList: { label: string; value: string }[]) => {
    formik.setFieldValue("category", selectedList);
  };

  const handleRemove = (selectedList: { label: string; value: string }[]) => {
    formik.setFieldValue("category", selectedList);
  };

  const handleAttributeSelect = (attribute: any) => {
    formik.setFieldValue("attributes", attribute);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response = await UserApi.getProductById(id || "");
      console.log(response.data);
      if (response.data.status === 200) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const productType = product.wp_term_relationships.find(
        (item: any) => item.term_taxonomy.taxonomy === "product_type",
      );
      const attributesTaxnonomy = {
        ...product.wp_nepaz2_postmeta?.find(
          (item: any) => item.meta_key == "_product_attributes",
        )?.meta_value,
      };
      const groupedData = product.attribute_lookup.reduce(
        (acc: any, item: any) => {
          const { taxonomy } = item;
          if (!acc[taxonomy]) {
            acc[taxonomy] = [];
          }
          acc[taxonomy].push({
            label: item.terms.name,
            value: item.terms.term_id,
          });
          return acc;
        },
        {},
      );

      if (groupedData) {
        Object.keys(groupedData).forEach((key) => {
          const attribute = groupedData[key];
          if (attribute) {
            if (attributesTaxnonomy[key]) {
              attributesTaxnonomy[key].value = attribute;
            }
          }
        });
      }
      formik.setValues({
        productType: productType.term_taxonomy.term.term_id,
        productName: product.post_title,
        price: product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "_price",
        )?.meta_value,
        description: product.post_content,
        category: product.wp_term_relationships
          .filter((item: any) => item.term_taxonomy.taxonomy === "product_cat")
          .map((value: any) => {
            return {
              label: value?.term_taxonomy?.term.name,
              value: value.term_taxonomy.term.term_id,
            };
          }),
        stocks: product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "_stock",
        )?.meta_value,
        attributes: attributesTaxnonomy,
      });

      setTaxClass(
        product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "tax_class",
        )?.meta_value,
      );

      setTaxStatus(
        product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "tax_status",
        )?.meta_value,
      );

      setMetaDescription(
        product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "meta_description",
        )?.meta_value,
      );
      setMetaKeyword(
        product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "meta_keyword",
        )?.meta_value,
      );

      setOffer(
        product.wp_nepaz2_postmeta.find((item: any) => item.meta_key == "offer")
          ?.meta_value,
      );
      setMinimumOffer(
        product.wp_nepaz2_postmeta.find(
          (item: any) => item.meta_key == "minimum_offer",
        )?.meta_value,
      );
      const attchemnts = product.attachment.map((item: any) => {
        return { isUploaded: true, item: item };
      });
      setFileUploadComponents(attchemnts);
    }
  }, [product]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedImage = selectedFiles[0];
      console.log(selectedImage);
      const uploadedData = JSON.parse(JSON.stringify(fileUploadComponents));
      uploadedData[index].item = selectedImage;
      uploadedData[index].isUploaded = true;
      setFileUploadComponents(uploadedData);
      setReload(!reload);
      // setImage(selectedImage);
      // setPreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleDelete = (key: number) => {
    const filter = fileUploadComponents.filter(
      (item: any, index: number) => index !== key,
    );
    setFileUploadComponents(filter);
  };

  const handleApiDelete = async (id: number, key: number) => {
    const response = await UserApi.deleteProducts(id);
    if (response.remote === "success") {
      const filter = fileUploadComponents.filter(
        (item: any, index: number) => index !== key,
      );
      setFileUploadComponents(filter);
    } else {
      console.log(response);
    }
  };

  const uploadImages = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < fileUploadComponents.length; i++) {
        const element = fileUploadComponents[i];
        if (element.item && !element.item.ID) {
          formData.append("image", element.item);
        }
      }
      formData.append("id", `${id}`);
      const response: any = await UserApi.uploadProductAttachment(formData);
      if (response.remote === "success") {
        setSnackbar({
          message: "edit product successfully",
          severity: "success",
          open: true,
        });
        // uploadImages(response.data.data.ID)
        router.push("/products");
      } else {
        setSnackbar({
          message: response.error.errors.message || "An error occurred!",
          severity: "error",
          open: true,
        });
        console.log({ response });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return loading ? (
    <></>
  ) : (
    <>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Edit Products
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

        <form onSubmit={formik.handleSubmit}>
          <div className="px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            <div className="flex gap-5">
              <div className="w-7/12">
                <div className="">
                  {" "}
                  <SelectComponent
                    label="Simple Product"
                    options={productArray}
                    selectedValue={productArray.find(
                      (item: any) =>
                        item.value ===
                        formik.getFieldProps("productType").value,
                    )}
                    onSelect={(value: any) =>
                      formik.setFieldValue("productType", value[0].value)
                    }
                  />
                  {formik.touched.productType && formik.errors.productType ? (
                    <div className="text-red-600">
                      {formik.errors.productType}
                    </div>
                  ) : null}
                </div>
                <div className="mt-4">
                  {" "}
                  <InputComponent
                    className="w-[80%]"
                    label="Product Title"
                    {...formik.getFieldProps("productName")}
                  />
                  {formik.touched.productName && formik.errors.productName ? (
                    <div className="text-red-600">
                      {formik.errors.productName}
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-5 mt-4">
                  <div className="w-6/12">
                    <div className="">
                      <InputComponent
                        className="w-[80%]"
                        label="Price($)"
                        {...formik.getFieldProps("price")}
                      />
                      {formik.touched.price && formik.errors.price ? (
                        <div className="text-red-600">
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-6/12">
                    <div className="">
                      <InputComponent
                        className="w-[80%]"
                        label="Sales Price($)"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <p
                    className="text-primaryMain underline cursor-pointer"
                    onClick={() =>
                      setShowSchedule((prevShowSchedule) => !prevShowSchedule)
                    }
                  >
                    schedule
                  </p>
                </div>
                {showSchedule ? (
                  <div className="flex gap-5 mt-2">
                    <div className="w-6/12">
                      <label
                        className={"block text-zinc-600 text-sm font-bold mb-1"}
                        htmlFor="date"
                      >
                        From
                      </label>
                      <DatePickerComponent />
                    </div>
                    <div className="w-6/12">
                      <label
                        className={"block text-zinc-600 text-sm font-bold mb-1"}
                        htmlFor="date"
                      >
                        Upto
                      </label>
                      <DatePickerComponent />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="mt-4 product_page_description">
                  <TextEditor
                    value={formik.getFieldProps("description").value}
                    onChange={(e: any) =>
                      formik.setFieldValue("description", e)
                    }
                    className="w-[80%] "
                    label="Description"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-600">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="w-5/12 ">
                <div className="mb-4 flex-wrap  flex items-end">
                  {fileUploadComponents.map((component: any, index: any) => (
                    <div
                      key={index}
                      className={`mt-4 mr-2   ${
                        fileUploadComponents.length > 1
                          ? "small_upload_div"
                          : ""
                      }`}
                    >
                      {
                        <SingleUploadComponent
                          handleDelete={() => {
                            if (component.item.ID) {
                              handleApiDelete(component.item.ID, index);
                            } else {
                              handleDelete(index);
                            }
                          }}
                          handleImageChange={(e) => handleImageChange(e, index)}
                          component={component}
                          key={0}
                          type="add"
                        />
                      }
                    </div>
                  ))}
                  <div className="text-end">
                    <svg
                      className="cursor-pointer"
                      onClick={handleAddFileUpload}
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                    </svg>
                  </div>
                </div>
                {/* <div className="mb-4">
              <SelectComponent label="Categories" options={categoriesArray} />
            </div> */}
                <div className="mb-4 categories_dropdown">
                  <MultiselectDropdown
                    label="Categories"
                    handleSelect={handleSelect}
                    handleRemove={handleRemove}
                    selectedValues={formik.getFieldProps("category").value}
                    options={categoriesArray}
                  />
                </div>
                {/* <div className="mb-4">
                <SelectComponent label="Condition" options={conditionArray} onSelect={value => formik.setFieldValue("condition", value[0].value)} />
                {formik.touched.condition && formik.errors.condition ? (
                  <div className="text-red-600">
                    {formik.errors.condition}
                  </div>
                ) : null}
              </div> */}
                {/* <div className="">
              <SelectComponent label="Brands" options={brandsArray} />
            </div> */}
                <div className="mt-4">
                  <label className="block text-zinc-600 text-sm font-bold mb-1">
                    Tags
                  </label>
                  <textarea
                    placeholder="Separate Product Tags with commas"
                    className="min-h-16 rounded-sm border border-slate-200 w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                    rows={3}
                  ></textarea>
                  <div className="text-end">
                    <p className="text-gray-400 underline hover:text-sky-600 cursor-pointer text-xs leading-3 ">
                      Choose from the most used tags
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            <TabComponent
              tabs={[
                {
                  id: "tab1",
                  label: "Inventory",
                  content: (
                    <div>
                      <Inventory
                        value={formik.getFieldProps("stocks").value}
                        onChangeStock={(e: any) =>
                          formik.setFieldValue("stocks", e.target.value)
                        }
                      />
                    </div>
                  ),
                },
                {
                  id: "tab2",
                  label: "Shipping",
                  content: (
                    <div>
                      <Shipping />
                    </div>
                  ),
                },
                {
                  id: "tab3",
                  label: "Tax",
                  content: (
                    <div>
                      <Tax
                        taxClass={taxClass}
                        taxStatus={taxStatus}
                        onClassChange={(e: any) => setTaxClass(e.value)}
                        onStatusChange={(e: any) => setTaxStatus(e.value)}
                      />
                    </div>
                  ),
                },
                {
                  id: "tab4",
                  label: "Attributes",
                  content: (
                    <div>
                      <Attributes
                        attributes={formik.getFieldProps("attributes").value}
                        data={allAttributes}
                        handleSelect={handleAttributeSelect}
                      />
                    </div>
                  ),
                },

                {
                  id: "tab6",
                  label: "SEO",
                  content: (
                    <div>
                      <SEO
                        metaDescription={metaDescription}
                        metaKeyword={metaKeyword}
                        onMetaDescriptionChange={setMetaDescription}
                        onMetaKeywordChange={setMetaKeyword}
                      />
                    </div>
                  ),
                },
                {
                  id: "tab7",
                  label: "Offers",
                  content: (
                    <div>
                      <Offers
                        minimumOffer={minimumOffer}
                        offer={offer}
                        setOffer={setOffer}
                        setMinimumOffer={setMinimumOffer}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <div className="mt-4 text-end">
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3"
                // onClick={() => router.push("/add-products")}
              >
                <span className="hidden xs:block">Draft</span>
              </button>
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white"
                type="submit"
                disabled={formik.isSubmitting}
                // onClick={() => router.push("/add-products")}
              >
                <span className="hidden xs:block ">Submit</span>
              </button>
            </div>
          </div>
        </form>
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
