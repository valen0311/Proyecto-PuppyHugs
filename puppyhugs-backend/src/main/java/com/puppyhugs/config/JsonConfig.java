package com.puppyhugs.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * Esta es una clase de Configuración de Spring.
 * Le dice a Spring cómo debe "construir" y "configurar"
 * ciertos objetos (llamados Beans) que nuestra aplicación usará.
 */
@Configuration
public class JsonConfig {


    /**
     * @Bean: Esta anotación le dice a Spring:
     * 1. Ejecuta este método cuando la aplicación arranque.
     * 2. El objeto que este método devuelve (un ObjectMapper) es un "Bean".
     * 3. Guárdalo en tu "Contenedor" (la memoria de Spring).
     * 4. Si cualquier otra clase (como nuestros Repositorios) pide un
     * ObjectMapper usando @Autowired, entrégale esta instancia que creaste.
     *
     * Esto asegura que usemos UNA SOLA instancia de ObjectMapper (Singleton)
     * en toda la aplicación, y que está configurada como queremos.
     */
    @Bean
    public ObjectMapper objectMapper() {

        // 1. Creamos la instancia del "traductor"
        ObjectMapper mapper = new ObjectMapper();


        // 2. Le enseñamos a escribir el JSON "bonito" (con indentación)
        // Esto es perfecto para nuestro proyecto, así podemos abrir
        // los archivos .json y ver que los datos se están guardando
        // de forma legible.
        mapper.enable(SerializationFeature.INDENT_OUTPUT);


        // 3. Le enseñamos a manejar fechas y horas de Java 8+
        // (LocalDate, LocalDateTime) que usamos en Venta, Promocion y Pago.
        // Sin esto, Jackson no sabe qué hacer con esos tipos de objeto.
        mapper.findAndRegisterModules();

        // 4. Le decimos que NO escriba las fechas como números largos (timestamps),
        // sino como texto estándar ISO (p. ej: "2025-10-20T15:30:00").
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);


        // 5. Devolvemos el "traductor" ya configurado.
        return mapper;
    }
}

