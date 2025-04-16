import React, { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MyInvestMentHistory } from "../../Controllers/User/UserController";
import { Loading1, Loading3, Loading4 } from "../Loading1";
import Details from "./Details";
import gif1 from "../../assets/photos/nodata.png";

export default function InvestmentHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetHistory = async () => {
    const response = await MyInvestMentHistory();
    if (response !== null) {
      setData(response);
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetHistory();
  }, []);

  if (loading) {
    return (
      <div className=" fixed flex justify-center items-center min-h-[40vh] md:min-h-[90vh] bg-opacity-50 z-[9999]">
        <Loading4 />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className=" ">
        <div>
          <h1 className="mb-6 font-bold text-lg dark:text-white text-center md:text-left hidden md:block">
            Investment History
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {data && data.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-40" />
                <p className="text-center font-bold dark:text-white text-xl">
                  No Records !
                </p>
              </div>
            ) : (
              <div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-indigo-400 border-4 hidden md:inline-table">
                  <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap ">
                        Trnx. Id
                      </th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap ">
                        INVESTMENT
                      </th>
                      <th scope="col" className=" px-6 py-3 whitespace-nowrap ">
                        PLAN
                      </th>
                      <th scope="col" className=" px-6 py-3 whitespace-nowrap ">
                        TOTAL PAYOUT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap ">
                        Status
                      </th>
                      <th scope="col" className=" px-6 py-3 whitespace-nowrap ">
                        DATE START
                      </th>
                      <th scope="col" className=" px-6 py-3 whitespace-nowrap ">
                        PAYOUT DATE
                      </th>
                    </tr>
                  </thead>
                  {data.map((item, index) => (
                    <tbody key={index}>
                      <tr
                        className={` text-black font-semibold dark:text-gray-200  border-b dark:border-gray-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-200 dark:bg-gray-800"
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap  dark:text-white"
                        >
                          {item.txtid}.
                        </th>
                        <td className="whitespace-nowrap  px-4 py-4">
                          ${item.amount}
                        </td>
                        <td className="whitespace-nowrap  px-4 py-4 ">
                          {item.plan_name}
                        </td>
                        <td className="whitespace-nowrap  px-4 py-4 ">
                          ${item.total_return_amount}
                        </td>

                        <td className="whitespace-nowrap  px-6 py-4  ">
                          {item.status}
                        </td>
                        <td className="whitespace-nowrap  px-6 py-4 ">
                          {item.date.split("T")[0]}
                        </td>
                        <td className="whitespace-nowrap  py-4 ">
                          {(() => {
                            const parsedDate = new Date(item.date);
                            const daysToAdd =
                              (Number(item.amount) * 2) /
                              ((Number(item.amount) *
                                Number(item.retrun_percentage)) /
                                100);
                            parsedDate.setDate(
                              parsedDate.getDate() + Math.floor(daysToAdd)
                            );
                            return parsedDate.toISOString().split("T")[0];
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
                <div className="flex flex-col md:hidden">
                  {data &&
                    data?.map((item, index) => (
                      <div className="rounded  shadow-lg bg-gray-800 p-3 mb-4">
                        <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                          <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-1">
                            {item.plan_name}
                          </p>
                          <p
                            className={`uppercase ${
                              item.status === "Cancelled"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.status}
                          </p>
                        </section>
                        <div className="pt-2 font-thin flex flex-col gap-1">
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Amount</p>
                            <p className="text-[#FEAA57]">${item.amount}</p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Start Date
                            </p>
                            <p className="text-gray-200 font-normal">
                              {item.date.split("T")[0]}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Last Payout Date
                            </p>
                            <p className="text-gray-200 font-normal">
                              {(() => {
                                const parsedDate = new Date(item.date);
                                const daysToAdd =
                                  (Number(item.amount) * 2) /
                                  ((Number(item.amount) *
                                    Number(item.retrun_percentage)) /
                                    100);
                                parsedDate.setDate(
                                  parsedDate.getDate() + Math.floor(daysToAdd)
                                );
                                return parsedDate.toISOString().split("T")[0];
                              })()}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Investment Id
                            </p>
                            <p className="text-gray-200 font-normal">
                              {item.id}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Transection Id
                            </p>
                            <p className="text-gray-200 font-normal">
                              {item.txtid}
                            </p>
                          </section>
                          {item.status === "Cancelled" && (
                            <section className="flex justify-between items-center font-bold  ">
                              <p className="text-gray-400 font-normal">
                                Reason
                              </p>
                              <p className="text-gray-200 font-normal">
                                {item.reason}
                              </p>
                            </section>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
