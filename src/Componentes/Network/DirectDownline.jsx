import React, { useEffect, useState } from "react";
import { GetDirectDownline } from "../../Controllers/User/UserController";
import { toast } from "react-toastify";
import { Loading3 } from "../Loading1";
import gif1 from "../../assets/photos/nodata.png";

export default function DirextDownline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    try {
      const response = await GetDirectDownline();
      if (response.status) {
        setData(response.data);
        setLoading(false);
      } else {
        toast.error("Something Went Wrong. Please Refresh.");
        setData([]);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something Went Wrong. Please Refresh.");
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-[9999]">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="mb-4 font-bold text-lg dark:text-white text-center md:text-left">
        Direct Downline{" "}
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full md:border-4 rounded-sm border-indigo-300 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {data.length === 0 ? (
            <div>
              <img alt="no data" src={gif1} className="m-auto w-40" />
              <p className="text-center font-bold text-xl">No Records !</p>
            </div>
          ) : (
            <div>
              <table className="hidden md:inline-table w-full">
                <thead className="text-xs   font-semibold text-gray-100 uppercase bg-indigo-500 dark:bg-gray-800 dark:text-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      S.No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      USERNAME
                    </th>
                    <th scope="col" className="px-6 py-3">
                      PHONE
                    </th>
                    <th scope="col" className="px-6 py-3">
                      POSITION
                    </th>
                    <th scope="col" className="px-6 py-3">
                      JOINING
                    </th>
                    <th scope="col" className="px-6 py-3">
                      BALANCE
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TOTAL INVEST
                    </th>
                    <th scope="col" className="px-6 py-3">
                      PAID/UNPAID
                    </th>
                  </tr>
                </thead>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white text-black font-semibold odd:dark:bg-gray-900 dark:text-gray-300 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  dark:text-white"
                    >
                      {index + 1}.
                    </th>
                    <td className="whitespace-nowrap px-6 py-4 capitalize">
                      {item.username}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.mobile}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.position === "L"
                        ? "LEFT"
                        : item.position === "R"
                        ? "RIGHT"
                        : ""}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.date.split("T")[0]}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      ${Number(item.balance).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      ${item.total_investment}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.paidType}
                    </td>
                  </tr>
                ))}
              </table>
              <div className="flex flex-col md:hidden">
                {data &&
                  data?.map((item, index) => (
                    <div className="rounded  shadow-lg bg-gray-800 p-3 mb-4">
                      <section className="border-b-[0.5px] border-gray-600 pb-2  flex justify-between items-center font-semibold  ">
                        <p className="px-2 bg-indigo-500 inline text-gray-200 rounded py-1 capitalize">
                          {item.username}
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
                      <div className="pt-2 font-thin flex flex-col gap-1">
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Phone</p>
                          <p className="text-gray-200">{item.mobile}</p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Position</p>
                          <p className="text-gray-200">{item.position}</p>
                        </section>

                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">
                            Total Investment
                          </p>
                          <p className="text-gray-200 font-normal">
                            $ {item.total_investment}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">
                            User Balance
                          </p>
                          <p className="text-gray-200 font-normal">
                            ${Number(item.balance).toFixed(2)}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">
                            Joining Date
                          </p>
                          <p className="text-gray-200 font-normal">
                            {item.date.split("T")[0]}
                          </p>
                        </section>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </table>
      </div>
    </div>
  );
}
