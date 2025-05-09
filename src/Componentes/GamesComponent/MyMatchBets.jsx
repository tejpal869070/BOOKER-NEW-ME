import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyMatchBets } from "../../Controllers/User/GamesController";
import { Loading4 } from "../Loading1";
import { FaBaseballBall } from "react-icons/fa";

export default function MyMatchBets() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyMatchBets();
        setData(response.data.reverse());
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

  const [expandedBetId, setExpandedBetId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedBetId(expandedBetId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center ">
        <Loading4 />
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-200 mb-4 text-center">My Bets</h2>
      {data?.map((bet) => {
        const match = bet.match_details;
        const section = match.sections.find(sec => sec.id === parseInt(bet.section_id));
        const result = section?.result?.find(r => r.team_name.toUpperCase() === bet.team_name.toUpperCase());
        const isWin = parseFloat(bet.win_amount || 0) > 0;

        return (
          <div
            key={bet.id}
            className={`bg-white rounded-lg shadow-md mb-4 p-4 transition-all ${
              isWin ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-sm">{match.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(match.match_time).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => toggleExpand(bet.id)}
                className="text-blue-500 text-sm"
              >
                {expandedBetId === bet.id ? 'Hide' : 'Details'}
              </button>
            </div>

            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Team:</span>
                <span>{bet.team_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{bet.bet_type === "L"
                          ? "Guessed Last Digit"
                          : "Guessed Exect Runs  "}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Bet:</span>
                <span>{bet.bet_value} {bet.bet_type === "E" && "Runs"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>₹{bet.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Won:</span>
                <span className={isWin ? 'text-green-600' : 'text-red-600'}>
                  ₹{bet.win_amount || '0'}
                </span>
              </div>
            </div>

            {expandedBetId === bet.id && section && (
              <div className="mt-3 text-xs text-gray-600 border-t pt-2">
                <div className="mb-1 font-semibold">Section After Over: {section.after_over}</div>
                {section?.result?.map((r, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{r.team_name}</span>
                    <span>{r.score} runs</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
}
