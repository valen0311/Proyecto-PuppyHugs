package com.puppyhugs.repository;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Pago;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;


import java.util.List;


/**
 * ITERACIÓN 3: Implementación completa.
 * Repositorio de Pago. No tiene métodos custom.
 */
@Repository
public class PagoRepository extends AbstractJsonFileRepository<Pago> {


    public PagoRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }


    @Override
    protected String getDatabaseFileName() {
        return "pagos.json";
    }


    @Override
    protected Long getId(Pago entity) {
        return entity.getId();
    }


    @Override
    protected void setId(Pago entity, Long id) {
        entity.setId(id);
    }


    @Override
    protected TypeReference<List<Pago>> getListTypeReference() {
        return new TypeReference<>() {};
    }

    // No necesita métodos custom (al menos de acuerdo a lo que llevan modelado).
}


