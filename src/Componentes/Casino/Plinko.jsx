import React from "react";

export default function Plinko() {
  return (
    <div className="w-full min-h-screen">
      <iframe
        title="example-iframe"
        src="https://plinko.sneakbooker.com/"
        // src="http://127.0.0.1:5500/index.html"
        className="w-full min-h-screen"
        frameBorder="0"
        style={{ border: "none" }}
      />
    </div>
  );
}
