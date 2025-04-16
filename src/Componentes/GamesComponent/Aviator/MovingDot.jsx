import React from "react";

export function MovingDot() {
  return (
    <div className="absolute bottom-0 w-full h-1 bg-transparent overflow-hidden">
      {/* First line of dots */}
      <div className="absolute inset-0 flex justify-between px-4 animate-moveDots z-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-1 h-1 bg-white rounded-full"></div>
        ))}
      </div>

      {/* Second line of dots (behind the first line) */}
      <div className="absolute inset-0 flex justify-between px-4 animate-moveDots2 z-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-1 h-1 bg-white rounded-full"></div>
        ))}
      </div>

      <style>
        {`
      @keyframes moveDots {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      @keyframes moveDots2 {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-200%); }
      }

      .animate-moveDots {
        animation: moveDots 10s linear infinite;
      }

      .animate-moveDots2 {
        animation: moveDots2 10s linear infinite;
      }
    `}
      </style>
    </div>
  );
}

export function MovingDot2() {
  return (
    <div className="absolute left-0 w-full h-1 bg-black overflow-hidden">
      {/* First line of dots */}
      <div className="absolute inset-0 flex justify-between px-4 animate-moveDots z-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-1 h-1 bg-white rounded-full"></div>
        ))}
      </div>

      {/* Second line of dots (behind the first line) */}
      <div className="absolute inset-0 flex justify-between px-4 animate-moveDots2 z-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-1 h-1 bg-white rounded-full"></div>
        ))}
      </div>

      <style>
        {`
        @keyframes moveDots {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
  
        @keyframes moveDots2 {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-200%); }
        }
  
        .animate-moveDots {
          animation: moveDots 10s linear infinite;
        }
  
        .animate-moveDots2 {
          animation: moveDots2 10s linear infinite;
        }
      `}
      </style>
    </div>
  );
}
