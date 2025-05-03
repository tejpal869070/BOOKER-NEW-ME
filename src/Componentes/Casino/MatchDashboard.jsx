import React, { useEffect, useState } from "react";
import { MatchData } from "../../assets/Data/MatchData";
import vsimg from "../../assets/photos/vs.png";
import { toast, ToastContainer } from "react-toastify";
import playerIcon from "../../assets/photos/cricket-player-icon.png";
import { getSingleMatchData } from "../../Controllers/User/GamesController";
import { API } from "../../Controllers/Api";
import MatchGamePopup from "../GamesComponent/MatchGamePopup";

export default function MatchDashboard() {
  const id = new URL(window.location.href).searchParams.get("id");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLastDigitOpen, setLastDigitOpen] = useState(false);
  const [selectedLastDigit, setSelectedLastDigit] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isExectOpen, setExectOpen] = useState(false);

  const [isBetPopupOpen, setBetPopupOpen] = useState(false);

  const [exectRun, setExectRun] = useState(Number);

  const [formData, setFormData] = useState({});

  // bet function
  const handleLastBet = (match_id, section_id, type, lastDigit) => {
    if (
      !match_id ||
      !section_id ||
      !type ||
      isNaN(lastDigit) ||
      lastDigit > 9 ||
      lastDigit < 0 ||
      type !== "L" ||
      lastDigit === null
    ) {
      toast.error("Select Correct Bet Number");
      return;
    }
    setFormData({ match_id, section_id, type, lastDigit });

    setBetPopupOpen(true);
  };

  const handleExectBet = (match_id, section_id, type) => {
    if (
      !match_id ||
      !section_id ||
      !type ||
      type !== "E" ||
      exectRun < 0 ||
      isNaN(Number(exectRun)) ||
      exectRun === null ||
      exectRun === ""
    ) {
      toast.error("Select Correct Bet");
      return;
    }

    setFormData({
      match_id,
      section_id,
      type,
      exectRun,
    });
    setBetPopupOpen(true);
  };

  useEffect(() => {
    const findData = MatchData?.find((i) => i.id === Number(id));
    setData(findData);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSingleMatchData(id);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Something Went Wrong !");
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <p className="text-4xl font-bold text-gray-200 italic text-cenetr">
          No Match Found
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full m-auto  bg-cover"
      style={{
        backgroundImage:
          "url('https://www.financialexpress.com/wp-content/uploads/2022/03/Online-gaming.jpg')",
      }}
    >
      <ToastContainer />
      <div className="max-w-4xl m-auto min-h-screen border px-4 bg-black/30 backdrop-blur-md rounded-md border-gray-700 ">
        <p className="text-center py-2 rounded-b-xl bg-yellow-400 font-semibold italic">
          {data?.title}
        </p>
        <div className="flex justify-between mb-10  ">
          <section className="flex flex-col w-[33%] items-center justify-center">
            <img
              alt="team img"
              src={`${API.url}assets/${data?.teams[0]?.image}`}
              className="w-16 h-16 md:h-auto md:w-24 lg:w-32"
            />
            <p className="text-sm mt-2 lg:text-lg font-semibold italic text-gray-200 text-center">
              {data?.teams[0]?.team_name}
            </p>
          </section>
          <img
            alt="vs"
            src={vsimg}
            className="w-40 m-auto animate-jump-in animate-duration-500"
          />
          <section className="flex flex-col w-[33%] items-center justify-center">
            <img
              alt="team img"
              src={`${API.url}assets/${data?.teams[1]?.image}`}
              className="w-16 h-16 md:h-auto md:w-24 lg:w-32"
            />
            <p className="text-sm mt-2 lg:text-lg font-semibold italic text-gray-200 text-center">
              {data?.teams[1]?.team_name}
            </p>
          </section>
        </div>

        <div className="rounded-t  overflow-hidden shadow-md flex justify-between bg-black/50 backdrop-blue-md">
          <section className="p-4   h-auto flex  bg-gradient-to-r from-blue-800 to-indigo-900">
            <img
              alt="team"
              className="w-12 m-auto"
              src={`${API.url}assets/${data?.teams[0]?.image}`}
            />
          </section>
          <div className="w-[85%] flex gap-6 items-center  py-2  px-2 overflow-scroll no-scrollbar ">
            {data?.teams[0]?.team_members?.map((item, index) => (
              <div className="w-12  ">
                <img
                  className="w-12 h-12 p-1 m-auto rounded-full bg-gradient-to-r from-amber-500 to-pink-500 shadow-md"
                  src={playerIcon}
                  alt="member"
                />
                <p className=" text-center text-xs font-semibold text-gray-400">
                  {item?.name?.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-b  overflow-hidden shadow-md flex justify-between bg-black/50 backdrop-blue-md  ">
          <section className="p-4   h-auto flex  bg-gradient-to-r from-blue-800 to-indigo-900">
            <img
              alt="team"
              className="w-12 m-auto"
              src={`${API.url}assets/${data?.teams[1]?.image}`}
            />
          </section>
          <div className="w-[85%] flex gap-6 items-center  py-2 px-2 overflow-x-auto  no-scrollbar">
            {data?.teams[1]?.team_members?.map((item, index) => (
              <div className="w-12  ">
                <img
                  className="w-12 h-12 p-1 m-auto rounded-full bg-gradient-to-r from-amber-500 to-pink-500 shadow-md"
                  src={playerIcon}
                  alt="member"
                />
                <p className=" text-center text-xs font-semibold text-gray-400">
                  {item?.name?.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex"></div>

        <section className="animate-flip-up">
          {data?.sections?.map((item, index) => (
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 skew-x-[-5deg] rounded">
              <div className="flex justify-between    p-4 mt-4  ">
                <p className="bg-gradient-to-r whitespace-nowrap from-amber-200 to-yellow-400 bg-clip-text text-transparent font-semibold text-lg">
                  {item?.after_over}th Over
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setExectOpen((pre) => !pre);
                      setSelectedSection(index);
                      setLastDigitOpen(false);
                      setExectRun(0);
                    }}
                    className="px-4 lg:px-8 py-0.5 whitespace-nowrap  border-2 border-black font-semibold  uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] "
                  >
                    Exect Run
                  </button>
                  <button
                    onClick={() => {
                      setLastDigitOpen((pre) => !pre);
                      setSelectedSection(index);
                      setSelectedLastDigit(null);
                      setExectOpen(false);
                    }}
                    className="px-4 lg:px-8 py-0.5 whitespace-nowrap border-2 border-black font-semibold  uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] "
                  >
                    Last Digit
                  </button>
                </div>
              </div>
              {/* selection of digit */}
              {isLastDigitOpen && selectedSection === index && (
                <div className="flex justify-around items-center border-t-2 border-indigo-400 border-dotted">
                  <div className="flex flex-wrap gap-3 justify-center py-4 ">
                    {lastDigit.map((i, index) => (
                      <p
                        key={index}
                        onClick={() => setSelectedLastDigit(i)}
                        className={`w-8 h-8 flex justify-center font-semibold items-center cursor-pointer animate-flip-down rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 ${
                          selectedLastDigit === i &&
                          "border border-red-100 text-gray-100"
                        }`}
                      >
                        {i}
                      </p>
                    ))}
                  </div>
                  <button type="button" class="button-1 ">
                    <div
                      onClick={() =>
                        handleLastBet(id, item?.id, "L", selectedLastDigit)
                      }
                      class="button-top"
                    >
                      BET
                    </div>
                    <div class="button-bottom"></div>
                    <div class="button-base"></div>
                  </button>
                </div>
              )}

              {isExectOpen && selectedSection === index && (
                <div className="flex justify-around items-center border-t-2 border-indigo-400 border-dotted">
                  <div className="flex gap-3 justify-center py-4 text-gray-200">
                    Exect Run
                    <input
                      value={exectRun}
                      type="number"
                      onChange={(e) => setExectRun(e.target.value)}
                      className="w-20 rounded border-2 text-lg h-10 border-black ring text-gray-900 font-semibold px-2"
                    />
                  </div>
                  <button type="button" class="button-1 ">
                    <div
                      onClick={() => handleExectBet(id, item.id, "E")}
                      class="button-top"
                    >
                      BET
                    </div>
                    <div class="button-bottom"></div>
                    <div class="button-base"></div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* popup */}
      {isBetPopupOpen && (
        <MatchGamePopup
          onclose={() => {
            setBetPopupOpen(false);
            setFormData({});
          }}
          formData={formData}
          successFunction={() => {
            toast.success("Bet Placed Success !", { position: "top-center" });
            setFormData({});
            setExectOpen(false);
            setLastDigitOpen(false);
          }}
        />
      )}
    </div>
  );
}

const lastDigit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
