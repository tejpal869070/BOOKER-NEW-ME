import React, { useEffect, useState } from "react";
import { GetMyDownline } from "../../Controllers/User/UserController";
import { toast } from "react-toastify";
import { Loading3 } from "../Loading1";

export default function Downlinemember() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    try {
      const response = await GetMyDownline();
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
    <div>
      <h1 className="mb-4 font-bold text-lg dark:text-white text-center md:text-left">
        Downline Member
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          {data.length === 0 ? (
            <tbody>
              <tr>
                <td colspan="8" className="text-center p-4">
                  No Records Found!
                </td>
              </tr>
            </tbody>
          ) : (
            <div>
              <table className="w-full hidden md:inline-table">
                <thead className="text-xs font-semibold text-gray-100 uppercase bg-indigo-500 dark:bg-gray-800 dark:text-gray-200">
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
                      TOTAL INVEST
                    </th>
                    <th scope="col" className="px-6 py-3">
                      FIRST INVST. DATE
                    </th>
                  </tr>
                </thead>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className=" text-black font-semibold dark:text-gray-300   border-b dark:border-gray-700"
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
                      $ {item.total_invest}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item.firstInveDate}
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
                        {/* <p className="text-green-500">{item.uid}</p> */}
                      </section>
                      <div className="pt-2 font-thin flex flex-col gap-1">
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">UID</p>
                          <p className="text-[#FEAA57]">{item.uid}</p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Position</p>
                          <p className="text-gray-200">
                            {item.position === "L"
                              ? "LEFT"
                              : item.position === "R"
                              ? "RIGHT"
                              : ""}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Mobile</p>
                          <p className="text-gray-200">{item.mobile}</p>
                        </section>

                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">
                            Total Investment
                          </p>
                          <p className="text-gray-200 font-normal">
                            $ {item.total_invest}
                          </p>
                        </section>
                        <section className="flex justify-between items-center font-bold  ">
                          <p className="text-gray-400 font-normal">Joined On</p>
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
        </div>
      </div>
    </div>
  );
}
