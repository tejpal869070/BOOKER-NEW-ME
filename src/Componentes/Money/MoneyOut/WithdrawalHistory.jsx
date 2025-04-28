import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import {
  GetUserPaymentHistory,
  RemoveWithdrawalRequest,
} from "../../../Controllers/User/UserController";
import { Loading4 } from "../../Loading1";
import gif1 from "../../../assets/photos/nodata.png";
import { useLocation } from "react-router-dom";
import DateSelector from "../../Income/DateSelector";
import { MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import CopyToClipboard from "react-copy-to-clipboard";

export default function WithdrawalHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();

  const handleCopy = () => {
    // window.alert("Withdrawal Address Copied.");
    toast.success("Withdrawal Address Copied.", {
      position: "top-right",
    });
  };

  const handleCancelWithdrawalRequest = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this withdrawal request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });
    if (result.isConfirmed) {
      try {
        await RemoveWithdrawalRequest(id);
        toast.success("Withdrawal Request Cancelled", {
          position: "top-center",
        });
        await GetPaymentHistory();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Internal Server Error !"
        );
      }
    }
  };

  const GetPaymentHistory = async () => {
    const type = "Withdrawal";
    const response = await GetUserPaymentHistory(type);
    console.log(response.data);
    if (response.data) {
      setData(response.data.reverse());
    } else {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    GetPaymentHistory();
  }, []);

  useEffect(() => {
    const start = new URLSearchParams(location.search).get("from");
    const end = new URLSearchParams(location.search).get("to");
    setStartDate(start);
    setEndDate(end);
  }, [location]);

  useEffect(() => {
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);

    if (startDate && endDate) {
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDateObj = new Date(startDate);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(data);
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
    <>
      {" "}
      <ToastContainer />
      <div className="relative h-screen">
        <div>
          <h1 className="mb-6 font-bold dark:text-gray-200 text-lg text-center md:text-left hidden md:blocks">
            Withdrawal History
          </h1>

          <div className="md:text-left hidden md:block">
            <DateSelector />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {filteredData.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-40" />
                <p className="text-center dark:text-gray-200 font-bold text-xl">
                  No Records !
                </p>
              </div>
            ) : (
              <div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-4 border-indigo-400 hidden md:inline-table">
                  <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Trnx Id
                      </th>
                      <th scope="col" className="px-4 py-3">
                        AMOUNT
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Withdrawal To
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-6 py-3"
                      >
                        DATE
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`text-black font-semibold dark:text-gray-200 border-b dark:border-gray-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-200 dark:bg-gray-800"
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                        >
                          {item.transection_id}
                        </th>
                        <td className="whitespace-nowrap px-4 py-4">
                          ${item.amount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {item.status === "P" ? "Pending" : item.status === "C" ? "Cancelled" : item.status === "IP" ? "Inprocess" : item.status === "R" ? "Rejected" : ""}
                        </td>
                        <td className="whitespace-nowrap flex items-center gap-1 px-6 py-4 ">
                          {item.withdrawal_address.slice(0, 8)}.....
                          {item.withdrawal_address.slice(-4)}
                          <CopyToClipboard
                            text={item.withdrawal_address}
                            onCopy={handleCopy}
                          >
                            <FaCopy className="cursor-pointer  " />
                          </CopyToClipboard>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 hidden md:table-cell">
                          {item.created_at.split("T")[0]}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 flex justify-left items-center gap-2">
                          {item.status === "P" && (
                            <MdCancel
                              size={20}
                              className="cursor-pointer text-red-500"
                              onClick={() =>
                                handleCancelWithdrawalRequest(item.id)
                              }
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col md:hidden pb-16">
                  {filteredData &&
                    filteredData?.map((item, index) => (
                      <div className="rounded  shadow-lg bg-gray-800 p-3 mb-4">
                        <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                          <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-1">
                            USDT Withdrawal
                          </p>
                          <p
                            className={` ${
                              item.status === "C"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.status === "P" ? "Pending" : item.status === "C" ? "Cancelled" : item.status === "IP" ? "Inprocess" : item.status === "R" ? "Rejected" : ""}
                          </p>
                        </section>
                        <div className="pt-2 font-thin flex flex-col gap-1">
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Amount</p>
                            <p className="text-[#FEAA57]"> 
                              {item.amount}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Time</p>
                            <p className="text-gray-200 font-normal">
                              {item.created_at.split("T")[0]}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Withdrawal To
                            </p>
                            <p className="text-gray-200 font-normal flex items-center gap-1">
                              {item.withdrawal_address.slice(0, 8)}.....
                              {item.withdrawal_address.slice(-4)}
                              <CopyToClipboard
                                text={item?.withdrawal_address}
                                onCopy={handleCopy}
                              >
                                <FaCopy className="cursor-pointer  " />
                              </CopyToClipboard>
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Transection Id
                            </p>
                            <p className="text-gray-200 font-normal flex items-center gap-1">
                              {item.transection_id}
                            </p>
                          </section>
                          {item.status === "C" && (
                            <section className="flex justify-between font-bold">
                              <p className="text-gray-400 font-normal">
                                Reason
                              </p>
                              <p className="text-gray-400 font-normal max-w-[60%]">
                                {item.reason}
                              </p>
                            </section>
                          )}
                          {item.status === "P" ? (
                            <section className="flex justify-between items-center font-bold  ">
                              <p
                                className="text-gray-800  w-full text-center py-2 rounded bg-red-400"
                                onClick={() =>
                                  handleCancelWithdrawalRequest(item.id)
                                }
                              >
                                Cancel Request
                              </p>
                            </section>
                          ) : (
                            ""
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
    </>
  );
}
