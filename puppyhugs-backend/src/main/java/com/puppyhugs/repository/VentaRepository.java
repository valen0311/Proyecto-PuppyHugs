package com.puppyhugs.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Venta;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Venta.
 * Hereda toda la lógica de persistencia JSON de AbstractJsonFileRepository.
 */
@Repository
public class VentaRepository extends AbstractJsonFileRepository<Venta> {

    // Constructor que inyecta ObjectMapper y la ruta de la DB
    public VentaRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }

    // 1. Tarea: Nombre del archivo
    @Override
    protected String getDatabaseFileName() {
        return "ventas.json"; // Archivo donde se guardarán las ventas
    }

    // 2. Tarea: Obtener ID
    @Override
    protected Long getId(Venta entity) {
        return entity.getId();
    }

    // 3. Tarea: Establecer ID
    @Override
    protected void setId(Venta entity, Long id) {
        entity.setId(id);
    }

    // 4. Tarea: Tipo de Lista para deserialización
    @Override
    protected TypeReference<List<Venta>> getListTypeReference() {
        return new TypeReference<>() {};
    }
}