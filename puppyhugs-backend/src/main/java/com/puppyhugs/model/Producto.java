package com.puppyhugs.model;


import java.math.BigDecimal;

/**
 * Clase POJO que representa la entidad Producto.
 * Contiene los atributos definidos en la HU-1.
 */
public class Producto {

  private Long id;
  private String nombre;
  private String codigoInterno;
  private CategoriaProducto categoria;
  private int cantidadDisponible;
  private BigDecimal precio; // Restricción 3.2: en USD
  private EstadoProducto estado;

  // --- Enums requeridos por HU-1 ---

  /**
   * Categorías permitidas para los productos (HU-1)
   */
  public enum CategoriaProducto {
    ARTICULO,
    MEDICINA,
    ACCESORIO,
    JUGUETE
  }

  /**
   * Estados posibles de un producto (HU-1)
   */
  public enum EstadoProducto {
    ACTIVO,
    AGOTADO
  }


  public Producto() {
  }

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

  public String getCodigoInterno() {
    return codigoInterno;
  }

  public void setCodigoInterno(String codigoInterno) {
    this.codigoInterno = codigoInterno;
  }

  public CategoriaProducto getCategoria() {
    return categoria;
  }

  public void setCategoria(CategoriaProducto categoria) {
    this.categoria = categoria;
  }

  public int getCantidadDisponible() {
    return cantidadDisponible;
  }

  public void setCantidadDisponible(int cantidadDisponible) {
    this.cantidadDisponible = cantidadDisponible;
  }

  public BigDecimal getPrecio() {
    return precio;
  }

  public void setPrecio(BigDecimal precio) {
    this.precio = precio;
  }

  public EstadoProducto getEstado() {
    return estado;
  }

  public void setEstado(EstadoProducto estado) {
    this.estado = estado;
  }
}
