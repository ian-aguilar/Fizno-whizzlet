import React from "react";
interface IGetPaidCardProps {
  availableAmount: number;
  pendingAmount: number;
  onGetPaid: () => void;
}
export const GetPaidCard: React.FC<IGetPaidCardProps> = ({
  availableAmount,
  pendingAmount,
  onGetPaid,
}) => {
  return (
    <div className="get_paid_card bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between">
        <div className=" items-center mb-5">
          <h4 className="text-[12px] font-semibold text-white flex items-center">
            Available
          </h4>
          <h2 className="text-2xl font-bold text-white">
            ${availableAmount.toFixed(2)}
          </h2>
        </div>
        {/* Uncomment and add your Image component here if needed */}
        {/* <Image alt="image" width={150} height={35} src="/images/mainLogo.png" /> */}
      </div>
      <h4 className="text-[12px] font-semibold text-yellow-500 flex items-center">
        Pending
      </h4>
      <h2 className="text-2xl font-bold text-yellow-500">
        ${pendingAmount.toFixed(2)}
      </h2>
      <div className="mt-4 get_paid_button">
        <button
          className="btn py-3 w-full font-bold bg-white hover:bg-white text-primaryMain"
          onClick={onGetPaid}
        >
          <span className="hidden xs:block">Get Paid</span>
        </button>
      </div>
    </div>
  );
};
