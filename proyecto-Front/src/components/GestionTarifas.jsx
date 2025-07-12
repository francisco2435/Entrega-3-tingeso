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
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const GestionTarifas = () => {
  const [tarifas, setTarifas] = useState([]);
  const [tarifasEspeciales, setTarifasEspeciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      } finally {
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  const CrearTarifa = () => {
    navigate("/crear-tarifa");
  };

  const CrearTarifaEspecial = () => {
    navigate("/crear-tarifa-especial");
  };

  const ModificarTarifa = (id) => {
    navigate(`/modificar-tarifa/${id}`);
  };

  const ModificarTarifaEspecial = (id) => {
    navigate(`/modificar-tarifa-especial/${id}`);
  };

  const renderTabla = (titulo, tarifas, onModificar, onCrear, textoBoton) => (
    <Box sx={{ width: "170%", mb: 4, display: "flex", flexDirection: "column", alignItems: "center", ml: -30 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 1200, mb: 2 }}>
        <Typography variant="h5">{titulo}</Typography>
        <Button variant="contained" color="primary" onClick={onCrear}>
          {textoBoton}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: "100%", maxWidth: 1200 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Número de vueltas</TableCell>
              <TableCell sx={{ color: "#fff" }}>Tiempo Máximo</TableCell>
              <TableCell sx={{ color: "#fff" }}>Precio</TableCell>
              <TableCell sx={{ color: "#fff" }}>Duración de reserva</TableCell>
              <TableCell sx={{ color: "#fff" }}>Tipo</TableCell>
              <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tarifas.map((tarifa) => (
              <TableRow key={tarifa.id}>
                <TableCell>{tarifa.id}</TableCell>
                <TableCell>{tarifa.numeroVueltas}</TableCell>
                <TableCell>{tarifa.tiempoMax}</TableCell>
                <TableCell>{tarifa.precio}</TableCell>
                <TableCell>{tarifa.duracionReserva}</TableCell>
                <TableCell>{tarifa.tipo}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => onModificar(tarifa.id)}
                  >
                    Modificar
                  </Button>
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
      padding: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h4" sx={{ mb: 4 }}>
      Gestión de Tarifas
    </Typography>

    {loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {renderTabla("Tarifas Normales", tarifas, ModificarTarifa, CrearTarifa, "Crear nueva tarifa")}
        </Grid>
        <Grid item xs={12}>
          {renderTabla("Tarifas Especiales", tarifasEspeciales, ModificarTarifaEspecial, CrearTarifaEspecial, "Crear tarifa especial")}
        </Grid>
      </Grid>
    )}
  </Box>
);

};

export default GestionTarifas;
