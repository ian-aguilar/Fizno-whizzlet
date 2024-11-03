/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useRef, useState } from "react";
import { useAppProvider } from "@/app/app-provider";
import { useSelectedLayoutSegments } from "next/navigation";
import { Transition } from "@headlessui/react";
import { getBreakpoint } from "../utils/utils";
import SidebarLinkGroup from "./sidebar-link-group";
import SidebarLink from "./sidebar-link";
import Logo from "./logo";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const sidebar = useRef<HTMLDivElement>(null);
  const { sidebarOpen, setSidebarOpen } = useAppProvider();
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const segments = useSelectedLayoutSegments();
  const [breakpoint, setBreakpoint] = useState<string | undefined>(
    getBreakpoint(),
  );
  const pathname = usePathname();

  const expandOnly =
    !sidebarExpanded && (breakpoint === "lg" || breakpoint === "xl");

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!sidebar.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleBreakpoint = () => {
    setBreakpoint(getBreakpoint());
  };

  useEffect(() => {
    window.addEventListener("resize", handleBreakpoint);
    return () => {
      window.removeEventListener("resize", handleBreakpoint);
    };
  }, [breakpoint]);

  return (
    <div className={`min-w-fit ${sidebarExpanded ? "sidebar-expanded" : ""}`}>
      {/* Sidebar backdrop (mobile only) */}
      <Transition
        className="fixed inset-0 bg-primaryMain bg-opacity-30 z-40 lg:hidden lg:z-auto"
        show={sidebarOpen}
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        unmount={false}
        as="div"
        id="sidebar"
        ref={sidebar}
        className="flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64  lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-primaryMain p-4 transition-all duration-200 ease-in-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Logo />
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            {/* <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3> */}
            <ul className="mt-3">
              {/* Dashboard */}
              {/* <SidebarLinkGroup open={segments.includes('dashboard')}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${segments.includes('dashboard') ? 'hover:text-slate-200' : 'hover:text-white'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick()
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${segments.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'
                                  }`}
                                d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                              />
                              <path
                                className={`fill-current ${segments.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'
                                  }`}
                                d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                              />
                              <path
                                className={`fill-current ${segments.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'
                                  }`}
                                d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                              />
                            </svg>
                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Dashboard
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/dashboard">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Main
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/dashboard/analytics">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Analytics
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/dashboard/fintech">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Fintech
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )
                }}
              </SidebarLinkGroup> */}
              {/* E-Commerce */}
              {/* Dashboard */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("#") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="#">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Dashboard
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Product Categories */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("product-category") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="/product-category">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
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
                      <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                      <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                      <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                      <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Product Categories
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Product Attributes */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("product-attributes") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="/product-attributes">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Product Attributes
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Product  */}
              <SidebarLinkGroup open={segments.includes("#")}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          segments.includes("products")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
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
                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Products
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${
                              pathname === "/pending-products"
                                ? "bg-blueTwo"
                                : "bg-transparent"
                            }`}
                          >
                            <SidebarLink href="/pending-products">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Pending
                              </span>
                            </SidebarLink>
                          </li>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${
                              pathname === "/approved-products"
                                ? "bg-blueTwo"
                                : "bg-transparent"
                            }`}
                          >
                            <SidebarLink href="/approved-products">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Approved
                              </span>
                            </SidebarLink>
                          </li>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${
                              pathname === "/not-approved-products"
                                ? "bg-blueTwo"
                                : "bg-transparent"
                            }`}
                          >
                            <SidebarLink href="/not-approved-products">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Not Approved
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>
              {/* seller  */}
              <SidebarLinkGroup open={segments.includes("#")}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          segments.includes("products")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
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
                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Manage Sellers
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${pathname === "/pending-seller"
                              ? "bg-blueTwo"
                              : "bg-transparent"
                              }`}
                          >
                            <SidebarLink href="/pending-seller">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Pending
                              </span>
                            </SidebarLink>
                          </li>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${
                              pathname === "/approved-seller"
                                ? "bg-blueTwo"
                                : "bg-transparent"
                            }`}
                          >
                            <SidebarLink href="/approved-seller">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Approved
                              </span>
                            </SidebarLink>
                          </li>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${pathname === "/not-approved-seller"
                              ? "bg-blueTwo"
                              : "bg-transparent"
                              }`}
                          >
                            <SidebarLink href="/not-approved-seller">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Not Approved
                              </span>
                            </SidebarLink>
                          </li>
                          <li
                            className={`p-2 mb-1 last:mb-0 ${pathname === "/blocked-seller"
                              ? "bg-blueTwo"
                              : "bg-transparent"
                              }`}
                          >
                            <SidebarLink href="/blocked-seller">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Blocked
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>
              {/* Orders  */}
              {/* <SidebarLinkGroup open={segments.includes("#")}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          segments.includes("products")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
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
                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Orders
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Pending
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                In Process
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Completed
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Refunded
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Failed
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* order */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("orders") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="/orders">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
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

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Orders
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* order status */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("manage-order-status") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="/manage-order-status">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
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

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Manage Order Status
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Customers */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("customer") ||
                  segments.includes("customer-details/:id")
                    ? "bg-blueTwo"
                    : ""
                }`}
              >
                <SidebarLink href="/customer">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Customers
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Reviews  */}
              {/* <SidebarLinkGroup open={segments.includes("#")}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          segments.includes("products")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
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
                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Reviews
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Seller Reviews
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Product Reviews
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* Messages */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("review") ||
                  segments.includes("review-detail")
                    ? "bg-blueTwo"
                    : ""
                }`}
              >
                <SidebarLink href="/review">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      version="1.2"
                      baseProfile="tiny"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 7h-3c0-1.65-1.35-3-3-3h-12c-1.65 0-3 1.35-3 3v7c0 1.65 1.35 3 3 3v3l3-3c0 1.65 1.35 3 3 3h8l3 3v-3h1c1.65 0 3-1.35 3-3v-7c0-1.65-1.35-3-3-3zm-18 8c-.542 0-1-.458-1-1v-7c0-.542.458-1 1-1h12c.542 0 1 .458 1 1v1h-6.5c-1.379 0-2.5 1.121-2.5 2.5v4.5h-4zm19 2c0 .542-.458 1-1 1h-12c-.542 0-1-.458-1-1v-6.5c0-.827.673-1.5 1.5-1.5h11.5c.542 0 1 .458 1 1v7z"></path>
                    </svg>
                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 relative">
                      Reviews
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Messages */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("messages") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="/messages">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      version="1.2"
                      baseProfile="tiny"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 7h-3c0-1.65-1.35-3-3-3h-12c-1.65 0-3 1.35-3 3v7c0 1.65 1.35 3 3 3v3l3-3c0 1.65 1.35 3 3 3h8l3 3v-3h1c1.65 0 3-1.35 3-3v-7c0-1.65-1.35-3-3-3zm-18 8c-.542 0-1-.458-1-1v-7c0-.542.458-1 1-1h12c.542 0 1 .458 1 1v1h-6.5c-1.379 0-2.5 1.121-2.5 2.5v4.5h-4zm19 2c0 .542-.458 1-1 1h-12c-.542 0-1-.458-1-1v-6.5c0-.827.673-1.5 1.5-1.5h11.5c.542 0 1 .458 1 1v7z"></path>
                    </svg>
                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 relative">
                      {/* <div className="h-4 w-4 text-[10px] flex justify-center items-center text-center rounded-full bg-red-500 text-white absolute right-[-20px] top-[-1px] z-10">
                        12
                      </div> */}
                      Messages
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* coupons */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("coupons") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="/coupons">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        strokeWidth="2"
                        d="M3,11 L21,11 L21,23 L3,23 L3,11 Z M2,11 L2,7 L22,7 L22,11 L2,11 Z M12,23 L12,7 L12,23 Z M7,7 L12,7 C12,7 10,2 7,2 C3.5,2 3,7 7,7 Z M17.1843819,7 L12.1843819,7 C12.1843819,7 14,2 17.1843819,2 C20.5,2 21.1843819,7 17.1843819,7 Z"
                      ></path>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Coupons
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Badges */}
              {/* <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("#") && "bg-blueTwo"
                }`}
              >
                <SidebarLink href="#">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Badges
                    </span>
                  </div>
                </SidebarLink>
              </li> */}
              {/* earning */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("earning-report") ||
                  segments.includes("earning-detail")
                    ? "bg-blueTwo"
                    : ""
                }`}
              >
                <SidebarLink href="/earning-report">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 576 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M112 112c0 35.3-28.7 64-64 64V336c35.3 0 64 28.7 64 64H464c0-35.3 28.7-64 64-64V176c-35.3 0-64-28.7-64-64H112zM0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM176 256a112 112 0 1 1 224 0 112 112 0 1 1 -224 0zm80-48c0 8.8 7.2 16 16 16v64h-8c-8.8 0-16 7.2-16 16s7.2 16 16 16h24 24c8.8 0 16-7.2 16-16s-7.2-16-16-16h-8V208c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16z"></path>
                    </svg>

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Earning Reports
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Payout Requests */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("payout-request") ||
                  segments.includes("#") ||
                  segments.includes("#")
                    ? "bg-blueTwo"
                    : ""
                }`}
              >
                <SidebarLink href="/payout-request">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
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

                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Payout Requests
                    </span>
                  </div>
                </SidebarLink>
              </li>
              {/* Manage content  */}
              <SidebarLinkGroup open={segments.includes("#")}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          segments.includes("#")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path>
                            </svg>

                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Manage Content
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/manage-homepage">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Homepage
                              </span>
                            </SidebarLink>
                          </li>
                          {/* <li className="mb-1 last:mb-0">
                            <SidebarLink href="/manage-about-us">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                About Us
                              </span>
                            </SidebarLink>
                          </li> */}
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/manage-term-and-condition">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Term & Condition
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/manage-privacy-policy">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Privacy Policy
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/manage-footer/manage-social-media">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Manage Social Media
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/manage-faq">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Manage Faq
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>
              {/* admin setting  */}
              {/* <SidebarLinkGroup open={segments.includes("#")}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${
                          segments.includes("setting  ")
                            ? "hover:text-slate-200"
                            : "hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          expandOnly ? setSidebarExpanded(true) : handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="shrink-0 h-6 w-6"
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
                            <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Admin Settings
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                open && "rotate-180"
                              }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Email Settings
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="#">
                              <span className="text-sm font-medium   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Other Settings
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup> */}

              {/* Commission setting */}
              <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("commission-setting") ? "bg-blueTwo" : ""
                }`}
              >
                <SidebarLink href="/commission-setting">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.445 20.913a1.665 1.665 0 0 1 -1.12 -1.23a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.31 .318 1.643 1.79 .997 2.694"></path>
                      <path d="M15 19l2 2l4 -4"></path>
                      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                    </svg>
                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Commision Setting
                    </span>
                  </div>
                </SidebarLink>
              </li>

               {/* admin setting */}
               <li
                className={`px-3 hover:bg-blueTwo py-2 rounded-sm mb-0.5 last:mb-0 ${
                  segments.includes("admin-setting") ? "bg-blueTwo" : ""
                }`}
              >
                <SidebarLink href="/admin-setting">
                  <div className="flex items-center">
                    <svg
                      className="shrink-0 h-6 w-6"
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M262.29 192.31a64 64 0 1 0 57.4 57.4 64.13 64.13 0 0 0-57.4-57.4zM416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22 155.3 155.3 0 0 1-21.46-12.57 16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22 155.3 155.3 0 0 1 21.46 12.57 16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47z"
                      ></path>
                    </svg>{" "}
                    <span className="text-sm font-medium ml-3   lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Admin Setting
                    </span>
                  </div>
                </SidebarLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}
