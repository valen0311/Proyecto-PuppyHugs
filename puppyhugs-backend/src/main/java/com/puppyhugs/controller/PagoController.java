package com.puppyhugs.controller;

import com.puppyhugs.dto.PagoRequestDTO;
import com.puppyhugs.model.Pago;
import com.puppyhugs.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

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

    // --- Método de Conversión ---
    private Pago convertDtoToModel(PagoRequestDTO dto) {
        Pago pago = new Pago();
        pago.setPedidoId(dto.getPedidoId());
        pago.setMontoTotal(dto.getMontoTotal());
        // El DTO asegura que metodoPago sea "MASTERCARD" o la validación falle
        pago.setMetodoPago(dto.getMetodoPago());
        // El estado y la fecha se asignan en el Service
        return pago;
    }
}