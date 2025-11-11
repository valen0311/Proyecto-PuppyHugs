package com.puppyhugs.controller;

import com.puppyhugs.dto.LoginRequest;
import com.puppyhugs.dto.ClienteRequestDTO; // ¡¡TU DTO!!
import com.puppyhugs.model.Cliente;
import com.puppyhugs.service.ClienteService;
import jakarta.validation.Valid; // ¡¡NUEVA IMPORTACIÓN!!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult; // ¡¡NUEVA IMPORTACIÓN!!
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors; // ¡¡NUEVA IMPORTACIÓN!!

@RestController
@RequestMapping("/api/auth")
// ¡¡AÑADIDO!! Permite que Angular (localhost:4200) llame a este backend.
@CrossOrigin(origins = "http://localhost:4200")
public class AutenticacionController {

  @Autowired
  private ClienteService clienteService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    // (Tu código de login original, que está perfecto)
    System.out.println("=================================================");
    System.out.println("🔍 LOGIN REQUEST RECIBIDO:");
    System.out.println("   Correo recibido: '" + loginRequest.getCorreo() + "'");
    System.out.println("   Password recibido: '" + loginRequest.getPassword() + "'");
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

  // ¡¡MÉTODO DE REGISTRO AÑADIDO Y CORREGIDO!!
  @PostMapping("/register")
  public ResponseEntity<?> register(
          // Usamos @Valid para activar las validaciones de tu DTO
          @Valid @RequestBody ClienteRequestDTO datosRegistro,
          // BindingResult captura los errores de @Valid
          BindingResult bindingResult
  ) {
    System.out.println("=================================================");
    System.out.println("🔍 REGISTER REQUEST RECIBIDO:");
    System.out.println("   Nombre: " + datosRegistro.getNombreCompleto());
    System.out.println("   Correo: " + datosRegistro.getCorreoElectronico());
    System.out.println("=================================================");

    // 1. Revisar si hay errores de validación del DTO
    if (bindingResult.hasErrors()) {
      // Concatenar todos los mensajes de error
      String errores = bindingResult.getAllErrors().stream()
              .map(error -> error.getDefaultMessage())
              .collect(Collectors.joining(" "));

      System.err.println("❌ REGISTRO FALLIDO (Validación): " + errores);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    // 2. Si no hay errores de validación, proceder con el registro
    try {
      Cliente clienteCreado = clienteService.register(datosRegistro);

      System.out.println("✅ REGISTRO EXITOSO");
      // Devolvemos 201 Created con el cliente nuevo
      return ResponseEntity.status(HttpStatus.CREATED).body(clienteCreado);

    } catch (IllegalArgumentException e) {
      // Capturar errores del servicio (ej: "El correo ya existe")
      System.err.println("❌ REGISTRO FALLIDO (Servicio): " + e.getMessage());
      return ResponseEntity
              .status(HttpStatus.BAD_REQUEST)
              .body(e.getMessage());
    }
  }
}