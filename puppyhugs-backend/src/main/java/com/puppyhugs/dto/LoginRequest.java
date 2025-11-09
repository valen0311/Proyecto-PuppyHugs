package com.puppyhugs.dto;

/**
 * DTO (Data Transfer Object) para mapear el JSON de la petición de Login.
 * Solo contiene los campos que esperamos recibir de Angular.
 */
public class LoginRequest {

  private String correo;
  private String password;

  // --- Getters y Setters (¡Necesarios para que Spring lea el JSON!) ---

  public String getCorreo() {
    return correo;
  }

  public void setCorreo(String correo) {
    this.correo = correo;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
