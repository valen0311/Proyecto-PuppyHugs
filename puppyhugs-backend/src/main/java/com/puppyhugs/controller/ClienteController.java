package com.puppyhugs.controller;

import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar la entidad Cliente.
 * Expone endpoints para el registro y consulta de clientes.
 */
@RestController
// Angular llamará a "http://localhost:8080/api/clientes"
@RequestMapping("/api/clientes")
public class ClienteController {

    // 1. Inyectamos el Servicio de Cliente
    @Autowired
    private ClienteService clienteService;

    /**
     * Endpoint para registrar un nuevo Cliente (Usuario).
     * Escucha peticiones POST en "/api/clientes".
     *
     * @param cliente El JSON enviado por Angular (del formulario de registro),
     * convertido a un objeto Cliente.
     * @return Un ResponseEntity:
     * - 200 OK (éxito) con el cliente creado (JSON).
     * - 400 Bad Request (error) con un mensaje (JSON).
     */
    @PostMapping
    public ResponseEntity<?> registrarCliente(@RequestBody Cliente cliente) {
        try {
            // 2. Le pasamos el trabajo al servicio
            // Aquí se valida que el correo no esté duplicado
            Cliente nuevoCliente = clienteService.registrarCliente(cliente);

            // 3. Devolvemos la respuesta
            // (En un sistema real, NUNCA devolveríamos el password,
            // pero para este POJO simple, está bien)
            return ResponseEntity.ok(nuevoCliente);

        } catch (IllegalArgumentException e) {

            // 4. Manejo de errores
            // Si el correo ya existe
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener TODOS los clientes.
     * (Probablemente solo para rol de Administrador en el futuro).
     * Escucha peticiones GET en "/api/clientes".
     *
     * @return Una lista de todos los clientes en formato JSON.
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> getClientes() {
        List<Cliente> clientes = clienteService.getClientes();
        return ResponseEntity.ok(clientes);
    }
}