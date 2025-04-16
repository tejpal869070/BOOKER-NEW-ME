import React, { useCallback, useEffect, useState } from "react";
import { MyColorGameHistory } from "../../Controllers/User/GamesController";
import swal from "sweetalert";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaCircleChevronDown } from "react-icons/fa6";

export default function ColorGameMyHistory({
  gameType,
  refreshHistory,
  isCountDown,
  currentGameData,
  betWon,
}) {
  const [data, setData] = useState([]);
  const [pageId, setPageId] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState();
  const [visible, setVisible] = useState(false);

  const fetchHistory = useCallback(
    async (gameType) => {
      try {
        const response = await MyColorGameHistory(gameType, pageId);
        if (response.status) {
          setData(response.data); 
        }
      } catch (error) {
        swal({
          title: "Error!",
          text: "Something Went Wrong",
          icon: "error",
          buttons: {
            confirm: "OK",
          },
          dangerMode: true,
        }).then((willRedirect) => {
          if (willRedirect) {
            window.location.reload();
          }
        });
      }
    },
    [pageId]
  );

  useEffect(() => {
    fetchHistory(gameType);
  }, [gameType, fetchHistory, refreshHistory, isCountDown]);

  useEffect(() => {
    let totalAmount = 0; // Start with a totalAmount of 0
    if (currentGameData?.period) {
      const lastBet =
        data &&
        data?.filter(
          (item) => Number(item.Period) === Number(currentGameData.period) - 1
        );
      if (lastBet.length > 0) {
        lastBet.forEach((item) => {
          if (item.type === "Color") {
            if (item.value === "Red") {
              if (item.number === "0") {
                totalAmount += Number(item.if_open_zero); // Accumulate the value
              } else if (item.value === item.open_color) {
                totalAmount += Number(item.winning_amount); // Accumulate the value
              } else {
                totalAmount -= Number(item.price); // Accumulate the value
              }
            } else if (item.value === "Green") {
              if (item.number === "5") {
                totalAmount += Number(item.if_open_zero); // Accumulate the value
              } else if (item.value === item.open_color) {
                totalAmount += Number(item.winning_amount); // Accumulate the value
              } else {
                totalAmount -= Number(item.price); // Accumulate the value
              }
            } else if (item.value === "Violet") {
              if (item.number === "0" || item.number === "5") {
                totalAmount += Number(item.if_open_zero); // Accumulate the value
              } else {
                totalAmount -= Number(item.price); // Accumulate the value
              }
            }
          } else {
            if (item.value === item.number) {
              totalAmount += Number(item.winning_amount); // Accumulate the value
            } else {
              totalAmount -= Number(item.price); // Accumulate the value
            }
          }
        });
        betWon(totalAmount);
      }
    }
  }, [currentGameData]); // Add `data` to dependencies if needed

  return (
    <div className="">
      <div className="color-game-history">
        <button className="bg-[#ff9600]">My History</button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full relative text-[16px] font-semibold text-left rtl:text-right text-black dark:text-gray-400">
          <thead className="text-sm text-black uppercase bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Period
              </th>
              <th scope="col" className="px-4 py-3 hidden md:table-cell">
                AMOUNT
              </th>
              <th scope="col" className="px-6 py-4 hidden md:table-cell">
                Type
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                Choosen
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                result
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                P/L
              </th>
              <th scope="col" className="px-6 py-3  md:hidden">
                Result
              </th>
              <th scope="col" className="px-6 py-3  md:hidden">
                P/L
              </th>
              <th scope="col" className="px-6 py-3  md:hidden">
                View
              </th>
            </tr>
          </thead>

          {data &&
            data.map((item, index) => (
              <tbody className=" " key={index}>
                <tr
                   
                  className={`  border-b-2 border-gray-300 dark:bg-gray-800 dark:border-gray-700  `}
                >
                  <th
                    scope="row"
                    className="px-6 py-[3px] font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                  >
                    {item.Period}
                  </th>
                  <td className="whitespace-nowrap px-4 py-[3px] hidden md:table-cell  ">
                    ${item.price}
                  </td>

                  <td className="whitespace-nowrap px-4 py-[3px] hidden md:table-cell">
                    {item.type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-[3px] hidden md:table-cell">
                    {item.value}
                  </td>
                  <td className="whitespace-nowrap px-6 py-[3px] border-l-2  hidden md:flex flex-row justify-between items-center">
                    <p>{item.open_color}</p>{" "}
                    <p className="rounded-full p-1 bg-[#ffc989] dark:text-gray-900">
                      {item.number}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-[3px]   md:hidden flex flex-row justify-center items-center">
                    <p
                      className={`rounded-full  w-8  h-8  flex items-center justify-center  dark:text-gray-900 bg-gray-200`}
                    >
                      {item.number}
                    </p>
                  </td>
                  <td
                    className={`px-6 py-[3px]    ${
                      item.type === "Color"
                        ? item.value === "Red"
                          ? item.number === "0"
                            ? "text-[green]"
                            : item.value === item.open_color
                            ? "text-[green]"
                            : "text-[red]"
                          : item.value === "Green"
                          ? item.number === "5"
                            ? "text-[green]"
                            : item.value === item.open_color
                            ? "text-[green]"
                            : "text-[red]"
                          : item.value === "Violet"
                          ? item.number === "0" || item.number === "5"
                            ? "text-[green]"
                            : "text-[red]"
                          : 0
                        : item.value === item.number
                        ? "text-[green]"
                        : "text-[red]"
                    }`}
                  >
                    {item.type === "Color"
                      ? item.value === "Red"
                        ? item.number === "0"
                          ? `+${item.if_open_zero}`
                          : item.value === item.open_color
                          ? `+${item.winning_amount}`
                          : -item.price
                        : item.value === "Green"
                        ? item.number === "5"
                          ? `+${item.if_open_zero}`
                          : item.value === item.open_color
                          ? `+${item.winning_amount}`
                          : -item.price
                        : item.value === "Violet"
                        ? item.number === "0" || item.number === "5"
                          ? `+${item.if_open_zero}`
                          : -item.price
                        : 0
                      : item.value === item.number
                      ? `+${item.winning_amount}`
                      : -item.price}
                  </td>
                  <td
                    className="px-6 py-[3px]  md:hidden"
                    onClick={() => {
                      setSelectedIndex(index);
                      setVisible((pre) => !pre);
                    }}
                  >
                    <FaCircleChevronDown
                      size={20}
                      className="text-black dark:text-gray-200"
                    />
                  </td>
                </tr>
                {visible && selectedIndex === index ? (
                  <tr className="  bg-gray-300  dark:bg-gray-400">
                    <td colSpan="4 " className="py-2">
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Period</p>
                        <p>{item.Period}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Amount</p>
                        <p>{item.price}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Type</p>
                        <p>{item.type}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Seleted</p>
                        <p>{item.value}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Result</p>
                        <p className="flex gap-2">
                          <p>{item.open_color}</p>
                          {" /"}
                          <p className=" ">{item.number}</p>
                        </p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Date</p>
                        <p>{item.date.split("T")[0]}</p>
                      </div>
                      <div className="text-black dark:text-gray-800 flex px-10 justify-between">
                        <p>Time</p>
                        <p>{item.date.split("T")[1]}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            ))}

          <div className="flex items-center gap-2 ">
            <button
              disabled={pageId === 1}
              onClick={() => setPageId(pageId - 1)}
            >
              <FaArrowCircleLeft size={20} className="cursor-pointer" />
            </button>
            {pageId}
            <button
              disabled={data && data.length < 10}
              onClick={() => setPageId(pageId + 1)}
            >
              <FaArrowCircleRight size={20} className="cursor-pointer" />
            </button>
          </div>
        </table>
      </div>
    </div>
  );
}
