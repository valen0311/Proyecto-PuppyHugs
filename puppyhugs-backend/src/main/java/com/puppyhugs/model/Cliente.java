package com.puppyhugs.model;

/**
 * Clase POJO que representa la entidad Cliente.
 * (No es parte del Sprint 1, pero sí del modelo general).
 */
public class Cliente {

    private Long id;
    private String nombreCompleto;
    private String correoElectronico; // Debería ser único
    private String password; // En un sistema real, esto iría hasheado
    private String direccion;
    private String telefono;

    // --- Constructor ---
    public Cliente() {
        // Constructor vacío para JSON
    }

    // --- Getters y Setters (Necesarios) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}