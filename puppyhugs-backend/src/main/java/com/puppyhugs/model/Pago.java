package com.puppyhugs.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Clase POJO que representa la entidad Pago.
 * Contiene los atributos definidos en la HU-4.
 */
public class Pago {

    private Long id;

    // Criterio HU-4: "Debe estar vinculado al pedido"
    private Long pedidoId;

    // Criterio HU-4 y Restricción 3.2: "Monto total de la compra (en USD)"
    private BigDecimal montoTotal;

    // Criterio HU-4: "Fecha y hora del pago"
    private LocalDateTime fecha;

    // Criterio HU-4 y Restricción 3.1: "Método de pago (MASTERCARD)"
    private String metodoPago;

    // Criterio HU-4: "Estado del pago"
    private EstadoPago estado;

    /**
     * Estados posibles de un pago (HU-4)
     */
    public enum EstadoPago {
        EXITOSO,
        FALLIDO,
        PENDIENTE
    }

    // --- Constructor ---
    public Pago() {
        // Constructor vacío para JSON
    }

    // --- Getters y Setters (Necesarios) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public EstadoPago getEstado() {
        return estado;
    }

    public void setEstado(EstadoPago estado) {
        this.estado = estado;
    }
}
