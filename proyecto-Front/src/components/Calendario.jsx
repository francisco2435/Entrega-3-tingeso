import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import PistaCarrera from "../components/PistaCarrera";
import {
  Box,
  Button,
  Typography,
  Alert,
  Tooltip,
  Dialog,            
  DialogTitle,        
  DialogContent,       
  DialogActions,      
  DialogContentText,              
  IconButton,
  Paper,
} from "@mui/material";
import esLocale from 'date-fns/locale/es';
import { useNavigate } from "react-router-dom";
import { useFecha } from "../components/FechaContext";
import addDays from "date-fns/addDays";
import isBefore from "date-fns/isBefore";
import formatISO from "date-fns/formatISO";
import CloseIcon from '@mui/icons-material/Close';
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Calendario = ({ setEtapa }) => {
  const [fecha, setFecha] = useState(null);
  const [error, setError] = useState(null);
  const { setFechaSeleccionada } = useFecha();
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const hoy = new Date();
  const minimo = addDays(hoy, 0); // Día siguiente
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const seleccionarFechaRapida = (dias) => {
    const nuevaFecha = addDays(hoy, dias);
    setFecha(nuevaFecha);
    setError(null);
  };

  useEffect(() => {
    setEtapa(1); // o la etapa que corresponda
  }, [setEtapa]);

  const handleChange = (nuevaFecha) => {
    if (isBefore(nuevaFecha, minimo)) {
      setError("Por favor, selecciona una fecha a partir de mañana.");
      setFecha(null);
    } else {
      setFecha(nuevaFecha);
      setError(null);
    }
  };

  const handleReservar = () => {
    if (fecha) {
      const localDate = formatISO(fecha, { representation: "date" }); // YYYY-MM-DD
      setFechaSeleccionada(localDate);
      navigate("/eleccion-tarifa");
    }
  };

  const handleCancelarSeleccion = () => {
    setFecha(null);
    setError(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <Box
        sx={{
          minHeight: "auto",
          background: "linear-gradient(135deg, #a8d0ff 0%, #cce6ff 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          gap: -20,
          flexWrap: "wrap", // para que quepa en pantallas chicas
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            maxWidth: 475,
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            backgroundColor: "#f9fbff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: { xs: 0, md: 2 },
          }}
        >
          <Typography variant="h5" fontWeight="700" gutterBottom>
            Selecciona una fecha para reservar
            <Tooltip title="Solo puedes reservar a partir de mañana.">
              <Typography
                component="span"
                sx={{ ml: 1, cursor: "help", color: "primary.main", fontWeight: "bold" }}
                aria-label="Instrucción de reserva"
              >
                (?)
              </Typography>
            </Tooltip>
            {/* Botón de ayuda */}
            <Button
              variant="text"
              size="small"
              sx={{ ml: 2, fontWeight: "700" }}
              onClick={() => setOpenHelpDialog(true)}
              aria-label="Abrir ayuda sobre reservas"
            >
              ¿Necesitas ayuda?
            </Button>
          </Typography>

          {/* Botones de fechas rápidas */}
          <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap", justifyContent: "center" }}>
            <Button size="small" variant="outlined" onClick={() => seleccionarFechaRapida(1)}>
              Mañana
            </Button>
            <Button size="small" variant="outlined" onClick={() => seleccionarFechaRapida(3)}>
              Dentro de 3 días
            </Button>
            <Button size="small" variant="outlined" onClick={() => seleccionarFechaRapida(7)}>
              Próximo fin de semana
            </Button>
          </Box>

          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              mt: 2,
              "& .MuiPickersDay-root": {
                borderRadius: 2,
                transition: "all 0.2s ease",
              },
              "& .MuiPickersDay-root:hover": {
                backgroundColor: "#7ea9ff",
                color: "#fff",
              },
              "& .Mui-selected": {
                backgroundColor: "#3f51b5",
                color: "#fff",
                fontWeight: "700",
              },
              "& .Mui-selected:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            <DateCalendar
              value={fecha}
              onChange={handleChange}
              disablePast
              minDate={minimo}
              sx={{
                "& .MuiPickersDay-root": {
                  width: 48,
                  height: 48,
                  fontSize: "1.20rem",
                },
              }}
              slots={{
                leftArrowIcon: () => (
                  <Tooltip title="Mes anterior">
                    <ArrowLeftIcon />
                  </Tooltip>
                ),
                rightArrowIcon: () => (
                  <Tooltip title="Mes siguiente">
                    <ArrowRightIcon />
                  </Tooltip>
                ),
                switchViewIcon: () => (
                  <Tooltip title="Cambiar año">
                    <ExpandMoreIcon />
                  </Tooltip>
                ),
              }}
            />
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 3, width: "100%" }}
              action={
                <IconButton aria-label="cerrar alerta" size="small" onClick={() => setError(null)}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}

          {fecha && (
            <Box display="flex" justifyContent="center" gap={3} mt={6} width="100%">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenConfirmDialog(true)}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "700",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(63,81,181,0.4)",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                    boxShadow: "0 6px 18px rgba(48,63,159,0.6)",
                  },
                }}
              >
                Hacer reserva este día
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancelarSeleccion}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "700",
                  borderRadius: 3,
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "#3f51b5",
                    backgroundColor: "#e3e9ff",
                  },
                }}
              >
                Cancelar selección
              </Button>
            </Box>
          )}
        </Paper>

        {/* PistaCarrera y Dialog Confirmación (sin cambios) */}
        <Box
                sx={{
                  minHeight: "auto",
                  maxWidth: 520,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",  // "relative" no es válido aquí
                  alignItems: "center",      // "relative" tampoco es válido aquí
                  position: "relative",      // Aquí sí aplica
                  top: '0px',
                  left: '60px',
                  padding: 0,
                  gap: 0,
                  flexWrap: 'nowrap',
                  backgroundColor: "black",   // <-- Fondo negro
                  color: "white",             // <-- Texto blanco (opcional)
                }}
              >
                {/* Aquí puedes poner contenido si quieres */}
              </Box>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Confirmar fecha de reserva</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Confirmas que deseas reservar el día{" "}
              <strong>{fecha ? format(fecha, "dd 'de' MMMM 'de' yyyy", { locale: esLocale }) : ""}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                const localDate = formatISO(fecha, { representation: "date" });
                setFechaSeleccionada(localDate);
                navigate("/eleccion-tarifa");
              }}
              color="secondary"
              variant="contained"
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Nuevo diálogo de ayuda */}
        <Dialog open={openHelpDialog} onClose={() => setOpenHelpDialog(false)}>
          <DialogTitle>Ayuda para hacer reservas</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Para reservar una pista, selecciona una fecha válida a partir de mañana.
            </Typography>
            <Typography gutterBottom>
              Puedes usar los botones de "fechas rápidas" para seleccionar rápidamente opciones comunes.
            </Typography>
            <Typography gutterBottom>
              Una vez que elijas la fecha, confirma la fecha en el diálogo que aparecerá.
            </Typography>
            <Typography gutterBottom>
              Si deseas cambiar tu selección, puedes cancelar y escoger otra fecha.
            </Typography>
            <Typography gutterBottom>
              Para cualquier duda, contacta con soporte.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHelpDialog(false)} color="primary" autoFocus>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Calendario;