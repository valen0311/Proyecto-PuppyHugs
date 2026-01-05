package com.puppyhugs.service;


import com.puppyhugs.model.Promocion;
import com.puppyhugs.repository.PromocionRepository;
// Importamos el repositorio de Producto para validar que los IDs existan
import com.puppyhugs.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
   * Obtiene la lista de todas las promociones y aplica filtros (Implementa HU-3).
   *
   * @param nombre Filtro opcional por nombre.
   * @param fechaStr Filtro opcional por fecha de actividad (YYYY-MM-DD).
   * @return Lista de promociones filtradas.
   */
  public List<Promocion> getPromociones(String nombre, String fechaStr) {
    // Obtenemos todas las promociones de la base de datos en memoria
    List<Promocion> todasLasPromociones = promocionRepository.findAll();

    // Iniciamos el stream para aplicar los filtros
    return todasLasPromociones.stream()
            // 1. Filtro por Nombre
            .filter(p -> nombre == null || p.getNombre().toLowerCase().contains(nombre.toLowerCase()))
            // 2. Filtro por Fecha (si se proporciona)
            .filter(p -> {
              if (fechaStr == null) {
                return true;
              }
              try {
                // Convertimos la cadena de texto a un objeto LocalDate
                LocalDate fechaFiltro = LocalDate.parse(fechaStr);

                // La promoción es válida si la fecha del filtro está
                // entre (o es igual a) la fecha de inicio y la de fin.
                return !fechaFiltro.isBefore(p.getFechaInicio()) && !fechaFiltro.isAfter(p.getFechaFin());
              } catch (Exception e) {
                // Ignoramos el filtro si la fecha es inválida, o podrías lanzar una excepción.
                return true;
              }
            })
            // 3. Recolectamos la lista final
            .collect(Collectors.toList());
  }

  public Optional<Promocion> getPromocionById(Long id) {
    return promocionRepository.findById(id);
  }

  public Promocion actualizarPromocion(Long id, Promocion promocionActualizada) {
    Optional<Promocion> promocionOptional = promocionRepository.findById(id);

    if (!promocionOptional.isPresent()) {
      throw new IllegalArgumentException("La promoción con ID " + id + " no existe.");
    }

    Promocion promocionExistente = promocionOptional.get();

    // Validar Nombre si cambió
    if (!promocionExistente.getNombre().equals(promocionActualizada.getNombre())) {
      if (promocionRepository.findByNombre(promocionActualizada.getNombre()).isPresent()) {
        throw new IllegalArgumentException("Ya existe una promoción con el nombre: " + promocionActualizada.getNombre());
      }
    }

    // Validar Descuento
    if (promocionActualizada.getDescuento() == null ||
        promocionActualizada.getDescuento().compareTo(new BigDecimal("0.50")) > 0) {
      throw new IllegalArgumentException("El descuento no puede ser nulo o mayor al 50% (0.50).");
    }

    // Validar Fechas
    if (promocionActualizada.getFechaInicio() == null || promocionActualizada.getFechaFin() == null) {
      throw new IllegalArgumentException("Las fechas de inicio y fin son obligatorias.");
    }
    if (promocionActualizada.getFechaInicio().isAfter(promocionActualizada.getFechaFin())) {
      throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin.");
    }

    // Validar Productos
    if (promocionActualizada.getProductoIds() == null || promocionActualizada.getProductoIds().isEmpty()) {
      throw new IllegalArgumentException("La promoción debe estar asociada al menos a un ID de producto.");
    }

    for (Long productoId : promocionActualizada.getProductoIds()) {
      if (productoRepository.findById(productoId).isEmpty()) {
        throw new IllegalArgumentException("El producto con ID " + productoId + " no existe.");
      }
    }

    // Actualizar campos
    promocionExistente.setNombre(promocionActualizada.getNombre());
    promocionExistente.setDescuento(promocionActualizada.getDescuento());
    promocionExistente.setFechaInicio(promocionActualizada.getFechaInicio());
    promocionExistente.setFechaFin(promocionActualizada.getFechaFin());
    promocionExistente.setProductoIds(promocionActualizada.getProductoIds());

    return promocionRepository.save(promocionExistente);
  }

  public void eliminarPromocion(Long id) {
    if (!promocionRepository.existsById(id)) {
      throw new IllegalArgumentException("La promoción con ID " + id + " no existe.");
    }
    promocionRepository.deleteById(id);
  }

  public void eliminarPromocionesConProducto(Long productoId) {
    List<Promocion> promocionesCon = promocionRepository.findAll().stream()
            .filter(p -> p.getProductoIds().contains(productoId))
            .collect(Collectors.toList());

    for (Promocion promocion : promocionesCon) {
      promocionRepository.deleteById(promocion.getId());
    }
  }
}
