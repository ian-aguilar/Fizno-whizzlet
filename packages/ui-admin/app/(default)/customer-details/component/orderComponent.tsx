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

import { useRouter } from "next/navigation";
import ProductCategoryTable from "./customer-order-table";
import CustomerTable from "./customer-order-table";
import CustomerOrderTable from "./customer-order-table";

function CustomerOrderContent() {
  const router = useRouter();
  // Some dummy customers data
  const customersOrder: any = [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full max-w-[96rem] mx-auto">
      {/* Table */}
      <CustomerOrderTable customersOrder={customersOrder} />
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

export default function CustomerOrderPage() {
  return (
    <SelectedItemsProvider>
      <CustomerOrderContent />
    </SelectedItemsProvider>
  );
}
