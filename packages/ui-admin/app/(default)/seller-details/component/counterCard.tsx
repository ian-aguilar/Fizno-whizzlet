"use client";

import Image from "next/image";
import Icon from "@/public/images/icon-01.svg";
import EditMenu from "@/components/edit-menu";

interface CounterCardProps {
  iconSrc: string;
  editMenuAlign: string;
  title: string;
  amount: string;
  percentage?: string;
  chartData?: any;
}

export default function CounterCard({
  iconSrc,
  editMenuAlign,
  title,
  amount,
  percentage,
  chartData,
}: CounterCardProps) {
  return (
    <div className="flex pb-3 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-3 pt-3 flex gap-1">
        <div className="w-2/12">
          <Image src={iconSrc} width={32} height={32} alt="Icon 01" />
        </div>
        <div className="w-10/12 ">
          <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {title}
          </h2>
          {/* <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
          Amount
        </div> */}
          <div className="flex items-start">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
              {amount}
            </div>
            {percentage && (
              <div className="text-sm font-semibold text-white px-1.5 bg-emerald-500 rounded-full">
                {percentage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { CounterCardProps };
