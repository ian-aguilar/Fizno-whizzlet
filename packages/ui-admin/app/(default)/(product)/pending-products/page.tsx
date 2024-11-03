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

import Image01 from "@/public/images/product1.png";
import Image02 from "@/public/images/product2.jpg";
import Image03 from "@/public/images/product3.jpg";
import Image04 from "@/public/images/product4.png";
import Image05 from "@/public/images/product1.png";
import Image06 from "@/public/images/product2.jpg";
import Image07 from "@/public/images/product3.jpg";
import Image08 from "@/public/images/product4.png";
import Image09 from "@/public/images/product1.png";
import Image10 from "@/public/images/product2.jpg";
import ProductTable from "./product-table";
import { useRouter } from "next/navigation";

function PendingProductContent() {
  const router = useRouter();
  // Some dummy customers data
  const products: any[] = [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        {/* Left: Title */}
        <div className="mb-4 sm:mb-0">
          <h1 className=" flex items-center text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            Pending Products
            <svg
              className="shrink-0 h-6 w-6 ms-2"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="32"
                d="M448 341.37V170.61A32 32 0 0 0 432.11 143l-152-88.46a47.94 47.94 0 0 0-48.24 0L79.89 143A32 32 0 0 0 64 170.61v170.76A32 32 0 0 0 79.89 369l152 88.46a48 48 0 0 0 48.24 0l152-88.46A32 32 0 0 0 448 341.37z"
              ></path>
              <path
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="32"
                d="m69 153.99 187 110 187-110m-187 310v-200"
              ></path>
            </svg>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Delete button */}
          <div className="">
            {/* <div className="text-red-500 border border-red-500 rounded-md py-1 px-2">
              Products Limit: Unlimited
            </div> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <ProductTable products={products} />

      {/* Pagination */}
      <div className="mt-8">
        <PaginationClassic
          pageIndex={0}
          pageSize={0}
          totalResults={0}
          setPageIndex={function (pageIndex: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}

export default function PendingProducts() {
  return (
    <SelectedItemsProvider>
      <PendingProductContent />
    </SelectedItemsProvider>
  );
}
