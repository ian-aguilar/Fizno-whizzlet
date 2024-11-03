import Image from "next/image";
import { Product } from "./product-table";
import Tooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import TooltipMainComponent from "@/components/common/tooltip/tooltipMainComponent";
import Image01 from "@/public/images/product3.jpg";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { useState } from "react";
import Link from "next/link";

interface CustomersTableItemProps {
  product: Product;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
  snackbar: any;
  setSnackbar: (e: any) => void;
}

export default function ProductTableItem({
  product,
  onCheckboxChange,
  isSelected,
  snackbar,
  setSnackbar,
}: CustomersTableItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(product.id, e.target.checked);
  };
  const router = useRouter();
  const [productImage, setProductImage] = useState(product.image);

  const handleDeleteProductById = async (id: number) => {
    const response = await categoriesService.deleteProductById(id);
    if (response.remote === "success") {
      setSnackbar({
        message: "Product Deleted Successfully",
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
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <label className="inline-flex">
              <span className="sr-only">Select</span>
              <input
                className="form-checkbox text-primaryMain"
                type="checkbox"
                onChange={handleCheckboxChange}
                checked={isSelected}
              />
            </label>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <Image
            className="rounded-full"
            src={productImage}
            width={40}
            height={40}
            alt={product.name}
            onError={() => setProductImage(Image01)}
          />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 ">
          <div className="flex items-center">
            <div className="font-medium text-slate-800 dark:text-slate-100">
              {product.name}
            </div>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          {product.status === "draft" ? (
            <div className="text-center text-xs rounded-sm text-white bg-primaryMain capitalize">
              {product.status}
            </div>
          ) : (
            <div className="text-center text-xs rounded-sm text-white bg-emerald-500 capitalize">
              {product.status}
            </div>
          )}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          {product.stock === 0 ? (
            <div className="text-left font-semibold text-red-400">
              Out of stock
            </div>
          ) : (
            <div className="text-left font-semibold text-emerald-500">
              In stock
              <span className="text-zinc-500 font-normal ms-2">
                ({product.stock})
              </span>
            </div>
          )}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left">{product.price}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-center">
            <b>Categories:</b>
            {product.taxonomies?.map(
              (item: any, index: any) =>
                item.term_taxonomy.taxonomy === "product_cat" && (
                  <span
                    key={index}
                    className="block text-emerald-500 font-semibold"
                  >
                    {`${item.term_taxonomy.term.name},`}
                  </span>
                ),
            )}
          </div>
          <div className="text-center">
            <b>Conditions:</b>
            {product.taxonomies?.map(
              (item: any, index: any) =>
                item.term_taxonomy.taxonomy === "pa_condition" && (
                  <span
                    key={index}
                    className="block text-emerald-500 font-semibold"
                  >
                    {`${item.term_taxonomy.term.name},`}
                  </span>
                ),
            )}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-center font-medium text-fuchsia-500">
            {product.views}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-center">{product.date}</div>
        </td>
        <td
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap flex items-center"
          style={{ minHeight: "110px" }}
        >
          {/* Menu button */}{" "}
          <TooltipMainComponent tooltipContent="View">
            <Link
              href={`http://digimonk.net:2765/search-detail?id=${product.id}`}
              target="_blank"
            >
              <div className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path>
                </svg>
              </div>
            </Link>
          </TooltipMainComponent>
          <TooltipMainComponent tooltipContent="Delete">
            <button
              className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
              onClick={() => handleDeleteProductById(product.id)}
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
          </TooltipMainComponent>
        </td>
      </tr>
    </>
  );
}
