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
 * (NO REQUIERE CAMBIOS PARA EL CAMPO ROL)
 */
@Repository
public class ClienteRepository {

    private final Map<Long, Cliente> clienteDb = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    public Cliente save(Cliente cliente) {
        if (cliente.getId() == null) {
            cliente.setId(idCounter.incrementAndGet());
        }
        clienteDb.put(cliente.getId(), cliente);
        return cliente;
    }

    public List<Cliente> findAll() {
        return List.copyOf(clienteDb.values());
    }

    public Optional<Cliente> findById(Long id) {
        return Optional.ofNullable(clienteDb.get(id));
    }

    /**
     * Este método es el que usará el Servicio de Login.
     * Ya existe y es perfecto para eso.
     */
    public Optional<Cliente> findByCorreoElectronico(String correo) {
        return clienteDb.values().stream()
                .filter(c -> c.getCorreoElectronico().equalsIgnoreCase(correo))
                .findFirst();
    }
}