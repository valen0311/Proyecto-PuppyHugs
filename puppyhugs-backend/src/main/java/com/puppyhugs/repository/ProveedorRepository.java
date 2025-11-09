package com.puppyhugs.repository;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Proveedor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


/**
 * ITERACIÓN 3: Implementación completa.
 * Este es el repositorio de Proveedor, siguiendo el
 * patrón de la Iteración 2.
 */
@Repository
public class ProveedorRepository extends AbstractJsonFileRepository<Proveedor> {


    // 1. Constructor
    public ProveedorRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
        super(objectMapper, dbPath);
    }


    // 2. Tarea 1: Nombre del archivo
    @Override
    protected String getDatabaseFileName() {
        return "proveedores.json";
    }


    // 3. Tarea 2: Obtener ID
    @Override
    protected Long getId(Proveedor entity) {
        return entity.getId();
    }


    // 4. Tarea 3: Establecer ID
    @Override
    protected void setId(Proveedor entity, Long id) {
        entity.setId(id);
    }


    // 5. Tarea 4: Tipo de Lista
    @Override
    protected TypeReference<List<Proveedor>> getListTypeReference() {
        return new TypeReference<>() {};
    }


    // 6. Métodos Custom (si los tiene)

    /**
     * Criterio HU-5: Busca un proveedor por ID Fiscal o Correo.
     * Usado para validar duplicados en ProveedorService.
     */
    public Optional<Proveedor> findByIdentificacionFiscalOrCorreoElectronico(
            String identificacionFiscal, String correoElectronico) {


        return this.inMemoryDb.values().stream()
                .filter(p -> p.getIdentificacionFiscal().equalsIgnoreCase(identificacionFiscal) ||
                        p.getCorreoElectronico().equalsIgnoreCase(correoElectronico))
                .findFirst();
    }
}
