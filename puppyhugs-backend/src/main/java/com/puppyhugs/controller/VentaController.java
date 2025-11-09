package com.puppyhugs.controller;

import com.puppyhugs.model.Venta;
import com.puppyhugs.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestBody Venta venta) {
        try {
            Venta nuevaVenta = ventaService.crearVenta(venta);
            return ResponseEntity.ok(nuevaVenta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Venta>> getVentas() {
        List<Venta> ventas = ventaService.getVentas();
        return ResponseEntity.ok(ventas);
    }
}
