import React from "react";
import { AiOutlineAreaChart } from "react-icons/ai";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { MdCancel } from "react-icons/md";
import { IoRefreshCircleSharp } from "react-icons/io5";

export default function Graph({
  wageredAmount,
  graphProfit,
  totalWin,
  totalLoss,
  handleClose,
  resetGraph,
}) {
  return (
    <div className="fixed z-[999] bottom-4 right-4   rounded h-80 bg-[#213743] rounded ">
      <div className="flex items-center justify-between bg-[#1A2C38]">
        <p className=" w-full rounded py-2 px-6 font-medium text-gray-100 flex gap-2 items-center">
          <AiOutlineAreaChart size={20} />
          Live Stats
        </p>
        <p className="flex flex-row-reverse items-center gap-2 ">
          <MdCancel
            color="white"
            size={24}
            className="mr-4  cursor-pointer"
            onClick={() => handleClose()}
          />
          <IoRefreshCircleSharp
            color="white"
            size={24}
            className=" cursor-pointer"
            onClick={() => resetGraph()}
          />
        </p>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap text-[#B1BAD3] font-medium bg-[#0F212E] rounded items-center justify-center grid-rows-2  p-2">
          <div className="w-[49%] border-r-2">
            <p>Profit</p>
            <p
              className={`flex items-center gap-2 ${
                Number(graphProfit) > 0 ? "text-[#20E701]" : "text-[red]"
              }`}
            >
              {Number(graphProfit) > 0 ? "+" : ""}
              {Number(graphProfit).toFixed(2)}
            </p>
          </div>
          <div className="w-[49%]  pl-4">
            <p>Wins</p>
            <p className="text-[#20E701]">{totalWin}</p>
          </div>
          <div className="w-[49%] border-r-2">
            <p>Wagered</p>
            <p className="text-gray-100">{Number(wageredAmount).toFixed(2)}</p>
          </div>
          <div className="w-[49%] pl-4">
            <p>Loss</p>
            <p className="text-[#ED4163]">{totalLoss}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
