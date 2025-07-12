package com.example.demo.Servicio;

import com.example.demo.Entidad.Kart;
import com.example.demo.Repositorio.KartRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KartServicio {
    @Autowired
    private KartRepositorio kartRepositorio;

    @Autowired
    public KartServicio(KartRepositorio kartRepositorio) {
        this.kartRepositorio = kartRepositorio;
    }

    //Nuevo kart
    public Kart nuevoKart(String codigo, String modelo, String estado) {
        Kart newKart = new Kart(codigo, modelo, estado);
        Kart existente = kartRepositorio.findByCodigo(newKart.getCodigo());
        if (existente != null) {
            return null;
        }
        return kartRepositorio.save(newKart);
    }

    // Obtener karts a partir de su estado (disponible, mantenimiento y ocupado)
    public List<Kart> obtenerKartsEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            throw new IllegalArgumentException("\"El estado no puede ser nulo o vacío.");
        }
        return kartRepositorio.findByEstado(estado);
    }

    // Cambiar el estado de un kart
    public void cambiarEstado(String codigo, String newEstado) {
        Kart kart = kartRepositorio.findByCodigo(codigo);

        if (kart == null) {
            throw new IllegalArgumentException("Kart no encontrado con código: " + codigo);
        }

        kart.setEstado(newEstado);
        kartRepositorio.save(kart);
        return;
    }
}
