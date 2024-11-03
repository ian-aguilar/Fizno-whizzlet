"use client";
import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { globalCacheStateSelector } from "@/redux/slices/globaCache.slice";
import { tokens } from "@/helpers/jwtTokenFunction";
import { SVGIcon } from "@/assets/svg";
import { usePathname } from "next/navigation";

export default function MainFooter() {
  /**
   * redux
   */

  const pathname = usePathname();
  const { user } = useAppSelector(globalCacheStateSelector);

  const isLoggedIn = () => {
    if (typeof window !== "undefined" && tokens.getAccessToken()) {
      return true;
    } else {
      return false;
    }
  };

  const ShopArray = [
    { label: "Categories", url: "/search-result" },
    { label: "Brands", url: "/search-result" },
    { label: "Create account", url: "/register" },
  ];
  const sellArray = [
    {
      label: "Sell on Fizno",
      url:
        isLoggedIn() && user?.role === "seller" ? "/seller/dashboard" : "/sell",
    },
    {
      label: "How to sell?",
      url:
        isLoggedIn() && user?.role === "seller" ? "/seller/dashboard" : "/sell",
    },
    { label: "Getting Paid", url: "/faq" },
    { label: "Selling Policies", url: "/faq" },
  ];
  const companyArray = [
    { label: "About us", url: "/about-us" },
    {
      label: "Terms & Conditions",
      url: "/term-&-conditions",
      newTab: true,
    },
    {
      label: "Privacy Policy",
      url: "/privacy-policy",
      newTab: true,
    },
    { label: "FAQS", url: "/faq" },
  ];

  const helpArray = [
    {
      label: "Buyer Support",
      url: "/faq",
    },
    { label: "Seller Support", url: "/faq" },
    { label: "Technical Support", url: "/faq" },
    { label: "Feedback", url: "/faq" },
  ];

  if (pathname === "/login2") {
    return null;
  }

  if (pathname === "/register2") {
    return null;
  }

  return (
    <div className="bg-black rounded-t-[24px] pt-12">
      <div className="container">
        <div className="text-white py-[32px] px-[48px] bg-[url('../../assets/images/footer-bg.png')] bg-no-repeat bg-cover rounded-[16px] flex justify-between items-center">
          <div>
            <div className="text-[28px] mb-2 font-semibold">
              Do you need help?
            </div>
            <div className="text-[14px] max-w-[530px] opacity-60">
              We will provide detailed information about our services, types of
              work, and top projects. We will calculate the cost and prepare a
              commercial proposal.
            </div>
          </div>
          <div className="xl:mr-10">
            <a className="text-white flex items-center">
              <span className="mr-4 text-[20px]">Get consultation</span>
              <SVGIcon.rightArrowIcon className="w-[26px] h-[22px] mt-[1px]" />
            </a>
          </div>
        </div>
        <div className="py-5 md:flex lg:flex sm:block my-10 mb-16">
          <div className="w-9/12">
            <div className="grid-cols-4 grid">
              <div className="">
                <h5 className="text-[#9C9CBB] text-[14px] tracking-[0.5px] font-semibold mb-5">
                  FIZNO PARTNER
                </h5>
                <ul className="">
                  {sellArray.map((item, index) => (
                    <li key={index} className="py-[3px] text-white text-[14px]">
                      <Link href={item.url}> {item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="">
                <h5 className="text-[#9C9CBB] text-[14px] tracking-[0.5px] font-semibold mb-5">
                  FIZNO SHOPPING
                </h5>
                <ul className="">
                  {ShopArray.map((item, index) => (
                    <li key={index} className="py-[3px] text-white text-[14px]">
                      <Link href={item.url}> {item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="">
                <h5 className="text-[#9C9CBB] text-[14px] tracking-[0.5px] font-semibold mb-5">
                  TERMS & POLICIES
                </h5>
                <ul className="">
                  {companyArray.map((item, index) => (
                    <li key={index} className="py-[3px] text-white text-[14px]">
                      <Link
                        href={item.url}
                        target={item.newTab ? "_blank" : "_self"}
                        rel={item.newTab ? "noopener noreferrer" : undefined}
                      >
                        {" "}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="">
                <h5 className="text-[#9C9CBB] text-[14px] tracking-[0.5px] font-semibold mb-5">
                  SUPPORT
                </h5>
                <ul className="">
                  {helpArray.map((item, index) => (
                    <li key={index} className="py-[3px] text-white text-[14px]">
                      <Link href={item.url}> {item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-3/12 flex flex-col items-end justify-between">
            <a href="/">
              <SVGIcon.fiznoLogo />
            </a>
            <div>
              <hr className="w-[45px] h-[1px] bg-[#9C9CBB] mb-5 mr-0 ml-auto" />
              <a
                href="mailto:Support@Fizno.com"
                className="text-[#9C9CBB] text-[14px] font-semibold"
              >
                Support@Fizno.com
              </a>
            </div>
          </div>
        </div>
        <div className="md:flex lg:flex sm:block pt-3 pb-12 justify-between items-center">
          <p className="text-sm text-[#9C9CBB] font-normal mb-0">
            Osborne Enterprises Inc t/a Fizno ™ All Rights Reserved © 2024
          </p>
        </div>
      </div>
    </div>
  );
}
