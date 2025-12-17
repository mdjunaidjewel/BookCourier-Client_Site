import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <span className="loading loading-spinner loading-xl text-cyan-500"></span>
    </div>
  );
};

export default Spinner;
