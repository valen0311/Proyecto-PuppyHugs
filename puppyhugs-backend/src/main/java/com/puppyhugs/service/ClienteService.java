package com.puppyhugs.service;

import com.puppyhugs.model.Cliente;
import com.puppyhugs.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio para la lógica de negocio de Clientes.
 */
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * Registra un nuevo cliente.
     * La lógica principal es validar que el correo no esté ya en uso.
     *
     * @param cliente El cliente a registrar.
     * @return El cliente guardado.
     * @throws IllegalArgumentException Si el correo ya existe.
     */
    public Cliente registrarCliente(Cliente cliente) {

        // Validar campos básicos
        if (cliente.getCorreoElectronico() == null || cliente.getCorreoElectronico().isBlank() ||
                cliente.getPassword() == null || cliente.getPassword().isBlank()) {
            throw new IllegalArgumentException("El correo y la contraseña son obligatorios.");
        }

        // Validar correo duplicado
        if (clienteRepository.findByCorreoElectronico(cliente.getCorreoElectronico()).isPresent()) {
            throw new IllegalArgumentException("El correo electrónico '" + cliente.getCorreoElectronico() + "' ya está registrado.");
        }

        // (Aquí iría la lógica para "hashear" el password antes de guardarlo)
        // ej: cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));

        return clienteRepository.save(cliente);
    }

    /**
     * Obtiene la lista de todos los clientes.
     */
    public List<Cliente> getClientes() {
        return clienteRepository.findAll();
    }
}