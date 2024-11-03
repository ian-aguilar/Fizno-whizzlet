"use client";
import { useItemSelection } from "@/components/utils/use-item-selection";
import EarningsTableItem from "./payoutRequest-table-item";
import RangeDatePicker from "@/components/common/datepicker/rangeDatePicker";
import React, { useState } from "react";
import MediumSizeModal from "@/components/common/modal/mediumSizeModal";
export interface Earning {
  id: number;
  orderId: string;
  dateTime: string;
  requestedBy: string;
  requestedAmount: string;
  status: string;
}

export default function PayoutRequestTable({
  earnings,
}: {
  earnings: Earning[];
}) {
  const { selectedItems, handleCheckboxChange } = useItemSelection(earnings);
  const [getPaidNowModalOpen, setGetPaidNowModalOpen] =
    useState<boolean>(false);
  return (
    <>
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
              <div className="flex items-center ">
                <span>Show</span>
                <select className=" h-9 w-20 mx-2 border-slate-200 border rounded-sm dark:bg-[rgb(18,18,18)] dark:border-slate-700">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option> <option>100</option>
                </select>
                <span>Entries</span>
              </div>
              <div className="ms-4">
                <RangeDatePicker />
              </div>
            </div>
            <div className="">
              <input
                type="text"
                className="h-9 w-72 text-sm px-2 rounded-sm border border-slate-200 dark:border-slate-700 dark:bg-[rgb(18,18,18)]"
                placeholder="search by seller name or Order ID"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-slate-300">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                    <div className="font-semibold text-left"> ID</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">Date</div>
                  </th>{" "}
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">Request By</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">
                      Requested Amount
                    </div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-right">Status</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                {earnings.map((earning) => (
                  <EarningsTableItem
                    key={earning.id}
                    earning={earning}
                    onCheckboxChange={handleCheckboxChange}
                    isSelected={selectedItems.includes(earning.id)}
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
