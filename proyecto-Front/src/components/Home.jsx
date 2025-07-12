import React, { useState } from "react";
import infografia from "../images/infografia.png";

const Home = () => {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Bienvenido</h1>
      <p style={{ textAlign: "center" }}>
        A continuación se muestra una infografía explicativa del funcionamiento del sistema.
        Puedes hacer clic para ampliarla.
      </p>

      {loading && !imgError && <p>Cargando infografía...</p>}

      {imgError ? (
        <p style={{ color: "red", textAlign: "center" }}>
          Error al cargar la infografía. Por favor, intenta recargar la página.
        </p>
      ) : (
        <img
          src={infografia}
          alt="Infografía del sistema"
          onClick={() => setModalOpen(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setImgError(true);
            setLoading(false);
          }}
          style={{
            width: "100%",
            cursor: "zoom-in",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      )}

      {/* Modal para ampliar la imagen */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={infografia}
            alt="Infografía ampliada"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              border: "4px solid white",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
