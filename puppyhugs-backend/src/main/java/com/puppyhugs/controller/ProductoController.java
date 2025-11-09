package com.puppyhugs.controller;


import com.puppyhugs.model.Producto;
import com.puppyhugs.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar la entidad Producto.
 * Expone los endpoints de la API que consumirá Angular.
 */
@RestController
// Define la URL base para todos los métodos de este controlador
// Angular llamará a "http://localhost:8080/api/productos"
@RequestMapping("/api/productos")
public class ProductoController {

  // 1. Inyectamos el Servicio
  // El controlador NUNCA habla con el Repositorio, habla con el Servicio.
  @Autowired
  private ProductoService productoService;

  /**
   * Endpoint para la HU-1: Registrar un nuevo Producto.
   * Escucha peticiones POST en "/api/productos".
   *
   * @param producto El JSON enviado por Angular, convertido automáticamente
   * a un objeto Producto por Spring (@RequestBody).
   * @return Un ResponseEntity:
   * - 200 OK (éxito) con el producto creado (JSON).
   * - 400 Bad Request (error) con un mensaje (JSON).
   */
  @PostMapping
  public ResponseEntity<?> registrarProducto(@RequestBody Producto producto) {
    try {
      // 2. Le pasamos el trabajo al servicio
      // Aquí es donde se ejecutan las validaciones (HU-1)
      Producto nuevoProducto = productoService.registrarProducto(producto);

      // 3. Devolvemos la respuesta
      // Spring convierte "nuevoProducto" a JSON automáticamente
      return ResponseEntity.ok(nuevoProducto);

    } catch (IllegalArgumentException e) {

      // 4. Manejo de errores
      // Si el servicio lanza una excepción (ej: producto duplicado),
      // la capturamos y la enviamos a Angular como un error 400.
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  /**
   * Endpoint para obtener TODOS los productos.
   * (Aunque no está en el Sprint 1, es esencial para Angular).
   * Escucha peticiones GET en "/api/productos".
   *
   * @return Una lista de todos los productos en formato JSON.
   */
  @GetMapping
  public ResponseEntity<List<Producto>> obtenerTodosLosProductos() {
    List<Producto> productos = productoService.obtenerTodosLosProductos();
    return ResponseEntity.ok(productos);
  }
}