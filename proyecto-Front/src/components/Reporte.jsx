import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Ícono informativo
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import reporteServicio from "../services/reporte.servicio";
import { format } from "date-fns";

const Reporte = () => {
  const [tipo, setTipo] = useState("Número de personas");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formReset, setFormReset] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) return setError("Selecciona ambas fechas.");
    if (fechaFin < fechaInicio)
      return setError("La fecha de fin no puede ser anterior a la de inicio.");

    setOpenConfirm(true); // 👉 Abre confirmación
  };

  const confirmarEnvio = async () => {
    setOpenConfirm(false); // Cierra el diálogo
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await reporteServicio.hacerReporte({
        tipo,
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaFin: fechaFin.toISOString().split("T")[0],
      });
      setReporte(res.data);
      setSuccess(true);
    } catch {
      setError("Error al obtener el reporte. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!reporte) return null;
    const columnas = Array.isArray(reporte.ColumnasMeses) ? reporte.ColumnasMeses : [];
    const filas =
      tipo === "Número de personas"
        ? [
            { label: "1-2 personas", values: reporte.personas1a2 },
            { label: "3-5 personas", values: reporte.personas3a5 },
            { label: "6-10 personas", values: reporte.personas6a10 },
            { label: "11-15 personas", values: reporte.personas11a15 },
            { label: "Total", values: reporte.totalesFilas },
          ]
        : [
            { label: "Vueltas 10-10", values: reporte.vueltas1010 },
            { label: "Vueltas 15-15", values: reporte.vueltas1515 },
            { label: "Vueltas 20-20", values: reporte.vueltas2020 },
          ];

    return (
      <TableContainer
        component={Paper}
        sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                Tipo
                <Tooltip title="Categoría de personas o N° vueltas - tiempo máximo">
                  <InfoOutlinedIcon sx={{ ml: 1 }} fontSize="small" />
                </Tooltip>
              </TableCell>

              {columnas.map((mes, idx) => (
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {mes}
                    <Tooltip title={`Datos para ${mes}`}>
                      <InfoOutlinedIcon sx={{ ml: 1 }} fontSize="small" />
                    </Tooltip>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filas.map((fila, idx) => (
              <TableRow
                key={idx}
                sx={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}
              >
                <TableCell>{fila.label}</TableCell>
                {fila.values.map((val, i) => (
                  <TableCell key={i}>{val ?? "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 4, minHeight: "90vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Generar Reporte
          </Typography>
          <Tooltip title="Ayuda general sobre cómo generar un reporte">
            <IconButton onClick={() => setOpenHelp(true)}>
              <HelpOutlineIcon color="primary" />
            </IconButton>
          </Tooltip>

        </Box>

        <Paper
          elevation={4}
          sx={{ p: 3, backgroundColor: "#f0f7ff", borderRadius: 3, mb: 4 }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <TextField
                select
                label="Tipo de Reporte"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  setReporte(null); // 🧹 Limpia el reporte anterior
                }}
                fullWidth
              >
                <MenuItem value="Número de personas">Número de personas</MenuItem>
                <MenuItem value="Por cantidad de vueltas o tiempo máximo">
                  Vueltas o tiempo
                </MenuItem>
              </TextField>
              <Tooltip title="Selecciona qué tipo de información deseas ver">
                <InfoOutlinedIcon color="action" />
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <DatePicker
                  label="Desde"
                  value={fechaInicio}
                  onChange={setFechaInicio}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <Tooltip title="Fecha de inicio del período a consultar">
                  <InfoOutlinedIcon color="action" />
                </Tooltip>
              </Box>

              <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <DatePicker
                  label="Hasta"
                  value={fechaFin}
                  onChange={setFechaFin}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <Tooltip title="Fecha de fin del período a consultar">
                  <InfoOutlinedIcon color="action" />
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                Generar Reporte
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  setTipo("Número de personas");
                  setFechaInicio(null);
                  setFechaFin(null);
                  setReporte(null);
                  setError(null);
                  setSuccess(false);
                  setFormReset(true);
                }}
              >
                Limpiar
              </Button>
            </Box>
          </form>
        </Paper>

        {loading && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Reporte generado exitosamente.
          </Alert>
        </Snackbar>

        {reporte && (
          <Box>
            <Paper
              sx={{ p: 2, mt: 2, backgroundColor: "#eaf6ff", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Detalles del Reporte
              </Typography>
              <Typography variant="body2">
                <strong>Creado:</strong>{" "}
                {reporte.fechaCreacion
                  ? format(new Date(reporte.fechaCreacion), "dd/MM/yyyy HH:mm")
                  : "-"}
              </Typography>

              <Typography variant="body2">
                <strong>Desde:</strong> {reporte.fechaInicio}
              </Typography>
              <Typography variant="body2">
                <strong>Hasta:</strong> {reporte.fechaFin}
              </Typography>
            </Paper>
            {renderTable()}
          </Box>
        )}

        <Snackbar
          open={formReset}
          autoHideDuration={4000}
          onClose={() => setFormReset(false)}
        >
          <Alert
            onClose={() => setFormReset(false)}
            severity="info"
            sx={{ width: "100%" }}
          >
            Formulario reiniciado.
          </Alert>
        </Snackbar>
        <Dialog open={openHelp} onClose={() => setOpenHelp(false)}>
          <DialogTitle>Ayuda para Generar Reporte</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aquí puedes generar reportes seleccionando un tipo y un rango de fechas.
              <br />
              <strong>Tipo de Reporte:</strong> define si quieres ver número de personas o vueltas/tiempo.
              <br />
              <strong>Desde/Hasta:</strong> selecciona el rango de fechas.
              <br />
              Luego haz clic en <em>Generar</em>.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHelp(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirmar Generación de Reporte</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas generar el reporte con los siguientes datos?
              <br /><br />
              <strong>Tipo:</strong> {tipo} <br />
              <strong>Desde:</strong> {fechaInicio ? fechaInicio.toLocaleDateString() : "-"} <br />
              <strong>Hasta:</strong> {fechaFin ? fechaFin.toLocaleDateString() : "-"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
            <Button onClick={confirmarEnvio} variant="contained" color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </LocalizationProvider>
  );
};

export default Reporte;
