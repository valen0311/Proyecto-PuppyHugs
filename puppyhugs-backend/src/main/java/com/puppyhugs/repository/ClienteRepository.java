package com.puppyhugs.repository;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Cliente;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


/**
 * ITERACIÓN 3: Implementación completa.
 * Este es el repositorio de Cliente, siguiendo el
 * patrón de la Iteración 2.
 */
@Repository
public class ClienteRepository extends AbstractJsonFileRepository<Cliente> {


    // 1. Constructor que pasa las dependencias al padre
    public ClienteRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }


    // 2. Tarea 1: Nombre del archivo
    @Override
    protected String getDatabaseFileName() {
        return "clientes.json";
    }


    // 3. Tarea 2: Obtener ID
    @Override
    protected Long getId(Cliente entity) {
        return entity.getId();
    }


    // 4. Tarea 3: Establecer ID
    @Override
    protected void setId(Cliente entity, Long id) {
        entity.setId(id);
    }


    // 5. Tarea 4: Tipo de Lista
    @Override
    protected TypeReference<List<Cliente>> getListTypeReference() {
        return new TypeReference<>() {};
    }


    // 6. Métodos Custom (si los tiene)


    /**
     * Busca un cliente por su correo. Necesario para el Login.
     * Busca en el caché en memoria 'inMemoryDb'.
     */
    public Optional<Cliente> findByCorreoElectronico(String correo) {
        return this.inMemoryDb.values().stream()
                .filter(c -> c.getCorreoElectronico().equalsIgnoreCase(correo))
                .findFirst();
    }
}
