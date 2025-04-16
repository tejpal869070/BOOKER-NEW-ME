import React, { useCallback, useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import gif1 from "../../assets/photos/nodata.png";
import { GetAccountAllStatement } from "../../Controllers/User/UserController";
import { Loading1, Loading3, Loading4 } from "../Loading1";

export default function TodayHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const showModal = useCallback(
    (index) => {
      setIsVisible((pre) => !pre);
      setSelectedIndex(index);
    },
    [setIsVisible, setSelectedIndex]
  );

  const GetAllStatement = async () => {
    try {
      const response = await GetAccountAllStatement();
      if (response.status) {
        setData(
          response.data.filter((item) => {
            const itemDate = new Date(item.date);
            const today = new Date();
            return (
              itemDate.getFullYear() === today.getFullYear() &&
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getDate() === today.getDate()
            );
          })
        );

        setLoading(false);
      } else {
        window.alert("Something Went Wrong.");
        setData([]);
        setLoading(false);
      }
    } catch (error) {
      window.alert("Something Went Wrong.");
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllStatement();
  }, []);

  if (loading) {
    return (
      <div className="  flex justify-center items-center min-h-[40vh] md:min-h-[90vh] bg-opacity-50 z-[9999]">
        <Loading4 />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className=" ">
        <div>
          <h1 className="mb-6 font-bold text-lg dark:text-white hidden md:block">
            Account {">"}Today History
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {data && data.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-40" />
                <p className="text-center dark:text-gray-300 font-bold text-xl">
                  No Records !
                </p>
              </div>
            ) : (
              <div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:inline-table w-full">
                  <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Trnx Id
                      </th>
                      <th scope="col" className="px-6 py-3">
                        TYPE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        DATE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        AMOUNT
                      </th>
                      <th scope="col" className="px-6 py-3">
                        SENT TO
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Received From
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
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
                          className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                        >
                          {item.txtid}
                        </th>
                        <td className="whitespace-nowrap px-4 py-3">
                          {item.type}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          {item.date.split("T")[0]}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          $ {item.amount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          {item.description.split(" ").includes("To")
                            ? item.description.split(" ")[2]
                            : ""}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          {item.description.split(" ").includes("from")
                            ? item.description.split(" ")[2]
                            : ""}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          {item?.type==="Matching-Income" ? "Matching Income" : item.description}
                        </td>
                      </tr>

                      {isVisible && selectedIndex === index ? (
                        <tr>
                          <td colspan="7" className="text-center p-4">
                            No Records Found!
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                    </tbody>
                  ))}
                </table>
                <div className="flex flex-col md:hidden pb-20">
                  {data &&
                    data?.map((item, index) => (
                      <div className="rounded  shadow-lg bg-gray-800 p-3 mb-2">
                        <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                          <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-1">
                            {item.payment_type === "USDT"
                              ? "Crypto"
                              : item.type}
                          </p>
                          <p
                            className={` ${
                              item.status === "Cancelled"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.status}
                          </p>
                        </section>
                        <div className="pt-2 font-thin flex flex-col gap-0.5">
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Amount</p>
                            <p className="text-[#FEAA57]">$ {item.amount}</p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Time</p>
                            <p className="text-gray-200 font-normal">
                              {item.date.split("T")[0]}
                            </p>
                          </section>

                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Description
                            </p>
                            <p className="text-gray-200 font-normal">
                              {item.description}
                            </p>
                          </section>
                          {item.status === "Cancelled" && (
                            <section className="flex justify-between   font-bold  ">
                              <p className="text-gray-400 font-normal">
                                Reason
                              </p>
                              <p className="text-gray-400 font-normal max-w-[60%]">
                                {item.reason}
                              </p>
                            </section>
                          )}
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Transection Id
                            </p>
                            <p className="text-gray-200 font-normal">
                              {item.txtid}
                            </p>
                          </section>
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
