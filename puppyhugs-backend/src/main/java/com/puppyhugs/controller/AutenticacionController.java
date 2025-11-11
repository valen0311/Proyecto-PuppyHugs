package com.puppyhugs.controller;

import com.puppyhugs.dto.LoginRequest;
import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AutenticacionController {

  @Autowired
  private ClienteService clienteService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // ✅ LOGS DE DEPURACIÓN
    System.out.println("=================================================");
    System.out.println("🔍 LOGIN REQUEST RECIBIDO:");
    System.out.println("   Correo recibido: '" + loginRequest.getCorreo() + "'");
    System.out.println("   Longitud correo: " + (loginRequest.getCorreo() != null ? loginRequest.getCorreo().length() : "null"));
    System.out.println("   Password recibido: '" + loginRequest.getPassword() + "'");
    System.out.println("   Longitud password: " + (loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "null"));
    System.out.println("=================================================");

    try {
      Cliente clienteAutenticado = clienteService.login(
              loginRequest.getCorreo(),
              loginRequest.getPassword()
      );

      System.out.println("✅ LOGIN EXITOSO");
      System.out.println("   Usuario: " + clienteAutenticado.getNombreCompleto());
      System.out.println("   Rol: " + clienteAutenticado.getRol());
      return ResponseEntity.ok(clienteAutenticado);

    } catch (IllegalArgumentException e) {
      System.err.println("❌ LOGIN FALLIDO: " + e.getMessage());
      return ResponseEntity
              .status(HttpStatus.UNAUTHORIZED)
              .body(e.getMessage());
    }
  }
}