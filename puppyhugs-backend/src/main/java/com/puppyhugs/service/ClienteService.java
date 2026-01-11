package com.puppyhugs.service;

import com.puppyhugs.model.Cliente;
import com.puppyhugs.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para la lógica de negocio de Clientes.
 * INCLUYE LÓGICA DE LOGIN CON LOGS DE DEPURACIÓN.
 */
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * Se ejecuta una vez al arrancar.
     * Verifica si el admin existe en "clientes.json" y, si no, lo crea.
     */
    @PostConstruct
    public void initAdmin() {
        Optional<Cliente> adminOpt = clienteRepository.findByCorreoElectronico("admin@puppyhugs.com");

        if (adminOpt.isEmpty()) {
            System.out.println("--- No se encontró admin. Creando admin por defecto... ---");
            Cliente admin = new Cliente();
            admin.setNombreCompleto("Admin Principal");
            admin.setCorreoElectronico("admin@puppyhugs.com");
            admin.setPassword("admin123");
            admin.setRol("ROL_ADMIN");
            admin.setActivo(true);
            admin.setDireccion("Oficina Central");
            admin.setTelefono("000-0000");

            clienteRepository.save(admin);
            System.out.println("✅ Admin 'admin@puppyhugs.com' creado exitosamente.");
        } else {
            System.out.println("✅ Admin 'admin@puppyhugs.com' ya existe.");
        }
    }

    /**
     * Registra un nuevo cliente.
     */
    public Cliente registrarCliente(Cliente cliente) {
        if (cliente.getCorreoElectronico() == null || cliente.getCorreoElectronico().isBlank() ||
                cliente.getPassword() == null || cliente.getPassword().isBlank()) {
            throw new IllegalArgumentException("El correo y la contraseña son obligatorios.");
        }

        if (clienteRepository.findByCorreoElectronico(cliente.getCorreoElectronico()).isPresent()) {
            throw new IllegalArgumentException("El correo electrónico '" + cliente.getCorreoElectronico() + "' ya está registrado.");
        }

        // Si no tiene rol asignado, por defecto es ROL_CLIENTE
        if (cliente.getRol() == null || cliente.getRol().isBlank()) {
            cliente.setRol("ROL_CLIENTE");
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> getClientes() {
        return clienteRepository.findAll();
    }

    /**
     * Autentica a un usuario (Cliente o Admin).
     *
     * @param correo El correo electrónico del usuario.
     * @param password La contraseña (en texto plano, por ahora).
     * @return El objeto Cliente si la autenticación es exitosa.
     * @throws IllegalArgumentException Si el correo no existe o la contraseña es incorrecta.
     */
    public Cliente login(String correo, String password) {
        System.out.println("🔎 INICIANDO PROCESO DE LOGIN");
        System.out.println("   Correo recibido: '" + correo + "'");
        System.out.println("   Password recibido: '" + password + "'");

        // 1. Buscamos al cliente por su correo
        Optional<Cliente> clienteOpt = clienteRepository.findByCorreoElectronico(correo);

        if (clienteOpt.isEmpty()) {
            // Usuario no encontrado
            System.err.println("❌ Usuario NO encontrado en la base de datos");
            System.err.println("📋 Listado de usuarios disponibles:");
            List<Cliente> todosLosClientes = clienteRepository.findAll();
            if (todosLosClientes.isEmpty()) {
                System.err.println("   ⚠️ NO HAY USUARIOS EN LA BASE DE DATOS");
            } else {
                for (Cliente c : todosLosClientes) {
                    System.err.println("   - ID: " + c.getId() + " | Correo: '" + c.getCorreoElectronico() + "' | Rol: " + c.getRol());
                }
            }
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }

        Cliente cliente = clienteOpt.get();
        System.out.println("✅ Usuario ENCONTRADO:");
        System.out.println("   ID: " + cliente.getId());
        System.out.println("   Nombre: " + cliente.getNombreCompleto());
        System.out.println("   Correo: '" + cliente.getCorreoElectronico() + "'");
        System.out.println("   Rol: " + cliente.getRol());

        // 2. Comparamos la contraseña
        System.out.println("🔐 COMPARANDO CONTRASEÑAS:");
        System.out.println("   Password en BD: '" + cliente.getPassword() + "' (longitud: " + cliente.getPassword().length() + ")");
        System.out.println("   Password recibido: '" + password + "' (longitud: " + password.length() + ")");
        System.out.println("   ¿Son iguales? " + cliente.getPassword().equals(password));

        if (!cliente.isActivo()) {
            throw new IllegalArgumentException("Tu cuenta está suspendida. Contacta al administrador.");
        }

        if (!cliente.getPassword().equals(password)) {
            // Contraseña incorrecta
            System.err.println("❌ CONTRASEÑA INCORRECTA");
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }

        // 3. ¡Login exitoso! Devolvemos el cliente (con su rol)
        System.out.println("✅✅✅ LOGIN EXITOSO ✅✅✅");
        System.out.println("   Usuario: " + cliente.getCorreoElectronico());
        System.out.println("   Rol: " + cliente.getRol());
        System.out.println("=================================================");

        return cliente;
    }

    /**
     * Cambia el estado (activo/suspendido) de un cliente por su ID.
     * Al usar clienteRepository.save(), el AbstractJsonFileRepository
     * actualiza automáticamente el archivo JSON.
     */
    public Cliente cambiarEstado(Long id, boolean nuevoEstado) {
        // 1. Buscamos al cliente por ID
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el cliente con ID: " + id));

        // 2. Modificamos el estado
        cliente.setActivo(nuevoEstado);

        // 3. Guardamos los cambios (esto actualiza el caché y el archivo físico)
        return clienteRepository.save(cliente);
    }
}