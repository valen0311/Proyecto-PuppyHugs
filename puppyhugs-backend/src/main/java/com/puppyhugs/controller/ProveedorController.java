package com.puppyhugs.controller;

import com.puppyhugs.model.Proveedor;
import com.puppyhugs.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar la entidad Proveedor.
 * Expone el endpoint para HU-5.
 */
@RestController
// Angular llamará a "http://localhost:8080/api/proveedores"
@RequestMapping("/api/proveedores")
public class ProveedorController {

    // 1. Inyectamos el Servicio de Proveedor
    @Autowired
    private ProveedorService proveedorService;

    /**
     * Endpoint para la HU-5: Registrar un nuevo Proveedor.
     * Escucha peticiones POST en "/api/proveedores".
     *
     * @param proveedor El JSON enviado por Angular, convertido automáticamente
     * a un objeto Proveedor por Spring (@RequestBody).
     * @return Un ResponseEntity:
     * - 200 OK (éxito) con el proveedor creado (JSON).
     * - 400 Bad Request (error) con un mensaje (JSON).
     */
    @PostMapping
    public ResponseEntity<?> registrarProveedor(@RequestBody Proveedor proveedor) {
        try {
            // 2. Le pasamos el trabajo al servicio
            // Aquí se ejecutan las validaciones (HU-5):
            // - Campos obligatorios
            // - ID Fiscal o Correo únicos
            Proveedor nuevoProveedor = proveedorService.registrarProveedor(proveedor);

            // 3. Devolvemos la respuesta
            // Spring convierte "nuevoProveedor" a JSON automáticamente
            return ResponseEntity.ok(nuevoProveedor);

        } catch (IllegalArgumentException e) {

            // 4. Manejo de errores
            // Si el servicio lanza una excepción (ej: ID Fiscal duplicado)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener TODOS los proveedores.
     * (Útil para futuras vistas de Angular).
     * Escucha peticiones GET en "/api/proveedores".
     *
     * @return Una lista de todos los proveedores en formato JSON.
     */
    @GetMapping
    public ResponseEntity<List<Proveedor>> getProveedores() {
        List<Proveedor> proveedores = proveedorService.getProveedores();
        return ResponseEntity.ok(proveedores);
    }
}