package com.puppyhugs.controller;

import com.puppyhugs.dto.LoginRequest; // Importamos el DTO
import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Importamos HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar la autenticación (login).
 */
@RestController
// Usamos una URL base "/api/auth" para agrupar los endpoints de autenticación
@RequestMapping("/api/auth")
public class AutenticacionController {

  // 1. Inyectamos el servicio de Cliente, que contiene la lógica del login
  @Autowired
  private ClienteService clienteService;

  /**
   * Endpoint para el login de clientes y administradores.
   * Responde a solicitudes POST en "/api/auth/login".
   *
   * @param loginRequest El JSON ({ "correo": "...", "password": "..." })
   *                     convertido al DTO "LoginRequest".
   * @return Un ResponseEntity:
   *         - 200 OK: con el objeto Cliente (incluyendo su rol).
   *         - 401 Unauthorized: si el correo o la contraseña son incorrectos.
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
      // 2. Llamamos al método login que creamos en el servicio
      Cliente clienteAutenticado = clienteService.login(
              loginRequest.getCorreo(),
              loginRequest.getPassword()
      );

      // 3. Éxito: devolvemos 200 OK con los datos del usuario.
      // El frontend guardará esta información (especialmente el 'rol')
      // para saber qué acciones puede realizar el usuario.
      return ResponseEntity.ok(clienteAutenticado);

    } catch (IllegalArgumentException e) {

      // 4. Error: el servicio lanzó una excepción.
      // Respondemos con un estado 401 (No Autorizado), que es el
      // estándar HTTP para indicar un login fallido.
      return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED) // Estado 401
              .body(e.getMessage()); // Mensaje: "Usuario o contraseña incorrectos."
    }
  }
}

