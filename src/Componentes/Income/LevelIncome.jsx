import React, { useEffect, useState } from "react";
import DateSelector from "./DateSelector";
import { GetLevelIncome } from "../../Controllers/User/UserController";
import { useLocation } from "react-router-dom";
import { Loading4 } from "../Loading1";

export default function LevelIncome() {
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableHead = ["Trnx. Id", "USER", "position", "LEVEL", "PAYOUT", "Date"];

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetLevelIncome();
      setTableData(response);
      setLoading(false);
    };

    fetchData();
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
      setFilteredData(tableData);
    } else {
      // Filter data between startDate and endDate
      const filteredData = tableData.filter((item) => {
        const itemDate = new Date(item.date);
        const startDateObj = new Date(startDate);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      setFilteredData(filteredData);
    }
  }, [startDate, endDate, tableData]);

  if (loading) {
    return (
      <div className="  flex justify-center items-center min-h-[40vh] md:min-h-[90vh] bg-opacity-50 z-[9999]">
        <Loading4 />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <p className="font-bold text-xl mb-6 dark:text-white text-center md:text-left hidden md:block">
        Level Income
      </p>
      <div className="md:text-left hidden md:block">
        <DateSelector />
      </div>
      <div>
        {filteredData?.length === 0 ? (
          <div className=" py-4">
            <img
              alt="no data"
              src={require("../../assets/photos/nodata.png")}
              className="w-40 mx-auto"
            />
            <p className="text-center dark:text-white font-semibold">
              No Record
            </p>
          </div>
        ) : (
          <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:inline-table w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-800 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {tableHead.map((item, index) => (
                      <th
                        scope="col"
                        className={`${index === 0 ? "px-4 py-3" : "px-6 py-3"}`}
                        key={index}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white dark:text-gray-300 odd:dark:bg-gray-900 text-black font-medium even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.txtid}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {item.user_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.position==="R" ? "Right" :"Left"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.level}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        ${item.retrun_amount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {item.date.split("T")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:hidden">
              {filteredData &&
                filteredData?.map((item, index) => (
                  <div className="rounded  shadow-lg bg-gray-800 p-3 mb-4">
                    <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                      <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-0.5">
                        {item.user_name}
                      </p>
                      <p className="text-green-500 text-lg">
                        ${item.retrun_amount}
                      </p>
                    </section>
                    <div className="pt-2 font-thin flex flex-col gap-1">
                      {/* <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">Mobile</p>
                        <p className="text-gray-200">{item.mobile}</p>
                      </section> */}
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">User Level</p>
                        <p className="text-gray-200">{item.level}</p>
                      </section>
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">Time</p>
                        <p className="text-gray-200 font-normal">
                          {item.date.split("T")[0]}
                        </p>
                      </section>
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">Trnx. Id</p>
                        <p className="text-gray-200 font-normal">{item.txtid}</p>
                      </section>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
