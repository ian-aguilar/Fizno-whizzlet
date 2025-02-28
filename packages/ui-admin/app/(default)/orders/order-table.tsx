import { StaticImageData } from "next/image";
import { useItemSelection } from "@/components/utils/use-item-selection";
import OrderTableItem from "./order-table-item";
import React from "react";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
export interface Order {
  id: number;
  image: string;
  itemName: string;
  orderId: string;
  purchased: string;
  address: string;
  sales: string;
  earning: string;
  date: string;
  status: string;
  shippedDate: string;
  orderItems: any;
}

export default function OrderTable({ orders }: { orders: Order[] }) {
  const { selectedItems, handleCheckboxChange } = useItemSelection(orders);
  const sellerArray = [{ label: "Seller 1", value: "1" }];
  const customerArray = [{ label: "customer 1", value: "1" }];

  return (
    <>
      <div className="py-3 px-3 mb-4 flex justify-between items-center bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
        <div className="">
          {" "}
          <span className="text-sm cursor-pointer mr-1 bg-primaryMain text-white px-2 rounded-sm">
            All
          </span>
          {""}|{""}
          <span className="ms-1 text-sm text-primaryMain cursor-pointer px-2 rounded-sm">
            Awaiting Shipment
          </span>
          {""}|{" "}
          <span className="text-sm text-primaryMain cursor-pointer mr-1 px-2 rounded-sm">
            Awaiting Delivery
          </span>
          |{" "}
          <span className="text-sm text-primaryMain cursor-pointer px-2 rounded-sm">
            Delivered
          </span>{" "}
          |{" "}
          <span className="text-sm text-primaryMain cursor-pointer px-2 rounded-sm">
            Payout Completed
          </span>{" "}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
        <header className="px-5 py-2">
          {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          All Products{" "}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            248
          </span>
        </h2> */}
        </header>
        <div>
          {/* Table */}

          <div className="flex justify-between mb-4 px-4">
            <div className="flex items-center">
              {/* <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3"
               
              >
                <span className="hidden xs:block ">Print</span>
              </button>
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3"
         
              >
                <span className="hidden xs:block ">Pdf</span>
              </button>
              <button
                className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3"
      
              >
                <span className="hidden xs:block ">Excel</span>
              </button> */}
            </div>
          </div>
          <div className="flex justify-between mb-4 px-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center ">
                <span>Show</span>
                <select className="h-9 w-20 mx-2 dark:bg-slate-900 dark:border-slate-700">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option> <option>100</option>
                </select>
                <span>Entries</span>
              </div>
              <div className="w-52">
                <SearchSingleSelect
                  placeholder="Search by Seller"
                  label=""
                  Options={sellerArray}
                />
              </div>
              <div className="w-56">
                <SearchSingleSelect
                  placeholder="Search by Customer"
                  label=""
                  Options={customerArray}
                />
              </div>
            </div>
            <div className="">
              <button className="btn bg-primaryMain hover:bg-blueTwo text-white mr-3">
                <span className="">CSV Export</span>
              </button>
              <input
                type="text"
                className="h-9 px-2 rounded-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                placeholder="search"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-slate-300">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Item</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold">Order</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">Date</div>
                  </th>

                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">
                      Shipping Address
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">Gross Sales</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Earning</div>
                  </th>

                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                    <div className="font-semibold">Status</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Actions</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                {orders.map((order) => (
                  <OrderTableItem
                    key={order.id}
                    order={order}
                    onCheckboxChange={handleCheckboxChange}
                    isSelected={selectedItems.includes(order.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
