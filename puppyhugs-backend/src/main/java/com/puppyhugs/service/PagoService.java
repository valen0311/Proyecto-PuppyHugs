package com.puppyhugs.service;

import com.puppyhugs.model.Pago;
import com.puppyhugs.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Servicio para la lógica de negocio de Pagos.
 * Implementa las reglas definidas en la HU-4 y la Restricción 3.1.
 */
@Service
public class PagoService {

    // Constante para la restricción de método de pago
    private static final String METODO_PAGO_ACEPTADO = "MASTERCARD";

    @Autowired
    private PagoRepository pagoRepository;

    /**
     * Registra un nuevo pago (Implementa HU-4).
     *
     * @param pago El pago a procesar.
     * @return El pago guardado con su estado final (EXITOSO o FALLIDO).
     * @throws IllegalArgumentException Si faltan datos clave.
     */
    public Pago registrarPago(Pago pago) {

        // Criterio HU-4: "Validar que los campos obligatorios (...) estén completos"
        if (pago.getPedidoId() == null || pago.getMontoTotal() == null ||
                pago.getMetodoPago() == null || pago.getMetodoPago().isBlank()) {
            throw new IllegalArgumentException("Error HU-4: PedidoID, Monto y Método de Pago son obligatorios.");
        }

        // Criterio HU-4: Validar datos de tarjeta (CVV, fecha, número)
        // --- SIMULACIÓN ---
        // En un proyecto real, aquí se llamaría a una pasarela de pagos
        // (ej. Stripe, PayPal) con los datos completos de la tarjeta.
        // Como no tenemos esos campos, simulamos la validación.

        // Restricción 3.1: "Sólo se aceptarán tarjetas MASTERCARD"
        if (!METODO_PAGO_ACEPTADO.equalsIgnoreCase(pago.getMetodoPago())) {

            // Si el método no es MASTERCARD, el pago falla.
            pago.setEstado(Pago.EstadoPago.FALLIDO);
            pago.setFecha(LocalDateTime.now()); // Registramos la fecha del intento

            // Guardamos el intento fallido
            return pagoRepository.save(pago);

            // (Alternativamente, podríamos lanzar una excepción, pero
            // registrar el fallo es mejor trazabilidad)
            // throw new IllegalArgumentException("Error Restricción 3.1: Método de pago no válido. Solo se acepta MASTERCARD.");
        }

        // Restricción 3.2: Monto en USD (se asume que el montoTotal ya viene en USD)
        if (pago.getMontoTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Error HU-4: El monto debe ser positivo.");
        }

        // --- Fin de la Simulación ---

        // Si todas las validaciones (incluyendo la simulación de pasarela)
        // y la restricción de MASTERCARD pasan:

        pago.setEstado(Pago.EstadoPago.EXITOSO);
        pago.setFecha(LocalDateTime.now());

        // Criterio HU-4: "El pago debe ser almacenado en un JSON."
        // (El repositorio en memoria simula esto)
        return pagoRepository.save(pago);
    }
}
