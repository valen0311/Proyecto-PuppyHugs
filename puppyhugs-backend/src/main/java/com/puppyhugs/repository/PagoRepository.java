package com.puppyhugs.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Pago;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Pago.
 * Hereda toda la lógica de persistencia JSON de AbstractJsonFileRepository.
 */
@Repository
public class PagoRepository extends AbstractJsonFileRepository<Pago> {

    // Constructor que inyecta ObjectMapper y la ruta de la DB
    public PagoRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }

    // 1. Tarea: Nombre del archivo
    @Override
    protected String getDatabaseFileName() {
        return "pagos.json"; // <--- Archivo donde se guardarán los pagos
    }

    // 2. Tarea: Obtener ID
    @Override
    protected Long getId(Pago entity) {
        return entity.getId();
    }

    // 3. Tarea: Establecer ID
    @Override
    protected void setId(Pago entity, Long id) {
        entity.setId(id);
    }

    // 4. Tarea: Tipo de Lista para deserialización
    @Override
    protected TypeReference<List<Pago>> getListTypeReference() {
        return new TypeReference<>() {};
    }

    // No se requieren métodos custom para la HU-4 (solo registrar y guardar)
}