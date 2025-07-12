package com.example.demo.Servicio;

import com.example.demo.Entidad.Usuario;
import com.example.demo.Repositorio.UsuarioRepositorio;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Random;

@Service
public class UsuarioServicio {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    public UsuarioServicio(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Autowired
    private JavaMailSender mailSender;


    //Nuevo Usuario
    public Usuario registrarUsuario(String nombre, String rut, String correo, String telefono, String rol, String contrasenia, LocalDate fechaNacimiento) {
        if (usuarioRepositorio.findByCorreo(correo) != null || usuarioRepositorio.findByRut(rut) != null) {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo o RUT.");
        }

        Usuario nuevoUsuario = new Usuario(nombre, rut, correo, telefono, rol, contrasenia, fechaNacimiento);
        return usuarioRepositorio.save(nuevoUsuario);
    }

    // Login usuario
    public Usuario LoginUsuario(String correo, String contrasenia) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correo);
        //Comprobar que el usuario esté registrado con el correo ingresado
        if (usuario == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        //Comprobar que la contraseña ingresada sea correcta
        if (!usuario.contrasenia.equals(contrasenia)) {
            throw new IllegalArgumentException("Contraseñas no coinciden");
        }
        //Retornar el usuario logueado
        return usuario;
    }

    public Usuario BuscarPorRut(String Rut) {
        return usuarioRepositorio.findByRut(Rut);
    }

    public void recuperarContrasenia(String correo) throws MessagingException {
        Usuario usuario = usuarioRepositorio.findByCorreo(correo);
        if (usuario == null) {
            throw new IllegalArgumentException("No existe un usuario con ese correo");
        }

        // Generar contraseña temporal simple
        String nuevaContrasenia = generarContraseniaTemporal();

        // Actualizar y guardar nueva contraseña
        usuario.setContrasenia(nuevaContrasenia);
        usuarioRepositorio.save(usuario);

        // Enviar por correo
        enviarCorreoRecuperacion(usuario.getCorreo(), nuevaContrasenia);
    }

    private String generarContraseniaTemporal() {
        int longitud = 8;
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(longitud);
        for (int i = 0; i < longitud; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return sb.toString();
    }

    private void enviarCorreoRecuperacion(String correo, String nuevaContrasenia) throws MessagingException {
        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

        helper.setFrom("franciscoriquelmenunez@gmail.com");
        helper.setTo(correo);
        helper.setSubject("Recuperación de contraseña");
        helper.setText("Su nueva contraseña temporal es: " + nuevaContrasenia +
                "\nPor favor, cámbiela después de ingresar al sistema.");

        mailSender.send(mensaje);
    }

    public void cambiarContrasenia(String correo, String contraseniaActual, String nuevaContrasenia) {
        Usuario usuario = usuarioRepositorio.findByCorreo(correo);

        if (usuario == null) {
            throw new IllegalArgumentException("Usuario no encontrado.");
        }

        if (!usuario.getContrasenia().equals(contraseniaActual)) {
            throw new IllegalArgumentException("La contraseña actual no es correcta.");
        }

        usuario.setContrasenia(nuevaContrasenia);
        usuarioRepositorio.save(usuario);
    }
}
