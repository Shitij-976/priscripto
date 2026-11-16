import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      {/* Brand Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Prescripto"
        className="w-40 cursor-pointer mb-8"
      />

      {/* 404 Visual Heading */}
      <h1 className="text-8xl sm:text-9xl font-extrabold text-primary tracking-tight">
        404
      </h1>

      <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-4">
        Page Not Found
      </p>

      <p className="text-gray-500 text-sm sm:text-base max-w-md mt-2">
        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-all shadow-md text-sm"
        >
          Go Back Home
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all text-sm"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default NotFound;
