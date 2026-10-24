import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/**
 * TopDoctor Component:
 * - Displays top featured doctors on Home page
 * - Dynamically shows real-time availability status (Available / Not Available)
 */
const TopDoctor = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctor to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>
      
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-5 px-3 sm:px-0">
        {doctors.slice(0, 4).map((item, index) => (
          <div 
            onClick={() => navigate(`/appointment/${item._id}`)} 
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" 
            key={index}
          >
            <img className="bg-blue-50" src={item.image} alt={item.name} />
            <div className="p-4">
              {/* Dynamic Availability Status linked with Admin Dashboard */}
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} 
        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctor;
