package com.puppyhugs.model;

/**
 * Clase POJO que representa la entidad Cliente.
 * AHORA INCLUYE LÓGICA DE ROLES.
 */
public class Cliente {

    /**
     * Enumeración para los roles de usuario.
     * ROL_CLIENTE: Un comprador normal.
     * ROL_ADMIN: Un administrador con permisos elevados.
     */
    public enum Role {
        ROL_CLIENTE,
        ROL_ADMIN
    }

    private Long id;
    private String nombreCompleto;
    private String correoElectronico;
    private String password;
    private String direccion;
    private String telefono;

    // --- CAMPO NUEVO ---
    private Role rol; // Aquí definimos si es Admin o Cliente

    // --- CONSTRUCTOR MODIFICADO ---
    public Cliente() {
        // Por defecto, cualquier cliente nuevo se registra como CLIENTE.
        this.rol = Role.ROL_CLIENTE;
    }

    // --- Getters y Setters (Existentes) ---

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

    // --- GETTER Y SETTER NUEVOS (Para Rol) ---

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }
}