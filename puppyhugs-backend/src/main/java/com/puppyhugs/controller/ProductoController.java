package com.puppyhugs.controller;

import com.puppyhugs.dto.ProductoRequestDTO; // <-- NUEVO: Importar el DTO
import com.puppyhugs.model.Producto;
import com.puppyhugs.service.ProductoService;
import jakarta.validation.Valid; // <-- NUEVO: Importar para activar la validación
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos") // Mapeo base para todos los endpoints de Producto
public class ProductoController {

  @Autowired
  private ProductoService productoService;

  /**
   * Endpoint para la HU-1: Registrar un nuevo Producto.
   *
   * @param productoDTO El DTO enviado por JSON con la validación de campos obligatorios.
   * @return Un ResponseEntity (200 OK o 400 Bad Request).
   */
  @PostMapping
  public ResponseEntity<?> registrarProducto(@Valid @RequestBody ProductoRequestDTO productoDTO) { // <-- CAMBIO CLAVE

    // 1. Convertir el DTO (Datos de Entrada) a el Model (Entidad de Negocio)
    Producto producto = convertDtoToModel(productoDTO); // <-- NUEVO: Conversión

    try {
      // 2. Le pasamos el trabajo al servicio (incluye la validación de DUPLICADOS)
      Producto nuevoProducto = productoService.registrarProducto(producto);

      // 3. Devolvemos la respuesta (200 OK)
      return ResponseEntity.ok(nuevoProducto);

    } catch (IllegalStateException e) { // Cambié a IllegalStateException o usa RuntimeException
      // 4. Manejo de errores de NEGOCIO (ej: Duplicados)
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // --- Método de Conversión ---
  // Es una buena práctica poner esto en una clase 'Mapper', pero para simplicidad, lo ponemos aquí.
  private Producto convertDtoToModel(ProductoRequestDTO dto) {
    Producto producto = new Producto();
    producto.setNombre(dto.getNombre());
    producto.setCodigoInterno(dto.getCodigoInterno());
    producto.setCategoria(dto.getCategoria());
    producto.setCantidadDisponible(dto.getCantidadDisponible());
    producto.setPrecio(dto.getPrecio());
    producto.setEstado(dto.getEstado());
    return producto;
  }

  /**
   * Endpoint para obtener TODOS los productos.
   */
  @GetMapping
  public ResponseEntity<List<Producto>> obtenerTodosLosProductos() {
    List<Producto> productos = productoService.obtenerTodosLosProductos();
    return ResponseEntity.ok(productos);
  }
}