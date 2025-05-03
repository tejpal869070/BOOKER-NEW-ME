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
        setLoading(false);
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
            {/* <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-300 to-blue-800 rounded-xl">
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
            </div> */}

            <Link
              to={{ pathname: "/home", search: "?game=match-bets" }}
              className="mt-2 bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block"
            >
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-12 ring-1 ring-white/10 ">
                <span className="text-lg">My Bets</span>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </Link>

            {/* matches */}
            <div class=" mt-10 max-w-screen overflow-hidden">
              {data?.map((item, index) => (
                <Link
                  key={index}
                  to={{
                    pathname: "/home",
                    search: `?game=match&id=${item.id}`, // Proper query string formatting
                  }}
                  class="min-w-full relative table divide-y divide-gray-900 rounded-xl overflow-hidden mb-4 animate-fade-up animate-once animate-duration-[800ms]"
                >
                  <p className="text-sm flex absolute px-2 right-0 z-[9] lg:hidden text-gray-200 py-0.5 bg-gray-700 rounded-bl-xl  ">
                    {item.status === "LIVE" ? (
                      <span className="flex items-center gap-2">
                        <CgMediaLive
                          color="green"
                          className="animate-ping"
                          size={12}
                        />
                        Live
                      </span>
                    ) : item.status === "C" ? (
                      <p className="flex gap-3">
                        COMPLETED <FormatDate date={item.match_time} />
                      </p>
                    ) : (
                      <FormatDate date={item.match_time} />
                    )}
                  </p>
                  <tbody class="bg-gradient-to-r from-slate-500 to-slate-800   rounded-xl ">
                    <tr class="w-full rounded-xl transition-colors duration-150">
                      <td class="w-[32%] pt-6 lg:pt-0  lg:w-40   ">
                        <div class="flex flex-col justify-center items-center">
                          <img
                            class=" h-20 w-20 rounded-full "
                            src={`${API.url}assets/${item.teams[0].image}`}
                            alt=""
                          />
                          <div class=" ">
                            <p class="text-sm text-center font-medium text-gray-300 whitespace-normal">
                              {item.teams[0].team_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="w-[32%] pt-6 lg:pt-0   lg:w-40  whitespace-nowrap">
                        <img alt="vs" src={vsimg} className="w-40 m-auto" />
                      </td>
                      <td class="w-[32%] pt-6 lg:pt-0  lg:w-40   ">
                        <div class="flex flex-col justify-center items-center">
                          <img
                            class=" h-20 w-20  rounded-full "
                            src={`${API.url}assets/${item.teams[1].image}`}
                            alt=""
                          />
                          <div class=" ">
                            <p class="text-sm text-center font-medium text-gray-300 whitespace-normal">
                              {item.teams[1].team_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="hidden lg:table-cell w-[32%] lg:w-40 px-6 py-4 whitespace-nowrap">
                        <div class="text-xs text-gray-300 font-semibold">
                          <p className="italic underline ">Match Time</p>
                          <p className="text-sm">
                            {item.status === "LIVE" ? (
                              <span className="flex items-center gap-2">
                                <CgMediaLive
                                  color="green"
                                  className="animate-ping"
                                  size={12}
                                />
                                Live
                              </span>
                            ) : item.status === "C" ? (
                              <p>
                                COMPLETED <FormatDate date={item.match_time} />
                              </p>
                            ) : (
                              <FormatDate date={item.match_time} />
                            )}
                          </p>
                        </div>
                      </td>

                      <div class="hidden lg:table-cell relative w-[8%]   align-center items-center px-6 py-4 whitespace-nowrap text-center bg-yellow-200  font-semibold cursor-pointer">
                        <p className=" w-full h-full absolute top-0 left-0 flex justify-center items-center">
                          VIEW
                        </p>
                      </div>
                    </tr>
                  </tbody>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
