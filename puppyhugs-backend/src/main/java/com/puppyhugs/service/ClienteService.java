package com.puppyhugs.service;

import com.puppyhugs.dto.ClienteRequestDTO;
import com.puppyhugs.model.Cliente;
import com.puppyhugs.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
// ¡¡AÑADE ESTA IMPORTACIÓN!! (Ahora sí la encontrará)
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // ¡¡INDISPENSABLE PARA LA SEGURIDAD!!
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAdmin() {
        Optional<Cliente> adminOpt = clienteRepository.findByCorreoElectronico("admin@puppyhugs.com");

        if (adminOpt.isEmpty()) {
            System.out.println("--- No se encontró admin. Creando admin por defecto... ---");
            Cliente admin = new Cliente();
            admin.setNombreCompleto("Admin Principal");
            admin.setCorreoElectronico("admin@puppyhugs.com");

            // ¡¡CORREGIDO: Encriptamos la contraseña!!
            admin.setPassword(passwordEncoder.encode("admin123"));

            admin.setRol("ROL_ADMIN");
            admin.setDireccion("Oficina Central");
            admin.setTelefono("000-0000");

            clienteRepository.save(admin);
            System.out.println("✅ Admin 'admin@puppyhugs.com' creado exitosamente.");
        } else {
            Cliente admin = adminOpt.get();
            if (!passwordEncoder.matches("admin123", admin.getPassword()) && admin.getPassword().equals("admin123")) {
                System.out.println("⚠️ ¡ADMIN TIENE CONTRASEÑA EN TEXTO PLANO! Actualizando a encriptada...");
                admin.setPassword(passwordEncoder.encode("admin123"));
                clienteRepository.save(admin);
                System.out.println("✅ Contraseña de admin actualizada a BCrypt.");
            } else {
                System.out.println("✅ Admin 'admin@puppyhugs.com' ya existe y tiene contraseña encriptada.");
            }
        }
    }

    /**
     * Registra un nuevo cliente (¡AHORA USANDO EL DTO!)
     */
    public Cliente register(ClienteRequestDTO datosRegistro) {
        if (clienteRepository.findByCorreoElectronico(datosRegistro.getCorreoElectronico()).isPresent()) {
            throw new IllegalArgumentException("El correo electrónico '" + datosRegistro.getCorreoElectronico() + "' ya está registrado.");
        }

        String passwordCifrado = passwordEncoder.encode(datosRegistro.getPassword());

        Cliente nuevoCliente = new Cliente();
        nuevoCliente.setNombreCompleto(datosRegistro.getNombreCompleto());
        nuevoCliente.setCorreoElectronico(datosRegistro.getCorreoElectronico());
        nuevoCliente.setPassword(passwordCifrado); // ¡Guardar la cifrada!
        nuevoCliente.setDireccion(datosRegistro.getDireccion());
        nuevoCliente.setTelefono(datosRegistro.getTelefono());
        nuevoCliente.setRol("ROL_CLIENTE");

        return clienteRepository.save(nuevoCliente);
    }

    public List<Cliente> getClientes() {
        return clienteRepository.findAll();
    }

    /**
     * Autentica a un usuario (Cliente o Admin).
     * ¡¡AHORA USANDO PASSWORD ENCRIPTADO!!
     */
    public Cliente login(String correo, String password) {
        System.out.println("🔎 INICIANDO PROCESO DE LOGIN (SEGURO)");
        System.out.println("   Correo recibido: '" + correo + "'");

        Optional<Cliente> clienteOpt = clienteRepository.findByCorreoElectronico(correo);

        if (clienteOpt.isEmpty()) {
            System.err.println("❌ Usuario NO encontrado en la base de datos");
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }

        Cliente cliente = clienteOpt.get();
        System.out.println("✅ Usuario ENCONTRADO: " + cliente.getCorreoElectronico());

        System.out.println("🔐 COMPARANDO CONTRASEÑAS (BCRYPT):");
        System.out.println("   Password en BD (hash): '" + cliente.getPassword() + "'");

        if (!passwordEncoder.matches(password, cliente.getPassword())) {
            System.err.println("❌ CONTRASEÑA INCORRECTA");
            throw new IllegalArgumentException("Usuario o contraseña incorrectos.");
        }

        System.out.println("✅✅✅ LOGIN EXITOSO ✅✅✅");
        System.out.println("   Rol: " + cliente.getRol());
        System.out.println("=================================================");

        return cliente;
    }
}