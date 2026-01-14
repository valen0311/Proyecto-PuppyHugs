package com.puppyhugs.controller;

import com.puppyhugs.dto.PagoRequestDTO;
import com.puppyhugs.model.Pago;
import com.puppyhugs.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    /**
     * Endpoint para registrar un pago (Implementa HU-4).
     * Escucha peticiones POST en "/api/pagos".
     *
     * @param pagoDTO DTO con los datos del pago.
     * @return 200 OK con el pago creado/registrado o 400 Bad Request si falla.
     */
    @PostMapping
    public ResponseEntity<?> registrarPago(@Valid @RequestBody PagoRequestDTO pagoDTO) {
        // 1. Mapeo DTO -> Model
        Pago pago = convertDtoToModel(pagoDTO);

        try {
            // 2. Lógica de Negocio (Validación MASTERCARD, Monto, y guardado de estado)
            Pago pagoRegistrado = pagoService.registrarPago(pago);

            // 3. Devolvemos el registro del pago (200 OK)
            // Esto incluye el estado final (EXITOSO o FALLIDO) y el ID.
            return ResponseEntity.ok(pagoRegistrado);

        } catch (IllegalArgumentException e) {
            // 4. Manejo de errores de datos faltantes.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 🆕 Endpoint para obtener todos los pagos.
     * Escucha peticiones GET en "/api/pagos".
     *
     * @return 200 OK con la lista de todos los pagos
     */
    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodosLosPagos() {
        List<Pago> pagos = pagoService.obtenerTodosLosPagos();
        return ResponseEntity.ok(pagos);
    }

    /**
     * 🆕 Endpoint para obtener un pago por ID.
     * Escucha peticiones GET en "/api/pagos/{id}".
     *
     * @param id El ID del pago
     * @return 200 OK con el pago o 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPagoPorId(@PathVariable Long id) {
        try {
            Pago pago = pagoService.obtenerPagoPorId(id);
            return ResponseEntity.ok(pago);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 🆕 Endpoint para eliminar un pago.
     * Escucha peticiones DELETE en "/api/pagos/{id}".
     *
     * @param id El ID del pago a eliminar
     * @return 200 OK si se eliminó correctamente o 400 Bad Request si falla
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPago(@PathVariable Long id) {
        try {
            pagoService.eliminarPago(id);
            return ResponseEntity.ok("Pago eliminado exitosamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Método de Conversión ---
    private Pago convertDtoToModel(PagoRequestDTO dto) {
        Pago pago = new Pago();
        pago.setPedidoId(dto.getPedidoId());
        pago.setMontoTotal(dto.getMontoTotal());
        // El DTO asegura que metodoPago sea "MASTERCARD" o la validación falla
        pago.setMetodoPago(dto.getMetodoPago());
        // El estado y la fecha se asignan en el Service
        return pago;
    }
}