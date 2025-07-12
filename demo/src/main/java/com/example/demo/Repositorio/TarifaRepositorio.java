package com.example.demo.Repositorio;

import com.example.demo.Entidad.Tarifa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarifaRepositorio extends JpaRepository<Tarifa, Long> {
    Tarifa findByTipoAndTiempoMax(String tipo, int tiempomax);
    Tarifa findByTipoAndNumeroVueltas(String tipo, int numeroVueltas);
    List<Tarifa> findByTipo(String tipo);
}
