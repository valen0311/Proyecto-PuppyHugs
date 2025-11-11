package com.puppyhugs.controller;

import com.puppyhugs.dto.PromocionRequestDTO;
import com.puppyhugs.model.Promocion;
import com.puppyhugs.service.PromocionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/promociones")
public class PromocionController {

    @Autowired
    private PromocionService promocionService;

    /**
     * Endpoint para crear una nueva Promoción (Implementa HU-2).
     * Escucha peticiones POST en "/api/promociones".
     *
     * @param promocionDTO DTO con los datos de la promoción y los IDs de producto.
     * @return 200 OK con la promoción creada o 400 Bad Request si falla alguna regla.
     */
    @PostMapping
    public ResponseEntity<?> crearPromocion(@Valid @RequestBody PromocionRequestDTO promocionDTO) {

        Promocion promocion = convertDtoToModel(promocionDTO);

        try {
            Promocion nuevaPromocion = promocionService.crearPromocion(promocion);

            return ResponseEntity.ok(nuevaPromocion);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Método de Conversión ---
    private Promocion convertDtoToModel(PromocionRequestDTO dto) {
        Promocion promocion = new Promocion();
        promocion.setNombre(dto.getNombre());
        promocion.setDescuento(dto.getDescuento());
        promocion.setFechaInicio(dto.getFechaInicio());
        promocion.setFechaFin(dto.getFechaFin());
        promocion.setProductoIds(dto.getProductoIds());
        return promocion;
    }

    /**
     * Endpoint para obtener la lista de promociones (Implementa HU-3).
     * Permite filtrar por nombre o por rango de fechas.
     * Escucha peticiones GET en "/api/promociones".
     *
     * @param nombre Opcional. Filtra por parte del nombre de la promoción.
     * @param fecha Opcional. Devuelve promociones activas en esta fecha (Formato YYYY-MM-DD).
     * @return Lista de promociones filtradas o todas si no hay parámetros.
     */
    @GetMapping
    public ResponseEntity<List<Promocion>> getPromociones(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String fecha) {

        List<Promocion> promociones = promocionService.getPromociones(nombre, fecha);
        return ResponseEntity.ok(promociones);
    }
}