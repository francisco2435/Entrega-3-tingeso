import React, { createContext, useContext, useState } from "react";

const TarifaContext = createContext();

export const TarifaProvider = ({ children }) => {
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null);

  return (
    <TarifaContext.Provider value={{ tarifaSeleccionada, setTarifaSeleccionada }}>
      {children}
    </TarifaContext.Provider>
  );
};

export const useTarifa = () => useContext(TarifaContext);
