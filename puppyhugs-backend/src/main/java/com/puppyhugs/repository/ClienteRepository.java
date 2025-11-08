package com.puppyhugs.repository;

import com.puppyhugs.model.Cliente;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repositorio en memoria para la entidad Cliente.
 */
@Repository
public class ClienteRepository {

    // "Base de datos" de clientes
    private final Map<Long, Cliente> clienteDb = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    /**
     * Guarda un cliente (nuevo o existente).
     * Asigna un ID si es nuevo.
     */
    public Cliente save(Cliente cliente) {
        if (cliente.getId() == null) {
            cliente.setId(idCounter.incrementAndGet());
        }
        clienteDb.put(cliente.getId(), cliente);
        return cliente;
    }

    /**
     * Devuelve todos los clientes.
     */
    public List<Cliente> findAll() {
        return List.copyOf(clienteDb.values());
    }

    /**
     * Busca un cliente por su ID.
     */
    public Optional<Cliente> findById(Long id) {
        return Optional.ofNullable(clienteDb.get(id));
    }

    /**
     * Busca un cliente por su Correo Electrónico.
     * Útil para validar duplicados o para el login.
     */
    public Optional<Cliente> findByCorreoElectronico(String correo) {
        return clienteDb.values().stream()
                .filter(c -> c.getCorreoElectronico().equalsIgnoreCase(correo))
                .findFirst();
    }
}