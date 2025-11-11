package com.puppyhugs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para la solicitud de registro de Cliente.
 * Contiene solo los datos que el usuario debe enviar para crear su cuenta.
 * Las validaciones aquí garantizan que el Controller reciba datos limpios.
 */
@Data // Genera Getters, Setters, toString, etc.
@NoArgsConstructor // Necesario para la deserialización JSON
public class ClienteRequestDTO {

    @NotBlank(message = "El nombre completo es obligatorio.")
    private String nombreCompleto;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico no es válido.")
    private String correoElectronico;

    // La contraseña debe tener al menos 6 caracteres por seguridad básica.
    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
    private String password;

    @NotBlank(message = "La dirección de residencia es obligatoria.")
    private String direccion;

    @NotBlank(message = "El número de teléfono es obligatorio.")
    private String telefono;

    // NOTA: El campo 'rol' no se incluye aquí porque es asignado automáticamente
    // a ROL_CLIENTE en el Model o en el Service, NO debe venir del usuario.
}