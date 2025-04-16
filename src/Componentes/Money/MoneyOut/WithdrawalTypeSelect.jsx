import React from "react";
import { Link } from "react-router-dom";
import { RiBankFill } from "react-icons/ri";
import { FaBitcoin } from "react-icons/fa";

export default function WithdrawalTypeSelect() {
  return (
    <div className="  my-4 mt-6">
      <div className="flex    gap-6 mt-6">
        <Link
          to={{
            pathname: "/home",
            search: "?money=withdrawal&withdrawalType=bank",
          }}
          className="relative w-[48%] md:w-auto text-center"
          href="/"
        >
          <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-300"></span>
          <span className="flex  items-center justify-center gap-1 fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-700 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
            <RiBankFill />
            BANK
          </span>
        </Link>
        <Link
          to={{
            pathname: "/home",
            search: "?money=withdrawal&withdrawalType=crypto",
          }}
          className="relative w-[48%] md:w-auto text-center"
          href="/"
        >
          <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-300"></span>
          <span className="flex  items-center justify-center gap-1 fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-700 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
            <FaBitcoin />
            CRYPTO
          </span>
        </Link>
      </div>
    </div>
  );
}
