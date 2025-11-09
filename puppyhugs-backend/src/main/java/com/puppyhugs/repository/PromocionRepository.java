package com.puppyhugs.repository;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Promocion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


/**
 * ITERACIÓN 3: Implementación completa.
 * Repositorio de Promocion.
 */
@Repository
public class PromocionRepository extends AbstractJsonFileRepository<Promocion> {


  public PromocionRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
    super(objectMapper, dbPath);
  }


  @Override
  protected String getDatabaseFileName() {
    return "promociones.json";
  }


  @Override
  protected Long getId(Promocion entity) {
    return entity.getId();
  }


  @Override
  protected void setId(Promocion entity, Long id) {
    entity.setId(id);
  }


  @Override
  protected TypeReference<List<Promocion>> getListTypeReference() {
    return new TypeReference<>() {};
  }


  // --- Métodos Custom ---


  /**
   * Criterio HU-2: Busca una promoción por su Nombre.
   */
  public Optional<Promocion> findByNombre(String nombre) {
    return this.inMemoryDb.values().stream()
            .filter(p -> p.getNombre().equalsIgnoreCase(nombre))
            .findFirst();
  }
}


