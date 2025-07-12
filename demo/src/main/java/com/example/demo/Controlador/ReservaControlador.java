package com.example.demo.Controlador;

import com.example.demo.Entidad.Reserva;
import com.example.demo.Servicio.ReservaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reserva")
@CrossOrigin("*")
public class ReservaControlador {
    @Autowired
    ReservaServicio reservaServicio;

    @PostMapping("/hacerReserva")
    public ResponseEntity<Reserva> hacerReserva(@RequestBody Reserva reserva) {
        return ResponseEntity.ok(reservaServicio.realizarReserva(
                reserva.getRutCliente(),
                reserva.getNombreCliente(),
                reserva.getCorreoCliente(),
                reserva.getFechaReserva(),
                reserva.getHoraInicio(),
                reserva.getRutsAmigos(),
                reserva.getNombres(),
                reserva.getNumVueltas(),
                reserva.getTiempoMax(),
                reserva.getPrecioTarifa(),
                reserva.getDuracionReserva(),
                reserva.getTipoTarifa()
        ));
    }

    @GetMapping("/obtenerReservas")
    public ResponseEntity<List<Reserva>> obtenerReservas() {
        return ResponseEntity.ok(reservaServicio.ObtenerReservas());
    }

    @GetMapping("/obtenerReservasEntreFechas")
    public ResponseEntity<List<Reserva>> obtenerReservasEntreFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(reservaServicio.obtenerReservasEntreFechas(fechaInicio, fechaFin));
    }

}
