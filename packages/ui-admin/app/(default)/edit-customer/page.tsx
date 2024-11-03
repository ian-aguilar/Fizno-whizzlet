"use client";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputComponent from "@/components/common/inputField/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import TooltipCustom from "@/components/common/tooltip/tooltip";
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import { Alert, Snackbar } from "@mui/material";
import TextEditor from "@/components/common/textEditor/page";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";

interface USERDETAIL {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  about: string;
}

export default function EditCustomer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<any>({});
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const handleGetUserById = async (id: string) => {
    setLoading(true);
    const response = await AuthApi.getUserById(id);
    if (response.remote === "success") {
      console.log(response);
      setUserDetail(response.data.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    console.log(id);
    if (id) {
      handleGetUserById(id);
    }
  }, [id]);

  const formik = useFormik<USERDETAIL>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      about: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().required("Required"),
      phoneNumber: Yup.string().required("Required"),
    }),
    onSubmit: async (
      values: USERDETAIL,
      { setSubmitting }: FormikHelpers<USERDETAIL>,
    ) => {
      console.log(values);
      const response: any = await AuthApi.updateUserById(id as string, values);
      if (response.remote === "success") {
        setSnackbar({
          message: "update user successful!",
          severity: "success",
          open: true,
        });
        router.push("/customer");
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

  const getMetaValue = (key: string) => {
    const meta = userDetail?.wp_nepaz2_usermeta?.find(
      (item: any) => item.meta_key === key,
    )?.meta_value;
    return meta;
  };

  useEffect(() => {
    if (userDetail) {
      formik.setValues({
        firstName: getMetaValue("first_name"),
        lastName: getMetaValue("last_name"),
        email: userDetail?.user_email,
        phoneNumber: getMetaValue("phone_number"),
        about: getMetaValue("about"),
      });
    }
  }, [userDetail]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const countryCode = [{ key: "1", value: "+1" }];

  return loading ? (
    <div></div>
  ) : (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Edit Customer
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
            onClick={() => router.back()}
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
            {/* <h5 className="text-lg mb-4 text-slate-800 font-semibold">Name</h5> */}
            <div className="">
              <label className=" normal-case text-zinc-600 text-sm font-bold">
                Profile {/* <span className="text-red-500"> *</span> */}
              </label>
              <SingleUploadComponent
                component={{ isUploaded: false }}
                type="add"
              />
            </div>
            <div className="grid grid-cols-2 gap-5 mt-4">
              {/* <div>
                <InputComponent
                  className="w-[80%]"
                  label="User Name"
                  type="text"
                  name="username"
                  value={userDetail?.user_nicename}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      user_nicename: e.target.value,
                    })
                  }
                />
              </div> */}

              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="First Name"
                  type="text"
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-red-600">{formik.errors.firstName}</div>
                ) : null}
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Last Name"
                  type="text"
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="text-red-600">{formik.errors.lastName}</div>
                ) : null}
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Email"
                  type="text"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <div className="">
                  <label className=" normal-case text-zinc-600 text-sm font-bold">
                    Phone Number
                    {/* <span className="text-red-500"> *</span> */}
                  </label>
                  <div
                    className="flex phone_input_code mt-0"
                    style={{ marginTop: "0!important" }}
                  >
                    {" "}
                    <div className="w-2/12 mr-4">
                      <SearchSingleSelect
                        label=""
                        Options={countryCode}
                        placeholder="+1"
                        value={{ key: "1", value: "+1" }}
                      />
                    </div>{" "}
                    <div className="w-10/12">
                      <InputComponent
                        className="capitalize font-medium text-[#000!important] "
                        label=""
                        placeholder="XXXXXXXXXX"
                        mandatory={true}
                        {...formik.getFieldProps("phoneNumber")}
                      />
                      {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber ? (
                        <div className="text-red-600">
                          {formik.errors.phoneNumber}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-4">
                <label className=" normal-case text-zinc-600 text-sm font-bold">
                  About Us {/* <span className="text-red-500"> *</span> */}
                </label>

                <div className="w-12/12 ">
                  <TextEditor
                    className=" capitalize font-medium text-[#000!important] "
                    value={formik.getFieldProps("about").value}
                    label=""
                    onChange={(e) => formik.setFieldValue("about", e)}
                  />
                </div>
              </div>
            </div>

            {/* <h5 className="text-lg mb-4 text-slate-800 font-semibold mt-5">
              Contact Info
            </h5>
            <div className="grid grid-cols-2 gap-5">
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={userDetail?.user_email}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      user_email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Website"
                  type="text"
                  name="website"
                  value={userDetail?.user_url}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      user_url: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Twitter Username"
                  type="text"
                  name="twitterUsername"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "twitter",
                    )?.meta_value
                  }
                  onChange={(e) => handleChangeInput("twitter", e.target.value)}
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Facebook Profile"
                  type="text"
                  name="facebookProfile"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "facebook",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("facebook", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Additional URLs"
                  type="text"
                  name="additionalUrls"
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Biographical Info"
                  type="text"
                  name="biographicalInfo"
                />
              </div>
            </div>

            {/* <h5 className="text-lg mb-4 text-slate-800 font-semibold mt-5">
              Address
            </h5>
            <div className="grid grid-cols-2 gap-5">
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Street Address"
                  type="text"
                  name="streetAddress"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_address_1",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_address_1", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Apartment, Suite, etc."
                  type="text"
                  name="apartment"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_address_2",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_address_2", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="City"
                  type="text"
                  name="city"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_city",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_city", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Postal Code"
                  type="text"
                  name="postalCode"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_postcode",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_postcode", e.target.value)
                  }
                />
              </div>
              <div>
                <InputComponent
                  className="w-[80%]"
                  label="Country"
                  type="text"
                  name="country"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_country",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_country", e.target.value)
                  }
                />
              </div>
              <div>
                <InputComponent
                  className="w-[80%]"
                  label="State"
                  type="text"
                  name="state"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_state",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_state", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Phone"
                  type="text"
                  name="phone"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_phone",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_phone", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Billing Email"
                  type="email"
                  name="billingEmail"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "billing_email",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("billing_email", e.target.value)
                  }
                />
              </div>
            </div>

            <h5 className="text-lg mb-4 text-slate-800 font-semibold mt-5">
              Shipping Address
            </h5>
            <div className="grid grid-cols-2 gap-5">
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="First Name"
                  type="text"
                  name="shippingAddress.firstName"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_first_name",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_first_name", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Last Name"
                  type="text"
                  name="shippingAddress.lastName"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_last_name",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_last_name", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Company"
                  type="text"
                  name="shippingAddress.company"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_company",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_company", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Address Line 1"
                  type="text"
                  name="shippingAddress.addressLine1"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_address_1",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_address_1", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Address Line 2"
                  type="text"
                  name="shippingAddress.addressLine2"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_address_2",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_address_2", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="City"
                  type="text"
                  name="shippingAddress.city"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_city",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_city", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Postal Code"
                  type="text"
                  name="shippingAddress.postalCode"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_postcode",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_postcode", e.target.value)
                  }
                />
              </div>
              <div>
                <InputComponent
                  className="w-[80%]"
                  label="country"
                  type="text"
                  name="shippingCountry"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_country",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_country", e.target.value)
                  }
                />
              </div>
              <div>
                <InputComponent
                  className="w-[80%]"
                  label="State"
                  type="text"
                  name="shippingState"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_state",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_state", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Phone"
                  type="text"
                  name="shippingAddress.phone"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_phone",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_phone", e.target.value)
                  }
                />
              </div>
              <div className="w-12/12">
                <InputComponent
                  className="w-[80%]"
                  label="Email Address"
                  type="email"
                  name="shippingAddress.emailAddress"
                  value={
                    userDetail?.wp_nepaz2_usermeta?.find(
                      (item: any) => item.meta_key == "shipping_email",
                    )?.meta_value
                  }
                  onChange={(e) =>
                    handleChangeInput("shipping_email", e.target.value)
                  }
                />
              </div>
            </div> */}

            {/* <div className="flex items-center mt-5">
              <input
                id="sendNotification"
                name="sendNotification"
                type="checkbox"
                className="form-checkbox"
              />
              <label htmlFor="sendNotification" className="ms-2">
                Send Notification
              </label>
            </div> */}

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="btn bg-primaryMain hover:bg-blueTwo text-white"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
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
