"use client";

// export const metadata = {
//   title: "Customers - Mosaic",
//   description: "Page description",
// };

import { SelectedItemsProvider } from "@/app/selected-items-context";
import DeleteButton from "@/components/delete-button";
import DateSelect from "@/components/date-select";
import FilterButton from "@/components/dropdown-filter";
import PaginationClassic from "@/components/pagination-classic";

import Image01 from "@/public/images/user-40-01.jpg";
import Image02 from "@/public/images/user-40-02.jpg";
import Image03 from "@/public/images/user-40-03.jpg";
import Image04 from "@/public/images/user-40-04.jpg";
import Image05 from "@/public/images/user-40-05.jpg";
import Image06 from "@/public/images/user-40-06.jpg";
import Image07 from "@/public/images/user-40-07.jpg";
import Image08 from "@/public/images/user-40-08.jpg";
import Image09 from "@/public/images/user-40-09.jpg";
import Image10 from "@/public/images/user-40-10.jpg";
import { useRouter } from "next/navigation";
import PendingSellerTable from "./pending-seller-table";
import ApprovedSellerTable from "./pending-seller-table";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import { useEffect, useState } from "react";
import RoundedLoader from "@/components/common/loader/roundedLoader";
import { Alert, Snackbar } from "@mui/material";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";

function ApprovedSellerContent() {
  const router = useRouter();
  const [vendors, setVendors] = useState<any>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  // Some dummy customers data
  const fetchVendor = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.getBlockedVendors({
        pageIndex,
        pageSize,
        query,
      });
      if (response.remote === "success") {
        setVendors(response.data.data.newData);
        setTotalCount(response.data.data.totalCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVendor();
  }, [pageIndex]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    fetchVendor();
  };

  return loading ? (
    <RoundedLoader />
  ) : (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Blocked Seller
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
          {/* <button
            className="btn bg-primaryMain hover:bg-blueTwo text-white"
            onClick={() => router.push("/add-product-category")}
          >
            <span className="hidden xs:block ">Add</span>
          </button> */}
        </div>
      </div>

      {/* Table */}
      <ApprovedSellerTable
        sellers={vendors}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />

      {/* Pagination */}
      <div className="mt-8">
        <PaginationClassic
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          totalResults={totalCount}
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

export default function SellerList() {
  return (
    <SelectedItemsProvider>
      <ApprovedSellerContent />
    </SelectedItemsProvider>
  );
}
