import React, { useState, useEffect } from "react";
import audio1 from "../../assets/audio/sound1.mp3";
import audio2 from "../../assets/audio/successSound.mp3";

export default function Timer({
  currentGameData,
  refresh,
  countdownFunction,
  sound,
}) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [countDownSound, setCountDownSound] = useState(false);
  const [successSound, setSuccessSound] = useState(false);

  useEffect(() => {
    const end_time = new Date(currentGameData?.end_date);
    const api_get_time = new Date(currentGameData?.api_get_time);
    const newTotalDuration = end_time - api_get_time;

    if (newTotalDuration <= 0) {
      refresh();
      return;
    }

    setTimeRemaining(newTotalDuration);

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;

        const countdownLimit = Number(currentGameData.coundown) * 1000;
        if (newTime < countdownLimit) {
          setCountDownSound(true);
          const seconds = Math.floor((newTime / 1000) % 60);
          countdownFunction(seconds);
        }

        if (newTime <= 0) {
          clearInterval(intervalId);
          setCountDownSound(false);
          setSuccessSound(true);
          refresh(); // Call refresh when timeRemaining is 0 or less
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentGameData]);

  const calculateTimeLeft = (timeLeft) => {
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    return {
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const { minutes, seconds } = calculateTimeLeft(timeRemaining);

  useEffect(() => {
    const sound1 = document.getElementById("sound1");
    if (sound && countDownSound) {
      sound1.play();
    } else {
      sound1.pause();
    }
  }, [sound, countDownSound]);

  useEffect(() => {
    const sound2 = document.getElementById("sound2");
    if (sound && successSound) {
      sound2.play();
    }
  }, [sound, successSound]);

  return (
    <div className="mt-2">
      <div>
        <audio loop id="sound1">
          <source src={audio1} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

        <audio id="sound2">
          <source src={audio2} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className="border-4 border-black rounded-lg px-4 py-1 inline-block bg-gray-100 shadow-lg">
        <h1 className="font-semibold ">Time Remaining</h1>
        <h2 className="text-center font-bold text-4xl">
          {minutes}:{seconds}
        </h2>
      </div>
    </div>
  );
}
