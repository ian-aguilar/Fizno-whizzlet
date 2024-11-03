"use client";
import BuyerSidebar from "@/components/common/sidebar/buyerSidebar";
import { usePathname } from "next/navigation";
import React from "react";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const hidesidebar = currentPath;

  return (
    <div className="flex overflow-hidden bg-white">
      {/* Sidebar */}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-x-hidden">
        {/*  Site header */}
        <div className="container">
          <div className="flex">
            <div
              className={` ${hidesidebar === "/order-detail" ? "hidden" : "w-1/5"} `}
            >
              <BuyerSidebar />
            </div>
            <div
              className={` ${hidesidebar === "/order-detail" ? "w-12/12" : "w-4/5"} `}
            >
              <main
                className={`grow [&>*:first-child]:scroll-mt-16 bg-white uppercase p-5  pr-0 pb-22 ${hidesidebar === "/order-detail" ? "pl-0" : ""}  `}
              >
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
