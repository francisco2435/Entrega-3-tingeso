package com.example.demo.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@Builder
@Table(name="tarifa_especial")
public class TarifaEspecial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Id autoincremental
    private Long id;

    private int numeroVueltas;
    private int tiempoMax;
    private double precio;
    private int duracionReserva;
    private String tipo;

    public TarifaEspecial() {
    }

    public TarifaEspecial(int numeroVueltas, int tiempoMax, double precio, int duracionReserva, String tipo) {
        this.numeroVueltas = numeroVueltas;
        this.tiempoMax = tiempoMax;
        this.precio = precio;
        this.duracionReserva = duracionReserva;
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumeroVueltas() {
        return numeroVueltas;
    }

    public void setNumeroVueltas(int numeroVueltas) {
        this.numeroVueltas = numeroVueltas;
    }

    public int getTiempoMax() {
        return tiempoMax;
    }

    public void setTiempoMax(int tiempoMax) {
        this.tiempoMax = tiempoMax;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getDuracionReserva() {
        return duracionReserva;
    }

    public void setDuracionReserva(int duracionReserva) {
        this.duracionReserva = duracionReserva;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
