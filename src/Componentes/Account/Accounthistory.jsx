import React, { useCallback, useEffect, useState } from "react";
import gif1 from "../../assets/photos/nodata.png";
import { GetAccountAllStatement } from "../../Controllers/User/UserController";
import DateSelector from "../Income/DateSelector";
import { Loading4 } from "../Loading1";
import { useLocation } from "react-router-dom";

export default function AccountHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();

  // search function

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
        setData(response.data);
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

  useEffect(() => {
    const start = new URLSearchParams(location.search).get("from");
    const end = new URLSearchParams(location.search).get("to");
    setStartDate(start);
    setEndDate(end);
  }, [location]);

  useEffect(() => {
    // Create a new date object for the endDate and set it to the end of the day
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);

    if (startDate === null || endDate === null) {
      setFilteredData(data);
    } else {
      // Filter data between startDate and endDate
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDateObj = new Date(startDate);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      setFilteredData(filteredData);
    }
  }, [startDate, endDate, data]);

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
          <div className="mb-6 font-bold text-lg dark:text-white text-center md:text-left hidden md:block">
            Account History{" "}
          </div>
          {/* <AccountHistoryPeriod /> */}
          <div className="md:text-left hidden md:block">
            <DateSelector />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 hidden md:block">
            {filteredData && filteredData.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-40" />
                <p className="text-center font-bold text-xl">No Records !</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Trnx Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TYPE
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Transaction Detail
                    </th>
                    <th scope="col" className="px-6 py-3">
                      AMOUNT
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Updated Balance ($)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                  </tr>
                </thead>
                {filteredData.map((item, index) => (
                  <tbody key={index}>
                    <tr
                      key={index}
                      className={` text-black font-semibold dark:text-gray-200  border-b dark:border-gray-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                      >
                        {item.txtid}.
                      </th>
                      <td className="whitespace-nowrap px-4 py-4">
                        {item.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.date.split("T")[0]}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        $ {Number(item.amount).toFixed(4)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        $ {item.balance}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.type === "Matching-Income"
                          ? "Matching Income"
                          : item.description}
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
            )}
          </div>

          <div className="flex flex-col md:hidden pb-20">
            {filteredData?.map((item, index) => (
              <div className="rounded  shadow-lg bg-gray-800 p-3 mb-2">
                <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                  <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-0.5">
                    {item.type}
                  </p>
                  <p className="text-green-500 ">
                    {item.type === "Matching-Income" ? "" : item.description}
                  </p>
                </section>
                <div className="pt-2 font-thin flex flex-col  ">
                  <section className="flex justify-between items-center font-bold  ">
                    <p className="text-gray-400 font-normal">Amount</p>
                    <p className="text-[#FEAA57]">${item.amount}</p>
                  </section>
                  <section className="flex justify-between items-center font-bold  ">
                    <p className="text-gray-400 font-normal">Time</p>
                    <p className="text-gray-200 font-normal">
                      {item.date.split("T")[0]}{" "}
                      {item.date.split("T")[1]?.split(".")[0]}
                    </p>
                  </section>
                  {item.type !== "Withdrawal" &&
                    item.type !== "Deposit" &&
                    item.type !== "Investment Return" &&
                    item.type !== "Level-Income" && (
                      <>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Sent To</p>
                          <p className="text-gray-200 font-normal">
                            {item.description.split(" ").includes("To")
                              ? item.description.split(" ")[2]
                              : ""}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">
                            Received From{" "}
                          </p>
                          <p className="text-gray-200 font-normal">
                            {item.description.split(" ").includes("from")
                              ? item.description.split(" ")[2]
                              : ""}
                          </p>
                        </section>
                      </>
                    )}
                  <section className="flex justify-between items-center font-bold  ">
                    <p className="text-gray-400 font-normal">Updated Balance</p>
                    <p className="text-gray-200 font-normal">
                      ${Number(item.balance).toFixed(2)}
                    </p>
                  </section>
                  <section className="flex justify-between items-center font-bold  ">
                    <p className="text-gray-400 font-normal">Transection Id</p>
                    <p className="text-gray-200 font-normal">{item.txtid}</p>
                  </section>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
