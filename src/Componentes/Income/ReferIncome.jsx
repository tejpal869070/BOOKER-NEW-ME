import React, { useEffect, useState } from "react";
import TableComponent from "../TableComponent";
import DateSelector from "./DateSelector";
import { GetReffer } from "../../Controllers/User/UserController";
import { useLocation } from "react-router-dom";
import { Loading4 } from "../Loading1";

export default function ReferIncome() {
  const [tableData, setTableData] = useState([]);
  const location = useLocation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableHead = [
    "Trnx. Id",
    "USER NAME",
    "Mobile",
    "INCOME",
    "STATUS",
    "Date",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetReffer();
      if (response !== null) {
        const updatedData = response?.map((item) => {
          const { id, reffer_by, reffer_code, ...rest } = item;
          return rest;
        });
        setTableData(updatedData);
        setLoading(false);
      } else {
        setTableData([]);
        setLoading(false);
      }
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
      <p className="font-bold text-xl mb-6 dark:text-white hidden md:block">
        Income Manager {">"} Reffer Income
      </p>
      <div className="md:text-left hidden md:block">
        <DateSelector />
      </div>

      <div className="pb-20">
        {filteredData?.length === 0 ? (
          <div className="border-y-[0.2px] border-gray-400 py-4">
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
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:inline-table">
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
                    <td className="whitespace-nowrap px-6 py-4 capitalize">
                      {item.username}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.mobile}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      $ {item.reffer_to_amount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.status === "Y" ? "SUCCESS" : "PENDING"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.date.split("T")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col md:hidden pb-20">
              {filteredData &&
                filteredData?.map((item, index) => (
                  <div className="rounded  shadow-lg bg-gray-800 p-3 mb-2">
                    <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                      <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-0.5 capitalize">
                        {item.username}
                      </p>
                      <p
                        className={` ${
                          item.status === "N"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.status === "Y" ? "SUCCESS" : "PENDING"}
                      </p>
                    </section>
                    <div className="pt-2 font-thin flex flex-col gap-1">
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">
                          Income Amount
                        </p>
                        <p className="text-gray-200">
                          ${item.reffer_to_amount}
                        </p>
                      </section>
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">Mobile</p>
                        <p className="text-gray-200">{item.mobile}</p>
                      </section>
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">Time</p>
                        <p className="text-gray-200 font-normal">
                          {item.date.split("T")[0]}
                        </p>
                      </section>
                      <section className="flex justify-between items-center font-bold  ">
                        <p className="text-gray-400 font-normal">
                          Transaction Id
                        </p>
                        <p className="text-gray-200 font-normal">
                          {item.txtid}
                        </p>
                      </section>
                      {item.status === "Cancelled" && (
                        <section className="flex justify-between   font-bold  ">
                          <p className="text-gray-400 font-normal">Reason</p>
                          <p className="text-gray-400 font-normal max-w-[60%]">
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
  );
}
