package com.puppyhugs.service;

import com.puppyhugs.model.Producto;
import com.puppyhugs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
}