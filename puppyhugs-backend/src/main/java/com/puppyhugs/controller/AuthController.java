package com.puppyhugs.controller;

import com.puppyhugs.dto.LoginRequest; // Importamos el DTO
import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Importamos HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar la Autenticación (Login).
 */
@RestController
// Usamos una URL base "/api/auth" para agrupar los endpoints de seguridad
@RequestMapping("/api/auth")
public class AuthController {

  // 1. Inyectamos el Servicio de Cliente, que tiene la lógica de login
  @Autowired
  private ClienteService clienteService;

  /**
   * Endpoint para el Login de Clientes y Administradores.
   * Escucha peticiones POST en "/api/auth/login".
   *
   * @param loginRequest El JSON ({ "correo": "...", "password": "..." })
   * convertido al DTO "LoginRequest".
   * @return Un ResponseEntity:
   * - 200 OK: con el objeto Cliente (incluyendo su rol).
   * - 401 Unauthorized: si el correo o la contraseña son incorrectos.
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
      // 2. Llamamos al método login que creamos en el servicio
      Cliente clienteAutenticado = clienteService.login(
        loginRequest.getCorreo(),
        loginRequest.getPassword()
      );

      // 3. Éxito: Devolvemos 200 OK con los datos del usuario.
      // Angular guardará esto (especialmente el 'rol') para saber
      // qué puede hacer el usuario en el frontend.
      return ResponseEntity.ok(clienteAutenticado);

    } catch (IllegalArgumentException e) {

      // 4. Fracaso: El servicio lanzó la excepción.
      // Devolvemos un error 401 (No Autorizado), que es el
      // estándar HTTP para un login fallido.
      return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED) // Status 401
        .body(e.getMessage()); // Mensaje: "Usuario o contraseña incorrectos."
    }
  }
}
