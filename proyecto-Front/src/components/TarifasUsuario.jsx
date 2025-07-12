import React, { useEffect, useState } from "react";
import tarifaServicio from "../services/tarifa.servicio";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Grid,
  Tooltip,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const TarifasUsuario = () => {
  const [tarifas, setTarifas] = useState([]);
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openHelp, setOpenHelp] = useState(false);

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const [resNormales, resEspeciales] = await Promise.all([
          tarifaServicio.obtenerTarifas(),
          tarifaServicio.obtenerTarifasEspeciales(),
        ]);
        setTarifas(resNormales.data);
        setTarifasEspeciales(resEspeciales.data);
      } catch (error) {
        console.error("Error al obtener tarifas:", error);
        setError("No se pudieron cargar las tarifas. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  const renderTabla = (titulo, lista) => (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        color="primary"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}
      >
        {titulo}
        {titulo.toLowerCase().includes("especial") && (
          <Tooltip title="Estas tarifas aplican en promociones o eventos especiales." arrow>
            <InfoOutlinedIcon
              sx={{ ml: 1, color: "text.secondary", cursor: "pointer" }}
              fontSize="small"
            />
          </Tooltip>
        )}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          mb: 4,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Vueltas</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tiempo máx. (min)</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Precio</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Duración (min)</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tipo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lista.map((tarifa, index) => (
              <TableRow
                key={index}
                sx={{
                  transition: "background-color 0.3s",
                  "&:hover": { backgroundColor: "#f1f8ff" },
                }}
              >
                <TableCell>{tarifa.numeroVueltas}</TableCell>
                <TableCell>{tarifa.tiempoMax}</TableCell>
                <TableCell>${tarifa.precio}</TableCell>
                <TableCell>{tarifa.duracionReserva}</TableCell>
                <TableCell>
                  <Chip
                    label={tarifa.tipo}
                    color={tarifa.tipo.toLowerCase().includes("especial") ? "secondary" : "primary"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f7fbff",
        minHeight: "100vh",
        sx: { height: 800, minHeight: "70vh" },
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight="700"
        gutterBottom
        color="primary.dark"
        sx={{ mb: 2 }}
      >
        Tarifas Disponibles
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button variant="outlined" onClick={() => setOpenHelp(true)}>
          ¿Qué significa cada campo?
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Cargando tarifas, por favor espere...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={10}>
            {renderTabla("Tarifas Normales", tarifas)}
          </Grid>
          <Grid item xs={12} md={10}>
            {renderTabla("Tarifas Especiales", tarifasEspeciales)}
          </Grid>
        </Grid>
      )}

      {/* Diálogo informativo sobre los campos */}
      <Dialog
        open={openHelp}
        onClose={() => setOpenHelp(false)}
        aria-labelledby="dialogo-ayuda-tarifas"
      >
        <DialogTitle id="dialogo-ayuda-tarifas">Significado de los campos de la tarifa</DialogTitle>
        <DialogContent dividers>
          <DialogContentText component="div">
            <ul>
              <li>
                <strong>Vueltas:</strong> Número de vueltas que incluye la reserva.
              </li>
              <li>
                <strong>Tiempo máx. (min):</strong> Tiempo máximo permitido para completar la
                reserva en minutos.
              </li>
              <li>
                <strong>Precio:</strong> Costo total a pagar por la reserva en pesos chilenos.
              </li>
              <li>
                <strong>Duración (min):</strong> Duración total de la reserva en minutos.
              </li>
              <li>
                <strong>Tipo:</strong> Indica si la tarifa es normal o especial (por promociones o
                eventos).
              </li>
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

export default TarifasUsuario;
