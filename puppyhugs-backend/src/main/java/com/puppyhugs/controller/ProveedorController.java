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