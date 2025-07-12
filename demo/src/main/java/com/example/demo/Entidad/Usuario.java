package com.example.demo.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@Builder
@Table(name="usuario")
public class Usuario {
    //Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Id autoincremental
    private Long id;
    public String rut;
    public String nombre;
    public String correo;
    public String telefono;
    public String rol;
    public String contrasenia;
    public LocalDate fechaNacimiento;

    public Usuario() {
    }

    public Usuario(String nombre, String rut, String correo, String telefono, String rol, String contrasenia, LocalDate fechaNacimiento) {
        this.nombre = nombre;
        this.rut = rut;
        this.correo = correo;
        this.telefono = telefono;
        this.rol = rol;
        this.contrasenia = contrasenia;
        this.fechaNacimiento = fechaNacimiento;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
}
