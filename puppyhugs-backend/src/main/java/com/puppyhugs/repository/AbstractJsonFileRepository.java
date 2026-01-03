package com.puppyhugs.repository;

// Imports necesarios de Jackson (para JSON) y Spring (para inyección)
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct; // Importante: para el método init()


// Imports de Java para manejo de archivos, colecciones y concurrencia
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;


/**
 * ITERACIÓN 2: El Enfoque "inteligente" (Refactorización).
 *
 * Esta es una CLASE ABSTRACTA (una "plantilla") para todos los repositorios que definan.
 * Contiene TODA la lógica duplicada de la iteración 1, pero usando
 * Genéricos (<T>) para que funcione con cualquier modelo (Producto, Venta, etc.).
 *
 * También agrega un CACHÉ EN MEMORIA (inMemoryDb) para ser mucho más rápido
 * que la versión ingenua (no se lee el archivo en cada 'findById').
 *
 * @param <T> El tipo de la entidad del modelo (p. ej: Producto, Cliente, Venta).
 */
public abstract class AbstractJsonFileRepository<T> {


    // --- 1. PROPIEDADES (Variables de la plantilla) ---


    /**
     * El "traductor" de JSON. Lo recibimos del constructor.
     */
    protected final ObjectMapper objectMapper;


    /**
     * ¡MEJORA DE RENDIMIENTO!
     * Esta es la base de datos en memoria 😉 o "caché".
     * En lugar de leer el archivo JSON en CADA `findById`, se carga
     * todo el archivo UNA SOLA VEZ al arrancar en este Mapa.
     *
     * Las lecturas (`findById`, `findAll`) usarán este Mapa (instantáneo).
     * Las escrituras (`save`, `delete`) actualizarán este Mapa Y el archivo.
     *
     * Es 'protected' para que las clases hijas (ProductoRepository)
     * puedan usarlo para sus búsquedas custom (ej: findByNombre).
     */
    protected final Map<Long, T> inMemoryDb = new ConcurrentHashMap<>();


    /**
     * El contador de IDs, "thread-safe" (seguro para concurrencia).
     */
    private final AtomicLong idCounter = new AtomicLong(0);


    /**
     * La ruta a la carpeta de la base de datos (ej: "./database").
     */
    private final String databaseBasePath;


    // --- 2. MÉTODOS ABSTRACTOS (El "Contrato" que las clases hijas deben cumplir) ---


    /**
     * TAREA 1: La clase hija DEBE decir cómo se llama su archivo.
     * @return El nombre del archivo, ej: "productos.json"
     */
    protected abstract String getDatabaseFileName();


    /**
     * TAREA 2: La clase hija DEBE decir cómo OBTENER el ID de una entidad <T>.
     * @param entity El objeto (ej: un Producto)
     * @return El ID de ese objeto (ej: producto.getId())
     */
    protected abstract Long getId(T entity);


    /**
     * TAREA 3: La clase hija DEBE decir cómo ESTABLECER el ID en una entidad <T>.
     * @param entity El objeto (ej: un Producto)
     * @param id El nuevo ID a establecer (ej: producto.setId(id))
     */
    protected abstract void setId(T entity, Long id);


    /**
     * TAREA 4: La clase hija DEBE dar el "truco" TypeReference.
     * @return new TypeReference<List<T>>() {}
     */
    protected abstract TypeReference<List<T>> getListTypeReference();




    // --- 3. CONSTRUCTOR E INICIALIZACIÓN ---


    /**
     * El constructor que llamarán las clases hijas.
     * Recibe las dependencias de Spring.
     */
    public AbstractJsonFileRepository(ObjectMapper objectMapper,
                                      @Value("${json.database.path}") String databaseBasePath) {
        this.objectMapper = objectMapper;
        this.databaseBasePath = databaseBasePath;
    }


    /**
     * @PostConstruct: Se ejecuta UNA VEZ al arrancar.
     * Carga el archivo JSON en el caché 'inMemoryDb'.
     *
     * 'synchronized': Previene problemas si alguien intenta usar el repo
     * mientras se está inicializando.
     */
    @PostConstruct
    public synchronized void init() {
        File dbFile = getDbFile();
        try {
            File parentDir = dbFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }
            
            if (!dbFile.exists()) {
                objectMapper.writeValue(dbFile, new ArrayList<>());
            }

            // Lógica: Leer el archivo y cargarlo en el caché en memoria.
            List<T> entities = objectMapper.readValue(dbFile, getListTypeReference()); // (TAREA 4)


            inMemoryDb.clear();
            long maxId = 0L;


            for (T entity : entities) {
                Long id = getId(entity); // (TAREA 2)
                inMemoryDb.put(id, entity); // ¡Cargado en el caché!


                if (id > maxId) {
                    maxId = id;
                }
            }


            // Lógica: Sincronizar el contador de IDs con el ID más alto del archivo.
            idCounter.set(maxId);


        } catch (IOException e) {
            throw new RuntimeException("Error fatal: No se pudo cargar la base de datos JSON: " + getDatabaseFileName(), e);
        }
    }




    // --- 4. MÉTODOS CRUD (Ahora son eficientes y están en un solo lugar) ---


    /**
     * Guarda una entidad (nueva o existente).
     * 'synchronized': Es FUNDAMENTAL. Actúa como un "candado". Solo una petición
     * a la vez puede ejecutar este método, previniendo que dos usuarios
     * generen el mismo ID o corrompan el archivo. Esto lo garantiza Java, siempre
     * y cuando se use “synchronized”.
     */
    public synchronized T save(T entity) {
        // Lógica: Asignar un nuevo ID si es una entidad nueva.
        if (getId(entity) == null) { // (TAREA 2)
            long newId = idCounter.incrementAndGet(); // Obtiene el siguiente ID
            setId(entity, newId); // (TAREA 3)
        }


        // 1. Actualiza el caché en memoria (rápido)
        inMemoryDb.put(getId(entity), entity);


        // 2. Persiste el cambio en el disco (lento)
        persistToFile();


        return entity;
    }


    /**
     * Devuelve una entidad por su ID.
     * ¡MUY RÁPIDO! Lee directamente del caché en memoria.
     */
    public Optional<T> findById(Long id) {
        return Optional.ofNullable(inMemoryDb.get(id));
    }


    /**
     * Verifica si una entidad existe por su ID.
     * ¡MUY RÁPIDO! Lee directamente del caché en memoria.
     */
    public boolean existsById(Long id) {
        return inMemoryDb.containsKey(id);
    }


    /**
     * Devuelve todas las entidades.
     * ¡MUY RÁPIDO! Lee directamente del caché en memoria.
     */
    public List<T> findAll() {
        return new ArrayList<>(inMemoryDb.values());
    }


    /**
     * Elimina una entidad por su ID.
     * 'synchronized': También necesita el "candado" porque modifica los datos.
     */
    public synchronized void deleteById(Long id) {
        inMemoryDb.remove(id); // 1. Quita del caché
        persistToFile();       // 2. Persiste en disco
    }




    // --- 5. MÉTODOS PRIVADOS (Ayudantes internos) ---


    /**
     * Ayudante para obtener el objeto File (archivo)
     */
    private File getDbFile() {
        // (TAREA 1)
        return Paths.get(databaseBasePath, getDatabaseFileName()).toFile();
    }


    /**
     * Escribe el estado COMPLETO del caché 'inMemoryDb' al archivo JSON.
     */
    private void persistToFile() {
        try {
            objectMapper.writeValue(getDbFile(), new ArrayList<>(inMemoryDb.values()));
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar datos en " + getDatabaseFileName(), e);
        }
    }
}

