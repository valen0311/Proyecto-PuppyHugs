package com.puppyhugs.repository;


import com.puppyhugs.model.Promocion;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio en memoria para la entidad Promocion.
 * Simula la persistencia en un archivo JSON (HU-2).
 */
@Repository
public class PromocionRepository {

  // "Base de datos" de promociones
  private final Map<Long, Promocion> promocionDb = new ConcurrentHashMap<>();
  private final AtomicLong idCounter = new AtomicLong(0);

  /**
   * Guarda una promoción (nueva o existente).
   * Asigna un ID si es nueva.
   */
  public Promocion save(Promocion promocion) {
    if (promocion.getId() == null) {
      promocion.setId(idCounter.incrementAndGet());
    }
    promocionDb.put(promocion.getId(), promocion);
    return promocion;
  }

  /**
   * Devuelve todas las promociones.
   * Requerido para la HU-3 (Ver lista de promociones).
   */
  public List<Promocion> findAll() {
    return List.copyOf(promocionDb.values());
  }

  /**
   * Busca una promoción por su ID.
   */
  public Optional<Promocion> findById(Long id) {
    return Optional.ofNullable(promocionDb.get(id));
  }

  /**
   * Criterio HU-2: Busca una promoción por su Nombre.
   * Es case-insensitive para robustez.
   */
  public Optional<Promocion> findByNombre(String nombre) {
    return promocionDb.values().stream()
      .filter(p -> p.getNombre().equalsIgnoreCase(nombre))
      .findFirst();
  }

  // (Aquí se podrían agregar métodos de búsqueda por fechas para la HU-3)
}
