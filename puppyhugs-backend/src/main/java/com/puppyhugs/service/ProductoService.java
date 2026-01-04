package com.puppyhugs.service;

import com.puppyhugs.model.Producto;
import com.puppyhugs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para la lógica de negocio de Productos.
 * Implementa las reglas definidas en la HU-1.
 */
@Service
public class ProductoService {

  @Autowired
  private ProductoRepository productoRepository;

  /**
   * Registra un nuevo producto (Implementa HU-1).
   *
   * @param producto El producto a registrar (asume que las validaciones de NULO/VACÍO se hicieron en el DTO/Controller).
   * @return El producto guardado con su ID asignado.
   * @throws IllegalStateException Si el producto viola las reglas de negocio (ej. duplicados o restricciones del proyecto).
   */
  public Producto registrarProducto(Producto producto) {

    if (productoRepository.findByNombre(producto.getNombre()).isPresent()) {
      throw new IllegalStateException("Error HU-1: Ya existe un producto con el nombre: '" + producto.getNombre() + "'.");
    }

    if (productoRepository.findByCodigoInterno(producto.getCodigoInterno()).isPresent()) {
      throw new IllegalStateException("Error HU-1: Ya existe un producto con el código interno: '" + producto.getCodigoInterno() + "'.");
    }

    return productoRepository.save(producto);
  }

  /**
   * Servicio para obtener todos los productos.
   */
  public List<Producto> obtenerTodosLosProductos() {
    return productoRepository.findAll();
  }

  /**
   * Obtiene un producto por ID.
   */
  public Optional<Producto> getProductoById(Long id) {
    return productoRepository.findById(id);
  }

  /**
   * Actualiza un producto existente.
   * @param id El ID del producto a actualizar.
   * @param productoActualizado Los datos actualizados del producto.
   * @return El producto actualizado.
   * @throws IllegalArgumentException Si el producto no existe o hay conflicto de unicidad.
   */
  public Producto actualizarProducto(Long id, Producto productoActualizado) {
    Optional<Producto> productoOptional = productoRepository.findById(id);

    if (!productoOptional.isPresent()) {
      throw new IllegalArgumentException("El producto con ID " + id + " no existe.");
    }

    Producto productoExistente = productoOptional.get();

    // Validar Nombre si cambió
    if (!productoExistente.getNombre().equals(productoActualizado.getNombre())) {
      if (productoRepository.findByNombre(productoActualizado.getNombre()).isPresent()) {
        throw new IllegalArgumentException("Ya existe un producto con el nombre: " + productoActualizado.getNombre());
      }
    }

    // Validar Código Interno si cambió
    if (!productoExistente.getCodigoInterno().equals(productoActualizado.getCodigoInterno())) {
      if (productoRepository.findByCodigoInterno(productoActualizado.getCodigoInterno()).isPresent()) {
        throw new IllegalArgumentException("Ya existe un producto con el código interno: " + productoActualizado.getCodigoInterno());
      }
    }

    // Actualizar campos
    productoExistente.setNombre(productoActualizado.getNombre());
    productoExistente.setCodigoInterno(productoActualizado.getCodigoInterno());
    productoExistente.setCategoria(productoActualizado.getCategoria());
    productoExistente.setCantidadDisponible(productoActualizado.getCantidadDisponible());
    productoExistente.setPrecio(productoActualizado.getPrecio());
    productoExistente.setEstado(productoActualizado.getEstado());

    return productoRepository.save(productoExistente);
  }

  /**
   * Elimina un producto por ID.
   */
  public void eliminarProducto(Long id) {
    if (!productoRepository.existsById(id)) {
      throw new IllegalArgumentException("El producto con ID " + id + " no existe.");
    }
    productoRepository.deleteById(id);
  }
}