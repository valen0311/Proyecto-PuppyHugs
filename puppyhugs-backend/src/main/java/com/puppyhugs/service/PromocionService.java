package com.puppyhugs.service;


import com.puppyhugs.model.Promocion;
import com.puppyhugs.repository.PromocionRepository;
// Importamos el repositorio de Producto para validar que los IDs existan
import com.puppyhugs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Servicio para la lógica de negocio de Promociones.
 * Implementa las reglas definidas en la HU-2 y HU-3.
 */
@Service
public class PromocionService {

  @Autowired
  private PromocionRepository promocionRepository;

  // Necesitamos el repo de producto para validar el Criterio 2 de HU-2
  @Autowired
  private ProductoRepository productoRepository;

  /**
   * Crea una nueva promoción (Implementa HU-2).
   *
   * @param promocion La promoción a crear.
   * @return La promoción guardada con su ID.
   * @throws IllegalArgumentException Si la promoción viola las reglas de negocio.
   */
  public Promocion crearPromocion(Promocion promocion) {

    // Criterio HU-2: "Debe tener un nombre descriptivo único"
    if (promocionRepository.findByNombre(promocion.getNombre()).isPresent()) {
      throw new IllegalArgumentException("Error HU-2: Ya existe una promoción con el nombre '" + promocion.getNombre() + "'.");
    }

    // Criterio HU-2: "No debe permitir un descuento mayor al 50%"
    // Usamos un BigDecimal para la comparación
    if (promocion.getDescuento() == null ||
      promocion.getDescuento().compareTo(new BigDecimal("0.50")) > 0) {
      throw new IllegalArgumentException("Error HU-2: El descuento no puede ser nulo o mayor al 50% (0.50).");
    }

    // Criterio HU-2: "Debe tener fechas de inicio y fin definidas"
    if (promocion.getFechaInicio() == null || promocion.getFechaFin() == null) {
      throw new IllegalArgumentException("Error HU-2: Las fechas de inicio y fin son obligatorias.");
    }
    if (promocion.getFechaInicio().isAfter(promocion.getFechaFin())) {
      throw new IllegalArgumentException("Error HU-2: La fecha de inicio no puede ser posterior a la fecha de fin.");
    }

    // Criterio HU-2: "Debe tener al menos un producto (...) asociado"
    if (promocion.getProductoIds() == null || promocion.getProductoIds().isEmpty()) {
      throw new IllegalArgumentException("Error HU-2: La promoción debe estar asociada al menos a un ID de producto.");
    }

    // Validación extra (buena práctica):
    // Verificar que los IDs de productos existan realmente.
    for (Long productoId : promocion.getProductoIds()) {
      if (productoRepository.findById(productoId).isEmpty()) {
        throw new IllegalArgumentException("Error HU-2: El producto con ID " + productoId + " no existe.");
      }
    }

    // Criterio HU-2: "Debe ser almacenada en un JSON."
    // (El repositorio en memoria simula esto)
    return promocionRepository.save(promocion);
  }

  /**
   * Obtiene la lista de todas las promociones (Implementa HU-3).
   *
   * @return Lista de promociones.
   */
  public List<Promocion> getPromociones() {
    // Criterio HU-3: "Debe mostrar la lista de promociones"
    // (La lógica de filtrado y búsqueda de HU-3 se implementaría aquí,
    // modificando este método para aceptar parámetros)
    return promocionRepository.findAll();
  }
}
