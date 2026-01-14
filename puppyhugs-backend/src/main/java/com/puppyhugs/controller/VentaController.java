package com.puppyhugs.controller;

import com.puppyhugs.dto.VentaRequestDTO;
import com.puppyhugs.model.Venta;
import com.puppyhugs.service.VentaService;
// --- NUEVOS IMPORTS ---
import com.puppyhugs.service.FacturaService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
// ----------------------
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    // Inyectamos el servicio de facturación
    @Autowired
    private FacturaService facturaService;

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

    /**
     * Endpoint para anular una venta y devolver los productos al stock.
     * Escucha peticiones PUT en "/api/ventas/{ventaId}/anular".
     * @param ventaId ID de la venta a anular
     * @return 200 OK con la venta actualizada con estado CANCELADA.
     */
    @PutMapping("/{ventaId}/anular")
    public ResponseEntity<?> anularVenta(@PathVariable Long ventaId) {
        try {
            Venta ventaAnulada = ventaService.anularVenta(ventaId);
            return ResponseEntity.ok(ventaAnulada);

        } catch (IllegalArgumentException e) {
            // Manejo de errores: venta no existe.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para generar y descargar la factura en PDF.
     * GET /api/ventas/{ventaId}/factura
     */
    @GetMapping("/{ventaId}/factura")
    public ResponseEntity<byte[]> generarFactura(@PathVariable Long ventaId) {
        try {
            // Llamamos al servicio para crear los bytes del PDF
            byte[] pdfBytes = facturaService.generarFacturaPDF(ventaId);

            // Configuramos los encabezados para la descarga
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // "attachment" fuerza la descarga, "filename" pone el nombre del archivo
            headers.setContentDispositionFormData("attachment", "factura-" + ventaId + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (IllegalArgumentException e) {
            // Si la venta no existe o hay un error de validación
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            // Error interno al generar el PDF (ej. error de iText)
            e.printStackTrace(); // Es bueno loguear el error en consola
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // --- Método de Conversión ---
    private Venta convertDtoToModel(VentaRequestDTO dto) {
        Venta venta = new Venta();
        venta.setClienteId(dto.getClienteId());
        venta.setProductos(dto.getProductos());
        // El total, estado y fecha se configuran en el Service
        return venta;
    }
}