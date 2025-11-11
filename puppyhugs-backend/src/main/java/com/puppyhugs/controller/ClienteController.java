package com.puppyhugs.controller;

import com.puppyhugs.dto.ClienteRequestDTO;
import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.puppyhugs.dto.ClienteLoginDTO;

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

    @PostMapping("/registro")
    public ResponseEntity<?> registrarCliente(@Valid @RequestBody ClienteRequestDTO clienteDTO) {
        Cliente cliente = convertDtoToModel(clienteDTO);
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

    /**
     * Endpoint para el Login/Autenticación.
     * Escucha peticiones POST en "/api/clientes/login".
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody ClienteLoginDTO loginDTO) {
        try {
            // Llama al servicio para validar las credenciales
            Cliente clienteAutenticado = clienteService.login(loginDTO.getCorreo(), loginDTO.getPassword());
            return ResponseEntity.ok(clienteAutenticado);

        } catch (IllegalArgumentException e) {
            // Error de negocio: Usuario no encontrado o contraseña incorrecta
            // Devolvemos 401 Unauthorized (No autorizado) para el login fallido
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    private Cliente convertDtoToModel(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombreCompleto(dto.getNombreCompleto());
        cliente.setCorreoElectronico(dto.getCorreoElectronico());
        cliente.setPassword(dto.getPassword());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        // El rol (ROL_CLIENTE) se asigna por defecto en el constructor de la clase Cliente.
        return cliente;
    }
}