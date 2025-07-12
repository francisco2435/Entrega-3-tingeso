import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFecha } from "../components/FechaContext";
import { useTarifa } from "../components/TarifaContext";
import tarifaServicio from "../services/tarifa.servicio";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const EleccionDeTarifa = ({ setEtapa }) => {
  const { fechaSeleccionada } = useFecha();
  const { setTarifaSeleccionada } = useTarifa();
  const [tipoTarifa, setTipoTarifa] = useState(null);
  const [tarifasNormales, setTarifasNormales] = useState([]);
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);
  const [todasLasTarifas, setTodasLasTarifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTarifa, setSelectedTarifa] = useState(null);
  const [openHelp, setOpenHelp] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!fechaSeleccionada) return;
    const fetchTarifas = async () => {
      setLoading(true);
      setError(null);
      try {
        const resTipo = await tarifaServicio.obtenerTipoTarifaPorFecha(fechaSeleccionada);
        const tipo = resTipo.data;
        setTipoTarifa(tipo || "Normal");

        const resTarifasNormales = await tarifaServicio.obtenerTarifaPorTipo(tipo);
        const resTarifasEspeciales = await tarifaServicio.obtenerTarifaEspecialPorTipo(tipo);

        const normales = resTarifasNormales.data || [];
        const especiales = resTarifasEspeciales.data || [];

        setTarifasNormales(normales);
        setTarifasEspeciales(especiales);
        setTodasLasTarifas([...normales, ...especiales]);
      } catch (err) {
        setError("Error al cargar las tarifas. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchTarifas();
  }, [fechaSeleccionada]);

  useEffect(() => {
    setEtapa(2);
  }, [setEtapa]);

  const handleSeleccionar = (tarifa) => {
    setSelectedTarifa(tarifa);
    setDialogOpen(true);
  };

  const confirmarSeleccion = () => {
    setTarifaSeleccionada(selectedTarifa);
    setDialogOpen(false);
    navigate("/reserva");
  };

  const cancelarSeleccion = () => {
    setSelectedTarifa(null);
    setDialogOpen(false);
  };

  if (!fechaSeleccionada) {
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
          disabled={loading}
        >
          ← Volver a selección de fecha
        </Button>
      </Box>
    </>
    );
  }

  if (loading) {
    return (
      <Box minHeight="80vh" display="flex" justifyContent="center" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography>Cargando tarifas...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "auto",
        background: "linear-gradient(135deg, #a8d0ff 0%, #cce6ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        gap: 4,
        flexWrap: "wrap",
      }}
    >
      {/* Columna de tarifas */}
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 490,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          backgroundColor: "#f9fbff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="700" gutterBottom>
          Tarifas para {tipoTarifa?.toUpperCase()}
        </Typography>

        <Button
          variant="text"
          startIcon={<HelpOutlineIcon />}
          onClick={() => setOpenHelp(true)}
          sx={{ mb: 2, textTransform: "none" }}
        >
          ¿Qué significa cada campo?
        </Button>

        <Alert severity="info" sx={{ mb: 2 }}>
          Por favor, selecciona una tarifa para continuar.
        </Alert>

        {error ? (
          <>
            <Typography variant="body1" color="error">{error}</Typography>
            <Button onClick={() => window.location.reload()} variant="outlined">Reintentar</Button>
          </>
        ) : (
          <TableContainer sx={{ maxWidth: 530, width: "110%" }}>
            <Table aria-label="Tabla de tarifas">
              <TableHead>
                <TableRow>
                  <TableCell>Codigo</TableCell>
                  <TableCell>Vueltas</TableCell>
                  <TableCell>Tiempo Máx</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todasLasTarifas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay tarifas disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  todasLasTarifas.map((tarifa) => (
                    <TableRow key={tarifa.id} hover sx={{ cursor: "pointer" }}>
                      <TableCell>{tarifa.id}</TableCell>
                      <TableCell>{tarifa.numeroVueltas}</TableCell>
                      <TableCell>{tarifa.tiempoMax} min</TableCell>
                      <TableCell>${tarifa.precio}</TableCell>
                      <TableCell>{tarifa.duracionReserva} min</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSeleccionar(tarifa)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "700",
                            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
                            width: 80,      // ancho en px
                            height: 30,      // alto en px
                            fontSize: 12,    // tamaño de fuente en px
                            "&:hover": {
                              backgroundColor: "#115293",
                              boxShadow: "0 6px 20px rgba(17, 82, 147, 0.6)",
                            },
                          }}
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1, textTransform: "none" }}
          onClick={() => navigate("/calendario")}
        >
          ← Volver a selección de fecha
        </Button>
      </Paper>

      {/* Columna de pista */}
      <Box
        sx={{
          width: "500px",   // ancho fijo
          height: "0px",  // alto fijo
          backgroundColor: "black",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        {/* Aquí puedes poner la pista, video o imagen */}
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={cancelarSeleccion}>
        <DialogTitle>Confirmar selección de tarifa</DialogTitle>
        <DialogContent>
          {selectedTarifa ? (
            <>
              <DialogContentText>
                ¿Confirma que desea seleccionar la siguiente tarifa?
              </DialogContentText>
              <Box mt={2}>
                <Typography><strong>Código:</strong> {selectedTarifa.id}</Typography>
                <Typography><strong>Vueltas:</strong> {selectedTarifa.numeroVueltas}</Typography>
                <Typography><strong>Tiempo Máx:</strong> {selectedTarifa.tiempoMax} min</Typography>
                <Typography><strong>Precio:</strong> ${selectedTarifa.precio}</Typography>
                <Typography><strong>Duración:</strong> {selectedTarifa.duracionReserva} min</Typography>
              </Box>
            </>
          ) : (
            <DialogContentText>No hay tarifa seleccionada.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarSeleccion} color="secondary" sx={{ borderRadius: 3 }}>
            Cancelar
          </Button>
          <Button onClick={confirmarSeleccion} color="primary" sx={{ borderRadius: 3 }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de ayuda */}
      <Dialog open={openHelp} onClose={() => setOpenHelp(false)}>
        <DialogTitle>Significado de los campos</DialogTitle>
        <DialogContent dividers>
          <DialogContentText component="div">
            <ul>
              <li><strong>Código:</strong> Identificador único de la tarifa.</li>
              <li><strong>Vueltas:</strong> Número de vueltas incluidas.</li>
              <li><strong>Tiempo Máx:</strong> Tiempo máximo permitido.</li>
              <li><strong>Precio:</strong> Valor de la tarifa.</li>
              <li><strong>Duración:</strong> Tiempo total de reserva.</li>
              <li><strong>Acción:</strong> Botón para seleccionar la tarifa.</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelp(false)} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EleccionDeTarifa;
