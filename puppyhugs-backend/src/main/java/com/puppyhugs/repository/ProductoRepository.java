package com.puppyhugs.repository;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.puppyhugs.model.Producto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


/**
 * ITERACIÓN 2: Repositorio Refactorizado.
 *
 * ¡Miren qué limpio! Ya no hay lógica de archivos.
 * Solo se "hereda" (extends) de la plantilla AbstractJsonFileRepository
 * y se le proporciona las 4 cosas que pide.
 */
@Repository
public class ProductoRepository extends AbstractJsonFileRepository<Producto> {


  /**
   * Constructor:
   * Recibe las dependencias (ObjectMapper y la ruta) de Spring...
   */
  public ProductoRepository(ObjectMapper objectMapper, @Value("${json.database.path}") String dbPath) {
    // ...y se las pasa a la plantilla "padre" (super).
    super(objectMapper, dbPath);
  }


  // --- TAREA 1: ¿Cómo se llama tu archivo? ---
  @Override
  protected String getDatabaseFileName() {
    return "productos.json";
  }


  // --- TAREA 2: ¿Cómo se obtiene el ID en este repo concreto? ---
  @Override
  protected Long getId(Producto entity) {
    return entity.getId();
  }


  // --- TAREA 3: ¿Cómo se establece el ID en este repo concreto? ---
  @Override
  protected void setId(Producto entity, Long id) {
    entity.setId(id);
  }


  // --- TAREA 4: ¿Cuál es el "Tipo de Lista" de este repo concreto? ---
  @Override
  protected TypeReference<List<Producto>> getListTypeReference() {
    // Nota: new TypeReference<>() {} es una sintaxis especial
    // de Java para capturar el tipo genérico (List<Producto>).
    return new TypeReference<>() {};
  }




  // --- MÉTODOS CUSTOM (Específicos de Producto) ---

  // Los métodos CRUD (save, findById, findAll) ya vienen "gratis"
  // de la clase abstracta. Solo se necesitan agregar aquellos que son
  // únicos de Producto.


  /**
   * Criterio HU-1: Busca un producto por su Nombre.
   * ¡MUY RÁPIDO! Busca en el caché 'inMemoryDb' heredado.
   */
  public Optional<Producto> findByNombre(String nombre) {
    // 'inMemoryDb' es 'protected' en la clase padre, así que podemos usarlo.
    return this.inMemoryDb.values().stream()
            .filter(p -> p.getNombre().equalsIgnoreCase(nombre))
            .findFirst();
  }


  /**
   * Criterio HU-1: Busca un producto por su CodigoInterno.
   * ¡MUY RÁPIDO! Busca en el caché 'inMemoryDb' heredado.
   */
  public Optional<Producto> findByCodigoInterno(String codigo) {
    return this.inMemoryDb.values().stream()
            .filter(p -> p.getCodigoInterno().equalsIgnoreCase(codigo))
            .findFirst();
  }
}
