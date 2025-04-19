import { createContext } from "react";

// Create context
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
  const value = {
    // Add any values you want to pass via context here
  }

  return (
    // Use the correct Provider component
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider
