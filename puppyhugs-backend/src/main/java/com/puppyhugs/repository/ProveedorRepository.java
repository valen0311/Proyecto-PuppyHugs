package com.puppyhugs.repository;

import com.puppyhugs.model.Proveedor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio en memoria para la entidad Proveedor.
 * Simula la persistencia en un archivo JSON (HU-5).
 */
@Repository
public class ProveedorRepository {

    // "Base de datos" de proveedores
    private final Map<Long, Proveedor> proveedorDb = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    /**
     * Guarda un proveedor (nuevo o existente).
     * Asigna un ID si es nuevo.
     */
    public Proveedor save(Proveedor proveedor) {
        if (proveedor.getId() == null) {
            proveedor.setId(idCounter.incrementAndGet());
        }
        proveedorDb.put(proveedor.getId(), proveedor);
        return proveedor;
    }

    /**
     * Devuelve todos los proveedores.
     */
    public List<Proveedor> findAll() {
        return List.copyOf(proveedorDb.values());
    }

    /**
     * Busca un proveedor por su ID.
     */
    public Optional<Proveedor> findById(Long id) {
        return Optional.ofNullable(proveedorDb.get(id));
    }

    /**
     * Criterio HU-5: Busca un proveedor por Identificación Fiscal O Correo Electrónico.
     * Usado para validar duplicados.
     */
    public Optional<Proveedor> findByIdentificacionFiscalOrCorreoElectronico(
            String identificacionFiscal, String correoElectronico) {

        return proveedorDb.values().stream()
                .filter(p -> p.getIdentificacionFiscal().equalsIgnoreCase(identificacionFiscal) ||
                        p.getCorreoElectronico().equalsIgnoreCase(correoElectronico))
                .findFirst();
    }
}