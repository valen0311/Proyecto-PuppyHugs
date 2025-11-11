package com.puppyhugs.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

/**
 * DTO para la solicitud de creación de Promoción.
 * Contiene todas las validaciones de entrada de datos.
 */
@Data
public class PromocionRequestDTO {

    @NotBlank(message = "El nombre de la promoción es obligatorio.")
    private String nombre;

    @NotNull(message = "El descuento es obligatorio.")
    // Descuento debe ser al menos 0 (0%)
    @DecimalMin(value = "0.00", inclusive = true, message = "El descuento no puede ser negativo.")
    // Descuento debe ser máximo 0.50 (50%), requisito de la HU-2
    @DecimalMax(value = "0.50", inclusive = true, message = "El descuento máximo permitido es del 50% (0.50).")
    private BigDecimal descuento;

    @NotNull(message = "La fecha de inicio es obligatoria.")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria.")
    private LocalDate fechaFin;

    @NotNull(message = "Debe seleccionar al menos un producto para la promoción.")
    @Size(min = 1, message = "La promoción debe aplicar a al menos un producto.")
    private Set<Long> productoIds;

    // NOTA: La validación de que fechaFin sea posterior a fechaInicio
    // es más compleja y se realizará en el SERVICE.
}