package com.example.demo.Servicio;

import com.example.demo.Entidad.Reserva;
import com.example.demo.Entidad.Usuario;
import com.example.demo.Repositorio.KartRepositorio;
import com.example.demo.Repositorio.ReservaRepositorio;
import com.example.demo.Repositorio.UsuarioRepositorio;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ReservaServicio {
    @Autowired
    private ReservaRepositorio reservaRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private KartRepositorio kartRepositorio;


    public Reserva realizarReserva(String rutCliente, String nombreCliente, String correoCliente, LocalDate fechaReserva, LocalTime horaInicio,
                                   List<String> rutsAmigos, List<String> nombres,
                                   int numeroVueltas, int tiempoMax, double precio, int duracionReserva, String tipoTarifa) {
        if(rutCliente == null){
            throw new IllegalArgumentException("rut ingresado no está registrado");
        }


        LocalTime horaFin = horaInicio.plusMinutes(duracionReserva);
        int numKartsDisponibles = obtenerCantidadKartsDisponibles(fechaReserva, horaInicio, horaFin);
        List<Double> montosTotales = new ArrayList<>();
        double montoTotal = 0.0;
        List<String> tiposDescuento = new ArrayList<>();
        List<Double> descuentos = new ArrayList<>();
        double valorIva = 0.19;
        double montoTotalConIva = 0.0;
        int cantidadPersonas = rutsAmigos.size() + 1; // +1 por el cliente que hace la reserva

        //Añadir al inicio al cliente quien está haciendo la reserva
        rutsAmigos.add(0, rutCliente);
        nombres.add(0, nombreCliente);


        // # Comprobar valores #

        // Comprobar que la cantidad de ruts ingresados sea igual al de los nombres ingresados
        if(rutsAmigos.size() != nombres.size()){
            throw new IllegalArgumentException("La cantidad de ruts ingresados no es igual al de los nombres ingresados");
        }

        // Comprobar la disponibilidad de karts segun el numero de integrantes.
        if(numKartsDisponibles < cantidadPersonas){

            throw new IllegalArgumentException("No hay suficientes karts para la cantidad de personas ingresadas " + numKartsDisponibles);
        }
        // Comprobar (número del grupo) y (ids ingresados más el usuario) sean iguales
        if(rutsAmigos.size() != cantidadPersonas){
            throw new IllegalArgumentException("El numero de ruts ingresados no coinciden con el numero de personas ingresadas");
        }
        // Comprobar que el total de integrantes sea menor o igual a 15
        if(cantidadPersonas > 15){
            throw new IllegalArgumentException("El numero de personas ingresadas es mayor que 15");
        }

        // # Comprobar horarios #

        // Comprobar que las fechas seleccionadas estén dentro del horario de trabajo
        if(!comprobarHorarioTrabajo(fechaReserva, horaInicio, horaFin)){
            throw new IllegalArgumentException("la reserva se está realizando fuera del horario de trabajo");
        }

        // Comprobar tope de horario
        if(!comprobarTopeHorario(fechaReserva, horaInicio, horaFin, cantidadPersonas+1)){
            throw new IllegalArgumentException("la reserva tiene tope de horario con otra reserva");
        }

        Reserva reserva = new Reserva();
        reservaRepositorio.save(reserva);

        // # Aplicar descuentos y calculo del monto total#
        tiposDescuento = obtenerTiposDeDescuento(reserva.getId(), rutsAmigos, cantidadPersonas, fechaReserva);
        descuentos = calcularDescuento(reserva.getId(), rutsAmigos, cantidadPersonas, fechaReserva);

        for (int i = 0; i < rutsAmigos.size(); i++) {
            double descuento = descuentos.get(i);
            double montoIndividual = precio * (1- descuento); // Calcular el monto individual después del descuento
            montosTotales.add(montoIndividual);
            montoTotal += montoIndividual; // Sumar al monto total
        }
        // Al final, redondear el monto total con IVA
        montoTotalConIva = Math.round((montoTotal + montoTotal * valorIva) * 100.0) / 100.0;

        // # Calcular el tiempo total de la reserva #
        int tiempoTotal = duracionReserva + tiempoMax; // en minutos, multiplicando la duración de la reserva por la cantidad de personas

        // # Asignar valores a la reserva #
        reserva.setRutCliente(rutCliente);
        reserva.setNombreCliente(nombreCliente);
        reserva.setFechaReserva(fechaReserva);
        reserva.setHoraInicio(horaInicio);
        reserva.setHoraFin(horaFin);
        reserva.setRutsAmigos(rutsAmigos);
        reserva.setNombres(nombres);
        reserva.setTipoTarifa(tipoTarifa);
        reserva.setHoraReserva(LocalTime.now());
        reserva.setNumVueltas(numeroVueltas);
        reserva.setTiempoMax(tiempoMax);
        reserva.setCantidadPersonas(cantidadPersonas);
        reserva.setPrecioTarifa(precio);
        reserva.setTiposDescuentos(tiposDescuento);
        reserva.setDescuentos(descuentos);
        reserva.setMontosConDescuento(montosTotales);
        reserva.setMontoTotal(montoTotal);
        reserva.setDuracionReserva(duracionReserva);
        reserva.setValorIva(valorIva);
        reserva.setMontoTotalConIva(montoTotalConIva);
        reserva.setTiempoTotal(tiempoTotal);

        // # Enviar comprobante de reserva por correo electrónico #
        enviarComprobanteReserva(reserva, correoCliente);

        return reservaRepositorio.save(reserva);



    }





    // Obtener descuentos
    // Devolverá el descuento que se debería aplicar en el formato [indice el tipo de descuento. valor del descuento menos el indice]
    public List<Double> calcularDescuento(Long idReserva, List<String> rutsIntegrantes, int cantidadIntegrantes, LocalDate fechaReserva) {

        List<Double> descuentoCumpleanos = obtenerDescuentoCumpleanios(rutsIntegrantes, fechaReserva);
        List<Double> descuentoNumPer = obtenerDescuentoNumPer(cantidadIntegrantes);
        List<Double> descuentoClientFrec = obtenerDescuentoClientFrec(rutsIntegrantes, fechaReserva);

        List<Double> descuentosFinales = new ArrayList<>();

        int maxSize = Math.max(descuentoCumpleanos.size(),
                Math.max(descuentoNumPer.size(), descuentoClientFrec.size()));

        for (int i = 0; i < maxSize; i++) {
            double dCumple = (i < descuentoCumpleanos.size()) ? descuentoCumpleanos.get(i) : 0.0;
            double dNumPer = (i < descuentoNumPer.size()) ? descuentoNumPer.get(i) : 0.0;
            double dFrec = (i < descuentoClientFrec.size()) ? descuentoClientFrec.get(i) : 0.0;

            double maxDescuento = Math.max(dCumple, Math.max(dNumPer, dFrec));
            descuentosFinales.add(maxDescuento);
        }

        return descuentosFinales;
    }

    public List<String> obtenerTiposDeDescuento(Long idReserva, List<String> rutsIntegrantes, int cantidadIntegrantes, LocalDate fechaReserva) {

        List<Double> descuentoCumpleanos = obtenerDescuentoCumpleanios(rutsIntegrantes, fechaReserva);
        List<Double> descuentoNumPer = obtenerDescuentoNumPer(cantidadIntegrantes);
        List<Double> descuentoClientFrec = obtenerDescuentoClientFrec(rutsIntegrantes, fechaReserva);

        List<String> tiposDescuento = new ArrayList<>();

        int maxSize = Math.max(descuentoCumpleanos.size(),
                Math.max(descuentoNumPer.size(), descuentoClientFrec.size()));

        for (int i = 0; i < maxSize; i++) {
            double dCumple = (i < descuentoCumpleanos.size()) ? descuentoCumpleanos.get(i) : 0.0;
            double dNumPer = (i < descuentoNumPer.size()) ? descuentoNumPer.get(i) : 0.0;
            double dFrec = (i < descuentoClientFrec.size()) ? descuentoClientFrec.get(i) : 0.0;

            double maxDescuento = Math.max(dCumple, Math.max(dNumPer, dFrec));

            if (maxDescuento == 0.0) {
                tiposDescuento.add("No aplica");
            } else if (maxDescuento == dCumple) {
                tiposDescuento.add("Descuento de cumpleaños");
            } else if (maxDescuento == dFrec) {
                tiposDescuento.add("Descuento por cliente frecuente");
            } else {
                tiposDescuento.add("Descuento por número de integrantes");
            }
        }

        return tiposDescuento;
    }



    // Comprobar tope de horario
    public boolean comprobarTopeHorario(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, int numIntegrantes){
        List<Reserva> reservas = reservaRepositorio.findByFechaReserva(fecha);;

        // Recorrer cada reserva y verificar si hay cruce de horarios
        for (Reserva reserva : reservas) {
            LocalTime inicioReserva = reserva.getHoraInicio();
            LocalTime finReserva = reserva.getHoraFin();

            // Comprobar si los horarios ingresados se solapan con la reserva
            if (!(horaFin.isBefore(inicioReserva) || horaInicio.isAfter(finReserva))) {
                return false;
            }
        }
        return true; // No hay tope de horario
    }

    // Comprobar que las fechas seleccionadas estén dentro del horario de trabajo
    // ( Lunes a Viernes: 14:00 a 22:00 horas o Sábados, Domingos y Feriados: 10:00 a 22:00 horas. )
    public boolean comprobarHorarioTrabajo(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        if (fecha == null || horaInicio == null || horaFin == null) {
            throw new IllegalArgumentException("La fecha, hora de inicio y hora de fin no pueden ser nulas");
        }

        boolean tipoDeDia = esDiaDeSemana(fecha); // 0 = día normal, 1 = fin de semana, 2 = feriado
        LocalTime apertura;
        LocalTime cierre = LocalTime.of(22, 0);

        if (tipoDeDia) { // Día normal (Lunes a Viernes)
            apertura = LocalTime.of(14, 0);
        } else { // Fin de semana o feriado (Sábado, Domingo o feriado)
            apertura = LocalTime.of(10, 0);
        }

        // Verificar si el horario está dentro del rango permitido
        return !horaInicio.isBefore(apertura) && !horaFin.isAfter(cierre);
    }

    public static boolean esDiaDeSemana(LocalDate fecha) {
        DayOfWeek dia = fecha.getDayOfWeek();
        return dia != DayOfWeek.SATURDAY && dia != DayOfWeek.SUNDAY;
    }


    // obtener la cantidad de karts disponibles dentro de ese horario
    public int obtenerCantidadKartsDisponibles(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        // Obtener la cantidad total de karts disponibles
        int kartsTotal = kartRepositorio.findByEstado("disponible").size();
        int kartsOcupados = 0; // Contador de karts ocupados en el horario dado
        // Obtener las reservas del día
        List<Reserva> reservas = reservaRepositorio.findByFechaReserva(fecha);;

        // Recorrer cada reserva y verificar si hay cruce de horarios
        for (Reserva reserva : reservas) {
            LocalTime inicioReserva = reserva.getHoraInicio();
            LocalTime finReserva = reserva.getHoraFin();

            // Comprobar si los horarios ingresados se solapan con la reserva
            if (!(horaFin.isBefore(inicioReserva) || horaInicio.isAfter(finReserva))) {
                kartsOcupados += reserva.getCantidadPersonas();
            }
        }

        if(kartsTotal - kartsOcupados < 0){ //Esto nunca debería ocurrir, pero se está comprobando igual
            System.out.println("kartsOcupados es mayor que karts total");
            return 0;
        }

        // retonar la cantidad de karts disponibles en ese horario
        return kartsTotal - kartsOcupados;
    }

    // Obtener todas las reservas RF 7 Rack semanal
    public List<Reserva> ObtenerReservas(){
        List<Reserva> reservas = reservaRepositorio.findAll();
        return reservas != null ? reservas : Collections.emptyList();  // Si es null, devolver una lista vacía
    }

    public List<Double> obtenerDescuentoNumPer(int numPersonas) {
        double descuento = 0.0;

        if (numPersonas >= 3 && numPersonas <= 5) {
            descuento = 0.10;
        } else if (numPersonas >= 6 && numPersonas <= 10) {
            descuento = 0.20;
        } else if (numPersonas > 10 && numPersonas <= 15) {
            descuento = 0.30;
        }

        List<Double> descuentos = new ArrayList<>();
        for(int i = 0; i < numPersonas; i++){
            descuentos.add(descuento);
        }

        return descuentos;
    }

    public List<Double> obtenerDescuentoClientFrec(List<String> rutsIntegrantes, LocalDate fechaReserva) {
        List<Double> descuentos = new ArrayList<>();

        for (int i = 0; i < rutsIntegrantes.size(); i++) {
            // Descuento por frecuencia del cliente
            int frecuencia = calcularFrecuencia(fechaReserva, rutsIntegrantes.get(i));
            if (frecuencia >= 2 && frecuencia <= 4) {
                descuentos.add(0.10);
            } else if (frecuencia >= 5 && frecuencia <= 6) {
                descuentos.add(0.20);
            } else if (frecuencia > 6) {
                descuentos.add(0.30);
            } else {
                descuentos.add(0.00);
            }
        }

        //descuentoClienteFrecuenteRepositorio.save(descuentoClienteFrecuente);

        return descuentos;
    }

    public int calcularFrecuencia(LocalDate fecha, String rutIntegrante) {
        // Verificar si el rutIntegrante es null o vacío y lanzar excepción
        if (rutIntegrante == null || rutIntegrante.isEmpty()) {
            throw new IllegalArgumentException("El rut no puede ser vacío");
        }

        // Obtener las reservas realizadas en el mes
        YearMonth mesIngresado = YearMonth.from(fecha);
        LocalDate inicioMes = mesIngresado.atDay(1);
        LocalDate finMes = mesIngresado.atEndOfMonth();
        int frecuenciaReservasRealizadas = 0;  // Cuantas veces aparece su rut en las reservas del mes

        // Obtener las reservas del mes
        List<Reserva> reservasDelMes = reservaRepositorio.findByFechaReservaBetween(inicioMes, finMes);

        for (Reserva reserva : reservasDelMes) {
            // Si el rutIntegrante es el cliente que hace la reserva o está en la lista de amigos
            if (reserva.getRutCliente().equals(rutIntegrante) ||
                    (reserva.getRutsAmigos() != null && reserva.getRutsAmigos().contains(rutIntegrante))) {
                frecuenciaReservasRealizadas++;
            }
        }

        return frecuenciaReservasRealizadas;
    }

    public List<Double> obtenerDescuentoCumpleanios(List<String> rutsIntegrantes, LocalDate fechaReserva) {
        List<Usuario> usuarios = obtenerUsuariosPorRuts(rutsIntegrantes);
        List<Double> descuentos = new ArrayList<>();
        int contador = 0;

        for (int i = 0; i < rutsIntegrantes.size(); i++) {
            if (i >= usuarios.size() || usuarios.get(i) == null || usuarios.get(i).getFechaNacimiento() == null) {
                descuentos.add(0.0);
                continue;
            }

            LocalDate fechaNacimiento = usuarios.get(i).getFechaNacimiento();
            boolean esCumpleanos = fechaNacimiento.getMonth() == fechaReserva.getMonth() &&
                    fechaNacimiento.getDayOfMonth() == fechaReserva.getDayOfMonth();

            if (esCumpleanos && contador < 2) {
                descuentos.add(0.5);
                contador++;
            } else {
                descuentos.add(0.0);
            }
        }

        return descuentos;
    }

    public List<Usuario> obtenerUsuariosPorRuts(List<String> ruts) {
        if (ruts == null || ruts.isEmpty()) {
            throw new IllegalArgumentException("La lista de RUTs no puede ser nula o vacía");
        }

        List<Usuario> usuarios = new ArrayList<>();

        for (String rut : ruts) {
            Usuario usuario = usuarioRepositorio.findByRut(rut);
            if (usuario != null) {
                usuarios.add(usuario);
            }
        }
        return usuarios;
    }

    public List<Reserva> obtenerReservasEntreFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio == null || fechaFin == null) {
            throw new IllegalArgumentException("Las fechas de inicio y fin no pueden ser nulas");
        }
        if (fechaInicio.isAfter(fechaFin)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        return reservaRepositorio.findByFechaReservaBetween(fechaInicio, fechaFin);
    }


    //Funcion para enviar el comprobante de reserva por correo electrónico
    // Crear comprobante (esperar respuesta del profe, si se debe hacer un pdf y mandar comprobante se hará este metodo, si no, solo se muestra por pantalla)
    public PDDocument generarComprobanteReserva(Reserva reserva) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(document, page);

        // Fuentes
        PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

        // Título
        contentStream.setFont(fontBold, 16);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, 750);
        contentStream.showText("Comprobante de Reserva");
        contentStream.endText();

        // Información de la reserva
        contentStream.setFont(fontRegular, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(50, 720);
        contentStream.showText("ID: " + reserva.getId());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Nombre reservante: " + reserva.getNombreCliente());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Fecha de reserva: " + reserva.getFechaReserva().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Hora de reserva: " + reserva.getHoraReserva());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Hora de inicio: " + reserva.getHoraInicio());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Número de vueltas: " + reserva.getNumVueltas());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Tiempo máximo: " + reserva.getTiempoMax() + " minutos");
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Cantidad de personas: " + reserva.getCantidadPersonas());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Tipo de Tarifa: " + reserva.getTipoTarifa());

        // Línea divisoria
        contentStream.newLineAtOffset(0, -25);
        contentStream.showText("--------------------------------------------");
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Integrantes:");

        for (int i = 0; i < reserva.getCantidadPersonas(); i++) {
            contentStream.newLineAtOffset(20, -15); // Indentación
            contentStream.showText(reserva.getNombres().get(i) + ": " + reserva.getMontosConDescuento().get(i) + " CLP");

            contentStream.newLineAtOffset(0, -15);
            contentStream.showText("Tipo de descuento: " + reserva.getTiposDescuentos().get(i));

            contentStream.newLineAtOffset(0, -15);
            contentStream.showText("Valor del descuento: " + reserva.getDescuentos().get(i));

            contentStream.newLineAtOffset(-20, -15); // Vuelve a margen izquierdo + espacio
        }

        // Línea divisoria
        contentStream.newLineAtOffset(0, -10);
        contentStream.showText("--------------------------------------------");

        // Totales en negrita
        contentStream.setFont(fontBold, 12);
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Monto total: " + reserva.getMontoTotal());

        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("IVA (19%): " + reserva.getValorIva());

        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Monto total con IVA: " + reserva.getMontoTotalConIva());

        contentStream.endText();
        contentStream.close();

        return document;
    }

    public void enviarPdfPorCorreo(String correo, PDDocument pdfDocument) throws MessagingException, IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfDocument.save(outputStream);
        byte[] pdfBytes = outputStream.toByteArray();

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom("franciscoriquelmenunez@gmail.com");
        helper.setTo(correo);
        helper.setSubject("Comprobante de Reserva");
        helper.setText("Adjunto encontrará el comprobante de su reserva.");

        // Adjuntar el PDF
        helper.addAttachment("comprobante_reserva.pdf", new ByteArrayDataSource(pdfBytes, "application/pdf"));

        mailSender.send(mimeMessage);
    }

    public void enviarComprobanteReserva(Reserva reserva, String correoCliente) {
        try {
            // Generar el comprobante PDF
            PDDocument comprobante = generarComprobanteReserva(reserva);

            // Enviar el PDF por correo electrónico
            enviarPdfPorCorreo(correoCliente, comprobante);

        } catch (MessagingException e) {
            // Manejar excepciones al enviar el correo
            System.err.println("Error al enviar el correo: " + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            // Manejar excepciones al generar o escribir el PDF
            System.err.println("Error al generar el archivo PDF: " + e.getMessage());
            e.printStackTrace();
        }
    }


}
