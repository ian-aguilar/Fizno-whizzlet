import Image from "next/image";
import Tooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { Seller } from "./pending-seller-table";
import { AdminApi } from "@fizno/api-client/src/apis/AdminApi";

interface ApprovedSellerTableItemProps {
  seller: Seller;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
  setSnackbar: (e: any) => void;
  snackbar: any;
}

export default function ApprovedSellerTableItem({
  seller,
  onCheckboxChange,
  isSelected,
  snackbar,
  setSnackbar,
}: ApprovedSellerTableItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(seller.id, e.target.checked);
  };
  const router = useRouter();
  const deleteUserById = async () => {
    const response = await AdminApi.deleteuserById(seller.id);
    if (response.remote === "success") {
      setSnackbar({
        message: "seller Deleted Successfully",
        severity: "success",
        open: true,
      });
    } else {
      setSnackbar({
        message: "Something went wrong",
        severity: "error",
        open: true,
      });
    }
  };

  const updateUserStatus = async (status: number) => {
    const response = await AdminApi.updateUserStatus({ status }, seller.id);
    if (response.remote === "success") {
      setSnackbar({
        message: "update status Successfully",
        severity: "success",
        open: true,
      });
    } else {
      setSnackbar({
        message: "Something went wrong",
        severity: "error",
        open: true,
      });
    }
  };
  return (
    <tr>
      {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M255.4 48.2c.2-.1 .4-.2 .6-.2s.4 .1 .6 .2L460.6 194c2.1 1.5 3.4 3.9 3.4 6.5v13.6L291.5 355.7c-20.7 17-50.4 17-71.1 0L48 214.1V200.5c0-2.6 1.2-5 3.4-6.5L255.4 48.2zM48 276.2L190 392.8c38.4 31.5 93.7 31.5 132 0L464 276.2V456c0 4.4-3.6 8-8 8H56c-4.4 0-8-3.6-8-8V276.2zM256 0c-10.2 0-20.2 3.2-28.5 9.1L23.5 154.9C8.7 165.4 0 182.4 0 200.5V456c0 30.9 25.1 56 56 56H456c30.9 0 56-25.1 56-56V200.5c0-18.1-8.7-35.1-23.4-45.6L284.5 9.1C276.2 3.2 266.2 0 256 0z"></path>
          </svg>
        </div>
      </td> */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className=" font-bold text-primaryMain">
          {`${seller?.wp_nepaz2_usermeta?.find((item) => item.meta_key === "dokan_store_name")?.meta_value}-${seller?.wp_nepaz2_usermeta?.find((item) => item.meta_key === "dokan_store_name")?.meta_value}(${seller.id}-${seller?.wp_nepaz2_usermeta?.find((item) => item.meta_key === "dokan_store_name")?.meta_value})`}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 ">
        <div className="text-left w-40 font-semibold text-orange-400">
          {
            seller?.wp_nepaz2_usermeta?.find(
              (item) => item.meta_key === "dokan_store_name",
            )?.meta_value
          }
        </div>
      </td>
      {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ">
        <div className="text-center">-</div>
      </td> */}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center">{"$0.00"}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center">{"$0.00"}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center">{"$0.00"}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        {/* Menu button */}
        {seller.user_status == "0" ? (
          <button onClick={() => updateUserStatus(1)}>
            <svg
              stroke="currentColor"
              fill="green"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="17px"
              width="17px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
            </svg>
          </button>
        ) : (
          <button onClick={() => updateUserStatus(0)}>
            <svg
              stroke="currentColor"
              fill="red"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 48C140.559 48 48 140.559 48 256c0 115.436 92.559 208 208 208 115.435 0 208-92.564 208-208 0-115.441-92.564-208-208-208zm104.002 282.881l-29.12 29.117L256 285.117l-74.881 74.881-29.121-29.117L226.881 256l-74.883-74.881 29.121-29.116L256 226.881l74.881-74.878 29.12 29.116L285.119 256l74.883 74.881z"></path>
            </svg>
          </button>
        )}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        {/* Menu button */}
        <button
          className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
          onClick={() => router.push(`/seller-details?id=${seller.id}`)}
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
          onClick={deleteUserById}
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
  );
}
