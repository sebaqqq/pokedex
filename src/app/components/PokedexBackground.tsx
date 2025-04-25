import React from "react";

interface PokedexBackgroundProps {
  children: React.ReactNode;
}

const PokedexBackground: React.FC<PokedexBackgroundProps> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen bg-red-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-700 rounded-b-full shadow-inner"></div>
      <div className="absolute top-8 left-8 w-48 h-48 bg-white rounded-full border-8 border-gray-300 shadow-inner">
        <div className="absolute top-2 left-2 w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-500 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-green-500 rounded-full"></div>
      </div>
      <div className="absolute top-64 left-12 space-y-4">
        <div className="w-16 h-4 bg-blue-500 rounded-full"></div>
        <div className="w-16 h-4 bg-green-500 rounded-full"></div>
        <div className="w-16 h-4 bg-yellow-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 right-32 w-32 h-32">
        <div className="absolute top-0 left-1/3 right-1/3 h-1/3 bg-gray-800 rounded-t-md"></div>
        <div className="absolute bottom-0 left-1/3 right-1/3 h-1/3 bg-gray-800 rounded-b-md"></div>
        <div className="absolute left-0 top-1/3 bottom-1/3 w-1/3 bg-gray-800 rounded-l-md"></div>
        <div className="absolute right-0 top-1/3 bottom-1/3 w-1/3 bg-gray-800 rounded-r-md"></div>
        <div className="absolute inset-1/3 bg-gray-700 rounded-full"></div>
      </div>
      <div className="absolute bottom-8 left-8 w-16 h-16 bg-gray-300 rounded-full border-4 border-gray-400"></div>
      <div className="absolute bottom-16 left-32 w-32 h-8 bg-gray-200 rounded-full"></div>
      <div className="relative z-10 p-8">{children}</div>
    </div>
  );
};

export default PokedexBackground;
