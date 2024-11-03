import React from "react";
import { Earning } from "./review-table";
import { Avatar } from "@mui/material";
import SVG from "@/public/svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Image03 from "@/public/images/product1.png";
import IMAGES from "@/public/images";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
interface CustomersTableItemProps {
  earning: Earning;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
  setSnackbar: (e: any) => void;
  snackbar: any;
}

export default function ReviewTableTableItem({
  earning,
  setSnackbar,
  snackbar,
}: CustomersTableItemProps) {
  const router = useRouter();
  const deleteItem = async () => {
    try {
      const response = await AdminApi.deleteReviewById(earning.id as number);
      if (response.remote === "success") {
        setSnackbar({
          message: "review Deleted Successfully",
          severity: "success",
          open: true,
        });
      }
    } catch (error) {
      setSnackbar({
        message: "something went wrong",
        severity: "error",
        open: true,
      });
    }
  };
  return (
    <tr>
      <td
        onClick={() => router.push(`/review-detail?id=${earning.id}`)}
        className="px-2 cursor-pointer first:pl-5 last:pr-5 py-3 w-[25%]"
      >
        <div className="flex items-center gap-3">
          <div className="border border-slate-200 rounded-md h-12 w-12 flex justify-center items-center">
            <Image
              className="default_img"
              src={earning.productDetail.image}
              width={50}
              height={50}
              alt={earning.productDetail.title}
              // onError={(e) => {
              //   e.target.src = IMAGES.Product1;
              // }}
            />
          </div>
          <div>
            {/* <p className="text-sm mb-1 font-semibold text-[#2B2B2B]">Buyer</p> */}
            <p className="text-base text-primaryMain font-semibold truncate w-[250px]">
              {earning.productDetail.title}
            </p>
          </div>
        </div>
      </td>
      <td
        onClick={() => router.push("/review-detail")}
        className="cursor-pointer px-2 first:pl-5 last:pr-5 py-3 w-[20%]"
      >
        <div className="text-center font-medium text-[#475569] ">
          {earning.buyer}
        </div>
      </td>
      <td className="cursor-pointer px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-[20%]">
        <div className="text-center font-medium ">{earning.seller}</div>
      </td>

      <td className="px-4 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-[10%]">
        <div className="text-center font-medium ">
          {" "}
          <div className="flex gap-1 my-1 justify-center">
            {[1, 2, 3, 4, 5].slice(0, parseInt(earning.starRating)).map(
              (item) => (
                // item <= el.rating ? (
                <SVG.yellowStar key={item} />
              ),
              // ) : (
              //   <SVG.GreyStar key={item} />
              // ),
            )}
          </div>
          {earning.starRating}
        </div>
      </td>
      <td
        onClick={() => router.push("/review-detail")}
        className="cursor-pointer px-2 first:pl-5 last:pr-5 py-3 w-[20%]"
      >
        <div className="text-center font-medium text-[#475569] ">
          {earning.date}
        </div>
      </td>
      <td className=" px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-[10%]">
        {/* Menu button */}

        <select className="h-9 border-slate-200 px-1 w-24 focus-visible:outline-none">
          <option>Active</option>
          <option>InActive</option>
        </select>
        <button
          onClick={deleteItem}
          className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z"></path>
            <path d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
}
