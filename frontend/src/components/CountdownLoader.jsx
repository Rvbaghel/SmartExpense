import React, { useState, useEffect } from "react";
import "./CountdownLoader.css"; // optional for styling

const CountdownLoader = ({ seconds = 10, onFinish }) => {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    setCount(seconds); // reset if seconds prop changes
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onFinish]);

  return (
    <div className="countdown-loader-overlay">
      <div className="countdown-loader-card">
        <h2>Processing...</h2>
        <p>{count} second{count !== 1 ? "s" : ""} remaining</p>
      </div>
    </div>
  );
};

export default CountdownLoader;
