// Archivo: com/puppyhugs/PuppyHugsApplication.java
package com.puppyhugs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal (Main) que arranca toda la aplicación Spring Boot.
 */
@SpringBootApplication
public class PuppyHugsAplication {

  /**
   * El método 'main' que sirve como punto de entrada para
   * ejecutar la aplicación.
   */
  public static void main(String[] args) {
    // Esta línea inicia todo el framework de Spring
    SpringApplication.run(PuppyHugsAplication.class, args);
  }

}
