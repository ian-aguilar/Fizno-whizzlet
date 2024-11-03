"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import GlobalIcon from "@/assets/svg/global-network.svg";
import Logo from "@/assets/images/output-onlinepngtools-2.png";
import LocationIcon from "@/assets/svg/akar-icons_location.svg";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchDropdown from "./searchDropdown";
import { CategoryDropdown } from "@/components/dropdown/categoryDropdown";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";
import { debounce } from "@/components/utils/debounce";
import { tokens } from "@/helpers/jwtTokenFunction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  globalCacheStateSelector,
  setUser,
} from "@/redux/slices/globaCache.slice";
import {
  productStateSelector,
  setCartCount,
} from "@/redux/slices/product.slice";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";
import Link from "next/link";
import Cookies from "js-cookie";
import { Avatar, Drawer } from "@mui/material";
import { SVGIcon } from "@/assets/svg";
import SkeletonLoader from "@/components/loader/skeletonLoader";
import userIcon from "../../../assets/images/user-icon.png";

export default function MainHeader() {
  /**
   * router
   */

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  /**
   * redux
   */

  const dispatch = useAppDispatch();
  const { user } = useAppSelector(globalCacheStateSelector);
  const { cartCount } = useAppSelector(productStateSelector);

  /**
   * state management
   */
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [profileMenu, setProfileMenu] = useState(false);
  const [userData, setUserData] = useState<{
    userName: string;
    userRole: string;
    userProfileImage: string;
  }>({
    userName: "",
    userRole: "",
    userProfileImage: "",
  });
  const [unreadMsgs, setUnreadMessageCount] = useState<number>(0);
  const [searchLoader, setSearchLoader] = useState<boolean>(false);

  /**
   * refs
   */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleShowMenuDropdown = () => {
    setShowDropdownMenu((prevState) => !prevState);
    // alert("showdropdown");
  };

  const handleInputChange = async (e: any) => {
    const inputValue = e.target.value;

    if (inputValue !== "") {
      const data = {
        keyword: inputValue,
        pageSize: 10,
        pageIndex: 1,
      };
      setSearchLoader(true);
      const response = await categoriesService.searchProductsByKeyword(data);
      if (response.remote === "success") {
        setSearchLoader(false);
        const mappedData = response.data.data.updateData.map((product: any) => {
          const postmeta = product.wp_nepaz2_postmeta.reduce(
            (acc: any, meta: any) => {
              acc[meta.meta_key] = meta.meta_value;
              return acc;
            },
            {},
          );
          return {
            id: product.ID,
            image: postmeta._ebay_product_featured_image
              ? postmeta._ebay_product_featured_image.img_url
              : product.attachment
                ? product.attachment?.guid.includes("http")
                  ? product.attachment?.guid
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.attachment?.guid}`
                : "",
            title: product.post_title,
            price: postmeta._price
              ? `$${postmeta._price}`
              : `$${(Math.random() * 100).toFixed(2)}`,
          };
        });
        setSearchResults(mappedData);
        setShowSearchDropdown(true);
      }
    } else {
      setSearchLoader(false);
      setShowSearchDropdown(false);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setShowSearchDropdown(false);
      setShowDropdownMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const fetchCatgories = async () => {
    const data = {
      pageSize: 1000000,
      pageIndex: 1,
      query: "",
      search: "",
    };
    const response = await categoriesService.getCategories(data);
    groupData(response?.data?.data?.updatedData);
    // if (response.remote === "success") {
    //   setAllCategories(response.data);
    // }
  };

  const groupData = (data: any) => {
    const map = new Map();
    data?.forEach((item: any) => {
      map.set(item.term_taxonomy_id, { ...item, children: [] });
    });

    // Step 2: Iterate through the array and assign children
    data.forEach((item: any) => {
      if (item.parent !== 0) {
        const parent = map.get(item.parent);
        if (parent) {
          parent.children.push(map.get(item.term_taxonomy_id));
        }
      }
    });

    // Step 3: Filter the array to include only top-level elements
    const result = data
      .filter((item: any) => item.parent === 0)
      .map((item: any) => map.get(item.term_taxonomy_id));

    setAllCategories(result);
  };

  const debounceSearch = useCallback(
    debounce((value: any) => {
      handleInputChange(value);
    }, 300),
    [],
  );

  /**
   * get all cart product list
   */

  const getAllCartProdList = async () => {
    const response = await UserApi.getAllCartProdAPI();
    if (response.remote === "success") {
      dispatch(setCartCount(response?.data?.data?.length || 0));
    }
  };

  /**
   * handle add bulk cart items
   */
  const handleAddBulkCart = async () => {
    if (typeof window !== "undefined") {
      const localCartData = localStorage.getItem("localCart");
      if (localCartData) {
        const parseData = JSON.parse(localCartData);

        const payload = parseData.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        const response = await UserApi.bulkCartAPI({ data: payload });

        if (response.remote === "success") {
          getAllCartProdList();
          localStorage.removeItem("localCart");
        }
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && tokens.getAccessToken()) {
      const localCartData = localStorage.getItem("localCart");
      if (localCartData) {
        const parseData = JSON.parse(localCartData);
        parseData.length === 0 ? getAllCartProdList() : handleAddBulkCart();
      } else {
        getAllCartProdList();
      }
    } else {
      if (typeof window !== "undefined") {
        const localCartData = localStorage.getItem("localCart");
        if (localCartData) {
          const parseData = JSON.parse(localCartData);
          dispatch(setCartCount(parseData?.length || 0));
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchCatgories();
  }, [router]);
  const currentPath = usePathname();

  const hideSubheader =
    currentPath === "/contact-us" || currentPath === "/feedback-page";
  const headerMenu =
    currentPath === "/seller/login" ||
    currentPath === "/login" ||
    currentPath === "/register" ||
    currentPath === "/forgot-password" ||
    currentPath === "/verification" ||
    currentPath === "/search-result" ||
    currentPath === "/search-detail" ||
    currentPath === "/shopping-cart" ||
    currentPath === "/home";

  const toggleProfileMenu = () => {
    setProfileMenu((prevState) => !prevState);
  };

  /**
   * handle sign out
   */
  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage?.removeItem("access-token");
      localStorage?.removeItem("refreshToken");
    }
    dispatch(setCartCount(0));
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    window.dispatchEvent(new Event("storage"));
    router.push("/signin");
  };

  /**
   * handle fetch user profile
   */
  const handleFetchUserProfile = async () => {
    if (tokens.getAccessTokenCookies()) {
      const response = await UserApi.getUserDetail();
      if (response.remote == "success") {
        dispatch(setUser(response.data));
      }
    }
  };

  useEffect(() => {
    handleFetchUserProfile();
  }, []);

  useEffect(() => {
    if (user && (user.display_name || user.role)) {
      setUserData({
        userName: user.display_name,
        userRole: user.role,
        userProfileImage: `${process.env.NEXT_PUBLIC_API_BASE_URL}${
          user?.avatar?.guid
        }`,
      });
    }
  }, [user, user?.display_name]);
  const toggleDrawer = (openState: boolean) => {
    setShowDropdownMenu(openState);
  };

  /**
   * handle fetch messages
   */
  const handleFetchMessages = async () => {
    if (tokens.getAccessTokenCookies()) {
      const response = await UserApi.getUnreadMessageAPI();
      if (response.remote == "success") {
        setUnreadMessageCount(response.data.data);
      }
    }
  };

  useEffect(() => {
    handleFetchMessages();
  }, []);

  return (
    <>
      <div className="main_header bg-white py-3 border-t border-primaryMain">
        <div className="mx-4 relative">
          <div className="flex justify-between items-center">
            <div className={`${!headerMenu ? "w-2/12" : "w-1/5"}`}>
              <div className="header_left_section flex justify-start items-center ">
                <Image
                  alt=""
                  height={30}
                  width={120}
                  src={Logo}
                  className="mr-4 cursor-pointer"
                  onClick={() => router.push("/home")}
                />
                <div className="flex justify-center ">
                  <LocationIcon className="mr-1" />
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-[14px] text-[#252525] cursor-pointer">
                      Deliver to
                    </p>
                    <p className="text-[14px] text-[#252525] cursor-pointer">
                      Nashville 37217
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={` header_search_section ${!headerMenu ? "w-4/12" : "w-[45%]"}`}
            >
              <div className="relative ">
                <div
                  onClick={handleShowMenuDropdown}
                  className="absolute font-sm flex justify-center items-center bg-[#F3F3F6] text-sm text-[#383839] cursor-pointer rounded-l-full border-r-2 border-r-[#CCCCCC] h-full left-0 px-3"
                >
                  Categories
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-500 ${
                      showDropdownMenu ? "rotate-90" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                <input
                  className="pl-32 rounded-sm border-none text-sm text-[#757575] bg-[#F3F3F6] w-full dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                  placeholder="Search Fizno"
                  value={keyword}
                  onChange={(e) => {
                    debounceSearch(e);
                    setKeyword(e.target.value);
                  }}
                />

                <div
                  onClick={() => {
                    router.push(`/search-result?keyword=${keyword}`);
                    setKeyword("");
                    setShowSearchDropdown(false);
                  }}
                  className="absolute top-[1px] right-[1px] text-[#737373] cursor-pointer rounded-r-full p-[9px]"
                >
                  <SVGIcon.SearchIcon2 />
                </div>
                {showSearchDropdown ? (
                  <SearchDropdown
                    keyword={keyword}
                    handleResetKeyword={() => {
                      setKeyword("");
                      setShowSearchDropdown(false);
                    }}
                    results={searchResults}
                  />
                ) : null}
                {searchLoader && (
                  <div className="absolute top-[3px] right-14 z-10 flex justify-center items-center h-10">
                    <div
                      className="w-5 h-5  rounded-full animate-spin"
                      style={{ animationDuration: "0.4s" }}
                    >
                      <div className="w-[19px] h-[19px] border-3  rounded-full border-blue-500 loader_search ">
                        &nbsp;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`${!headerMenu ? "w-4/12" : "w-5/12"} `}>
              <div className="header_right_section">
                <ul className="flex items-center justify-end ">
                  <div className="flex items-center justify-between space-x-4 ">
                    <div className="flex space-x-1 cursor-pointer">
                      <GlobalIcon className="w-4 h-4 text-gray-600" />
                      <p className="text-[14px] font-medium text-gray-700">
                        English
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 pr-3">
                      <p className="text-[14px] font-medium text-gray-700 cursor-pointer">
                        What we offer
                      </p>
                      <p className="text-[14px] font-medium text-gray-700 cursor-pointer">
                        Contact
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center border-2 border-gray-400 rounded-full mr-4 p-2">
                    <li
                      className="relative cursor-pointer"
                      onClick={() => router.push("/shopping-cart")}
                    >
                      <div className="flex justify-center items-center w-3 h-3 text-white bg-[#E54B4D] font-semibold text-[10px] absolute right-[-2px] top-[-2px] rounded-full">
                        {cartCount}
                      </div>
                      <SVGIcon.CartIcon />
                    </li>
                  </div>

                  {!tokens.getAccessTokenCookies() && (
                    <li className="flex items-center text-[14px]">
                      <a
                        className="mb-[-4px] block text-black font-semibold cursor-pointer"
                        onClick={() => router.push("/login2")}
                      >
                        <Image
                          className="mr-3 ml-7"
                          width="27"
                          height="22"
                          alt="Login"
                          src={userIcon}
                        />
                      </a>
                      <div>
                        <a
                          className="mb-[-4px] block text-black font-semibold cursor-pointer"
                          onClick={() => router.push("/login2")}
                        >
                          Log in
                        </a>
                        <a
                          className="block text-black font-semibold cursor-pointer"
                          onClick={() => router.push("/register2")}
                        >
                          Register
                        </a>
                      </div>
                    </li>
                  )}
                  {tokens.getAccessTokenCookies() && (
                    <li className="mr-2">
                      {!userData ? (
                        <div
                          className="flex cursor-pointer relative items-center"
                          onClick={toggleProfileMenu}
                        >
                          <div className="mr-2">
                            <SkeletonLoader
                              type="circular"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="">
                            <span className="">
                              <SkeletonLoader
                                type="rectangular"
                                width={100}
                                height={18}
                              />
                            </span>
                            <p className="mt-1">
                              <SkeletonLoader
                                type="rectangular"
                                width={160}
                                height={25}
                              />
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex cursor-pointer relative items-center"
                          onClick={toggleProfileMenu}
                        >
                          <div className="ml-4">
                            <Avatar
                              src={userData.userProfileImage}
                              style={{
                                width: "32px",
                                height: "32px",
                                background: "#306cb5",
                              }}
                            >
                              {userData.userName[0]?.toUpperCase()}
                            </Avatar>
                          </div>
                          {profileMenu && (
                            <div className="right-[0] top-[44px] min-w-[250px] main-menu absolute bg-white w-full border border-[#ccc] rounded-[10px] z-10 text-[#666] text-[14px]">
                              <ul className=" p-1 ">
                                <li className="text-[20px] py-[3px] px-[20px] mt-[16px] mb-[10px]">
                                  <div className="font-semibold text-black">
                                    Hello&nbsp;
                                    <span
                                      className="text-black"
                                      dangerouslySetInnerHTML={{
                                        __html: userData.userName,
                                      }}
                                    />
                                    !
                                  </div>
                                </li>
                                <li className="py-[3px] px-[20px]">
                                  <Link href={"/whats-new"}>
                                    Buyer Dashboard
                                  </Link>
                                </li>
                                {true && (
                                  <>
                                    <li className="py-[3px] px-[20px]">
                                      <Link href={"/seller/dashboard"}>
                                        Seller Dashboard
                                      </Link>
                                    </li>
                                    <li className="py-[3px] px-[20px]">
                                      <Link
                                        href={`/store-page?sellerId=${user?.id}`}
                                      >
                                        My Store
                                      </Link>
                                    </li>
                                  </>
                                )}
                                <li className="py-[3px] px-[20px]">
                                  <Link href={"/seller/messages"}>
                                    Messages{" "}
                                    {unreadMsgs > 0 ? (
                                      <span className="inline-block relative">
                                        <div className="animate-[pulsate_8s_ease-out_infinite] border border-[#e85656] rounded-full w-[40px] h-[40px] absolute top-[-12px] right-[-12px] opacity-0"></div>
                                        <span className="flex justify-center items-center w-4 h-4 text-white bg-[#E54B4D] text-semibold text-[10px] rounded-full">
                                          {unreadMsgs}
                                        </span>
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </Link>
                                </li>
                                <div className="pt-[16px]"></div>
                                <li
                                  className="mx-[-5px] border-[#ccc] border-t py-[10px] px-[25px] cursor-pointer"
                                  onClick={() => handleSignOut()}
                                >
                                  Logout
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* {showDropdownMenu && ( */}
          <Drawer
            sx={{ maxWidth: "1280px", mx: "0 auto" }}
            anchor="top"
            open={showDropdownMenu}
            onClose={() => toggleDrawer(false)}
            ModalProps={{
              keepMounted: true,
              BackdropProps: {
                sx: {
                  backgroundColor: "transparent", // Example of backdrop customization
                },
              },
              // Keep the drawer mounted for performance
            }}
            PaperProps={{
              sx: {
                backgroundColor: "transparent",
                position: "absolute",
                top: 84,
                height: "auto",
                left: "10%",
                right: "-10%",
                maxWidth: "1280px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              },
            }}
          >
            <div className="">
              <CategoryDropdown
                categories={allCategories.filter(
                  (item: any) => item.children.length > 0,
                )}
              />
            </div>
          </Drawer>
          {/* )} */}
        </div>
      </div>
      {!hideSubheader && (
        <div className="subHeader_section flex items-center justify-center mt-[85px]">
          {/* {allCategories.length === 0 && <CircularProgress />} bg-blue-100  */}
          <ul className="flex justify-center">
            {allCategories.length === 0 && (
              <>
                {[...Array(8)].map((_, index) => (
                  <li className="px-2 py-3" key={index}>
                    <SkeletonLoader
                      key={index}
                      type="rectangular"
                      width={100}
                      height={30}
                    />
                  </li>
                ))}
              </>
            )}
            {allCategories
              .filter((item: any) => item.children.length > 0)
              .map((item: any, index: number) => (
                <li
                  key={index}
                  className="px-5 py-3  cursor-pointer"
                  style={{
                    color:
                      Number(item.term_taxonomy_id) === Number(categoryId)
                        ? "blue"
                        : "#000",
                  }}
                  onClick={() =>
                    router.push(
                      `/search-result?category=${item.term_taxonomy_id}`,
                    )
                  }
                  dangerouslySetInnerHTML={{ __html: item?.term?.name }}
                />
              ))}
          </ul>
        </div>
      )}

      {/* loader for whole frontend pages  */}
      {/* <div className="fixed w-full top-0 left-0 z-10">
        <LinearProgress value={80} sx={{ height: "6px" }} />
      </div> */}
    </>
  );
}
