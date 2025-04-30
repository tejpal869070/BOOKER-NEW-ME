import React, { useEffect, useState } from "react";
import vsimg from "../../assets/photos/vs.png";
import { MatchData } from "../../assets/Data/MatchData";
import { CgMediaLive } from "react-icons/cg";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getAllMatch } from "../../Controllers/User/GamesController";
import { API } from "../../Controllers/Api";
import { Loading4 } from "../Loading1";

export default function Match() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const FormatDate = ({ date }) => {
    // Function to format the date
    const formatDate = (dateStr) => {
      const dateObj = new Date(dateStr);
      return dateObj
        .toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "")
        .replace(":", ".");
    };

    return <p>{formatDate(date)}</p>;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllMatch();
        setData(response?.data);
        setLoading(false)
      } catch (error) {
        toast.error("Something Went Wrong !");
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center ">
        <Loading4 />
      </div>
    );
  }

  return (
    <div className="  m-auto max-w-6l m-auto min-h-screen">
      <ToastContainer />
      <div class="w-full   flex items-center justify-center min-h-full p-2">
        <div class="container max-w-6xl">
          <div class="  rounded-xl shadow-md overflow-hidden ">
            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-300 to-blue-800 rounded-xl">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 class="text-xl font-bold text-gray-800">Team Members</h2>
                  <p class="text-gray-500 mt-1">
                    Manage your team members and their account permissions here.
                  </p>
                </div>
              </div>

              <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <div class="relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full "
                    placeholder="Search members..."
                  />
                </div>
                <div>
                  <select class="border border-gray-300 rounded-lg px-4 py-2  w-full sm:w-auto">
                    <option value="">All</option>
                    <option value="engineering">Live</option>
                    <option value="design">Upcoming</option>
                    <option value="marketing">Finished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* matches */}
            <div class="overflow-x-auto mt-10 ">
              {data?.map((item, index) => (
                <table
                  key={index}
                  class="min-w-full divide-y divide-gray-900 rounded-xl overflow-hidden mb-4 animate-fade-up animate-once animate-duration-[800ms]"
                >
                  <tbody class="bg-gradient-to-r from-slate-500 to-slate-800   rounded-xl">
                    <tr class=" rounded-xl transition-colors duration-150">
                      <td class="w-[24%] px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col justify-center items-center">
                          <div class=" w-20  ">
                            <img
                              class=" w-40 rounded-full "
                              src={`${API.url}assets/${item.teams[0].image}`}
                              alt=""
                            />
                          </div>
                          <div class=" ">
                            <div class="text-sm text-center font-medium text-gray-300">
                              {item.teams[0].team_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-[24%]">
                        <img alt="vs" src={vsimg} className="w-40 m-auto" />
                      </td>
                      <td class="w-[24%] px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col justify-center items-center">
                          <div class=" w-20  ">
                            <img
                              class=" w-40 rounded-full "
                              src={`${API.url}assets/${item.teams[1].image}`}
                              alt=""
                            />
                          </div>
                          <div class=" ">
                            <div class="text-sm text-center font-medium text-gray-300">
                              {item.teams[1].team_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class=" w-[24%] px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-300 font-semibold">
                          <p className="italic underline ">Match Time</p>
                          <p className="text-lg">
                            {item.status === "LIVE" ? (
                              <span className="flex items-center gap-2">
                                <CgMediaLive
                                  color="green"
                                  className="animate-ping"
                                  size={12}
                                />
                                Live
                              </span>
                            ) : (
                              <FormatDate date={item.match_time} />
                            )}
                          </p>
                        </div>
                      </td>

                      <td class="px-6 py-4 whitespace-nowrap text-center bg-yellow-200  font-semibold cursor-pointer">
                        <Link
                          to={{
                            pathname: "/home",
                            search: `?game=match&id=${item.id}`, // Proper query string formatting
                          }}
                        >
                          VIEW
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
