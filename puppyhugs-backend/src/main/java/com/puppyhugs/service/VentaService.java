package com.puppyhugs.service;

import com.puppyhugs.model.Cliente;
import com.puppyhugs.model.Producto;
import com.puppyhugs.model.Venta;
import com.puppyhugs.repository.ClienteRepository;
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

    public Venta crearVenta(Venta venta) {
        // Validar que el cliente exista
        Cliente cliente = clienteRepository.findById(venta.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("El cliente con ID " + venta.getClienteId() + " no existe."));

        // ✅ CORREGIDO: Validar el rol del cliente (ahora usa String)
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
}