import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home'
import GestionTarifas from './components/GestionTarifas'
import NotFound from './components/NotFound'
import ModificarTarifa from './components/ModificarTarifa'
import CrearTarifa from './components/CrearTarifa'
import CrearTarifaEspecial from './components/CrearTarifaEspecial'
import ModificarTarifaEspecial from './components/ModificarTarifaEspecial'
import Karts from './components/Karts'
import RegistroUsuario from './components/RegistroUsuario'
import Login from './components/Login'
import Reporte from './components/Reporte'
import RackSemanal from './components/RackSemanal'
import Reserva from './components/Reserva'
import TarifasUsuario from './components/TarifasUsuario'
import CrearKart from './components/CrearKart'
import { FechaProvider } from "./components/FechaContext"
import { TarifaProvider } from "./components/TarifaContext"
import Calendario from './components/Calendario'
import EleccionDeTarifa from './components/EleccionDeTarifa'
import { UsuarioProvider } from "./components/UsuarioContext"
import RecuperarContrasena from "./components/RecuperarContrasena";
import CambiarContrasena from "./components/CambiarContrasena";
import PistaCarrera from './components/PistaCarrera'

import { useState } from 'react'

function AppContent() {
  const location = useLocation();
  const [etapa, setEtapa] = useState(1); // Ejemplo, ajusta según tu lógica

  // Lista de rutas donde se debe mostrar PistaCarrera
  const rutasConPista = ["/reserva", "/calendario", "/eleccion-tarifa"];

  return (
    <div className="container">
      <Navbar />
      {rutasConPista.includes(location.pathname) && (
        <div
          className="pista-carrera-overlay"
          style={{
            top: '270px',
            left: '660px',
          }}
        >
          <PistaCarrera etapa={etapa} />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tarifas" element={<GestionTarifas />} />
        <Route path="/crear-tarifa" element={<CrearTarifa />} />
        <Route path="/crear-tarifa-especial" element={<CrearTarifaEspecial />} />
        <Route path="/modificar-tarifa/:id" element={<ModificarTarifa />} />
        <Route path="/modificar-tarifa-especial/:id" element={<ModificarTarifaEspecial />} />
        <Route path="/karts" element={<Karts />} />
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/rack-semanal" element={<RackSemanal />} />
        <Route path="/reserva" element={<Reserva setEtapa={setEtapa} />} />
        <Route path="/tarifas-cliente" element={<TarifasUsuario />} />
        <Route path="/nuevo-Kart" element={<CrearKart />} />
        <Route path="/eleccion-tarifa" element={<EleccionDeTarifa setEtapa={setEtapa} />} />
        <Route path="/calendario" element={<Calendario setEtapa={setEtapa} />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <UsuarioProvider>
      <FechaProvider>
        <TarifaProvider>
          <Router>
            <AppContent />
          </Router>
        </TarifaProvider>
      </FechaProvider>
    </UsuarioProvider>
  )
}

export default App
