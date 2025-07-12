import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import usuarioServicio from "../services/usuario.servicio";

const CambiarContrasena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const correo = location.state?.correo || "";

  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const validarContrasena = (pwd) => {
    return pwd.length >= 6;
  };

  const handleCambio = () => {
    setMensaje("");
    setError("");

    if (!correo) {
      setError("No se ha encontrado el correo. Intenta recuperar la contraseña de nuevo.");
      return;
    }

    if (nueva !== confirmacion) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    if (!validarContrasena(nueva)) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    usuarioServicio
      .cambiarContrasenia(correo, actual, nueva)
      .then(() => {
        setMensaje("Contraseña actualizada correctamente.");
        setSnackbar(true);
        setActual("");
        setNueva("");
        setConfirmacion("");

        // ✅ Esperar 3 segundos y redirigir
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        const mensajeError =
          err?.response?.data?.mensaje || err?.response?.data || "Error al actualizar la contraseña.";
        setError(mensajeError);
      })
      .finally(() => setCargando(false));
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
          Cambiar contraseña
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Cambia la contraseña temporal que recibiste por una nueva.
        </Typography>

        <TextField
          label="Contraseña temporal"
          type="password"
          fullWidth
          margin="normal"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          autoFocus
        />
        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          helperText="Debe tener al menos 6 caracteres"
        />
        <TextField
          label="Confirmar nueva contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
        />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {mensaje && <Alert severity="success" sx={{ mt: 2 }}>{mensaje}</Alert>}

        <Box sx={{ mt: 2, position: "relative" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCambio}
            disabled={cargando}
          >
            Guardar cambios
          </Button>
          {cargando && (
            <CircularProgress
              size={24}
              sx={{
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
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>

        <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
          ¿Problemas con tu contraseña?{" "}
          <Link href="/recuperar-contrasena" underline="hover">
            Recuperarla aquí
          </Link>
        </Typography>

        <Snackbar
          open={snackbar}
          autoHideDuration={3000}
          onClose={() => setSnackbar(false)}
          message="Contraseña actualizada"
        />
      </Paper>
    </Box>
  );
};

export default CambiarContrasena;
