import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Snackbar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import usuarioServicio from "../services/usuario.servicio";
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "./UsuarioContext";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ayudaAbierta, setAyudaAbierta] = useState(false);
  const [snackbarAbierto, setSnackbarAbierto] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(UsuarioContext);

  const esFormularioValido = correo.includes("@") && contrasenia.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!esFormularioValido) {
      setLoading(false);
      setError("Revisa los campos antes de continuar.");
      return;
    }

    usuarioServicio
      .login(correo, contrasenia)
      .then((response) => {
        setLoading(false);
        if (response.data) {
          const rolUsuario = response.data.rol;
          login(response.data);
          setSnackbarAbierto(true);

          if (rolUsuario === "administrador") {
            navigate("/tarifas");
          } else if (rolUsuario === "cliente") {
            navigate("/home");
          } else {
            setError("Rol de usuario no reconocido.");
          }
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Credenciales incorrectas.");
      });
  };

  const handleRegistro = () => {
    navigate("/registro-usuario");
  };

  const limpiarFormulario = () => {
    setCorreo("");
    setContrasenia("");
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        bgcolor: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 340,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
        >
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            type="email"
            fullWidth
            margin="normal"
            required
            autoComplete="email"
            autoFocus
            inputProps={{ "aria-label": "correo electrónico" }}
            InputProps={{
              startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
            }}
            helperText="Ej: usuario@correo.com"
            error={!!error && !correo.includes("@")}
          />

          <TextField
            label="Contraseña"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            type={mostrarContrasenia ? "text" : "password"}
            fullWidth
            margin="normal"
            required
            autoComplete="current-password"
            inputProps={{ "aria-label": "contraseña" }}
            InputProps={{
              startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
              endAdornment: (
                <Tooltip title="Mostrar/ocultar contraseña">
                  <IconButton
                    onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                    edge="end"
                  >
                    {mostrarContrasenia ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              ),
            }}
            helperText="Mínimo 6 caracteres"
            error={!!error && contrasenia.length < 6}
          />

          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 1, mb: 2, cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/recuperar-contrasena")}
          >
            ¿Olvidaste tu contraseña?
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !esFormularioValido}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleRegistro}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Registro
            </Button>

            <Button
              variant="text"
              color="secondary"
              onClick={limpiarFormulario}
              sx={{ fontSize: "0.875rem", textTransform: "none" }}
            >
              Limpiar formulario
            </Button>
          </Box>

          <Button
            startIcon={<HelpOutlineIcon />}
            onClick={() => setAyudaAbierta(true)}
            sx={{
              mt: 3,
              textTransform: "none",
              color: "#616161",
              fontSize: "0.875rem",
            }}
          >
            ¿Necesitas ayuda?
          </Button>

          {/* Diálogo de ayuda */}
          <Dialog open={ayudaAbierta} onClose={() => setAyudaAbierta(false)}>
            <DialogTitle>Ayuda para iniciar sesión</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Asegúrate de ingresar tu correo correctamente.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Tu contraseña debe tener al menos 6 caracteres.
              </Typography>
              <Typography variant="body2">
                • Si olvidaste tu contraseña, puedes recuperarla haciendo clic en "¿Olvidaste tu contraseña?".
              </Typography>
            </DialogContent>
          </Dialog>

          {/* Snackbar de confirmación */}
          <Snackbar
            open={snackbarAbierto}
            autoHideDuration={3000}
            onClose={() => setSnackbarAbierto(false)}
            message="Inicio de sesión exitoso"
          />
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
