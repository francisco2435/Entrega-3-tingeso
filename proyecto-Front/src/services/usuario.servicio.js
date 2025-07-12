import httpClient from "../http-common";

const USUARIO_API_URL = "/usuario";

// Método para login
const login = (correo, contrasenia) => {
  const params = new URLSearchParams({ correo, contrasenia });
  return httpClient.post(`${USUARIO_API_URL}/login?${params.toString()}`);
};

// Método para registrar nuevo usuario
const registrarUsuario = (nuevoUsuario) => {
  return httpClient.post(`${USUARIO_API_URL}/nuevousuario`, nuevoUsuario);
};

const recuperarContrasenia = (correo) => {
  const params = new URLSearchParams({ correo });
  return httpClient.post(`${USUARIO_API_URL}/recuperar-contrasenia?${params.toString()}`);
};

const cambiarContrasenia = (correo, contraseniaActual, nuevaContrasenia) => {
  const params = new URLSearchParams({
    correo,
    contraseniaActual,
    nuevaContrasenia,
  });
  return httpClient.put(`${USUARIO_API_URL}/cambiar-contrasenia?${params.toString()}`);
};

export default {
    login,
    registrarUsuario,
    recuperarContrasenia,
    cambiarContrasenia,
};
