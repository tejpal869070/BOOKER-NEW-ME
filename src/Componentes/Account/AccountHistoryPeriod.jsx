import React  from "react";

export default function AccountHistoryPeriod() {
  return (
    <div className="flex gap-4">
      <div>
        <select className="text-black  border-2 border-[#ff9600]  hover:shadow-lg    rounded  text-md font-semibold px-5 py-1 text-left inline-flex items-center      ">
          <option value="0">--Type--</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>

        <div
          id="dropdown"
          className="z-10 hidden  bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-30 border-2 border-gray dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <a
                href="/"
                className="block font-semibold px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Deposit
              </a>
            </li>
            <li>
              <a
                href="/"
                className="block font-semibold px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Withdrawal
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* date  */}
      <div className="flex items-center gap-1">
        <p  className="text-gray-800 font-medium dark:text-gray-200">From</p>
        <input
          aria-label="Date"
          placeholder="Start Date"
          type="date"
          className="border-2 border-[#ff9600] rounded py-1"
        />
        <p className="text-gray-800 font-medium dark:text-gray-200">to</p>
        <input
          aria-label="Date"
          placeholder="Start Date"
          type="date"
          className="border-2 border-[#ff9600] rounded py-1"
        />
        <a className="relative ml-6" href="/">
          <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black dark:bg-gray-400"></span>
          <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black dark:border-gray-500 bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
            SEARCH
          </span>
        </a>
      </div>
    </div>
  );
}
