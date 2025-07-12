package com.example.demo.Controlador;

import com.example.demo.Entidad.Usuario;
import com.example.demo.Servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioControlador {
    @Autowired
    private UsuarioServicio usuarioServicio;

    //Crear nuevo usuario
    @PostMapping("/nuevousuario")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioServicio.registrarUsuario(usuario.nombre, usuario.rut, usuario.correo, usuario.telefono, usuario.rol, usuario.contrasenia, usuario.fechaNacimiento));
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestParam String correo, @RequestParam String contrasenia) {
        return ResponseEntity.ok(usuarioServicio.LoginUsuario(correo, contrasenia));
    }

    @GetMapping("/buscarPorRut/{rut}")
    public ResponseEntity<Usuario> buscarPorRut(@PathVariable String rut) {
        return ResponseEntity.ok(usuarioServicio.BuscarPorRut(rut));
    }

    @PostMapping("/recuperar-contrasenia")
    public ResponseEntity<String> recuperarContrasenia(@RequestParam String correo) {
        try {
            usuarioServicio.recuperarContrasenia(correo);
            return ResponseEntity.ok("Se ha enviado una nueva contraseña a tu correo.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar el correo.");
        }
    }

    @PutMapping("/cambiar-contrasenia")
    public ResponseEntity<String> cambiarContrasenia(
            @RequestParam String correo,
            @RequestParam String contraseniaActual,
            @RequestParam String nuevaContrasenia) {

        try {
            usuarioServicio.cambiarContrasenia(correo, contraseniaActual, nuevaContrasenia);
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la contraseña.");
        }
    }

}
