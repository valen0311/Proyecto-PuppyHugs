package com.puppyhugs.repository;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Venta;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.stream.Collectors;


/**
 * ITERACIÓN 2: Repositorio Refactorizado.
 *
 * Al igual que ProductoRepository, esta clase ahora es
 * súper simple y solo define su comportamiento específico.
 */
@Repository
public class VentaRepository extends AbstractJsonFileRepository<Venta> {


    /**
     * Constructor: Pasa las dependencias al padre (super).
     */
    public VentaRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }


    // --- TAREA 1: ¿Cómo se llama tu archivo? ---
    @Override
    protected String getDatabaseFileName() {
        return "ventas.json";
    }


    // --- TAREA 2: ¿Cómo obtengo el ID? ---
    @Override
    protected Long getId(Venta entity) {
        return entity.getId();
    }


    // --- TAREA 3: ¿Cómo establezco el ID? ---
    @Override
    protected void setId(Venta entity, Long id) {
        entity.setId(id);
    }


    // --- TAREA 4: ¿Cuál es tu "Tipo de Lista"? ---
    @Override
    protected TypeReference<List<Venta>> getListTypeReference() {
        return new TypeReference<>() {};
    }


    // --- MÉTODOS CUSTOM (Específicos de Venta) ---


    /**
     * Busca ventas por el ID del cliente.
     * ¡MUY RÁPIDO! Busca en el caché 'inMemoryDb' heredado.
     */
    public List<Venta> findByClienteId(Long clienteId) {
        return this.inMemoryDb.values().stream()
                .filter(venta -> venta.getClienteId().equals(clienteId))
                .collect(Collectors.toList());
    }
}

