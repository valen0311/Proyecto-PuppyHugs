package com.puppyhugs.service;

import com.puppyhugs.model.Proveedor;
import com.puppyhugs.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para la lógica de negocio de Proveedores.
 * Implementa las reglas definidas en la HU-5.
 */
@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    /**
     * Registra un nuevo proveedor (Implementa HU-5).
     *
     * @param proveedor El proveedor a registrar.
     * @return El proveedor guardado con su ID.
     * @throws IllegalArgumentException Si el proveedor viola las reglas de negocio.
     */
    public Proveedor registrarProveedor(Proveedor proveedor) {

        // Criterio HU-5: "Todos los campos requeridos deben completarse"
        // Validamos los campos clave
        if (proveedor.getRazonSocial() == null || proveedor.getRazonSocial().isBlank() ||
                proveedor.getIdentificacionFiscal() == null || proveedor.getIdentificacionFiscal().isBlank() ||
                proveedor.getCorreoElectronico() == null || proveedor.getCorreoElectronico().isBlank()) {

            throw new IllegalArgumentException("Error HU-5: Razón Social, ID Fiscal y Correo son obligatorios.");
        }

        // Criterio HU-5: "El sistema no debe permitir el registro de proveedores
        // con la misma identificación fiscal o correo electrónico."
        Optional<Proveedor> duplicado = proveedorRepository.findByIdentificacionFiscalOrCorreoElectronico(
                proveedor.getIdentificacionFiscal(),
                proveedor.getCorreoElectronico()
        );

        if (duplicado.isPresent()) {
            throw new IllegalArgumentException("Error HU-5: Ya existe un proveedor con esa identificación fiscal o correo electrónico.");
        }

        // Criterio HU-5: "El proveedor debe ser almacenado en un JSON."
        // (El repositorio en memoria simula esto)
        return proveedorRepository.save(proveedor);
    }

    /**
     * Obtiene la lista de todos los proveedores.
     * (Útil para futuras HU del Sprint 2).
     */
    public List<Proveedor> getProveedores() {
        return proveedorRepository.findAll();
    }
}