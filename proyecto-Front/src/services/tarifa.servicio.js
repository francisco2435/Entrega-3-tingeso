import httpClient from "../http-common";

const TARIFA_API_URL = '/tarifa'; 
const TARIFA_ESPECIAL_API_URL = '/tarifaEsp';

const obtenerTarifas = () => {
    return httpClient.get(`${TARIFA_API_URL}/obtenerTarifas`);
};

const crearTarifa = (nuevaTarifa) => {
    return httpClient.post(`${TARIFA_API_URL}/nuevaTarifa`, nuevaTarifa); 
};

const modificarTarifa = (tarifa) => {
    return httpClient.put(`${TARIFA_API_URL}/modificarTarifa`, tarifa); 
};

const obtenerTarifa = (id) => {
    return httpClient.get(`${TARIFA_API_URL}/obtenerTarifa?id=${id}`);
};

// Tarifas especiales
const obtenerTarifasEspeciales = () => {
    return httpClient.get(`${TARIFA_ESPECIAL_API_URL}/obtenerTarifas`);
};

const crearTarifaEspecial = (nuevaTarifa) => {
    return httpClient.post(`${TARIFA_ESPECIAL_API_URL}/nuevaTarifaEspecial`, nuevaTarifa); 
};

const modificarTarifaEspecial = (tarifa) => {
    return httpClient.put(`${TARIFA_ESPECIAL_API_URL}/modificarTarifa`, tarifa); 
}

const obtenerTarifaEspecial = (id) => {
    return httpClient.get(`${TARIFA_ESPECIAL_API_URL}/obtenerTarifa?id=${id}`);
};

//obtener Tipo Tarifa Por Fecha
const obtenerTipoTarifaPorFecha = (fecha) => {
    return httpClient.get(`${TARIFA_ESPECIAL_API_URL}/obtenerTipoTarifaPorFecha?fechaReserva=${fecha}`);
};

//obtener Tarifa Por Tipo
const obtenerTarifaEspecialPorTipo = (tipo) => {
    return httpClient.get(`${TARIFA_ESPECIAL_API_URL}/obtenerTarifaPorTipo?tipo=${tipo}`);
};

const obtenerTarifaPorTipo = (tipo) => {
    return httpClient.get(`${TARIFA_API_URL}/obtenerTarifaPorTipo?tipo=${tipo}`);
};

// Exportar los métodos para que puedan ser utilizados en otros archivos
export default {
    obtenerTarifas,
    crearTarifa,
    modificarTarifa,
    obtenerTarifa,
    obtenerTarifasEspeciales,
    crearTarifaEspecial,
    modificarTarifaEspecial,
    obtenerTarifaEspecial,
    obtenerTipoTarifaPorFecha,
    obtenerTarifaPorTipo,
    obtenerTarifaEspecialPorTipo
};
