import Image from "next/image";
import Tooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { Customer } from "./customer-table";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";

interface CustomerTableItemProps {
  customer: Customer;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
  setSnackbar: (e: any) => void;
  snackbar: any;
}

export default function CustomerTableItem({
  customer,
  onCheckboxChange,
  isSelected,
  snackbar,
  setSnackbar,
}: CustomerTableItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(customer.id, e.target.checked);
  };
  const router = useRouter();
  const handleDeleteCategoryById = async (id: number) => {
    const response = await AuthApi.deleteUserById(id as number);
    if (response.remote === "success") {
      setSnackbar({
        message: "User Deleted Successfully",
        severity: "success",
        open: true,
      });
    } else {
      setSnackbar({
        message: response?.error?.errors?.message || "An error occurred!",
        severity: "error",
        open: true,
      });
    }
  };
  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className=" font-bold text-primaryMain">{customer.username}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="">{customer.name}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 ">
          <div className="text-left w-40">{customer.email}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
          <div className="">{customer.role}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          {/* Menu button */}
          <button
            className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
            onClick={() => router.push(`/customer-details?id=${customer.id}`)}
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
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M12 6.5a9.77 9.77 0 0 1 8.82 5.5c-1.65 3.37-5.02 5.5-8.82 5.5S4.83 15.37 3.18 12A9.77 9.77 0 0 1 12 6.5m0-2C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z"></path>
            </svg>
          </button>
          <button
            onClick={() => handleDeleteCategoryById(customer.id)}
            className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
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
    </>
  );
}
