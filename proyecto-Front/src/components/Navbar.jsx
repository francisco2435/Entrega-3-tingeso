import React, { useContext } from "react"
import { UsuarioContext } from "./UsuarioContext"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import Sidemenu from "./Sidemenu"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const { usuario, logout } = useContext(UsuarioContext)
  const [open, setOpen] = React.useState(false)
  const [confirmLogout, setConfirmLogout] = React.useState(false)
  const [openHelp, setOpenHelp] = React.useState(false)
  const [loggingOut, setLoggingOut] = React.useState(false)
  const [errorLogout, setErrorLogout] = React.useState(null)
  const navigate = useNavigate()
  const [showLoginWarning, setShowLoginWarning] = React.useState(false)

  const toggleDrawer = (open) => () => {
    if (!usuario) {
      setShowLoginWarning(true)
      return
    }
    setOpen(open)
  }


  const handleLogout = () => {
    setConfirmLogout(true)
  }

  const confirmLogoutYes = async () => {
    setLoggingOut(true)
    setErrorLogout(null)
    try {
      setOpen(false) // Cerrar menú lateral al hacer logout
      await logout()
      navigate("/login")
    } catch (error) {
      setErrorLogout("Error al cerrar sesión. Por favor intenta nuevamente.")
    } finally {
      setLoggingOut(false)
      setConfirmLogout(false)
    }
  }

  const confirmLogoutNo = () => {
    if (!loggingOut) setConfirmLogout(false)
  }

  const handleOpenHelp = () => {
    setOpenHelp(true)
  }

  const handleCloseHelp = () => {
    setOpenHelp(false)
  }

  const handleCloseError = () => {
    setErrorLogout(null)
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        setOpen((prev) => !prev)
      }
      if (e.ctrlKey && e.key.toLowerCase() === "h") {
        setOpenHelp(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="abrir menú lateral (Ctrl+M)"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Karting RM.
          </Typography>

          <Tooltip title="Haz clic para obtener ayuda">
            <IconButton color="inherit" onClick={handleOpenHelp} aria-label="abrir ayuda">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>

          {!usuario ? (
            <Link to="/login" aria-label="Iniciar sesión">
              <Button sx={{ color: "#fff" }}>Iniciar sesión</Button>
            </Link>
          ) : (
            <>
              <Typography variant="h6" sx={{ mr: 2 }}>
                {usuario.nombre}
              </Typography>
              <Button
                sx={{ color: "#fff" }}
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                disabled={loggingOut}
              >
                Cerrar sesión
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Sidemenu open={open} toggleDrawer={toggleDrawer} />

      {/* Confirmación logout */}
      <Dialog open={confirmLogout} onClose={confirmLogoutNo} aria-labelledby="dialog-title-logout">
        <DialogTitle id="dialog-title-logout">Confirmar cierre de sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas cerrar sesión?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmLogoutNo} disabled={loggingOut}>
            Cancelar
          </Button>
          <Button onClick={confirmLogoutYes} autoFocus disabled={loggingOut}>
            {loggingOut ? (
              <>
                Cerrando... <CircularProgress size={16} sx={{ ml: 1 }} />
              </>
            ) : (
              "Cerrar sesión"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo ayuda */}
      <Dialog open={openHelp} onClose={handleCloseHelp} aria-labelledby="dialog-title-help">
        <DialogTitle id="dialog-title-help">Ayuda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Sistema de Karting RM:</strong>
            <br />
            Este sistema permite hacer reservas, visualizar rack semanal y hacer reportes.
            <br />
            <br />
            <strong>Menú lateral:</strong> Utilízalo para acceder a las distintas secciones del sistema como Reservas,
            Tarifas, Reportes, etc.
            <br />
            <br />
            <strong>Iniciar / Cerrar sesión:</strong> Puedes iniciar sesión con tu cuenta registrada y cerrar sesión desde
            esta barra superior.
            <br />
            <br />
            Si necesitas más asistencia, o <strong>cancelar alguna reserva</strong>, contacta al siguiente correo electronico: soporte@gmail.com.
            <br />
            <br />
            <em>Atajos: Ctrl+M para abrir/cerrar menú.</em>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHelp}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para errores logout */}
      <Snackbar open={Boolean(errorLogout)} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {errorLogout}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showLoginWarning}
        autoHideDuration={4000}
        onClose={() => setShowLoginWarning(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowLoginWarning(false)} severity="warning" sx={{ width: "100%" }}>
          Primero debes iniciar sesión.
        </Alert>
      </Snackbar>
    </Box>
  )
}
