package com.puppyhugs.service;

import com.puppyhugs.model.Proveedor;
import com.puppyhugs.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    /**
     * Registra un nuevo proveedor, validando unicidad de campos clave.
     * @param proveedor El proveedor a registrar.
     * @return El proveedor guardado.
     * @throws IllegalArgumentException Si la identificación fiscal o el correo ya existen.
     */
    public Proveedor registrarProveedor(Proveedor proveedor) {

        // 1. Validar Identificación Fiscal (debe ser único)
        if (proveedorRepository.findByIdentificacionFiscal(proveedor.getIdentificacionFiscal()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un proveedor con la identificación fiscal: " + proveedor.getIdentificacionFiscal());
        }

        // 2. Validar Correo Electrónico (debe ser único)
        if (proveedorRepository.findByCorreoElectronico(proveedor.getCorreoElectronico()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un proveedor con el correo electrónico: " + proveedor.getCorreoElectronico());
        }

        // 3. Guardar
        return proveedorRepository.save(proveedor);
    }

    /**
     * Obtiene la lista completa de proveedores.
     */
    public List<Proveedor> getProveedores() {
        return proveedorRepository.findAll();
    }
}