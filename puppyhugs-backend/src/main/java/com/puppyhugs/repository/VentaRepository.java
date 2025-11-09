package com.puppyhugs.repository;

import com.puppyhugs.model.Venta;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
public class VentaRepository {

    private final Map<Long, Venta> ventaDb = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    public Venta save(Venta venta) {
        if (venta.getId() == null) {
            venta.setId(idCounter.incrementAndGet());
        }
        ventaDb.put(venta.getId(), venta);
        return venta;
    }

    public List<Venta> findAll() {
        return ventaDb.values().stream().collect(Collectors.toList());
    }

    public Optional<Venta> findById(Long id) {
        return Optional.ofNullable(ventaDb.get(id));
    }

    public List<Venta> findByClienteId(Long clienteId) {
        return ventaDb.values().stream()
                .filter(venta -> venta.getClienteId().equals(clienteId))
                .collect(Collectors.toList());
    }
}
