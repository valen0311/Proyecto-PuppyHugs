package com.puppyhugs.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Clase POJO que representa la entidad Venta (o Pedido).
 * Conecta Clientes, Productos y Pagos.
 */
public class Venta {

    private Long id;
    private Long clienteId; // El cliente que realiza la compra

    // Usamos un Mapa para guardar el ID del producto y la cantidad
    // Ej: {ProductoID_1: 2, ProductoID_5: 1}
    private Map<Long, Integer> productos;

    private BigDecimal totalVenta; // Total calculado (en USD)
    private LocalDateTime fecha;
    private EstadoVenta estado;

    // Vinculado al pago una vez que se procesa
    private Long pagoId;

    public enum EstadoVenta {
        PENDIENTE_DE_PAGO,
        PAGADA,
        CANCELADA
    }

    // --- Constructor ---
    public Venta() {
        // Constructor vacío para JSON
    }

    // --- Getters y Setters (Necesarios) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Map<Long, Integer> getProductos() {
        return productos;
    }

    public void setProductos(Map<Long, Integer> productos) {
        this.productos = productos;
    }

    public BigDecimal getTotalVenta() {
        return totalVenta;
    }

    public void setTotalVenta(BigDecimal totalVenta) {
        this.totalVenta = totalVenta;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public EstadoVenta getEstado() {
        return estado;
    }

    public void setEstado(EstadoVenta estado) {
        this.estado = estado;
    }

    public Long getPagoId() {
        return pagoId;
    }

    public void setPagoId(Long pagoId) {
        this.pagoId = pagoId;
    }
}