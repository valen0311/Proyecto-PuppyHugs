package com.puppyhugs.controller;

import com.puppyhugs.dto.VentaRequestDTO;
import com.puppyhugs.model.Venta;
import com.puppyhugs.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    /**
     * Endpoint para crear un nuevo Pedido/Venta con estado PENDIENTE_DE_PAGO (Implementa HU-5).
     * Escucha peticiones POST en "/api/ventas".
     *
     * @param ventaDTO DTO con el ID del cliente y los productos/cantidades.
     * @return 200 OK con la Venta creada, el Total Calculado y el Stock Descontado.
     */
    @PostMapping
    public ResponseEntity<?> crearVenta(@Valid @RequestBody VentaRequestDTO ventaDTO) {

        // 1. Mapeo DTO -> Model
        Venta venta = convertDtoToModel(ventaDTO);

        try {
            // 2. Lógica de Negocio (Validación de cliente, productos, stock, cálculo y descuento)
            Venta nuevaVenta = ventaService.crearVenta(venta);

            // 3. Respuesta exitosa
            return ResponseEntity.ok(nuevaVenta);

        } catch (IllegalArgumentException e) {
            // 4. Manejo de errores de negocio (Cliente/Producto no existe, stock insuficiente, etc.)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener todas las ventas/pedidos.
     */
    @GetMapping
    public ResponseEntity<List<Venta>> getVentas() {
        return ResponseEntity.ok(ventaService.getVentas());
    }

    // --- Método de Conversión ---
    private Venta convertDtoToModel(VentaRequestDTO dto) {
        Venta venta = new Venta();
        venta.setClienteId(dto.getClienteId());
        venta.setProductos(dto.getProductos());
        // El total, estado y fecha se configuran en el Service
        return venta;
    }

    /**
     * Endpoint para finalizar una Venta y marcarla como PAGADA (Implementa HU-6).
     * Escucha peticiones PUT en "/api/ventas/{ventaId}/finalizar".
     * @param ventaId ID de la venta a actualizar.
     * @param pagoId ID del pago asociado (enviado como RequestParam).
     * @return 200 OK con la venta actualizada.
     */
    @PutMapping("/{ventaId}/finalizar")
    public ResponseEntity<?> finalizarVenta(
            @PathVariable Long ventaId,
            @RequestParam Long pagoId) {

        try {
            Venta ventaFinalizada = ventaService.finalizarVenta(ventaId, pagoId);
            return ResponseEntity.ok(ventaFinalizada);

        } catch (IllegalArgumentException e) {
            // Manejo de errores: venta no existe, pago no existe o pago falló.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}