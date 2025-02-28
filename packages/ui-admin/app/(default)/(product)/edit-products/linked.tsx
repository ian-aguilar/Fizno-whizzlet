import InputComponent from "@/components/common/inputField/page";
import SelectComponent from "@/components/common/select/page";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import React from "react";

export default function Linked() {
  const upSellsArray = [
    { value: "none", label: "None" },
    { value: "shipping_only", label: "Shipping Only" },
    { value: "taxable", label: "Taxable" },
  ];

  const crossSellsArray = [
    { value: "standard", label: "Standard" },
    { value: "normal_rate", label: "Normal Rate" },
    { value: "reduced_rate", label: "Reduced Rate" },
    { value: "zero_rate", label: "Zero Rate" },
  ];
  return (
    <>
      <div className="flex mt-4 mb-4 gap-5">
        <div className="w-6/12">
          <div className="">
            {" "}
            {/* <SelectComponent label="Up-sells" options={upSellsArray} /> */}
            <SearchSingleSelect
              label="Up-sells"
              Options={upSellsArray}
              tooltipMessage="Up-sells are products which you recommend instead of the currently viewed product, for example, products that are more profitable or better quality or more expensive."
              showTooltip={true}
              onChange={function (data: any): void {
                throw new Error("Function not implemented.");
              }}
              value={undefined}
              name={""}
              onBlur={function (e: any): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
        <div className="w-6/12">
          <div className="">
            {" "}
            <SearchSingleSelect
              label="Cross-sells"
              Options={crossSellsArray}
              tooltipMessage="Cross-sells are products which you promote in the cart, based on the current product"
              showTooltip={true}
              onChange={function (data: any): void {
                throw new Error("Function not implemented.");
              }}
              value={undefined}
              name={""}
              onBlur={function (e: any): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
