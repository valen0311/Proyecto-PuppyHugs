package com.puppyhugs.model;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

/**
 * Clase POJO que representa la entidad Promocion.
 * Contiene los atributos definidos en la HU-2.
 */
public class Promocion {

  private Long id;

  // Criterio HU-2: "Nombre descriptivo único"
  private String nombre;

  // Criterio HU-2: "No debe permitir un descuento mayor al 50%"
  // Se guarda como decimal (ej: 0.25 para 25%)
  private BigDecimal descuento;

  // Criterio HU-2: "Debe tener fechas de inicio y fin definidas"
  private LocalDate fechaInicio;
  private LocalDate fechaFin;

  // Criterio HU-2: "Debe tener al menos un producto (...) asociado"
  // Guardamos solo los IDs de los productos,
  // es más simple para un modelo "JSON" en memoria.
  private Set<Long> productoIds;

  // --- Constructores ---
  public Promocion() {
    // Constructor vacío para JSON
  }

  // --- Getters y Setters (Necesarios) ---

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public BigDecimal getDescuento() {
    return descuento;
  }

  public void setDescuento(BigDecimal descuento) {
    this.descuento = descuento;
  }

  public LocalDate getFechaInicio() {
    return fechaInicio;
  }

  public void setFechaInicio(LocalDate fechaInicio) {
    this.fechaInicio = fechaInicio;
  }

  public LocalDate getFechaFin() {
    return fechaFin;
  }

  public void setFechaFin(LocalDate fechaFin) {
    this.fechaFin = fechaFin;
  }

  public Set<Long> getProductoIds() {
    return productoIds;
  }

  public void setProductoIds(Set<Long> productoIds) {
    this.productoIds = productoIds;
  }
}
