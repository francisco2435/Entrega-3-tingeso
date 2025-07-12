import * as React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BarChartIcon from "@mui/icons-material/BarChart";
import DateRangeIcon from "@mui/icons-material/DateRange";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer, isAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const MenuItem = ({ to, icon, label }) => (
    <Tooltip title={label} placement="right">
      <ListItemButton
        selected={location.pathname === to}
        onClick={() => navigate(to)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </Tooltip>
  );

  const listOptions = () => (
    <Box role="presentation">
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={toggleDrawer(false)} aria-label="Cerrar menú">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <List>
        <MenuItem to="/home" icon={<HomeIcon />} label="Inicio" />

        {isAdmin ? (
          <>
            <MenuItem to="/tarifas" icon={<InsertDriveFileIcon />} label="Tarifas" />
            <MenuItem to="/karts" icon={<DirectionsCarIcon />} label="Karts" />
            <MenuItem to="/reporte" icon={<BarChartIcon />} label="Reporte" />
            <MenuItem to="/rack-semanal" icon={<CalendarTodayIcon />} label="Rack Semanal" />
          </>
        ) : (
          <>
            <MenuItem to="/calendario" icon={<DateRangeIcon />} label="Reserva" />
            <MenuItem to="/tarifas-cliente" icon={<InsertDriveFileIcon />} label="Tarifas Cliente" />
            <MenuItem to="/rack-semanal" icon={<CalendarTodayIcon />} label="Calendario Semanal" />
            <MenuItem to="/reporte" icon={<BarChartIcon />} label="Reporte" />
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
      {listOptions()}
    </Drawer>
  );
}
