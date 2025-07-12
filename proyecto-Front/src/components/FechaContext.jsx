import { createContext, useContext, useState } from "react";

const FechaContext = createContext();

export const useFecha = () => useContext(FechaContext);

export const FechaProvider = ({ children }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null); // formato: YYYY-MM-DD

  return (
    <FechaContext.Provider value={{ fechaSeleccionada, setFechaSeleccionada }}>
      {children}
    </FechaContext.Provider>
  );
};
