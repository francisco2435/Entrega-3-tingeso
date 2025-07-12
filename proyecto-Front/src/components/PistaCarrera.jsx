import React from "react";
import { Box, Typography } from "@mui/material";
import auto from "../images/auto3.png";
import pista from "../images/pista.png";
import meta from "../images/meta.png";

const PistaCarrera = ({ etapa }) => {
  const posiciones = {
    1: "5%",
    2: "40%",
    3: "80%",
    4: "95%",
  };

  return (
    <Box
  sx={{
    maxWidth: 1000,
    width: "100%",
    margin: "1.5rem auto",
    borderRadius: 2,
    background: "linear-gradient(145deg, #1a1a1a, #2c2c2c)", // asfalto oscuro
    border: "2px solidrgb(255, 255, 255)", // rojo deportivo
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.6)",
    padding: 3,
    color: "#fff",
    fontFamily: "'Orbitron', sans-serif", // estilo digital/deportivo
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Detalle tipo franja decorativa */}
  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: 1000,
      height: 100,
      padding: 10,
      opacity: 0.7,
    }}
  />
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "1.25rem",
          color: "#6e6e6e6",
          mb: 1.5,
          userSelect: "none",
          letterSpacing: 1.2,
        }}
      >
        Progreso
      </Typography>

      <Box
        sx={{
            position: "relative",
            width: "100%",
            height: 110,
            borderRadius: 25,
            backgroundImage: `url(${pista})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
        >
        {/* Auto */}
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: posiciones[etapa],
            transform: "translate(-50%, -50%)",
            width: 150,
            height: 60,
            transition: "left 1s ease",
            zIndex: 2,
          }}
        >
          <img
            src={auto}
            alt="Auto progreso"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Imagen Meta */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: -10,
            transform: "translateY(-50%)",
            width: 80,
            height: 90,
            zIndex: 1,
          }}
        >
          <img
            src={meta}
            alt="Meta"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PistaCarrera;
