package com.puppyhugs.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Map;

/**
 * DTO para la solicitud de creación de una Venta/Pedido (Implementa HU-5).
 * Contiene las validaciones de entrada de datos.
 */
@Data
public class VentaRequestDTO {

    @NotNull(message = "El ID del cliente es obligatorio.")
    @Min(value = 1, message = "El ID del cliente debe ser un número positivo.")
    private Long clienteId;

    @NotNull(message = "El pedido debe contener al menos un producto.")
    @Size(min = 1, message = "Debe seleccionar al menos un producto para la venta.")
    // Usamos el mismo formato que en el Model: ProductoID -> Cantidad
    private Map<Long, Integer> productos;
}