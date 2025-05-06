import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyMatchBets } from "../../Controllers/User/GamesController";
import { Loading4 } from "../Loading1";
import { FaBaseballBall } from "react-icons/fa";

export default function MyMatchBets() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyMatchBets();
        setData(response.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Internal Server Error !"
        );
      } finally {
        setLoading(false);
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
    <div>
      <section class=" bg-gray-900  sm:p-5 min-h-screen">
        <div class="mx-auto max-w-screen-xl   lg:px-12">
          <div class="  bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500  ">
                <thead class="text-xs   uppercase  bg-gray-700  text-gray-400">
                  <tr>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      M.Id
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Match
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Bet Type
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Bet Team
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Over section
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Value
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Result
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      amount
                    </th>
                    <th scope="col" class="px-4 py-3 whitespace-nowrap">
                      Win amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reverse()?.map((item, index) => (
                    <tr
                      key={index}
                      class="border-b  border-gray-900 text-gray-300"
                    >
                      <th
                        scope="row"
                        class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.match_id}
                      </th>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <p className="text-red-400">
                          {item.match_details?.teams[0].team_name}
                        </p>
                        <p className="text-yellow-300">
                          {item.match_details?.teams[1].team_name}
                        </p>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        {item.bet_type === "L"
                          ? "Guessed Last Digit"
                          : "Guessed Exect Runs  "}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        {item.team_name }
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        After{" "}
                        {
                          item.match_details?.sections?.find(
                            (i) => Number(i.id) === Number(item.section_id)
                          )?.after_over
                        }
                        th over
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap ">
                        {item.bet_type === "L"
                          ? `__${item.bet_value}`
                          : item.bet_value}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap     ">
                        <p className="flex items-center gap-1">
                          <span>
                          <FaBaseballBall size={16} className="text-red-500" />
                          </span>
                          {
                            item.match_details?.sections?.find(
                              (i) => Number(i.id) === Number(item.section_id)
                            )?.result?.find(j => j.team_name === item.team_name)?.score || 0
                          }
                        </p>
                      </td>

                      <td class="px-4 py-3 whitespace-nowrap text-red-600 font-medium">
                        $ {item.amount}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-[#23d59d] font-medium">
                        $ {item.win_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
