/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ProductShortCard } from "./productShortCard";
import CustomTouchSpin from "./customTouchSpin";
import { useAppDispatch } from "@/redux/hooks";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";
import { setIsLoading } from "@/redux/slices/globaCache.slice";
import { IconButton } from "@mui/material";
import { setCartCount } from "@/redux/slices/product.slice";
import { tokens } from "@/helpers/jwtTokenFunction";
import { SVGIcon } from "@/assets/svg";
import IMAGES from "@/public/images";

interface OrderListTableI {
  handleCheckoutData: (args: any) => void;
}

const OrderListTable = ({ handleCheckoutData }: OrderListTableI) => {
  /**
   * redux
   */

  const dispatch = useAppDispatch();

  /**
   * state management
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allCartProd, setAllCartProd] = useState<any>([]);
  const [localCartProd, setLocalCartProd] = useState<
    {
      title: string;
      image: string;
      price: string;
      stock: string;
      quantity: string;
      sellerId: number;
      productId: number;
      sellerName: string;
    }[]
  >([]);

  console.log({ allCartProd });

  /**
   * get all cart product list
   */

  const getAllCartProdList = async () => {
    const response = await UserApi.getAllCartProdAPI();
    if (response.remote === "success") {
      setAllCartProd(response.data.data);
      dispatch(setCartCount(response?.data?.data?.length || 0));
      const total = response?.data?.data?.reduce(
        (accumulator: any, currentValue: any) =>
          accumulator +
          Number(
            currentValue?.product?.wp_nepaz2_postmeta?.find(
              (el: any) => el.meta_key == "sale_price",
            )?.meta_value
              ? currentValue?.product?.wp_nepaz2_postmeta?.find(
                  (el: any) => el.meta_key == "sale_price",
                )?.meta_value
              : currentValue?.product?.wp_nepaz2_postmeta?.find(
                  (el: any) => el.meta_key == "_price",
                )?.meta_value,
          ) *
            Number(currentValue?.quantity),
        0,
      );
      const data = {
        subTotal: total,
        totalItems: response?.data?.data?.length || 0,
      };
      handleCheckoutData(data);
    }
  };

  /**
   * remove from cart
   */

  const handleRemoveCart = async (productId: number) => {
    const payload = {
      productId: productId,
    };
    dispatch(setIsLoading(true));

    const response = await UserApi.removeFromCartAPI(payload);
    if (response.remote === "success") {
      dispatch(setIsLoading(false));
      getAllCartProdList();
    } else {
      dispatch(setIsLoading(false));
    }
  };

  /**
   * handle update cart
   */

  const handleUpdateCartCount = async (productId: number, count: number) => {
    const response = await UserApi.updateCartAPI({
      productId,
      quantity: count,
    });
    if (response.remote === "success") {
      dispatch(setIsLoading(false));
      getAllCartProdList();
    } else {
      dispatch(setIsLoading(false));
    }
  };

  /**
   * =============== local cart functionality =============
   */

  const handleGetLocalCartItems = () => {
    if (typeof window !== "undefined") {
      const localCartData = localStorage.getItem("localCart");
      if (localCartData) {
        const parseData = JSON.parse(localCartData);
        setLocalCartProd(parseData);
        dispatch(setCartCount(parseData?.length || 0));
        const total = parseData?.reduce(
          (accumulator: any, currentValue: any) =>
            accumulator +
            Number(currentValue?.price.substring(1)) *
              Number(currentValue?.quantity),
          0,
        );
        const data = {
          subTotal: total,
          totalItems: parseData?.length || 0,
        };
        handleCheckoutData(data);
      }
    }
  };

  const handleRemoveLocalCartItem = (item: any) => {
    if (typeof window !== "undefined") {
      const localCartData = localStorage.getItem("localCart");
      if (localCartData) {
        const parsedata = JSON.parse(localCartData);
        const filterData = parsedata.filter(
          (el: any) => el.title !== item.title,
        );
        localStorage.setItem("localCart", JSON.stringify(filterData));
        handleGetLocalCartItems();
      }
    }
  };

  const handleUpdateQuantity = (quantity: number, title: string) => {
    if (typeof window !== "undefined") {
      const localCartData = localStorage.getItem("localCart");
      if (localCartData) {
        const parsedata = JSON.parse(localCartData);
        const filterData = parsedata.map((el: any) => {
          if (el.title === title) {
            return {
              ...el,
              quantity,
            };
          } else {
            return el;
          }
        });
        localStorage.setItem("localCart", JSON.stringify(filterData));
        handleGetLocalCartItems();
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && tokens.getAccessToken()) {
      getAllCartProdList();
    } else {
      handleGetLocalCartItems();
    }
  }, []);

  return (
    <>
      <div className="min-h-[310px] w-full border rounded-2xl">
        <table className="w-full ">
          <thead className="border-b">
            <tr>
              <th className="p-3 w-16"> </th>
              <th className="p-3 font-semibold normal-case w-4/12" align="left">
                Products
              </th>
              <th className="p-3 font-semibold normal-case" align="center">
                Quantity
              </th>
              <th className="p-3 font-semibold normal-case" align="center">
                Price
              </th>
              <th className="p-3 font-semibold normal-case">Shipping</th>

              <th className="p-3 font-semibold normal-case" align="center">
                Total
              </th>
            </tr>
          </thead>
          {typeof window !== "undefined" && tokens.getAccessToken() ? (
            <tbody>
              {allCartProd?.map((item: any) => (
                <tr key={item?.id} className="border-b">
                  <td className="px-3" align="center">
                    <IconButton
                      onClick={() => handleRemoveCart(item?.product?.ID)}
                    >
                      X
                    </IconButton>
                  </td>
                  <td className="px-3">
                    <ProductShortCard
                      productId={item?.product?.ID}
                      sellerId={item?.product?.wp_nepaz2_users?.id}
                      condition={
                        item?.wp_term_relationships?.find(
                          (el: any) =>
                            el?.term_taxonomy?.taxonomy === "pa_condition",
                        )?.term?.name
                      }
                      productTitle={item?.product?.post_title}
                      productImage={
                        item?.product?.attachment[0]?.guid
                          ? item?.product?.attachment[0]?.guid.includes("http")
                            ? item?.product?.attachment[0]?.guid
                            : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item?.product?.attachment[0]?.guid}`
                          : ""
                      }
                      productPrice={`$${
                        Number(
                          item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "sale_price",
                          )?.meta_value
                            ? item?.product?.wp_nepaz2_postmeta?.find(
                                (el: any) => el.meta_key == "sale_price",
                              )?.meta_value
                            : item?.product?.wp_nepaz2_postmeta?.find(
                                (el: any) => el.meta_key == "_price",
                              )?.meta_value,
                        ) * Number(item?.quantity)
                      }`}
                      storeName={
                        item?.product?.wp_nepaz2_users?.store?.store_name
                      }
                    />
                  </td>

                  <td className="px-3">
                    <CustomTouchSpin
                      min={1}
                      max={Number(
                        item?.product?.wp_nepaz2_postmeta?.find(
                          (el: any) => el.meta_key == "_stock",
                        )?.meta_value,
                      )}
                      step={1}
                      initialValue={item?.quantity}
                      onChange={(value) => {
                        handleUpdateCartCount(item?.product?.ID, value);
                      }}
                    />
                  </td>
                  <td>
                    {Number(
                      item?.product?.wp_nepaz2_postmeta?.find(
                        (el: any) => el.meta_key == "sale_price",
                      )?.meta_value
                        ? item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "sale_price",
                          )?.meta_value
                        : item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "_price",
                          )?.meta_value,
                    ) * Number(item?.quantity)}
                  </td>
                  <td
                    className="normal-case font-medium text-black px-3"
                    align="center"
                  >
                    Free Shipping
                  </td>
                  <td className="font-bold text-black text-end px-3">
                    $
                    {Number(
                      item?.product?.wp_nepaz2_postmeta?.find(
                        (el: any) => el.meta_key == "sale_price",
                      )?.meta_value
                        ? item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "sale_price",
                          )?.meta_value
                        : item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "_price",
                          )?.meta_value,
                    ) * Number(item?.quantity)}
                  </td>
                </tr>
              ))}

              {allCartProd?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {" "}
                    <div className="flex justify-center items-center normal-case card_item_empty">
                      <div className="text-center">
                        <SVGIcon.noOffer />
                        <p className="text-base font-semibold text-black ">
                          Your cart is currently empty.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ) : (
            <tbody>
              {localCartProd?.map((item: any) => (
                <tr key={item?.id} className="border-b">
                  <td className="px-3" align="center">
                    <IconButton onClick={() => handleRemoveLocalCartItem(item)}>
                      X
                    </IconButton>
                  </td>
                  <td className="px-3">
                    <ProductShortCard
                      sellerId={item?.sellerId}
                      productId={item?.productId}
                      productTitle={item?.title}
                      productImage={
                        item?.image
                          ? item?.image?.includes("http")
                            ? item?.image
                            : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item?.image}`
                          : IMAGES.dummyProduct
                      }
                      productPrice={
                        (
                          Number(item?.price) * Number(item?.quantity)
                        ).toString() || "0"
                      }
                      storeName={item?.storeName}
                    />
                  </td>

                  <td className="px-3">
                    <CustomTouchSpin
                      min={1}
                      max={Number(item?.stocks) || 0}
                      step={1}
                      initialValue={item?.quantity}
                      onChange={(value) => {
                        handleUpdateQuantity(value, item?.title);
                      }}
                    />
                  </td>
                  <td>
                    {Number(
                      item?.product?.wp_nepaz2_postmeta?.find(
                        (el: any) => el.meta_key == "sale_price",
                      )?.meta_value
                        ? item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "sale_price",
                          )?.meta_value
                        : item?.product?.wp_nepaz2_postmeta?.find(
                            (el: any) => el.meta_key == "_price",
                          )?.meta_value,
                    ) * Number(item?.quantity)}
                  </td>
                  <td
                    className="normal-case font-medium text-black px-3"
                    align="center"
                  >
                    Free Shipping
                  </td>
                  <td className="font-bold text-black text-end px-3">
                    $
                    {(
                      Number(item?.price.substring(1)) * Number(item?.quantity)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
              {localCartProd?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <div className="flex justify-center items-center normal-case card_item_empty">
                      <div className="text-center">
                        <SVGIcon.noOffer />
                        <p className="text-base font-semibold text-black ">
                          Your cart is currently empty.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default OrderListTable;
