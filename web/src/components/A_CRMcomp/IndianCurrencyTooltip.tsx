import React from "react";

const formatIndianNumber = (num) => {
  if (num >= 1_00_00_00_000) return (num / 1_00_00_00_000).toFixed(1) + "Lcr+";
  if (num >= 1_00_00_000) return (num / 1_00_00_000).toFixed(1) + "Cr+";
  if (num >= 1_00_000) return (num / 1_00_000).toFixed(1) + "L+";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
  return num.toString();
};

const IndianCurrencyTooltip = ({ amount }) => {
  const formattedAmount = Math.round(Math.max(amount || 0, 0));

  return (
    <div className="relative flex flex-col items-center group" style={{ alignItems: "start" }}>
      <div
        className="absolute bottom-0 flex-col items-center hidden mb-6 flex group-hover:flex"
        style={{ alignItems: "start", width: "300px" }}
      >
        <span
          className="rounded italian relative mr-3 z-50 p-2 text-xs leading-none text-white bg-black shadow-lg"
          style={{
            color: "white",
            background: "#213343",
            maxWidth: "300px",
          }}
        >
          <span className="italic">{formatIndianNumber(formattedAmount)}</span>
        </span>
        <div
          className="w-3 h-3 ml-1 -mt-2 rotate-45 bg-black"
          style={{ background: "#213343", marginRight: "12px" }}
        ></div>
      </div>
      <span className="text-[14px] font-bold">
        ₹{formattedAmount.toLocaleString("en-IN")}
      </span>
    </div>
  );
};

export default IndianCurrencyTooltip;
