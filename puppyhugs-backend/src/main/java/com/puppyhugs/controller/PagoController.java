package com.puppyhugs.controller;

import com.puppyhugs.model.Pago;
import com.puppyhugs.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar la entidad Pago.
 * Expone el endpoint para HU-4.
 */
@RestController
// Angular llamará a "http://localhost:8080/api/pagos"
@RequestMapping("/api/pagos")
public class PagoController {

    // 1. Inyectamos el Servicio de Pago
    @Autowired
    private PagoService pagoService;

    /**
     * Endpoint para la HU-4: Registrar un nuevo Pago.
     * Escucha peticiones POST en "/api/pagos".
     *
     * @param pago El JSON enviado por Angular (que debe incluir el pedidoId,
     * el monto y el metodoPago), convertido a un objeto Pago.
     * @return Un ResponseEntity:
     * - 200 OK (éxito) con el pago procesado (JSON).
     * - 400 Bad Request (error) con un mensaje (JSON).
     */
    @PostMapping
    public ResponseEntity<?> registrarPago(@RequestBody Pago pago) {
        try {
            // 2. Le pasamos el trabajo al servicio
            // Aquí es donde se ejecuta la lógica de HU-4:
            // - Validar campos obligatorios.
            // - Validar que el método de pago sea "MASTERCARD" (Restricción 3.1).
            // - Simular la validación de la tarjeta.
            // - Asignar estado "EXITOSO" o "FALLIDO".
            Pago pagoProcesado = pagoService.registrarPago(pago);

            // 3. Devolvemos la respuesta
            // Si el pago fue fallido (ej: no era MASTERCARD),
            // el servicio igualmente devuelve un objeto Pago con estado FALLIDO,
            // lo cual es un éxito de procesamiento (un 200 OK).
            // El front (Angular) debe leer el "estado" del JSON de respuesta.
            return ResponseEntity.ok(pagoProcesado);

        } catch (IllegalArgumentException e) {

            // 4. Manejo de errores
            // Esto solo se dispararía si faltan datos clave (ej: monto es null)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // (Opcional: Se podría añadir un @GetMapping para que un admin vea los pagos,
    // pero no es parte del Sprint 1)
}
