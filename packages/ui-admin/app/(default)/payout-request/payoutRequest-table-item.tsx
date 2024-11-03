import React from "react";
import { Earning } from "./payoutRequest-table";

interface CustomersTableItemProps {
  earning: Earning;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
}

export default function PayoutRequestTableTableItem({
  earning,
}: CustomersTableItemProps) {
  const [mainStatus, subStatus] = earning.status.split("|"); // Splitting status by "|"

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sm text-[#1E293B] dark:text-slate-100 text-center">
          {earning.orderId}
        </div>
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 ">
        <div className="text-center font-medium text-[#475569] ">
          {earning.dateTime}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center font-medium ">{earning.requestedBy}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-center font-medium ">
          {earning.requestedAmount}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-right font-medium ">
          {" "}
          {mainStatus}
          <br />
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            {subStatus}
          </span>
        </div>
      </td>
    </tr>
  );
}
