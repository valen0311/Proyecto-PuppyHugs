package com.puppyhugs.service;

import com.puppyhugs.model.Cliente;
import com.puppyhugs.model.Pago;
import com.puppyhugs.model.Producto;
import com.puppyhugs.model.Venta;
import com.puppyhugs.repository.ClienteRepository;
import com.puppyhugs.repository.PagoRepository;
import com.puppyhugs.repository.ProductoRepository;
import com.puppyhugs.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PagoRepository pagoRepository;

    public Venta crearVenta(Venta venta) {
        // Validar que el cliente exista
        Cliente cliente = clienteRepository.findById(venta.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("El cliente con ID " + venta.getClienteId() + " no existe."));

        // Validar el rol del cliente
        if ("ROL_ADMIN".equals(cliente.getRol())) {
            throw new IllegalArgumentException("Los administradores no pueden realizar compras.");
        }

        // Validar que la venta tenga productos
        if (venta.getProductos() == null || venta.getProductos().isEmpty()) {
            throw new IllegalArgumentException("La venta debe tener al menos un producto.");
        }

        BigDecimal totalCalculado = BigDecimal.ZERO;

        // Validar productos y calcular el total
        for (Map.Entry<Long, Integer> item : venta.getProductos().entrySet()) {
            Long productoId = item.getKey();
            Integer cantidad = item.getValue();

            if (cantidad <= 0) {
                throw new IllegalArgumentException("La cantidad de productos debe ser mayor a 0.");
            }

            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new IllegalArgumentException("El producto con ID " + productoId + " no existe."));

            if (producto.getCantidadDisponible() < cantidad) {
                throw new IllegalArgumentException("No hay suficiente stock para el producto con ID " + productoId + ".");
            }

            totalCalculado = totalCalculado.add(producto.getPrecio().multiply(new BigDecimal(cantidad)));
        }

        // Descontar el stock de los productos
        for (Map.Entry<Long, Integer> item : venta.getProductos().entrySet()) {
            Producto producto = productoRepository.findById(item.getKey()).get();
            producto.setCantidadDisponible(producto.getCantidadDisponible() - item.getValue());
            productoRepository.save(producto);
        }

        // Configurar la venta
        venta.setTotalVenta(totalCalculado);
        venta.setFecha(LocalDateTime.now());
        venta.setEstado(Venta.EstadoVenta.PENDIENTE_DE_PAGO);

        return ventaRepository.save(venta);
    }

    public List<Venta> getVentas() {
        return ventaRepository.findAll();
    }

    /**
     * Finaliza una venta y la marca como PAGADA (Implementa HU-6).
     *
     * @param ventaId ID de la venta a finalizar
     * @param pagoId ID del pago asociado
     * @return La venta actualizada con estado PAGADA
     * @throws IllegalArgumentException si la venta o el pago no existen, o si el pago falló
     */
    public Venta finalizarVenta(Long ventaId, Long pagoId) {
        // 1. Validar que la venta exista
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new IllegalArgumentException("La venta con ID " + ventaId + " no existe."));

        // 2. Validar que el pago exista
        Pago pago = pagoRepository.findById(pagoId)
                .orElseThrow(() -> new IllegalArgumentException("El pago con ID " + pagoId + " no existe."));

        // 3. Validar que el pago esté exitoso
        if (pago.getEstado() != Pago.EstadoPago.EXITOSO) {
            throw new IllegalArgumentException("El pago debe estar EXITOSO para finalizar la venta. Estado actual: " + pago.getEstado());
        }

        // 4. Validar que el monto del pago coincida con el total de la venta
        if (pago.getMontoTotal().compareTo(venta.getTotalVenta()) != 0) {
            throw new IllegalArgumentException("El monto del pago (" + pago.getMontoTotal() +
                    ") no coincide con el total de la venta (" + venta.getTotalVenta() + ").");
        }

        // 5. Actualizar el estado de la venta
        venta.setEstado(Venta.EstadoVenta.PAGADA);
        venta.setPagoId(pagoId);

        // 6. Guardar y retornar
        return ventaRepository.save(venta);
    }
}