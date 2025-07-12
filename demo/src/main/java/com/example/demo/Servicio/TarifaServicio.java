package com.example.demo.Servicio;

import com.example.demo.Entidad.Tarifa;
import com.example.demo.Repositorio.TarifaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class TarifaServicio {
    @Autowired
    TarifaRepositorio tarifaRepositorio;

    // Crear una tarifa
    public Tarifa NuevaTarifa(int numeroVueltas, int tiempoMax, Double precio, int duracionReserva, String tipo){

        if(!(Objects.equals(tipo, "normal"))){
            throw new IllegalArgumentException("la tarifa debe ser de tipo dia especial o fin de semana");
        }

        if(tiempoMax < 0){
            throw new IllegalArgumentException(" El tiempo maximo permitido debe ser positivo");
        }

        if(precio < 0){
            throw new IllegalArgumentException(" El precio debe ser positivo");
        }

        if(duracionReserva < tiempoMax){
            throw new IllegalArgumentException("La duracion total de la reserva debe ser mayor que el tiempo máximo permitido");
        }

        Tarifa tarifa = new Tarifa(numeroVueltas, tiempoMax, precio, duracionReserva, tipo);

        return tarifaRepositorio.save(tarifa);
    }

    public List<Tarifa> ObtenerTodasLasTarifas(){
        return tarifaRepositorio.findAll();
    }

    //modificar alguna caracteristica de una tarifa
    public void modificarTarifa(Long id, int nuevasVueltas, int nuevoTiempomax, double nuevoPrecio, int nuevaDuracion, String nuevoTipo){
        Tarifa tarifa = tarifaRepositorio.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tarifa no encontrada"));

        if(tarifa == null){
            throw new IllegalArgumentException("La tarifa no existe");
        }

        if(nuevoTiempomax < 0){
            throw new IllegalArgumentException(" El tiempo maximo permitido debe ser positivo");
        }

        if(nuevoPrecio < 0){
            throw new IllegalArgumentException(" El precio debe ser positivo");
        }

        if(nuevaDuracion < nuevoTiempomax){
            throw new IllegalArgumentException("La duración total de la reserva debe ser mayor que el tiempo máximo permitido");
        }

        tarifa.setNumeroVueltas(nuevasVueltas);
        tarifa.setTiempoMax(nuevoTiempomax);
        tarifa.setPrecio(nuevoPrecio);
        tarifa.setDuracionReserva(nuevaDuracion);
        tarifa.setTipo(nuevoTipo);

        tarifaRepositorio.save(tarifa);
        return;
    }

    public Tarifa obtenerTarifa(Long id){
        return tarifaRepositorio.findById(id).get();
    }

    public List<Tarifa> obtenerTarifaPorTipo(String tipo) {
        return tarifaRepositorio.findByTipo(tipo);
    }
}
