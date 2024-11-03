"use client";

import { SelectedItemsProvider } from "@/app/selected-items-context";
import Image01 from "@/public/images/applications-image-06.jpg";
import { useRouter } from "next/navigation";
import HomepageTable from "./footer-table";
import { useEffect, useState } from "react";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import SVG from "@/public/svg";
import FooterSocialMediaTable from "./footer-table";

function ManageSocialMediaContent() {
  const router = useRouter();
  // Some dummy customers data
  const content = [
    {
      id: 0,
      image: Image01,
      title: "SEARCH, SELL & BUY. WE KEEP IT SIMPLE.",
      url: "https://www.instagram.com/",
    },
    {
      id: 1,
      image: Image01,
      title: "SEARCH, SELL & BUY. WE KEEP IT SIMPLE.",
      url: "https://www.facebook.com/",
    },
  ];

  /**
   * state management
   */
  const [bannerData, setBannerData] = useState<
    { id: number; image: string; title: string }[] | null
  >([]);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  /**
   * handle get all banners
   */
  const handleGetAllBanner = async () => {
    const response = await AdminApi.getSocialMediaIcon();

    if (response.remote === "success") {
      const data = response.data.data;
      const bData = data.map((item: any) => ({
        id: item.id,
        image: `${"http://digimonk.net:2770"}/${item.icon}`,
        name: item.name,
        url: item.url,
      }));
      setBannerData(bData);
    } else {
      setBannerData(null);
    }
  };

  useEffect(() => {
    handleGetAllBanner();
  }, []);
  // console.

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
            Manage Footer Social Media
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

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Delete button */}
          <button
            className="btn bg-primaryMain hover:bg-blueTwo text-white"
            onClick={() => router.push("/manage-footer/add-social-media")}
          >
            <span className="hidden xs:block ">Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <FooterSocialMediaTable
        categories={bannerData}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
      {bannerData?.length === 0 && (
        <div className="w-full h-[200px] bg-white flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
      {!bannerData && (
        <div className="w-full h-[200px] bg-white flex items-center justify-center">
          <SVG.NoData />
        </div>
      )}
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

export default function FooterSocialMedia() {
  return (
    <SelectedItemsProvider>
      <ManageSocialMediaContent />
    </SelectedItemsProvider>
  );
}
