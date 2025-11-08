package com.puppyhugs.repository;


import com.puppyhugs.model.Producto;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio en memoria para la entidad Producto.
 * Simula la persistencia en un archivo JSON (HU-1).
 * Usamos ConcurrentHashMap para ser seguro en ambientes multi-hilo.
 */
@Repository
public class ProductoRepository {

  // Nuestra "base de datos" en memoria
  private final Map<Long, Producto> productoDb = new ConcurrentHashMap<>();

  // Un contador atómico para generar IDs únicos
  private final AtomicLong idCounter = new AtomicLong(0);

  /**
   * Guarda un producto (nuevo o existente).
   * Si el producto es nuevo (ID es null), le asigna un nuevo ID.
   */
  public Producto save(Producto producto) {
    if (producto.getId() == null) {
      // Es un producto nuevo, generamos ID
      producto.setId(idCounter.incrementAndGet());
    }
    // Agregamos o actualizamos en el mapa
    productoDb.put(producto.getId(), producto);
    return producto;
  }

  /**
   * Devuelve todos los productos de la base de datos.
   */
  public List<Producto> findAll() {
    return List.copyOf(productoDb.values());
  }

  /**
   * Busca un producto por su ID.
   */
  public Optional<Producto> findById(Long id) {
    return Optional.ofNullable(productoDb.get(id));
  }

  /**
   * Criterio HU-1: Busca un producto por su Nombre.
   * Es case-insensitive para robustez.
   */
  public Optional<Producto> findByNombre(String nombre) {
    return productoDb.values().stream()
      .filter(p -> p.getNombre().equalsIgnoreCase(nombre))
      .findFirst();
  }

  /**
   * Criterio HU-1: Busca un producto por su CodigoInterno.
   * Es case-insensitive.
   */
  public Optional<Producto> findByCodigoInterno(String codigo) {
    return productoDb.values().stream()
      .filter(p -> p.getCodigoInterno().equalsIgnoreCase(codigo))
      .findFirst();
  }

  // (Opcional: Métodos deleteById, etc. si fueran necesarios)
}