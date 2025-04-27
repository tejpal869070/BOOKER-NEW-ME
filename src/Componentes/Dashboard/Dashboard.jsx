import React, { useEffect, useState } from "react"; 
import Hero1 from "./Hero1";
import { GetUserDetails } from "../../Controllers/User/UserController";
import { Loading3 } from "../Loading1"; 

export default function Dashboard() { 
  const [loading, setLoading] = useState(true);

  const userDataGet = async () => {
    const response = await GetUserDetails();
    if (response !== null) {
      // setUser(response[0]);
      setLoading(false);
    }
  };

  

  useEffect(() => {
    userDataGet();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0   z-[9999] w-screen h-screen flex items-center justify-center m-auto inset-0">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero1 />
      {/* <div className="w-full pb-10 overflow-hidden grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {data.map((item, index) => (
          <div
            key={index}
            className="mt-6 group w-[95%] h-[150px] rounded-[8px] bg-white dark:bg-gray-800 relative p-4 border-2 border-[#c3c6ce] transition duration-500 ease-out overflow-visible hover:border-[#008bf8] hover:shadow-lg"
          >
            <div className="text-black h-full gap-2 grid  ">
              <p className="text-2xl font-bold dark:text-gray-200">
                {item.icons}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {item.title}
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {item.value}
              </p>
            </div>
            <Link
              to={item.link}
              className="text-center transform translate-x-[-50%] translate-y-[125%] w-[60%] rounded-[1rem] border-none bg-[#008bf8] text-white text-base py-2 px-4 absolute left-1/2 bottom-0 opacity-0 transition duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100"
            >
              View
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  );
}
