package com.puppyhugs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteLoginDTO {

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "Formato de correo inválido.")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria.")
    private String password;
}