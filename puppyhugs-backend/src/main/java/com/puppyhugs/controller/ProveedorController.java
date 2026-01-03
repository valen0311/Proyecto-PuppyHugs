package com.puppyhugs.controller;

import com.puppyhugs.dto.ProveedorRequestDTO;
import com.puppyhugs.model.Proveedor;
import com.puppyhugs.service.ProveedorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    /**
     * Endpoint para registrar un nuevo proveedor.
     */
    @PostMapping
    public ResponseEntity<?> registrarProveedor(@Valid @RequestBody ProveedorRequestDTO proveedorDTO) {

        // 1. Mapeo DTO -> Model
        Proveedor proveedor = convertDtoToModel(proveedorDTO);

        try {
            // 2. Lógica de Negocio (validación de unicidad y guardado)
            Proveedor nuevoProveedor = proveedorService.registrarProveedor(proveedor);

            // 3. Respuesta exitosa
            return ResponseEntity.ok(nuevoProveedor);
        } catch (IllegalArgumentException e) {
            // 4. Manejo de errores de negocio (unicidad violada)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener todos los proveedores.
     */
    @GetMapping
    public ResponseEntity<List<Proveedor>> getProveedores() {
        return ResponseEntity.ok(proveedorService.getProveedores());
    }

    /**
     * Endpoint para obtener un proveedor por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProveedorById(@PathVariable Long id) {
        return proveedorService.getProveedorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para actualizar un proveedor existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProveedor(@PathVariable Long id, @Valid @RequestBody ProveedorRequestDTO proveedorDTO) {
        
        Proveedor proveedorActualizado = convertDtoToModel(proveedorDTO);

        try {
            Proveedor proveedor = proveedorService.actualizarProveedor(id, proveedorActualizado);
            return ResponseEntity.ok(proveedor);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para eliminar un proveedor por ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarProveedor(@PathVariable Long id) {
        try {
            proveedorService.eliminarProveedor(id);
            return ResponseEntity.ok("Proveedor eliminado correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // --- Método de Conversión ---
    private Proveedor convertDtoToModel(ProveedorRequestDTO dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setRazonSocial(dto.getRazonSocial());
        proveedor.setIdentificacionFiscal(dto.getIdentificacionFiscal());
        proveedor.setDireccion(dto.getDireccion());
        proveedor.setTelefono(dto.getTelefono());
        proveedor.setCorreoElectronico(dto.getCorreoElectronico());
        proveedor.setTipoProveedor(dto.getTipoProveedor());
        return proveedor;
    }
}