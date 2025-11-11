package com.puppyhugs.controller;

import com.puppyhugs.dto.ClienteRequestDTO;
import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
// import com.puppyhugs.dto.ClienteLoginDTO; // Ya no se usa

import java.util.List;

/**
 * Controlador REST para gestionar la entidad Cliente.
 * Expone endpoints para el registro y consulta de clientes.
 */
@RestController
@RequestMapping("/api/clientes")
// ¡¡AÑADIDO!! Permite que Angular (localhost:4200) llame a este backend.
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /**
     * Endpoint para registrar un nuevo cliente.
     * (Usado por un admin, o una ruta alternativa a /api/auth/register)
     * Escucha peticiones POST en "/api/clientes/registro".
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrarCliente(@Valid @RequestBody ClienteRequestDTO clienteDTO) {
        try {
            // ¡¡ARREGLADO!!
            // Ya no convertimos a Modelo, llamamos al servicio
            // directamente con el DTO (¡mucho más limpio!).
            // El servicio ahora se encarga de encriptar y guardar.
            Cliente nuevoCliente = clienteService.register(clienteDTO);

            return ResponseEntity.ok(nuevoCliente);

        } catch (IllegalArgumentException e) {
            // Si el correo ya existe
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener TODOS los clientes.
     * (Probablemente solo para rol de Administrador en el futuro).
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> getClientes() {
        List<Cliente> clientes = clienteService.getClientes();
        return ResponseEntity.ok(clientes);
    }

    /*
     * SE HA ELIMINADO EL ENDPOINT POST /login DE ESTE CONTROLADOR.
     *
     * ¿Por qué? Porque ya existe en 'AutenticacionController.java'
     * (@PostMapping("/api/auth/login")).
     *
     * Tener dos endpoints de login es confuso y redundante.
     * Dejamos que 'AutenticacionController' maneje todo el login/auth.
     */

    /*
     * SE HA ELIMINADO EL MÉTODO 'convertDtoToModel'.
     *
     * ¿Por qué? Porque ahora el servicio 'ClienteService'
     * acepta el DTO (ClienteRequestDTO) directamente.
     * Esto es una mejor práctica (Separación de Responsabilidades).
     */
}