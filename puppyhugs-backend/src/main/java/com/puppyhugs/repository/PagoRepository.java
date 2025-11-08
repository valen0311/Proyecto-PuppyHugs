package com.puppyhugs.repository;

import com.puppyhugs.model.Pago;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio en memoria para la entidad Pago.
 * Simula la persistencia en un archivo JSON (HU-4).
 */
@Repository
public class PagoRepository {

    // "Base de datos" de pagos
    private final Map<Long, Pago> pagoDb = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    /**
     * Guarda un pago (nuevo o existente).
     * Asigna un ID si es nuevo.
     */
    public Pago save(Pago pago) {
        if (pago.getId() == null) {
            pago.setId(idCounter.incrementAndGet());
        }
        pagoDb.put(pago.getId(), pago);
        return pago;
    }

    /**
     * Devuelve todos los pagos.
     */
    public List<Pago> findAll() {
        return List.copyOf(pagoDb.values());
    }

    /**
     * Busca un pago por su ID.
     */
    public Optional<Pago> findById(Long id) {
        return Optional.ofNullable(pagoDb.get(id));
    }

    // (No se requieren métodos de búsqueda específicos para HU-4)
}
