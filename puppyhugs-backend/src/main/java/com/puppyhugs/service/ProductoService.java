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

  // Spring inyectará la instancia única (Singleton) de ProductoRepository
  @Autowired
  private ProductoRepository productoRepository;

  /**
   * Registra un nuevo producto (Implementa HU-1).
   *
   * @param producto El producto a registrar.
   * @return El producto guardado con su ID asignado.
   * @throws IllegalArgumentException Si el producto viola las reglas de negocio.
   */
  public Producto registrarProducto(Producto producto) {

    // Criterio de Aceptación HU-1: "No debe permitir el registro de productos
    // con el mismo nombre o código interno."

    // 1. Validar Nombre duplicado
    if (productoRepository.findByNombre(producto.getNombre()).isPresent()) {
      throw new IllegalArgumentException("Error HU-1: El nombre de producto '" + producto.getNombre() + "' ya existe.");
    }

    // 2. Validar Código Interno duplicado
    if (productoRepository.findByCodigoInterno(producto.getCodigoInterno()).isPresent()) {
      throw new IllegalArgumentException("Error HU-1: El código interno '" + producto.getCodigoInterno() + "' ya existe.");
    }

    // Criterio HU-1: "Validar que los campos obligatorios (...) no estén vacíos."
    // (Esto se validará mejor en el Controller/DTO, pero una validación simple aquí es buena)
    if (producto.getNombre() == null || producto.getNombre().isBlank() ||
      producto.getCodigoInterno() == null || producto.getCodigoInterno().isBlank() ||
      producto.getCategoria() == null ||
      producto.getPrecio() == null ||
      producto.getEstado() == null) {

      throw new IllegalArgumentException("Error HU-1: Faltan campos obligatorios.");
    }

    // Criterio HU-1: "El producto debe ser almacenado en un JSON."
    // (Nuestro Repository simula esto. Al guardarlo, se cumple la lógica)

    return productoRepository.save(producto);
  }

  /**
   * Servicio para obtener todos los productos.
   * (Este no es parte de la HU-1, pero será útil para el Controller).
   */
  public List<Producto> obtenerTodosLosProductos() {
    return productoRepository.findAll();
  }
}
