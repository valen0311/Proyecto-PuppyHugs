package com.puppyhugs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para la solicitud de registro de Proveedor.
 * NOTA: Se incluyen Getters y Setters explícitos para evitar problemas con la configuración de Lombok.
 */
public class ProveedorRequestDTO {

    @NotBlank(message = "La razón social es obligatoria.")
    private String razonSocial;

    @NotBlank(message = "La identificación fiscal es obligatoria.")
    private String identificacionFiscal;

    @NotBlank(message = "La dirección es obligatoria.")
    private String direccion;

    @NotBlank(message = "El teléfono es obligatorio.")
    private String telefono;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico no es válido.")
    private String correoElectronico;

    @NotBlank(message = "El tipo de proveedor es obligatorio.")
    private String tipoProveedor;

    // --- Getters ---

    public String getRazonSocial() {
        return razonSocial;
    }

    public String getIdentificacionFiscal() {
        return identificacionFiscal;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public String getTipoProveedor() {
        return tipoProveedor;
    }

    // --- Setters ---

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public void setIdentificacionFiscal(String identificacionFiscal) {
        this.identificacionFiscal = identificacionFiscal;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public void setTipoProveedor(String tipoProveedor) {
        this.tipoProveedor = tipoProveedor;
    }
}