package com.puppyhugs.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Cliente {

    private Long id;
    private String nombreCompleto;
    private String correoElectronico;
    private String password;
    private String direccion;
    private String telefono;

    @JsonProperty("rol") // ⭐ Asegura que Jackson lea "rol" del JSON
    private String rol; // ⭐ String para compatibilidad con JSON

    // Constructor vacío (por defecto es CLIENTE)
    public Cliente() {
        this.rol = "ROL_CLIENTE";
    }

    // Constructor completo
    public Cliente(Long id, String nombreCompleto, String correoElectronico,
                   String password, String direccion, String telefono, String rol) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.correoElectronico = correoElectronico;
        this.password = password;
        this.direccion = direccion;
        this.telefono = telefono;
        this.rol = rol != null ? rol : "ROL_CLIENTE";
    }

    // GETTERS Y SETTERS
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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "id=" + id +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", correoElectronico='" + correoElectronico + '\'' +
                ", rol='" + rol + '\'' +
                '}';
    }
}