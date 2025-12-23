import React from "react";

const GetStartedButton = ({ onClick, text = "Get Started" }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-900"
    >
      {text}
    </button>
  );
};

export default GetStartedButton;
