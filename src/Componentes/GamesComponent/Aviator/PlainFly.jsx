import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import aviator from "../../../assets/photos/aviator.gif";

export default function PlainFly() {
  const [planeX, setPlaneX] = useState(0);
  const [planeY, setPlaneY] = useState(500);

  // Motion values for real-time tracking
  const x = useMotionValue(50);
  const y = useMotionValue(500);

  // Update state when motion values change
  useEffect(() => {
    x.onChange((latest) => setPlaneX(latest));
    y.onChange((latest) => setPlaneY(latest));
  }, [x, y]);
  return (
    <div>
      <div className="  relative border-[1px] border-gray-700 w-full  rounded-md mt-2 min-h-[30vh] lg:min-h-[60vh]  max-h-[60vh] overflow-hidden ">
        <video
          className="absolute w-full h-full top-0  "
          autoPlay
          loop
          muted
        >
          <source
            src={require("../../../assets/videos/aviator-video.mp4")}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <svg className="absolute left-0 w-full h-full">
          {/* Border Path on Top (hypotenuse) */}
          <motion.path
            d={`M -120,400  Q ${(planeX + 40) / 2},${
              (planeY + 404) / 2 + 100
            } ${planeX + 20},${planeY}`}
            stroke="red" // Black border color
            strokeWidth="4" // Width of the borderm
            fill="transparent" // No fill for the border path
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Original Path with semi-transparent red fill */}
          <motion.path
            d={`M -120,400 Q ${(planeX + 40) / 2},${(planeY + 404) / 2 + 100} ${
              planeX + 20
            },${planeY} L ${planeX + 20},500 Z`}
            fill="rgba(255, 0, 0, 0.4)" // Semi-transparent red
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </svg>

        {/* Plane Animation */}
        <motion.div
          style={{ x, y }}
          initial={{ x: 10, y: 330, rotate: 15 }}
          animate={{ x: 320, y: 80, rotate: 10 }}
          transition={{ duration: 6, ease: "easeInOut" }}
          className="absolute w-full h-full"
        >
          <img
            src={aviator}
            alt="Plane"
            className="relative  -left-12"
            width={100}
            height={100}
          />
        </motion.div>
      </div>
    </div>
  );
}
