package com.puppyhugs.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Promocion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Promocion.
 * Hereda toda la lógica de persistencia JSON de AbstractJsonFileRepository.
 */
@Repository
public class PromocionRepository extends AbstractJsonFileRepository<Promocion> {

  // Constructor que inyecta ObjectMapper y la ruta
  public PromocionRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
    super(objectMapper, dbPath);
  }

  // 1. Tarea: Nombre del archivo
  @Override
  protected String getDatabaseFileName() {
    return "promociones.json";
  }

  // 2. Tarea: Obtener ID
  @Override
  protected Long getId(Promocion entity) {
    return entity.getId();
  }

  // 3. Tarea: Establecer ID
  @Override
  protected void setId(Promocion entity, Long id) {
    entity.setId(id);
  }

  // 4. Tarea: Tipo de Lista para deserialización
  @Override
  protected TypeReference<List<Promocion>> getListTypeReference() {
    return new TypeReference<>() {};
  }

  // --- MÉTODOS CUSTOM ---

  /**
   * Busca una promoción por su nombre.
   * Necesario para el requisito de unicidad (no duplicados).
   */
  public Optional<Promocion> findByNombre(String nombre) {
    return this.inMemoryDb.values().stream()
            .filter(p -> p.getNombre().equalsIgnoreCase(nombre))
            .findFirst();
  }
}
