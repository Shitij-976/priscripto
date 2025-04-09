import { createContext } from "react";

// Create context
export const AppContext = createContext()

const AppContextProvider = (props) => {
  const value = {
    // Add any values you want to pass via context here
  }

  return (
    // Use the correct Provider component
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider