package com.example.demo.Repositorio;

import com.example.demo.Entidad.TarifaEspecial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarifaEspecialRepositorio extends JpaRepository<TarifaEspecial, Long> {
    List<TarifaEspecial> findByTipo(String tipo);
}
