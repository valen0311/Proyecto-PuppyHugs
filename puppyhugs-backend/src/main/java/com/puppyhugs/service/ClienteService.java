package com.puppyhugs.service;

import com.puppyhugs.model.Cliente;
import com.puppyhugs.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional; // Necesitamos importar Optional

/**
 * Servicio para la lógica de negocio de Clientes.
 * AHORA INCLUYE LÓGICA DE LOGIN.
 */
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * Registra un nuevo cliente.
     * (No necesita cambios, el rol por defecto se asigna en el constructor)
     */
    public Cliente registrarCliente(Cliente cliente) {
        if (cliente.getCorreoElectronico() == null || cliente.getCorreoElectronico().isBlank() ||
                cliente.getPassword() == null || cliente.getPassword().isBlank()) {
            throw new IllegalArgumentException("El correo y la contraseña son obligatorios.");
        }

        if (clienteRepository.findByCorreoElectronico(cliente.getCorreoElectronico()).isPresent()) {
            throw new IllegalArgumentException("El correo electrónico '" + cliente.getCorreoElectronico() + "' ya está registrado.");
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> getClientes() {
        return clienteRepository.findAll();
    }

    // --- MÉTODO NUEVO PARA LOGIN ---

    /**
     * Autentica a un usuario (Cliente o Admin).
     *
     * @param correo El correo electrónico del usuario.
     * @param password La contraseña (en texto plano, por ahora).
     * @return El objeto Cliente si la autenticación es exitosa.
     * @throws IllegalArgumentException Si el correo no existe o la contraseña es incorrecta.
     */
    public Cliente login(String correo, String password) {
        // 1. Buscamos al cliente por su correo
        Optional<Cliente> clienteOpt = clienteRepository.findByCorreoElectronico(correo);

        if (clienteOpt.isEmpty()) {
            // Usuario no encontrado
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }

        Cliente cliente = clienteOpt.get();

        // 2. Comparamos la contraseña
        // (En un sistema real, usaríamos un 'passwordEncoder' para comparar hashes)
        if (cliente.getPassword().equals(password)) {
            // ¡Éxito! Devolvemos el cliente (que incluye su rol)
            return cliente;
        } else {
            // Contraseña incorrecta
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }
    }
}