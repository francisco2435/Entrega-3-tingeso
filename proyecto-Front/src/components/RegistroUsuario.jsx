import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import usuarioServicio from "../services/usuario.servicio";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import { UsuarioContext } from "./UsuarioContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


const RegistroUsuario = () => {
  const navigate = useNavigate();
  const { login } = useContext(UsuarioContext);

  const [usuario, setUsuario] = useState({
    nombre: "",
    rut: "",
    correo: "",
    telefono: "",
    rol: "cliente",
    contrasenia: "",
    fechaNacimiento: "",
  });

  const [erroresCampo, setErroresCampo] = useState({
    nombre: "",
    rut: "",
    correo: "",
    telefono: "",
    contrasenia: "",
    fechaNacimiento: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [erroresFormulario, setErroresFormulario] = useState([]);

  const formatearRut = (valor) => {
    let limpio = valor.replace(/[^\dkK]/gi, "").toUpperCase();
    limpio = limpio.slice(0, 9);
    if (limpio.length < 2) return limpio;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let cuerpoConPuntos = "";
    let i = cuerpo.length;
    while (i > 3) {
      const parte = cuerpo.slice(i - 3, i);
      cuerpoConPuntos = "." + parte + cuerpoConPuntos;
      i -= 3;
    }
    cuerpoConPuntos = cuerpo.slice(0, i) + cuerpoConPuntos;
    return `${cuerpoConPuntos}-${dv}`;
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  };

  const validarCampo = (name, value) => {
    let mensaje = "";

    switch (name) {
      case "rut":
        const rutLimpio = value.replace(/\./g, "");
        const rutRegex = /^[0-9]{7,8}-[0-9Kk]$/;
        if (!rutRegex.test(rutLimpio)) {
          mensaje = "Formato inválido: 12.345.678-9";
        }
        break;

      case "correo":
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(value)) {
          mensaje = "Correo inválido.";
        }
        break;

      case "telefono":
        const telefonoLimpio = value.replace(/[\s-]/g, "");
        if (!/^\d{8,12}$/.test(telefonoLimpio)) {
          mensaje = "Debe tener entre 8 y 12 dígitos, sin espacios ni guiones.";
        }
        break;

      case "contrasenia":
        if (value.length < 6) {
          mensaje = "Mínimo 6 caracteres.";
        }
        break;

      case "nombre":
        if (!value.trim()) {
          mensaje = "El nombre es obligatorio.";
        } else if (/\d/.test(value)) {
          mensaje = "El nombre no puede contener números.";
        }
        break;

      case "fechaNacimiento":
        if (!value) {
          mensaje = "La fecha de nacimiento es obligatoria.";
        } else {
          const fecha = new Date(value);
          const hoy = new Date();
          if (fecha > hoy) {
            mensaje = "La fecha no puede ser futura.";
          } else {
            const edad = calcularEdad(fecha);
            if (edad < 18) {
              mensaje = "Debes ser mayor de 18 años.";
            }
          }
        }
        break;
      default:
        break;
    }

    setErroresCampo((prev) => ({ ...prev, [name]: mensaje }));
    return mensaje;
  };

  const validarTodo = () => {
    const nuevosErrores = {};
    Object.entries(usuario).forEach(([campo, valor]) => {
      nuevosErrores[campo] = validarCampo(campo, valor);
    });
    setErroresCampo(nuevosErrores);
    return nuevosErrores;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevoValor = name === "rut" ? formatearRut(value) : value;
    setUsuario({ ...usuario, [name]: nuevoValor });
    validarCampo(name, nuevoValor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);

    const nuevosErrores = validarTodo();
    const erroresActivos = Object.entries(nuevosErrores).filter(
      ([campo, mensaje]) => mensaje !== ""
    );

    if (erroresActivos.length > 0) {
      setErroresFormulario(erroresActivos);
      return;
    } else {
      setErroresFormulario([]);
    }

    setLoading(true);

    try {
      const response = await usuarioServicio.registrarUsuario(usuario);

      setLoading(false);

      if (!response) {
        setError("No se pudo registrar el usuario. Respuesta vacía del servidor.");
        return;
      }

      await login(usuario);
      setExito("Usuario registrado exitosamente. Redirigiendo a la página de inicio...");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      setLoading(false);
      const mensajeError =
        error.response?.data?.mensaje || "Ya existe un usuario con ese correo o RUT.";
      setError(mensajeError);
      console.error("Error en el registro:", error);
    }
  };

  const handleCancel = () => {
    setOpenDialog(true);
  };

  const confirmarCancelacion = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Registro de Usuario
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre completo"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          autoComplete="name"
          error={Boolean(erroresCampo.nombre)}
          helperText={erroresCampo.nombre || "Ej: Juan Pérez"}
        />

        <Tooltip title="Formato: 12.345.678-9" arrow>
          <TextField
            label="RUT"
            name="rut"
            value={usuario.rut}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={Boolean(erroresCampo.rut)}
            helperText={erroresCampo.rut || "Ej: 12345678-9"}
          />
        </Tooltip>

        <TextField
          label="Correo electrónico"
          name="correo"
          value={usuario.correo}
          onChange={handleChange}
          type="email"
          fullWidth
          margin="normal"
          required
          error={Boolean(erroresCampo.correo)}
          helperText={erroresCampo.correo || "Ej: nombre@ejemplo.com"}
          autoComplete="email"
        />

        <Tooltip title="Solo números, sin guiones ni espacios" arrow>
          <TextField
            label="Teléfono"
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={Boolean(erroresCampo.telefono)}
            helperText={erroresCampo.telefono || "Ej: 912345678"}
            autoComplete="tel"
          />
        </Tooltip>

        <Tooltip title="Debe contener al menos 6 caracteres" arrow>
          <TextField
            label="Contraseña"
            name="contrasenia"
            type="password"
            value={usuario.contrasenia}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={Boolean(erroresCampo.contrasenia)}
            helperText={erroresCampo.contrasenia || "Mínimo 6 caracteres"}
            autoComplete="new-password"
          />
        </Tooltip>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DatePicker
              sx={{ flexGrow: 1 }}
              label="Fecha de Nacimiento"
              value={usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento) : null}
              onChange={(newValue) => {
                const isoDate = newValue ? newValue.toISOString().split("T")[0] : "";
                setUsuario((prev) => ({ ...prev, fechaNacimiento: isoDate }));
                validarCampo("fechaNacimiento", isoDate);
              }}
              maxDate={new Date()}
              onError={(reason) => {
                if (reason) {
                  setErroresCampo((prev) => ({
                    ...prev,
                    fechaNacimiento: "Fecha inválida: usa el calendario o revisa el formato.",
                  }));
                } else {
                  validarCampo("fechaNacimiento", usuario.fechaNacimiento);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  required
                  error={Boolean(erroresCampo.fechaNacimiento) || params.error}
                  helperText={
                    erroresCampo.fechaNacimiento ||
                    params.helperText ||
                    (usuario.fechaNacimiento && !params.error
                      ? `Edad: ${calcularEdad(new Date(usuario.fechaNacimiento))} años`
                      : "")
                  }
                />
              )}
            />

            <Tooltip title="Debes ser mayor de 18 años" arrow>
              <InfoOutlinedIcon color="action" sx={{ ml: 1, cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </LocalizationProvider>

        {erroresFormulario.length > 0 && (
          <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
            <strong>Corrige los siguientes errores:</strong>
            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
              {erroresFormulario.map(([campo, mensaje]) => (
                <li key={campo}>
                  <strong>{campo}:</strong> {mensaje}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {exito && <Alert severity="success" sx={{ mt: 2 }}>{exito}</Alert>}

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Registrar"}
          </Button>

          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>

          <Button
            variant="text"
            onClick={() => setOpenHelp(true)}
            sx={{ mt: 2, display: "block", mx: "auto" }}
          >
            ¿Necesitas ayuda?
          </Button>
        </Box>
      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancelar registro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar? Perderás todos los datos ingresados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Continuar editando</Button>
          <Button onClick={confirmarCancelacion} color="secondary">
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openHelp} onClose={() => setOpenHelp(false)}>
        <DialogTitle>Ayuda para el Registro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            • El RUT debe estar en formato 12345678-9.<br />
            • El teléfono debe tener solo números, entre 8 y 12 dígitos.<br />
            • Usa una contraseña segura de al menos 6 caracteres.<br />
            • Todos los campos son obligatorios.<br />
            Si tienes dudas, contáctanos a soporte@ejemplo.com
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelp(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistroUsuario;
