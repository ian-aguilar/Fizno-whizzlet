"use client";

import { SelectedItemsProvider } from "@/app/selected-items-context";
import Image01 from "@/public/images/applications-image-06.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import SVG from "@/public/svg";
import ManageOrderStatusTable from "./manage-orderStatus-table";

function ManageOrderStatus() {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  // Some dummy customers data

  /**
   * state management
   */
  const OrderStatusArray = [
    { id: 1, name: "order one", slug: "422dwwd", color: "#000" },
  ];
  const [bannerData, setBannerData] = useState<
    { id: number; name: string; slug: string; color: string }[]
  >([]);

  /**
   * handle get all banners
   */
  const handleGetAllBanner = async () => {
    const response = await AdminApi.getAllOrderStatus();
    if (response.remote === "success") {
      const data = response.data.data;
      const bData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        color: item.color,
      }));
      setBannerData(bData);
    }
  };

  useEffect(() => {
    handleGetAllBanner();
  }, []);
  console.log({ bannerData });

  const handleCloseSnackbar = () => {
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
    handleGetAllBanner();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Manage Order Status
            {/* <svg
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
            </svg> */}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Delete button */}
          <button
            className="btn bg-primaryMain hover:bg-blueTwo text-white"
            onClick={() => router.push("/add-order-status")}
          >
            <span className="hidden xs:block ">Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <ManageOrderStatusTable
        categories={bannerData}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
      {/* {bannerData?.length === 0 && (
        <div className="w-full h-[200px] bg-white flex items-center justify-center">
          <CircularProgress />
        </div>
      )} */}
      {/* {!bannerData && (
        <div className="w-full h-[200px] bg-white flex items-center justify-center">
          <SVG.NoData />
        </div>
      )} */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
  );
}

export default function ManageOrderStatusContent() {
  return (
    <SelectedItemsProvider>
      <ManageOrderStatus />
    </SelectedItemsProvider>
  );
}
