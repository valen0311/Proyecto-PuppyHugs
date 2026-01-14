package com.puppyhugs.service;

import com.puppyhugs.model.Pago;
import com.puppyhugs.model.Venta;
import com.puppyhugs.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Autowired
    private VentaService ventaService; // 🆕 Inyectamos el servicio de ventas

    /**
     * Registra un nuevo pago (Implementa HU-4).
     * 🆕 Ahora finaliza automáticamente la venta si el pago es exitoso.
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

        // 🆕 Verificar que la venta existe y obtener sus datos
        Venta venta;
        try {
            List<Venta> ventas = ventaService.getVentas();
            venta = ventas.stream()
                    .filter(v -> v.getId().equals(pago.getPedidoId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("No existe una venta con ID " + pago.getPedidoId()));
        } catch (Exception e) {
            throw new IllegalArgumentException("No existe una venta con ID " + pago.getPedidoId());
        }

        // 🆕 Verificar que el monto del pago coincida con el total de la venta
        if (pago.getMontoTotal().compareTo(venta.getTotalVenta()) != 0) {
            throw new IllegalArgumentException("El monto del pago (" + pago.getMontoTotal() +
                    ") no coincide con el total de la venta (" + venta.getTotalVenta() + ").");
        }

        // Criterio HU-4: Validar datos de tarjeta (CVV, fecha, número)
        // --- SIMULACIÓN ---
        // En un proyecto real, aquí se llamaría a una pasarela de pagos
        // (ej. Stripe, PayPal) con los datos completos de la tarjeta.

        boolean pagoExitoso = false;

        // Restricción 3.1: "Sólo se aceptarán tarjetas MASTERCARD"
        if (!METODO_PAGO_ACEPTADO.equalsIgnoreCase(pago.getMetodoPago())) {
            // Si el método no es MASTERCARD, el pago falla.
            pago.setEstado(Pago.EstadoPago.FALLIDO);
            pago.setFecha(LocalDateTime.now());
            pagoExitoso = false;
        } 
        // Restricción 3.2: Monto en USD (se asume que el montoTotal ya viene en USD)
        else if (pago.getMontoTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Error HU-4: El monto debe ser positivo.");
        } 
        else {
            // Si todas las validaciones pasan
            pago.setEstado(Pago.EstadoPago.EXITOSO);
            pago.setFecha(LocalDateTime.now());
            pagoExitoso = true;
        }

        // Guardamos el pago (exitoso o fallido)
        Pago pagoRegistrado = pagoRepository.save(pago);

        // 🆕 Si el pago fue exitoso, finalizar la venta automáticamente (HU-6)
        if (pagoExitoso) {
            try {
                ventaService.finalizarVenta(pago.getPedidoId(), pagoRegistrado.getId());
            } catch (Exception e) {
                // Si hay error al finalizar la venta, registramos pero no bloqueamos
                System.err.println("Error al finalizar venta: " + e.getMessage());
                // El pago ya está guardado como EXITOSO, pero la venta no se actualizó
            }
        }

        return pagoRegistrado;
    }

    /**
     * Obtiene todos los pagos registrados.
     *
     * @return Lista de todos los pagos
     */
    public List<Pago> obtenerTodosLosPagos() {
        return pagoRepository.findAll();
    }

    /**
     * Obtiene un pago por su ID.
     *
     * @param id El ID del pago
     * @return El pago encontrado
     * @throws IllegalArgumentException Si el pago no existe
     */
    public Pago obtenerPagoPorId(Long id) {
        Optional<Pago> pagoOpt = pagoRepository.findById(id);
        if (pagoOpt.isEmpty()) {
            throw new IllegalArgumentException("Pago con ID " + id + " no encontrado.");
        }
        return pagoOpt.get();
    }

    /**
     * Elimina un pago por su ID.
     * RESTRICCIÓN: No se pueden eliminar pagos con estado EXITOSO.
     *
     * @param id El ID del pago a eliminar
     * @throws IllegalArgumentException Si el pago no existe o si es EXITOSO
     */
    public void eliminarPago(Long id) {
        Pago pago = obtenerPagoPorId(id); // Lanza excepción si no existe

        // Verificar que no sea un pago exitoso
        if (pago.getEstado() == Pago.EstadoPago.EXITOSO) {
            throw new IllegalArgumentException("No se puede eliminar un pago exitoso.");
        }

        pagoRepository.deleteById(id);
    }
}