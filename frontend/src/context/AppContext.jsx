import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Global Application Context for sharing states across components
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹"; // Indian Rupee symbol
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Global state variables
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  // Global search query state used by Navbar and Doctors filtering
  const [search, setSearch] = useState("");

  /**
   * Fetch list of all approved doctors from backend API
   */
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error.message);
      toast.error(error.message);
    }
  };

  /**
   * Fetch authenticated user profile data
   */
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Shared values accessible by any consumer component
  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    search,
    setSearch, // Expose search state & updater globally
  };

  // Load user profile whenever authentication token updates
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  // Initial fetch of doctors list on app mount
  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
