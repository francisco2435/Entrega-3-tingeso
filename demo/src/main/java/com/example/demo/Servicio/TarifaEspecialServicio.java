package com.example.demo.Servicio;

import com.example.demo.Entidad.TarifaEspecial;

import com.example.demo.Repositorio.TarifaEspecialRepositorio;
import com.example.demo.Repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class TarifaEspecialServicio {
    @Autowired
    TarifaEspecialRepositorio tarifaEspecialRepositorio;

    @Autowired
    UsuarioRepositorio usuarioRepositorio;

    public TarifaEspecial NuevaTarifa(int numeroVueltas, int tiempoMax, Double precio, int duracionReserva, String tipo) {

        if (!(Objects.equals(tipo, "dia especial") || Objects.equals(tipo, "fin de semana"))) {
            throw new IllegalArgumentException("la tarifa debe ser de tipo dia especial o fin de semana");
        }

        if (tiempoMax < 0) {
            throw new IllegalArgumentException(" El tiempo maximo permitido debe ser positivo");
        }

        if (precio < 0) {
            throw new IllegalArgumentException(" El precio debe ser positivo");
        }

        if (duracionReserva < tiempoMax) {
            throw new IllegalArgumentException("La duracion total de la reserva debe ser mayor que el tiempo máximo permitido");
        }

        TarifaEspecial tarifa = new TarifaEspecial(numeroVueltas, tiempoMax, precio, duracionReserva, tipo);

        return tarifaEspecialRepositorio.save(tarifa);
    }

    //modificar alguna caracteristica de una tarifa
    public void modificarTarifa(Long id, int nuevasVueltas, int nuevoTiempomax, double nuevoPrecio, int nuevaDuracion, String nuevoTipo) {
        TarifaEspecial tarifa = tarifaEspecialRepositorio.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tarifa no encontrada"));

        if (tarifa == null) {
            throw new IllegalArgumentException("La tarifa no existe");
        }

        if (nuevoTiempomax < 0) {
            throw new IllegalArgumentException(" El tiempo maximo permitido debe ser positivo");
        }

        if (nuevoPrecio < 0) {
            throw new IllegalArgumentException(" El precio debe ser positivo");
        }

        if (nuevaDuracion < nuevoTiempomax) {
            throw new IllegalArgumentException("La duración total de la reserva debe ser mayor que el tiempo máximo permitido");
        }

        tarifa.setNumeroVueltas(nuevasVueltas);
        tarifa.setTiempoMax(nuevoTiempomax);
        tarifa.setPrecio(nuevoPrecio);
        tarifa.setDuracionReserva(nuevaDuracion);
        tarifa.setTipo(nuevoTipo);

        tarifaEspecialRepositorio.save(tarifa);
        return;
    }

    public List<TarifaEspecial> ObtenerTodasLasTarifas() {
        return tarifaEspecialRepositorio.findAll();
    }

    public TarifaEspecial obtenerTarifa(Long id) {

        return tarifaEspecialRepositorio.findById(id).get();
    }

    public String obtenerTipoTarifaPorFecha(LocalDate fecha) {
        if (fecha.getDayOfWeek().getValue() >= 6) {
            return "fin de semana"; // Fin de semana
        } else if (obtenerFeriados().contains(fecha)) {
            return "dia especial"; // Día especial
        } else {
            return "normal"; // Tarifa normal
        }
    }

    public List<TarifaEspecial> obtenerTarifaPorTipo(String tipo) {
        return tarifaEspecialRepositorio.findByTipo(tipo);
    }

    public List<LocalDate> obtenerFeriados() {
        List<LocalDate> feriados = new ArrayList<>();
        feriados.add(LocalDate.of(2025, 1, 1)); // Año Nuevo
        feriados.add(LocalDate.of(2025, 5, 1)); // Día del Trabajador
        feriados.add(LocalDate.of(2025, 9, 18)); // Independencia de Chile
        feriados.add(LocalDate.of(2025, 9, 19)); // Día de las Glorias del Ejército
        feriados.add(LocalDate.of(2025, 10, 31)); // Halloween
        return feriados;
    }
}
