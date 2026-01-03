package com.puppyhugs.service;

import com.puppyhugs.model.Proveedor;
import com.puppyhugs.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    /**
     * Obtiene un proveedor por ID.
     */
    public Optional<Proveedor> getProveedorById(Long id) {
        return proveedorRepository.findById(id);
    }

    /**
     * Actualiza un proveedor existente.
     * @param id El ID del proveedor a actualizar.
     * @param proveedorActualizado Los datos actualizados del proveedor.
     * @return El proveedor actualizado.
     * @throws IllegalArgumentException Si el proveedor no existe o hay conflicto de unicidad.
     */
    public Proveedor actualizarProveedor(Long id, Proveedor proveedorActualizado) {
        Optional<Proveedor> proveedorOptional = proveedorRepository.findById(id);
        
        if (!proveedorOptional.isPresent()) {
            throw new IllegalArgumentException("El proveedor con ID " + id + " no existe.");
        }

        Proveedor proveedorExistente = proveedorOptional.get();

        // Validar Identificación Fiscal si cambió
        if (!proveedorExistente.getIdentificacionFiscal().equals(proveedorActualizado.getIdentificacionFiscal())) {
            if (proveedorRepository.findByIdentificacionFiscal(proveedorActualizado.getIdentificacionFiscal()).isPresent()) {
                throw new IllegalArgumentException("Ya existe un proveedor con la identificación fiscal: " + proveedorActualizado.getIdentificacionFiscal());
            }
        }

        // Validar Correo Electrónico si cambió
        if (!proveedorExistente.getCorreoElectronico().equals(proveedorActualizado.getCorreoElectronico())) {
            if (proveedorRepository.findByCorreoElectronico(proveedorActualizado.getCorreoElectronico()).isPresent()) {
                throw new IllegalArgumentException("Ya existe un proveedor con el correo electrónico: " + proveedorActualizado.getCorreoElectronico());
            }
        }

        // Actualizar campos
        proveedorExistente.setRazonSocial(proveedorActualizado.getRazonSocial());
        proveedorExistente.setIdentificacionFiscal(proveedorActualizado.getIdentificacionFiscal());
        proveedorExistente.setCorreoElectronico(proveedorActualizado.getCorreoElectronico());
        proveedorExistente.setTelefono(proveedorActualizado.getTelefono());
        proveedorExistente.setDireccion(proveedorActualizado.getDireccion());
        proveedorExistente.setTipoProveedor(proveedorActualizado.getTipoProveedor());

        return proveedorRepository.save(proveedorExistente);
    }

    /**
     * Elimina un proveedor por ID.
     */
    public void eliminarProveedor(Long id) {
        if (!proveedorRepository.existsById(id)) {
            throw new IllegalArgumentException("El proveedor con ID " + id + " no existe.");
        }
        proveedorRepository.deleteById(id);
    }
}