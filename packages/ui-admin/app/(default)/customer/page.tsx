"use client";

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
import CustomerTable from "./customer-table";
import { useEffect, useState } from "react";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import RoundedLoader from "@/components/common/loader/roundedLoader";
import { Alert, Snackbar } from "@mui/material";
interface OriginalUserType {
  id: number;
  user_login: string;
  user_pass: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
  user_registered: string;
  user_activation_key: string;
  user_status: number;
  display_name: string;
  wp_nepaz2_usermeta: any;
}

interface CustomerType {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}
function CustomerContent() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const transformUsers = (users: OriginalUserType[]): CustomerType[] => {
    return users.map((user) => ({
      id: user.id,
      username: user.user_login,
      name: user.display_name,
      email: user.user_email,
      role:
        user.wp_nepaz2_usermeta.length > 0
          ? Object.keys(user.wp_nepaz2_usermeta[0]?.meta_value)[0]
          : "", // You might want to determine this value based on your logic
    }));
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    fetchUsers();
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response: any = await AuthApi.getAllCustomer({
        pageIndex,
        pageSize,
        query,
      });

      if (response.remote === "success") {
        const customers: CustomerType[] = transformUsers(
          response.data.data.updateData as any,
        );
        setTotalCount(response.data.data.totalCount);
        console.log(customers);
        setCustomers(customers);
      } else {
        console.error("Failed to fetch users:", response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [pageIndex, pageSize, query]);

  return isLoading ? (
    <RoundedLoader />
  ) : (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Customers
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
          {/* Add button */}
          {/* <button
            className="btn bg-primaryMain hover:bg-blueTwo text-white"
            onClick={() => router.push("/add-customer")}
          >
            <span className="hidden xs:block ">Add</span>
          </button> */}
        </div>
      </div>

      {/* Table */}
      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        setPageSize={setPageSize}
        pageSize={pageSize}
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

export default function CustomerPage() {
  return (
    <SelectedItemsProvider>
      <CustomerContent />
    </SelectedItemsProvider>
  );
}
