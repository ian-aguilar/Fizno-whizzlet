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
import { useAppDispatch, useAppSelector } from "@fizno/ui-core/src/redux/hooks";
import {
  globalCacheStateSelector,
  setAlertMessage,
  setPreLoader,
  closeSnackbar,
} from "@fizno/ui-core/src/redux/slices/globaCache.slice";
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
import ProductCategoryTable from "./product-category-table";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Alert, Snackbar } from "@mui/material";
interface GetCategoriesParams {
  pageSize?: number;
  pageIndex?: number;
  query?: string;
  search: string;
}
interface Category {
  id: number;
  image: string;
  name: string;
  count: string;
  type: string;
  slug: string;
  expiryDate: string;
  description: string;
  usageLimit: string;
  parent: number;
}
function ProductCategoryContent() {
  // redux
  const dispatch = useAppDispatch();
  const { preLoader } = useAppSelector(globalCacheStateSelector);

  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [rowPerPageValue, setRowPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 1000);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  // reset alert message

  // Function to transform API response to desired format
  const transformCategories = (data: any[]): any[] => {
    return data.map((item, index) => ({
      id: item.term_id,
      image: Image01, // Assuming all categories have the same image
      name: item.term.name,
      count: item.count, // Adjust as per your data or remove if not needed
      type: "Type Placeholder", // Adjust as per your data or remove if not needed
      slug: item.term.slug,
      expiryDate: "Expiry Date Placeholder", // Adjust as per your data or remove if not needed
      description: item.description, // Adjust as per your data or remove if not needed
      usageLimit: "Usage Limit Placeholder", // Adjust as per your data or remove if not needed
      parent: item.parent,
    }));
  };
  const fetchCategories = async (params: GetCategoriesParams) => {
    dispatch(setPreLoader(true));
    try {
      const result = await categoriesService.getCategories(params);
      if (result.remote === "success") {
        dispatch(setPreLoader(false));
        const transformedData = transformCategories(
          result.data.data.updatedData,
        );
        setCategories(transformedData);
        setTotalResults(result?.data?.data?.totalResults);
      }
    } catch (error) {
      dispatch(setPreLoader(false));
      console.error("Error fetching categories:", error);
    } finally {
      dispatch(setPreLoader(false));
    }
  };

  const handleRowPerPageChange = (value: number) => {
    setRowPerPage(value);
    setPageIndex(1); // Reset to first page
    fetchCategories({ pageSize: value, pageIndex: 1, search });
  };

  // Handle pagination change
  const handlePageChange = (pageIndex: number) => {
    setPageIndex(pageIndex);
    fetchCategories({ pageSize: rowPerPageValue, pageIndex, search });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    fetchCategories({ pageSize: rowPerPageValue, pageIndex, search });
  }, [rowPerPageValue, pageIndex, searchDebounce]);
  // // Fetch categories data on component mount
  // useEffect(() => {
  //   fetchCategories({ pageSize: rowPerPageValue, pageIndex, search });
  // }, [rowPerPageValue, pageIndex]); // Empty dependency array ensures it runs once on mount

  // useEffect(() => {
  //   const params: GetCategoriesParams = {
  //     pageSize: rowPerPageValue, // Example page size
  //     pageIndex: 1, // Example page index
  //     query: "", // Example query
  //     search,
  //   };
  //   fetchCategories(params);
  // }, [searchDebounce]);
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    fetchCategories({ pageSize: rowPerPageValue, pageIndex, search });
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Product Category
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
            onClick={() => router.push("/add-product-category")}
          >
            <span className="hidden xs:block ">Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <ProductCategoryTable
        categories={categories}
        handleRowPerPageChange={handleRowPerPageChange}
        rowPerPageValue={rowPerPageValue}
        handleSearch={handleSearch}
        loading={preLoader}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
      <div className="mt-8">
        <PaginationClassic
          pageIndex={pageIndex}
          pageSize={rowPerPageValue}
          totalResults={totalResults}
          setPageIndex={handlePageChange}
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

export default function ProductCategory() {
  return (
    <SelectedItemsProvider>
      <ProductCategoryContent />
    </SelectedItemsProvider>
  );
}
