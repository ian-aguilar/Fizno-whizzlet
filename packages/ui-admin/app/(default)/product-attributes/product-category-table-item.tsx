import Image from "next/image";
import Tooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { Attribute } from "./product-category-table";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import Link from "next/link";

interface ProductAttributesTableItemProps {
  attribute: Attribute;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
}

export default function ProductAttributesTableItem({
  attribute,
  onCheckboxChange,
  isSelected,
}: ProductAttributesTableItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(attribute.attribute_id, e.target.checked);
  };
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });
  const router = useRouter();
  const deleteAttribute = async () => {
    const response = await categoriesService.deleteAttributesById(
      attribute.attribute_id as number,
    );
    if (response.remote === "success") {
      setSnackbar({
        message: "Attribute Deleted Successfully",
        severity: "success",
        open: true,
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // console.log(attribute.details, attribute.attribute_name)
  return (
    <>
      <tr>
        <td
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          valign="top"
        >
          <div className=" font-bold text-primaryMain">
            {attribute.attribute_label}
          </div>
        </td>
        <td
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap "
          valign="top"
        >
          <div className="">{attribute.attribute_name}</div>
        </td>
        <td
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          valign="top"
        >
          <div className="text-center">{attribute.attribute_orderby}</div>
        </td>
        <td
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"
          valign="top"
        >
          <div
            className=" w-80 relative"
            style={{
              whiteSpace: "pre-line",
              wordBreak: "break-all",

              display: "-webkit-box",
              overflow: "hidden",
            }}
          >
            {attribute?.details?.slice(0, 50).map((item: any) => {
              return `${item.term.name},`;
            })}{" "}
            {attribute?.details.length > 50 &&
              `(${attribute?.details.length - 50} more)`}
          </div>
          <p
            onClick={() =>
              router.push(
                `/edit-product-attributes?id=${attribute.attribute_id}`,
              )
            }
            className="text-primaryMain cursor-pointer text-left w-full"
          >
            Configure terms
          </p>
        </td>
        <td
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px"
          valign="top"
        >
          {/* Menu button */}

          <button
            className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
            onClick={() =>
              router.push(
                `/edit-product-attributes?id=${attribute.attribute_id}`,
              )
            }
          >
            <svg
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            onClick={deleteAttribute}
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
    </>
  );
}
