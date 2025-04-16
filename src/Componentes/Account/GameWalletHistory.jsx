import React, { useCallback, useEffect, useState } from "react";
import gif1 from "../../assets/photos/nodata.png";
import { GetGameWalletStatement } from "../../Controllers/User/UserController";
import DateSelector from "../Income/DateSelector";
import { Loading1, Loading3, Loading4 } from "../Loading1";
import { useLocation } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function GameWalletHistory() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [pageId, setPageId] = useState(1);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});

  const classes1 = "flex justify-between border-b border-gray-400";

  const location = useLocation();

  const setOpenCasinoTransection = (item) => {
    setPopupOpen(true);
    setPopupData(item);
  };

  const showModal = useCallback(
    (index) => {
      setIsVisible((pre) => !pre);
      setSelectedIndex(index);
    },
    [setIsVisible, setSelectedIndex]
  );

  const GetAllStatement = async () => {
    try {
      const response = await GetGameWalletStatement(pageId);
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
  }, [pageId]);

  useEffect(() => {
    const start = new URLSearchParams(location.search).get("from");
    const end = new URLSearchParams(location.search).get("to");
    setStartDate(start);
    setEndDate(end);
  }, [location]);

  useEffect(() => {
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
    <div className=" min-h-screen">
      <div className=" ">
        <div>
          <h1 className="mb-6 font-bold text-lg dark:text-white hidden md:block ">
            Account {"> "}Game Wallet History
          </h1>
          {/* <AccountHistoryPeriod /> */}

          <div className="md:text-left hidden md:block">
            <DateSelector />
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-1">
            {filteredData && filteredData.length === 0 ? (
              <div>
                <img alt="no data" src={gif1} className="m-auto w-40" />
                <p className="text-center dark:text-white font-bold text-xl">
                  No Records !
                </p>
              </div>
            ) : (
              <div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:inline-table w-full">
                  <thead className="text-xs font-semibold text-black uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Trnx. Id
                      </th>
                      {/* <th scope="col" className="px-6 py-3">
                      TYPE
                    </th> */}
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        AMOUNT
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Updated Balance
                      </th>
                      <th scope="col" className="px-6 py-3">
                        GAME NAME
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Desc.
                      </th>
                    </tr>
                  </thead>
                  {filteredData.map((item, index) => (
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
                          className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                        >
                          {item.txtid}.
                        </th>
                        {/* <td className="whitespace-nowrap px-4 py-2">{item.type}</td> */}
                        <td className="whitespace-nowrap px-6 py-2">
                          {item.date.split("T")[0]}
                        </td>
                        <td
                          className={`px-6 py-2 ${
                            item.bet_type === "Win Bet" ||
                            item.game_type === "Received" ||
                            (item.transaction_type === "credit" &&
                              (item.bet_type === "win" ||
                                item.bet_type === "bonus" ||
                                item.bet_type === "spin" ||
                                item.bet_type === "bet")) ||
                            (item.transaction_type === "debit" &&
                              (item.bet_type === "cancel" ||
                                item.bet_type === "partial_cancel"))
                              ? "text-[green]"
                              : "text-red-600"
                          }`}
                        >
                          {item.bet_type === "Win Bet" ||
                          item.game_type === "Received" ||
                          (item.transaction_type === "credit" &&
                            (item.bet_type === "win" ||
                              item.bet_type === "bonus" ||
                              item.bet_type === "spin" ||
                              item.bet_type === "bet")) ||
                          (item.transaction_type === "debit" &&
                            (item.bet_type === "cancel" ||
                              item.bet_type === "partial_cancel"))
                            ? "+"
                            : "-"}
                          {Number(item.bet_balance).toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                           {Number(item.total_balance).toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2 flex justify-left items-center gap-2">
                          {item.game_type}{" "}
                          {item.game_type === "casino" && (
                            <FaRegEye
                              className="cursor-pointer"
                              size={16}
                              onClick={() => {
                                setOpenCasinoTransection(item);
                              }}
                            />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                          {item.bet_type}
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
                  {filteredData &&
                    filteredData?.map((item, index) => (
                      <div className="rounded  shadow-lg bg-gray-800 p-3 mb-2">
                        <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                          <p className="px-2 bg-indigo-500 inline text-gray-200 rounded  py-0.5">
                            {item.game_type}
                          </p>
                          <p
                            className={`  ${
                              item.bet_type === "Win Bet" ||
                              item.game_type === "Received" ||
                              (item.transaction_type === "credit" &&
                                (item.bet_type === "win" ||
                                  item.bet_type === "bonus" ||
                                  item.bet_type === "spin" ||
                                  item.bet_type === "bet")) ||
                              (item.transaction_type === "debit" &&
                                (item.bet_type === "cancel" ||
                                  item.bet_type === "partial_cancel"))
                                ? "text-[green]"
                                : "text-red-600"
                            }`}
                          >
                            {item.bet_type === "Win Bet" ||
                            item.game_type === "Received" ||
                            (item.transaction_type === "credit" &&
                              (item.bet_type === "win" ||
                                item.bet_type === "bonus" ||
                                item.bet_type === "spin" ||
                                item.bet_type === "bet")) ||
                            (item.transaction_type === "debit" &&
                              (item.bet_type === "cancel" ||
                                item.bet_type === "partial_cancel"))
                              ? "+"
                              : "-"}
                            {Number(item.bet_balance).toFixed(2)}
                          </p>
                        </section>
                        <div className="pt-2 font-thin flex flex-col gap-1">
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Updated Balance
                            </p>
                            <p className="text-gray-200 font-normal">
                             {Number(item.total_balance).toFixed(2)}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">
                              Bet Type
                            </p>
                            <p className="text-gray-200 font-normal">
                              {item.bet_type}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Time</p>
                            <p className="text-gray-200 font-normal">
                              {item.date.split("T")[0]}
                            </p>
                          </section>
                          <section className="flex justify-between items-center font-bold  ">
                            <p className="text-gray-400 font-normal">Transection Id</p>
                            <p className="text-gray-200 font-normal">
                              {item.txtid}
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
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-black dark:text-white pb-40">
            <button
              disabled={pageId === 1}
              onClick={() => setPageId(pageId - 1)}
            >
              <FaArrowCircleLeft size={20} className="cursor-pointer " />
            </button>
            {pageId}
            <button
              disabled={data && data.length <= 99}
              onClick={() => setPageId(pageId + 1)}
            >
              <FaArrowCircleRight size={20} className="cursor-pointer " />
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="absolute w-full h-full top-0">
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
            <div className=" text-white bg-gradient-to-r from-gray-700 rounded h-[70vh] to-slate-900 p-10 inline-block">
              <h1 className="text-center text-2xl font-bold ">
                CASINO TRANSECTION{" "}
              </h1>
              <div className="flex flex-col mt-6 gap-2">
                <div className={`${classes1}`}>
                  <p>Amount :</p>
                  <p>{Number(popupData.bet_balance).toFixed(2)}</p>
                </div>

                <div className={`${classes1}`}>
                  <p>Round Id :</p>
                  <p> {popupData.round_id}</p>
                </div>
              </div>
              <MdCancel
                size={30}
                onClick={() => setPopupOpen(false)}
                className="cursor-pointer mt-8 flex justify-center m-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
