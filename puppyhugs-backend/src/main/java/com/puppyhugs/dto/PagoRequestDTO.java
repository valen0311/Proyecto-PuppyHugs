package com.puppyhugs.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO para la solicitud de registro de un Pago (Implementa HU-4).
 * Contiene todas las validaciones de entrada de datos.
 */
@Data
public class PagoRequestDTO {

    @NotNull(message = "El ID del pedido es obligatorio.")
    @Min(value = 1, message = "El ID del pedido debe ser un número positivo.")
    private Long pedidoId;

    @NotNull(message = "El monto total es obligatorio.")
    @DecimalMin(value = "0.01", message = "El monto total debe ser mayor a cero.")
    private BigDecimal montoTotal;

    @NotBlank(message = "El método de pago es obligatorio.")
    // Regla de Negocio (Restricción 3.1): Solo se permite MASTERCARD
    // Usamos el Pattern para forzar la validación de la cadena
    @Pattern(regexp = "MASTERCARD", flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Error HU-4: El único método de pago aceptado es MASTERCARD.")
    private String metodoPago;

    // El estado y la fecha se asignan automáticamente en el Service/Model,
    // por lo que no se incluyen en el DTO de Solicitud (Request).
}