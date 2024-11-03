"use client";

// export const metadata = {
//   title: "Customers - Mosaic",
//   description: "Page description",
// };
import React, { useState, useEffect } from "react";
import { SelectedItemsProvider } from "@/app/selected-items-context";
import PaginationClassic from "@/components/pagination-classic";
import ReviewTable from "./review-table";
import Image01 from "@/public/images/soccer.jpeg";
import Image02 from "@/public/images/soccer.jpg";

import Image03 from "@/public/images/product1.png";

import Image04 from "@/public/images/fourBox.png";

import Image05 from "@/public/images/applications-image-32.jpg";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";
import moment from "moment";
import RoundedLoader from "@/components/common/loader/roundedLoader";
import { Alert, Snackbar } from "@mui/material";

function ReviewContent() {
  // Some dummy customers data
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  // Static values for demo purposes
  const pageSize = 10;
  const totalResults = 95; // Assume 95 items available

  // Sample array of data (could be fetched data)
  const data = Array.from({ length: totalResults }, (_, i) => `Item ${i + 1}`);

  // Get the current page's data
  const currentPageData = data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize,
  );

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    getAllReviews();
  };

  const getAllReviews = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.getAllReview();
      if (response.remote === "success") {
        console.log(response.data);
        const data = response.data.data.map((item: any) => {
          return {
            id: item.comment_ID,
            date: moment(item.comment_date).format("DD/MM/YYYY"),
            buyer: item.user.display_name,
            seller: item.posts.wp_nepaz2_users.display_name,
            starRating: item.wp_commentmeta[0].meta_value,
            productDetail: {
              id: item.posts.ID,
              image: item.posts.attachments[0]?.guid.includes("http")
                ? item.posts.attachments[0]?.guid
                : item.posts.attachments[0]?.guid
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.posts.attachments[0]?.guid}`
                  : Image01.src,
              title: item.posts.post_title,
            },
          };
        });
        setReviews(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  return loading ? (
    <RoundedLoader />
  ) : (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Reviews
            <svg
              className="shrink-0 h-6 w-6 ms-2"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 576 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M112 112c0 35.3-28.7 64-64 64V336c35.3 0 64 28.7 64 64H464c0-35.3 28.7-64 64-64V176c-35.3 0-64-28.7-64-64H112zM0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM176 256a112 112 0 1 1 224 0 112 112 0 1 1 -224 0zm80-48c0 8.8 7.2 16 16 16v64h-8c-8.8 0-16 7.2-16 16s7.2 16 16 16h24 24c8.8 0 16-7.2 16-16s-7.2-16-16-16h-8V208c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16z"></path>
            </svg>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Delete button */}
        </div>
      </div>

      {/* Table */}
      <ReviewTable
        earnings={reviews}
        setSnackbar={setSnackbar}
        snackbar={snackbar}
      />

      {/* Pagination */}
      <div className="mt-8">
        <PaginationClassic
          // ts-ignore
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalResults={totalResults}
          setPageIndex={setPageIndex}
        />
      </div>
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

export default function MyEarnings() {
  return (
    <SelectedItemsProvider>
      <ReviewContent />
    </SelectedItemsProvider>
  );
}
