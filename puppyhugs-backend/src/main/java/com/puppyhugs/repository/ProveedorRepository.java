package com.puppyhugs.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Proveedor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Proveedor.
 */
@Repository
public class ProveedorRepository extends AbstractJsonFileRepository<Proveedor> {

    public ProveedorRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }

    @Override
    protected String getDatabaseFileName() {
        return "proveedores.json";
    }

    @Override
    protected Long getId(Proveedor entity) {
        return entity.getId();
    }

    @Override
    protected void setId(Proveedor entity, Long id) {
        entity.setId(id);
    }

    @Override
    protected TypeReference<List<Proveedor>> getListTypeReference() {
        return new TypeReference<>() {};
    }

    // --- MÉTODOS CUSTOM NECESARIOS PARA VALIDACIÓN DE UNICIDAD ---

    /**
     * Busca un proveedor por su Identificación Fiscal (debe ser único).
     */
    public Optional<Proveedor> findByIdentificacionFiscal(String identificacionFiscal) {
        return this.inMemoryDb.values().stream()
                .filter(p -> p.getIdentificacionFiscal().equalsIgnoreCase(identificacionFiscal))
                .findFirst();
    }

    /**
     * Busca un proveedor por su Correo Electrónico (debe ser único).
     */
    public Optional<Proveedor> findByCorreoElectronico(String correo) {
        return this.inMemoryDb.values().stream()
                .filter(p -> p.getCorreoElectronico().equalsIgnoreCase(correo))
                .findFirst();
    }
}