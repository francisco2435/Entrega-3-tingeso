import httpClient from "../http-common";

const RACKSEMANAL_API_URL = "/reserva";

const obtenerRackSemanal = () => {
    return httpClient.get(`${RACKSEMANAL_API_URL}/obtenerReservas`);
    }

export default {
  obtenerRackSemanal,
};