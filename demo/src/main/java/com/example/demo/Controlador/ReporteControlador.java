package com.example.demo.Controlador;

import com.example.demo.Entidad.Reporte;
import com.example.demo.Servicio.ReporteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reporte")
@CrossOrigin("*")
public class ReporteControlador {
    @Autowired
    ReporteServicio reporteServicio;

    @PostMapping("/hacerReporte")
    public ResponseEntity<Reporte> hacerReporte(@RequestBody Reporte reporte) {
        return ResponseEntity.ok(reporteServicio.crearReporte(reporte.getTipo(), reporte.getFechaInicio(), reporte.getFechaFin()));
    }
}
