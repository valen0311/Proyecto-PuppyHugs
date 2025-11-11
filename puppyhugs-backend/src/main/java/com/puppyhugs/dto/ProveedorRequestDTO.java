package com.puppyhugs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para la solicitud de registro de Proveedor.
 */
@Data
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
}