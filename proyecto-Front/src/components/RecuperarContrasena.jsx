import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Link,
  CircularProgress,
} from "@mui/material";
import usuarioServicio from "../services/usuario.servicio";
import { useNavigate } from "react-router-dom";

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [cargando, setCargando] = useState(false); // <- nuevo estado
  const navigate = useNavigate();

  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleRecuperar = () => {
    setMensaje("");
    setError("");

    if (!validarCorreo(correo)) {
      setError("Debes ingresar un correo electrónico válido.");
      return;
    }

    setCargando(true); // <- inicia carga

    usuarioServicio
      .recuperarContrasenia(correo)
      .then(() => {
        setMensaje("Se ha enviado una nueva contraseña temporal a tu correo.");
        setSnackbar(true);

        setTimeout(() => {
          navigate("/cambiar-contrasena", { state: { correo } });
        }, 3000);
      })
      .catch((err) => {
        setError(
          err?.response?.data ||
            "Ocurrió un error al intentar recuperar la contraseña. Intenta nuevamente o contacta soporte."
        );
      })
      .finally(() => setCargando(false)); // <- termina carga
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !cargando) {
      handleRecuperar();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f7fa",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recuperar contraseña
        </Typography>
        <Typography variant="body2" gutterBottom>
          Ingresa tu correo y recibirás una contraseña temporal para acceder nuevamente.
        </Typography>

        <TextField
          label="Correo electrónico"
          fullWidth
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={cargando}
        />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {mensaje && <Alert severity="success" sx={{ mt: 2 }}>{mensaje}</Alert>}

        <Box sx={{ position: "relative", mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={cargando}
            onClick={handleRecuperar}
          >
            {cargando ? "Enviando..." : "Enviar nueva contraseña"}
          </Button>
          {cargando && (
            <CircularProgress
              size={24}
              sx={{
                color: "primary.main",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/login")}
          disabled={cargando}
        >
          Cancelar
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          ¿Tienes problemas?{" "}
          <Link href="https://www.youtube.com/watch?v=xvFZjo5PgG0" target="_blank" rel="noopener noreferrer" underline="hover">
            Contactar soporte
          </Link>
        </Typography>

        <Snackbar
          open={snackbar}
          autoHideDuration={3000}
          onClose={() => setSnackbar(false)}
          message="Correo enviado"
        />
      </Paper>
    </Box>
  );
};

export default RecuperarContrasena;
