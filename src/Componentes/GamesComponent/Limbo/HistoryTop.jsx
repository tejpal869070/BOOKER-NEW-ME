import React from "react";

export default function HistoryTop({ history }) { 
  return (
    <div className="flex overflow-hidden place-content-end gap-2 py-4 px-2">
      {history &&
        history.length &&
        history.map((item, index) => (
          <div
            className={`px-4 py-1 text-sm flex justify-center items-center font-medium rounded-full ${
              Number(item.target).toFixed(2) <=
              Number(item.randomNumber).toFixed(2)
                ? "bg-green-500  text-gray-200"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {Number(item.randomNumber).toFixed(2)}x
          </div>
        ))}
    </div>
  );
}

// const data = [
//   {
//     id: 1,
//     value: 2.2,
//   },
//   {
//     id: 1,
//     value: 1.65,
//   },
//   {
//     id: 1,
//     value: 13.0,
//   },
//   {
//     id: 1,
//     value: 1.5,
//   },
//   {
//     id: 1,
//     value: 12.5,
//   },
//   {
//     id: 1,
//     value: 133.8,
//   },
//   {
//     id: 1,
//     value: 1.01,
//   },
//   {
//     id: 1,
//     value: 2,
//   },
//   {
//     id: 1,
//     value: 6.5,
//   },
//   {
//     id: 1,
//     value: 4.9,
//   },
//   {
//     id: 1,
//     value: 1.03,
//   },
// ];
