"use client";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import InputComponent from "@/components/common/inputField/page";
import React, { useEffect, useState } from "react";
import itemPic from "@/public/images/itemPic.jpeg";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import moment from "moment";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";
import { Alert, Snackbar } from "@mui/material";
import orderPic from "../../../assets/images/product_dummy.png";
import RoundedLoader from "@/components/common/loader/roundedLoader";
// const AttachmentCard: React.FC<{ onRemove: () => void }> = ({ onRemove }) => {
//   return (
//     <div className="border border-slate-200 p-3 attachment_card relative mt-3  dark:border-slate-700">
//       <div className="mt-4 ">
//         <div className="">
//           <label className="block text-zinc-600 text-sm font-bold">File</label>
//           <SingleUploadComponent component={{ isUploaded: false }} type="add" />
//           <p className="mt-1 text-red-500 font-medium text-xs">
//             Image size must be 160px * 160px
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

interface NOTES {
  content: string;
  attachment: File | string;
}

const OrderDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("orderId");
  const [orderDetail, setOrderDetail] = useState<any>();
  const [orderNotes, setOrderNotes] = useState([]);
  const [profileImage, setProfileImage] = useState<File | string>("");
  const getOrderDetail = async () => {
    try {
      const response = await AdminApi.getOrderById(id as string);
      if (response.remote === "success") {
        console.log(response);
        setOrderDetail(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderDetail();
      getOrderNotesById();
    }
  }, [id]);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const [loading, setLoading] = useState(true);
  // const [attachmentCards, setAttachmentCards] = useState<JSX.Element[]>([

  // ]);
  const router = useRouter();

  const getOrderNotesById = async () => {
    try {
      const response = await AdminApi.getOrderNotesById(id as string);
      if (response.remote === "success") {
        console.log(response.data);
        setOrderNotes(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to add a new attachment card
  // const addAttachmentCard = () => {
  //   setAttachmentCards((prevCards) => [
  //     ...prevCards,
  //     <AttachmentCard
  //       key={prevCards.length}
  //       onRemove={() => removeAttachmentCard(prevCards.length)}
  //     />,
  //   ]);
  // };

  // // Function to remove an attachment card
  // const removeAttachmentCard = (index: number) => {
  //   setAttachmentCards((prevCards) => prevCards.filter((_, i) => i !== index));
  // };
  const privatNoteArray = [
    { value: "private_note", label: "Private Note" },
    { value: "note_to_customer", label: "Note to Customer" },
  ];
  const handleBack = () => {
    router.back();
  };

  const getPostMeta = (key: string) => {
    const meta = orderDetail?.wp_nepaz2_postmeta.find(
      (item: any) => item.meta_key === key,
    );
    return meta?.meta_value;
  };

  const getProductMeta = (data: any, key: string) => {
    const value = data.find((meta: any) => meta.meta_key === key)?.meta_value;
    return value;
  };

  const formik = useFormik<NOTES>({
    initialValues: {
      content: "",
      attachment: "",
    },
    validationSchema: Yup.object({
      content: Yup.string().required("Required"),
    }),
    onSubmit: async (
      values: NOTES,
      { setSubmitting }: FormikHelpers<NOTES>,
    ) => {
      console.log(values);
      setLoading(true);
      const response: any = await UserApi.addOrderNotes({
        ...values,
        orderId: id as string,
      });
      if (response.remote === "success") {
        setSnackbar({
          message: "add note successful!",
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
      formik.setValues({
        content: "",
        attachment: "",
      });
      setLoading(false);
      setSubmitting(false);
      setProfileImage("");
    },
  });

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
    getOrderNotesById();
  };

  return loading ? (
    <RoundedLoader />
  ) : (
    <SelectedItemsProvider>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
              Order Detail
              <svg
                className="shrink-0 h-6 w-6 ms-2"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path>
              </svg>
            </h1>
          </div>
          <button
            className="btn  bg-primaryMain hover:bg-blueTwo text-white mr-3"
            onClick={() => handleBack()}
          >
            <span className="flex items-center">
              <svg
                className="mr-2"
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
                  strokeWidth="48"
                  d="M244 400 100 256l144-144M120 256h292"
                ></path>
              </svg>
              Back
            </span>
          </button>
        </div>

        <div className="py-3 px-3 mb-4 flex justify-between items-center bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="">
            <h3 className="text-slate-950 font-semibold">
              Order #{orderDetail?.ID}
              <span className="bg-red-500 text-white p-1 text-xs ms-2 ">
                {orderDetail?.post_status}
              </span>
            </h3>
          </div>
        </div>

        <div className="py-4 pb-8 px-4 mb-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="">
            <p className="font-normal text-sm text-slate-950  mb-2  ">
              Order date :{" "}
              {moment(orderDetail?.post_date).format("MMM DD, YYYY @hh:mm a")}
            </p>
            <p className="font-normal text-sm text-slate-950 mb-2">
              Order Status : {orderDetail?.post_status}
            </p>
            <p className="font-normal text-sm text-slate-950 mb-2">
              Payment via {getPostMeta("_payment_method_title")}.
            </p>
          </div>
          <div className="mt-5">
            <label className="font-normal text-sm text-primaryMain ">
              Shipping Detail
            </label>
          </div>
          <hr className="my-3"></hr>
          <div className="">
            <p className="font-normal text-sm text-slate-950 mb-2">
              {getPostMeta("_shipping_first_name")}{" "}
              {getPostMeta("_shipping_last_name")}
              <br />
              {getPostMeta("_shipping_address_1")}
              <br />
              {getPostMeta("_shipping_city")}, {getPostMeta("_shipping_state")},{" "}
              {getPostMeta("_shipping_postcode")}
              {/* <br />
              Fort Myers, FL 33967-4824 */}
            </p>
          </div>
        </div>
        <div className="bg-blueTwo rounded-sm text-white px-4 py-3">
          {" "}
          Order Items
        </div>
        <div className="py-4 pb-8 px-4 mb-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
          <div className="">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-[5%] text-center font-semibold text-primaryMain">
                    Img
                  </th>
                  <th className="w-[50%] text-left font-semibold text-primaryMain">
                    Item
                  </th>
                  <th className="w-[10%] font-semibold text-primaryMain">
                    Cost
                  </th>
                  <th className="w-[10%] font-semibold text-primaryMain">
                    Qty
                  </th>
                  <th className="w-[15%] font-semibold text-primaryMain">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderDetail?.wp_wc_order_product_lookup_order.map(
                  (item: any) => {
                    return (
                      <tr key={item.order_item_id}>
                        <td className="text-center mx-auto">
                          <Image
                            src={
                              item?.product?.attachments.length > 0
                                ? `${"http://digimonk.net:2770"}${item.product.attachments[0].guid}`
                                : itemPic
                            }
                            width={30}
                            height={30}
                            alt=""
                            className="mx-auto"
                          />
                        </td>
                        <td>
                          <div className="">
                            <p className="text-primaryMain mb-1 text-sm">
                              {item.product.post_title}
                            </p>
                            <p className="text-sm">
                              Vendor:{" "}
                              <span className="text-primaryMain text-sm">
                                {item.product.wp_nepaz2_users.display_name}
                              </span>
                            </p>
                          </div>
                        </td>
                        <td className="text-center">
                          $
                          {getProductMeta(
                            item.product.wp_nepaz2_postmeta,
                            "sale_price",
                          ) ||
                            getProductMeta(
                              item.product.wp_nepaz2_postmeta,
                              "_price",
                            )}
                        </td>
                        <td className="text-center">x {item.product_qty}</td>
                        <td className="text-center">
                          $
                          {parseInt(item.product_qty) *
                            (getProductMeta(
                              item.product.wp_nepaz2_postmeta,
                              "sale_price",
                            )
                              ? parseFloat(
                                  getProductMeta(
                                    item.product.wp_nepaz2_postmeta,
                                    "sale_price",
                                  ),
                                )
                              : parseFloat(
                                  getProductMeta(
                                    item.product.wp_nepaz2_postmeta,
                                    "_price",
                                  ),
                                ))}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
          <div className="">
            <h5 className="text-slate-950 font-bold italic my-3">
              Shipping Items(s)
            </h5>

            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-center mx-auto w-[5%]">
                    <svg
                      className="text-center"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="Delivery_Truck">
                        <g>
                          <path d="M21.47,11.185l-1.03-1.43a2.5,2.5,0,0,0-2.03-1.05H14.03V6.565a2.5,2.5,0,0,0-2.5-2.5H4.56a2.507,2.507,0,0,0-2.5,2.5v9.94a1.5,1.5,0,0,0,1.5,1.5H4.78a2.242,2.242,0,0,0,4.44,0h5.56a2.242,2.242,0,0,0,4.44,0h1.22a1.5,1.5,0,0,0,1.5-1.5v-3.87A2.508,2.508,0,0,0,21.47,11.185ZM7,18.935a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,7,18.935Zm6.03-1.93H9.15a2.257,2.257,0,0,0-4.3,0H3.56a.5.5,0,0,1-.5-.5V6.565a1.5,1.5,0,0,1,1.5-1.5h6.97a1.5,1.5,0,0,1,1.5,1.5ZM17,18.935a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,17,18.935Zm3.94-2.43a.5.5,0,0,1-.5.5H19.15a2.257,2.257,0,0,0-4.3,0h-.82v-7.3h4.38a1.516,1.516,0,0,1,1.22.63l1.03,1.43a1.527,1.527,0,0,1,.28.87Z"></path>
                          <path d="M18.029,12.205h-2a.5.5,0,0,1,0-1h2a.5.5,0,0,1,0,1Z"></path>
                        </g>
                      </g>
                    </svg>
                  </td>
                  <td colSpan={3} className="w-[80%]">
                    <div className="">
                      <p className=" mb-1 text-sm">Flat Shipping</p>
                      <p className="text-sm font-semibold">
                        285:{" "}
                        <span className="font-normal text-sm">MBJ Deals</span>
                      </p>
                    </div>
                  </td>
                  <td className="text-center w-[15%]">$0.00</td>
                </tr>
                <tr>
                  <td colSpan={4} className="w-[85%]">
                    <div className="text-end mt-4">
                      <p className=" mb-1 font-semibold text-sm">Shipping</p>
                    </div>
                  </td>
                  <td className="text-center w-[15%]">
                    <div className="mt-4"> $0.00</div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="w-[85%]">
                    <div className="text-end mt-4">
                      <p className=" mb-1 font-semibold text-sm">discount</p>
                    </div>
                  </td>
                  <td className="text-center w-[15%]">
                    <div className="mt-4">
                      - ${parseFloat(getPostMeta("_cart_discount"))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="w-[85%]">
                    <div className="text-end mt-4">
                      <p className=" mb-1 font-semibold text-sm">Order Total</p>
                    </div>
                  </td>
                  <td className="text-center w-[15%]">
                    <div className="mt-4"> $ {getPostMeta("_order_total")}</div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="w-[85%]">
                    <div className="text-end mt-4">
                      <p className=" mb-1 font-normal text-sm">Total Earning</p>
                    </div>
                  </td>
                  <td className="text-center w-[15%]">
                    <div className="mt-4"> ${getPostMeta("_order_total")}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="bg-blueTwo rounded-sm text-white px-4 py-3">
            Order Notes
          </div>

          <div className="py-4 pb-8 px-4 mb-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            {orderNotes.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className="pb-1 border-b border-[#E1E1E1] mb-2"
                >
                  <p className="font-bold text-[17px] text-black normal-case">
                    {item.user.display_name}
                    <span className="text-[#4F547B] font-normal text-[13px] ml-1">
                      {moment(item.comment_date).format(
                        "DD MMM YYYY | hh:mm a",
                      )}
                    </span>
                  </p>
                  <p className="font-semibold text-primaryMain mt-1 normal-case text-[15px]">
                    {item.content}
                  </p>

                  <div className="my-2">
                    <ul className="flex flex-wrap gap-2">
                      {item.attachment && (
                        <li>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.attachment}`}
                            alt=""
                            height={180}
                            width={180}
                            className="rounded-md"
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
            <div className="mt-4">
              <label className="block text-zinc-600 text-sm font-bold mb-1">
                Add Note
              </label>
              <textarea
                placeholder="write your comments here"
                className="min-h-16 rounded-sm border border-slate-200 w-full dark:bg-slate-900 dark:border-slate-700"
                rows={3}
                {...formik.getFieldProps("content")}
              ></textarea>
              {formik.touched.content && formik.errors.content ? (
                <div className="text-red-600">{formik.errors.content}</div>
              ) : null}
            </div>

            <label className="block text-zinc-600 text-sm font-bold my-2">
              Attachment(s)
            </label>
            <div className="">
              <>
                <div className="relative">
                  <div className="border border-slate-200 p-3 attachment_card relative mt-3  dark:border-slate-700">
                    <div className="mt-4 ">
                      <div className="">
                        <label className="block text-zinc-600 text-sm font-bold">
                          File
                        </label>
                        <SingleUploadComponent
                          component={{
                            isUploaded: profileImage !== "" ? true : false,
                            item: profileImage,
                          }}
                          type="add"
                          handleImageChange={(e) => {
                            if (e.target.files) {
                              setProfileImage(e.target.files[0]);
                              formik.setFieldValue(
                                "attachment",
                                e.target.files[0],
                              );
                            }
                          }}
                        />
                        <p className="mt-1 text-red-500 font-medium text-xs">
                          Image size must be 160px * 160px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
            <div className="flex justify-end mt-4">
              <div className="w-48">
                <SearchSingleSelect label="" Options={privatNoteArray} />
              </div>
            </div>
            <div className="text-end mt-4">
              {" "}
              <button
                type="submit"
                className="btn bg-primaryMain  hover:bg-blueTwo text-white"
              >
                <span className="hidden xs:block">Add</span>
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
    </SelectedItemsProvider>
  );
};

export default OrderDetails;
