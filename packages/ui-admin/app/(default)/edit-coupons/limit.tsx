import InputComponent from "@/components/common/inputField/page";
import React from "react";

export default function Limit({
  handleLimit,
  handleLimitPerItem,
  handleLimitPerUser,
  limit,
  limitPerItem,
  limitPerUser,
}: {
  handleLimit: any;
  handleLimitPerItem: any;
  handleLimitPerUser: any;
  limit: string;
  limitPerItem: string;
  limitPerUser: string;
}) {
  // const [setInputValue] = useState("1");

  // Function to handle input change
  // const handleInputChange = (newValue: string) => {
  //   setInputValue(newValue);
  // };
  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <div className="mt-4 mb-4 ">
          <InputComponent
            className="w-[50%]"
            label="Usage limit per coupon"
            type="number"
            onChange={handleLimit}
            value={limit}
          />
        </div>
        <div className="mt-4 mb-4 ">
          <InputComponent
            className="w-[50%]"
            label="Limit usage to X items"
            type="number"
            onChange={handleLimitPerItem}
            value={limitPerItem}
          />
        </div>
        <div className=" ">
          <InputComponent
            className="w-[50%]"
            label="Usage limit per user"
            type="number"
            onChange={handleLimitPerUser}
            value={limitPerUser}
          />
        </div>
      </div>
    </>
  );
}
