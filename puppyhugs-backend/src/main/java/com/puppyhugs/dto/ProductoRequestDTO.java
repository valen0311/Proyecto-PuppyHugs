package com.puppyhugs.dto;

import com.puppyhugs.model.Producto.CategoriaProducto;
import com.puppyhugs.model.Producto.EstadoProducto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import lombok.Data; // Asumo que ya resolviste el error de Lombok 😉

/**
 * DTO (Data Transfer Object) para la solicitud de registro de Producto (HU-1).
 * Contiene solo los datos que el usuario debe enviar.
 */
@Data
public class ProductoRequestDTO {

    // Nombre y Código Interno son únicos y obligatorios (HU-1 y HU-5).
    @NotBlank(message = "El nombre no puede estar vacío.")
    private String nombre;

    @NotBlank(message = "El código interno no puede estar vacío.")
    private String codigoInterno;

    // La categoría es obligatoria y debe ser una de las definidas (ENUM).
    @NotNull(message = "La categoría es obligatoria y debe ser: ARTICULO, MEDICINA, ACCESORIO o JUGUETE.")
    private CategoriaProducto categoria;

    // Cantidad debe ser positiva y es obligatoria.
    @NotNull(message = "La cantidad disponible es obligatoria.")
    @Positive(message = "La cantidad debe ser un número positivo.")
    private Integer cantidadDisponible; // Usamos Integer aquí para que @NotNull funcione en el DTO

    // El precio es obligatorio y debe ser un valor positivo (USD).
    @NotNull(message = "El precio es obligatorio.")
    @Positive(message = "El precio debe ser un número positivo.")
    private BigDecimal precio;

    // El estado es obligatorio.
    @NotNull(message = "El estado es obligatorio y debe ser: ACTIVO o AGOTADO.")
    private EstadoProducto estado;
}