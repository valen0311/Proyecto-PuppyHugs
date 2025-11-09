package com.puppyhugs.controller;

import com.puppyhugs.model.Promocion;
import com.puppyhugs.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar la entidad Promocion.
 * Expone los endpoints para HU-2 y HU-3.
 */
@RestController
// Angular llamará a "http://localhost:8080/api/promociones"
@RequestMapping("/api/promociones")
public class PromocionController {

    // 1. Inyectamos el Servicio de Promoción
    @Autowired
    private PromocionService promocionService;

    /**
     * Endpoint para la HU-2: Crear una nueva Promoción.
     * Escucha peticiones POST en "/api/promociones".
     *
     * @param promocion El JSON enviado por Angular, convertido automáticamente
     * a un objeto Promocion por Spring (@RequestBody).
     * @return Un ResponseEntity:
     * - 200 OK (éxito) con la promoción creada (JSON).
     * - 400 Bad Request (error) con un mensaje (JSON).
     */
    @PostMapping
    public ResponseEntity<?> crearPromocion(@RequestBody Promocion promocion) {
        try {
            // 2. Le pasamos el trabajo al servicio
            // Aquí se ejecutan las validaciones (HU-2):
            // - Nombre único
            // - Descuento <= 50%
            // - Fechas válidas
            // - Al menos 1 producto
            Promocion nuevaPromocion = promocionService.crearPromocion(promocion);

            // 3. Devolvemos la respuesta
            // Spring convierte "nuevaPromocion" a JSON automáticamente
            return ResponseEntity.ok(nuevaPromocion);

        } catch (IllegalArgumentException e) {

            // 4. Manejo de errores
            // Si el servicio lanza una excepción (ej: nombre duplicado)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para la HU-3: Ver lista de promociones.
     * Escucha peticiones GET en "/api/promociones".
     *
     * @return Una lista de todas las promociones en formato JSON.
     */
    @GetMapping
    public ResponseEntity<List<Promocion>> getPromociones() {
        // 2. El servicio nos da la lista
        List<Promocion> promociones = promocionService.getPromociones();

        // 3. Devolvemos la lista (Spring la convierte a JSON)
        return ResponseEntity.ok(promociones);

        // (Nota: Para cumplir 100% la HU-3, que habla de filtros,
        // este método @GetMapping podría recibir @RequestParams,
        // pero para el Sprint 1, devolver la lista completa es lo esencial).
    }
}