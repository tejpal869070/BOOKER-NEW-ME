import React, { useEffect, useState } from "react";
import { MatchData } from "../../assets/Data/MatchData";
import vsimg from "../../assets/photos/vs.png";

export default function MatchDashboard() {
  const id = new URL(window.location.href).searchParams.get("id"); 
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    const findData = MatchData?.find((i) => i.id === Number(id)); 
    setData(findData);
    setLoading(false)
  }, [id]);

  if (!MatchData.some((item) => item.id === Number(id)) || loading) {
    return (
      <div className="min-h-screen">
        <p className="text-4xl font-bold text-gray-200 italic text-cenetr">
          No Match Found
        </p>
      </div>
    );
  }
  return (
    <div className="w-full m-auto  ">
      <div className="max-w-4xl m-auto min-h-screen border p-4 rounded-md border-gray-700 ">
        <div className="flex justify-between   ">
          <section className="flex flex-col w-[33%] items-center justify-center">
            <img alt="team img" src={data?.teams[0].image} className="w-32" />
            <p className="text-lg font-semibold italic text-gray-200">
              {data?.teams[0].team_name}
            </p>
          </section>
          <img alt="vs" src={vsimg} className="w-40 m-auto" />
          <section className="flex flex-col w-[33%] items-center justify-center">
            <img alt="team img" src={data?.teams[1].image} className="w-32" />
            <p className="text-lg font-semibold italic text-gray-200">
              {data?.teams[1]?.team_name}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
