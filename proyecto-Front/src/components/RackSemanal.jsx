import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Paper, Typography, Button, Box, CircularProgress, Tooltip } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import es from "date-fns/locale/es";
import rackSemanalServicio from "../services/rackSemanal.servicio";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const RackSemanal = () => {
  const [eventos, setEventos] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    rackSemanalServicio
      .obtenerRackSemanal()
      .then((res) => {
        const reservas = res.data;
        const eventosFormateados = reservas
          .filter(
            (reserva) =>
              reserva.fechaReserva &&
              reserva.horaInicio &&
              reserva.horaFin &&
              reserva.nombreCliente
          )
          .map((reserva) => {
            const fechaInicio = new Date(`${reserva.fechaReserva}T${reserva.horaInicio}`);
            const fechaFin = new Date(`${reserva.fechaReserva}T${reserva.horaFin}`);

            return {
              title: reserva.nombreCliente,
              start: fechaInicio,
              end: fechaFin,
              desc: `Reserva para ${reserva.cantidadPersonas} personas`,
            };
          });

        setEventos(eventosFormateados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las reservas:", error);
        setError("No se pudieron cargar las reservas. Intente nuevamente más tarde.");
        setLoading(false);
      });
  }, []);

  // Componente para evento con tooltip
  const Event = ({ event }) => (
    <Tooltip title={event.desc} arrow>
      <span>{event.title}</span>
    </Tooltip>
  );

    return (
      <Paper sx={{ padding: 2, margin: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Typography variant="h5" gutterBottom>
            Rack Semanal de Reservas
          </Typography>
          {/* Heurística 10: botón de ayuda */}
          <Tooltip title="Vista semanal del rack de reservas. Puede navegar entre semanas, ver detalles pasando el cursor y recargar si hay errores." arrow>
            <Button variant="outlined" size="small">?</Button>
          </Tooltip>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} flexWrap="wrap" gap={1}>
          <Tooltip title="Ver la semana anterior" arrow>
            <Button variant="outlined" onClick={() => setDate(addDays(date, -7))}>
              Semana anterior
            </Button>
          </Tooltip>
          <Tooltip title="Volver a la semana actual" arrow>
            <Button
              variant={format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "contained" : "outlined"}
              onClick={() => setDate(new Date())}
            >
              Semana actual
            </Button>
          </Tooltip>
          <Typography variant="subtitle1" sx={{ flexGrow: 1, textAlign: "center" }}>
            Semana de {format(date, "dd 'de' MMMM yyyy", { locale: es })}
          </Typography>
          <Tooltip title="Ver la semana siguiente" arrow>
            <Button variant="outlined" onClick={() => setDate(addDays(date, 7))}>
              Semana siguiente
            </Button>
          </Tooltip>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 600 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ height: 600, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <Typography color="error" variant="body1" gutterBottom>
              {error}
            </Typography>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </Box>
        ) : eventos.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ height: 600, display: "flex", justifyContent: "center", alignItems: "center" }}>
            No hay reservas para esta semana.
          </Typography>
        ) : (
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            views={["week"]}
            defaultView="week"
            date={date}
            onNavigate={setDate}
            style={{ height: 600 }}
            culture="es"
            min={new Date(0, 0, 0, 10, 0)}
            max={new Date(0, 0, 0, 22, 0)}
            components={{ 
              event: Event,
              toolbar: () => null,
            }}
          />
        )}

        <Typography variant="caption" color="textSecondary" mt={2} display="block" textAlign="center">
          Use los botones para navegar entre semanas o volver a la semana actual. Pase el cursor sobre una reserva para más detalles.
        </Typography>
      </Paper>
    );

};

export default RackSemanal;
