import InputComponent from "@/components/common/inputField/page";
import React from "react";

export default function Inventory({
  onChangeStock,
  value,
}: {
  onChangeStock: (e: any) => void;
  value?: string;
}) {
  return (
    <>
      <div className="mt-4 mb-4 w-6/12">
        <InputComponent
          className="w-[50%]"
          label="Stock Qty "
          showTooltip={true}
          onChange={onChangeStock}
          value={value}
          tooltipMessage="Stock quantity. If this is a variable product this value will be used to control stock for all variations, unless you define stock at variation level."
        />
      </div>
    </>
  );
}
