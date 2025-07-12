import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import reservaServicio from '../services/reserva.servicio';
import { useTarifa } from "../components/TarifaContext";
import { useFecha } from "../components/FechaContext";
import { useNavigate } from 'react-router-dom';
import PistaCarrera from "./PistaCarrera";

const Reserva = ({ setEtapa }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

  const [fechaReserva, setFechaReserva] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [tiempoMax, setTiempoMax] = useState('');
  const [numVueltas, setNumVueltas] = useState('');
  const [precioTarifa, setPrecioTarifa] = useState('');
  const [duracionReserva, setDuracionReserva] = useState('');
  const [tipoTarifa, setTipoTarifa] = useState('');
  const { tarifaSeleccionada } = useTarifa();
  const { fechaSeleccionada } = useFecha();

  const [rutAmigo, setRutAmigo] = useState('');
  const [nombreAmigo, setNombreAmigo] = useState('');
  const [rutsAmigos, setRutsAmigos] = useState([]);
  const [nombres, setNombres] = useState([]);

  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(false);
  const [errorReserva, setErrorReserva] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [mensajeSnack, setMensajeSnack] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  const [abrirDialogo, setAbrirDialogo] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarError, setMostrarError] = useState(false);
  const [ultimoAmigo, setUltimoAmigo] = useState(null);
  const [ultimoAgregado, setUltimoAgregado] = useState(null);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [snackTipo, setSnackTipo] = useState('');


  const mostrarErrorSnack = (mensaje) => {
    setMensajeError(mensaje);
    setMostrarError(true);
  };

  useEffect(() => {
    setEtapa(3); // por ejemplo
  }, [setEtapa]);

  const confirmarReserva = () => setAbrirDialogo(true);
  const cerrarDialogo = () => setAbrirDialogo(false);
  const navigate = useNavigate();

  const handleCancelar = () => {
    navigate('/calendario'); // o la ruta a donde deseas volver
  };

  const fechaFormateada = new Date(`${fechaReserva}T12:00:00`).toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Enter' && rutAmigo && nombreAmigo) agregarAmigo();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [rutAmigo, nombreAmigo]);

  useEffect(() => {
    if (fechaSeleccionada) setFechaReserva(fechaSeleccionada);
  }, [fechaSeleccionada]);

  useEffect(() => {
    if (tarifaSeleccionada) {
      setTiempoMax(tarifaSeleccionada.tiempoMax || '');
      setNumVueltas(tarifaSeleccionada.numeroVueltas || '');
      setPrecioTarifa(tarifaSeleccionada.precio || '');
      setDuracionReserva(tarifaSeleccionada.duracionReserva || '');
      setTipoTarifa(tarifaSeleccionada.tipo || '');
    }
  }, [tarifaSeleccionada]);

  const mostrarSnack = (mensaje, tipo = '') => {
    setOpenSnack(false);
    setTimeout(() => {
      setMensajeSnack(mensaje);
      setSnackTipo(tipo);
      setOpenSnack(true);
    }, 100);
  };

  const generarHorasDisponibles = () => {
    const horas = [];
    let inicio = 14, fin = 21;
    if (["fin de semana", "día especial"].includes(tipoTarifa.toLowerCase())) inicio = 10;
    for (let h = inicio; h <= fin; h++) {
      horas.push(h.toString().padStart(2, '0') + ':00');
    }
    return horas;
  };

  const formatearRut = (valor) => {
    const limpio = valor.replace(/[^\dkK]/gi, '').toUpperCase();
    if (limpio.length < 2) return limpio;
    const cuerpo = limpio.slice(0, -1), dv = limpio.slice(-1);
    let cuerpoConPuntos = '', i = cuerpo.length;
    while (i > 3) {
      const parte = cuerpo.slice(i - 3, i);
      cuerpoConPuntos = '.' + parte + cuerpoConPuntos;
      i -= 3;
    }
    cuerpoConPuntos = cuerpo.slice(0, i) + cuerpoConPuntos;
    return `${cuerpoConPuntos}-${dv}`;
  };

  const agregarAmigo = () => {
    if (!rutAmigo.match(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/) || rutAmigo.size > 9) {
      mostrarErrorSnack("RUT inválido. Ejemplo: 12.345.678-9");
      return;
    }
    if (!nombreAmigo.trim()) {
      mostrarErrorSnack("El nombre del amigo no puede estar vacío.");
      return;
    }
    if (rutsAmigos.includes(rutAmigo)) {
      mostrarErrorSnack("Este RUT ya fue ingresado.");
      return;
    }

    const nuevoAmigo = { rut: rutAmigo, nombre: nombreAmigo };
    setRutsAmigos([...rutsAmigos, nuevoAmigo.rut]);
    setNombres([...nombres, nuevoAmigo.nombre]);
    setUltimoAgregado(nuevoAmigo);
    setRutAmigo('');
    setNombreAmigo('');
    mostrarSnack('Amigo agregado correctamente', 'agregado');
  };

  const eliminarAmigo = (index) => {
    const nuevosRuts = [...rutsAmigos];
    const nuevosNombres = [...nombres];
    const eliminado = { rut: nuevosRuts[index], nombre: nuevosNombres[index] };
    nuevosRuts.splice(index, 1);
    nuevosNombres.splice(index, 1);
    setRutsAmigos(nuevosRuts);
    setNombres(nuevosNombres);
    setUltimoAmigo(eliminado);
    mostrarSnack('Amigo eliminado correctamente', 'eliminado');
  };

  const limpiarFormulario = () => {
    setFechaReserva('');
    setHoraInicio('');
    setTiempoMax('');
    setNumVueltas('');
    setPrecioTarifa('');
    setDuracionReserva('');
    setTipoTarifa('');
    setRutsAmigos([]);
    setNombres([]);
  };

  const ejecutarReserva = async () => {
    setAbrirDialogo(false);
    const reserva = {
      rutCliente: usuario.rut,
      nombreCliente: usuario.nombre,
      correoCliente: usuario.correo,
      fechaReserva,
      horaInicio,
      tiempoMax: parseInt(tiempoMax),
      numVueltas: parseInt(numVueltas),
      precioTarifa: parseFloat(precioTarifa),
      duracionReserva: parseInt(duracionReserva),
      tipoTarifa,
      rutsAmigos,
      nombres,
    };

    try {
      setCargando(true);
      await reservaServicio.hacerReserva(reserva);
      setMensajeConfirmacion(true);
      limpiarFormulario();
      setEtapa(4);
      setTimeout(() => navigate("/calendario"), 4000);
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      let mensaje = "Ocurrió un error al realizar la reserva.";
      if (error.response?.data?.message) mensaje = error.response.data.message;
      else if (error.message) mensaje = error.message;
      setSnackTipo('error');
      setMensajeSnack(mensaje);
      setOpenSnack(true);
      setErrorReserva(true);
    } finally {
      setCargando(false);
    }
  };

  if (!tarifaSeleccionada) 
  return (
    <>
      <p>No hay tarifa seleccionada.</p>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffffcc',
          zIndex: 2000,
          position: 'fixed',
          top: 0,
          left: 0
        }}
      >
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1, textTransform: 'none' }}
          onClick={() => navigate('/calendario')}
          disabled={cargando}
        >
          ← Volver a selección de fecha
        </Button>
      </Box>
    </>
  );
    if (cargando) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffffcc',
          zIndex: 2000,
          position: 'fixed',
          top: 0,
          left: 0
        }}
      >
        <CircularProgress size={80} thickness={5} color="primary" />
      </Box>
    );
  }


  return (
    <Box
      sx={{
        minHeight: "auto",
        height: "100%",
        background: "linear-gradient(135deg, #a8d0ff 0%, #cce6ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 4,
        gap: -1,
        flexWrap: 'wrap',
      }}
    >
      {/* Panel principal */}
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 475,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          backgroundColor: "#f9fbff",
        }}
      >
        {/* Título con icono de ayuda */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="700">
            Realizar Reserva
          </Typography>
          <Tooltip title="Instrucciones para realizar una reserva" arrow>
            <IconButton onClick={() => setMostrarAyuda(true)} color="primary" aria-label="Ayuda">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mensaje instructivo visible */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Selecciona la hora de inicio, verifica los datos de la tarifa y añade acompañantes si lo deseas.
          Luego confirma tu reserva.
        </Alert>

        {/* Hora inicio con tooltip */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" mb={0.5}>
            <Typography variant="body1" component="label" htmlFor="hora-inicio-select">
              Hora de Inicio
            </Typography>
            <Tooltip title="Seleccione la hora en que desea comenzar la reserva" arrow>
              <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 0.5 }} />
            </Tooltip>
          </Box>
          <Select
            id="hora-inicio-select"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            size="small"
            displayEmpty
            inputProps={{ 'aria-label': 'Hora de Inicio' }}
          >
            {generarHorasDisponibles().map((hora) => (
              <MenuItem key={hora} value={hora}>
                {hora}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-tarifa-content"
            id="panel-tarifa-header"
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Datos de Tarifa
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {[
              { label: "Tiempo Máximo (minutos)", value: tiempoMax, tooltip: "Tiempo máximo permitido para la reserva" },
              { label: "Número de Vueltas", value: numVueltas, tooltip: "Número total de vueltas que realizará" },
              { label: "Precio Tarifa", value: precioTarifa, tooltip: "Precio por persona según la tarifa seleccionada" },
              { label: "Duración Reserva (minutos)", value: duracionReserva, tooltip: "Duración total de la reserva" },
              { label: "Tipo de Tarifa", value: tipoTarifa, tooltip: "Tipo de tarifa aplicada a la reserva" },
            ].map(({ label, value, tooltip }) => (
              <TextField
                key={label}
                fullWidth
                size="small"
                label={label}
                value={value}
                disabled
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={tooltip} arrow>
                        <InfoOutlinedIcon fontSize="small" color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />

        {/* Añadir Amigos con tooltip */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="h6">Añadir Amigos</Typography>
          <Tooltip title="Ingresa el RUT y nombre de cada acompañante para incluirlos en la reserva" arrow>
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Tooltip>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="RUT Amigo"
            value={rutAmigo}
            size="small"
            onChange={(e) => setRutAmigo(formatearRut(e.target.value))}
            helperText="Ejemplo: 12.345.678-9"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Ingrese el RUT en formato correcto, sin espacios" arrow>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nombre Amigo"
            size="small"
            value={nombreAmigo}
            onChange={(e) => setNombreAmigo(e.target.value)}
            helperText="Nombre completo"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Nombre completo del acompañante" arrow>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={agregarAmigo}
            disabled={!rutAmigo.match(/^\d{1,2}(\.\d{3})*\-[\dkK]$/) || !nombreAmigo.trim() || rutsAmigos.includes(rutAmigo) || cargando || !rutsAmigos.length >= 8 || !rutsAmigos.length >= 9}
            sx={{
              minWidth: 120,
              fontSize: '0.9rem',
              alignSelf: 'center',
            }}
          >
            Añadir
          </Button>
        </Stack>

        {/* Lista de amigos añadidos */}
        {rutsAmigos.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {rutsAmigos.map((rut, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ border: '1px solid #ccc', borderRadius: 2, p: 1, mb: 1 }}
              >
                <Typography>{rut} - {nombres[index]}</Typography>
                <IconButton onClick={() => eliminarAmigo(index)} color="error" aria-label={`Eliminar amigo ${nombres[index]}`}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Botones principales */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            if (!horaInicio) {
              mostrarErrorSnack("Por favor, selecciona una hora de inicio.");
              return;
            }
            confirmarReserva();
          }}
          disabled={cargando}
        >
          Realizar Reserva
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleCancelar}
          disabled={cargando}
        >
          Cancelar
        </Button>

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1, textTransform: 'none' }}
          onClick={() => navigate('/eleccion-tarifa')}
          disabled={cargando}
        >
          ← Volver a selección de tarifa
        </Button>

        <Snackbar
          open={mensajeConfirmacion}
          autoHideDuration={6000}
          onClose={() => setMensajeConfirmacion(false)}
        >
          <Alert
            onClose={() => setMensajeConfirmacion(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            El comprobante de su reserva ha sido enviado a: {usuario.correo}
          </Alert>
        </Snackbar>

        {/* Snackbar de error */}
        <Snackbar
          open={mostrarError}
          autoHideDuration={4000}
          onClose={() => setMostrarError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setMostrarError(false)} sx={{ width: '100%' }}>
            {mensajeError}
          </Alert>
        </Snackbar>

        <Snackbar
          open={openSnack}
          autoHideDuration={4000}
          onClose={() => setOpenSnack(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={
              snackTipo === 'agregado'
                ? 'success'
                : snackTipo === 'eliminado'
                ? 'info'
                : snackTipo === 'error'
                ? 'error'
                : 'warning'
            }
            onClose={() => setOpenSnack(false)}
            sx={{ width: '100%' }}
          >
            {mensajeSnack}
          </Alert>
        </Snackbar>

        {/* Confirmación de reserva */}
        <Dialog open={abrirDialogo} onClose={cerrarDialogo}>
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas realizar esta reserva el día <strong>{fechaFormateada}</strong> a las <strong>{horaInicio}</strong> hrs?<br/>
              Tipo de tarifa: <strong>{tipoTarifa}</strong><br/>
              Número de personas: <strong>{1 + rutsAmigos.length}</strong> <br/>
              Ten en consideración que si quieres cancelar tu reserva, debes contactaros al siguiente correo: soporte@gmail.com y con al menos 24 horas de anticipación.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarDialogo} color="secondary">
              Cancelar
            </Button>
            <Button
              onClick={ejecutarReserva}
              variant="contained"
              color="primary"
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : 'Confirmar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de ayuda */}
        <Dialog open={mostrarAyuda} onClose={() => setMostrarAyuda(false)}>
          <DialogTitle>¿Cómo realizar una reserva?</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              <ol>
                <li>Selecciona la <strong>hora de inicio</strong> de tu reserva.</li>
                <li>Verifica la información de la tarifa y duración.</li>
                <li>Agrega a tus acompañantes (si tienes).</li>
                <li>Haz clic en <strong>“Realizar Reserva”</strong> para confirmar.</li>
                <li>Recibirás un comprobante por correo electrónico.</li>
              </ol>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMostrarAyuda(false)} color="primary" autoFocus>
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Pista visual a la derecha */}
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
                backgroundColor: "black",   
                color: "white",             
              }}
            >
            </Box>
    </Box>
  );
};

export default Reserva;