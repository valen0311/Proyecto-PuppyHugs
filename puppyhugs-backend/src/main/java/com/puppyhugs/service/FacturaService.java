// service/FacturaService.java
package com.puppyhugs.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.puppyhugs.model.Cliente;
import com.puppyhugs.model.Producto;
import com.puppyhugs.model.Venta;
import com.puppyhugs.repository.ClienteRepository;
import com.puppyhugs.repository.ProductoRepository;
import com.puppyhugs.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class FacturaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Genera un PDF de factura para una venta específica
     * @param ventaId ID de la venta
     * @return Array de bytes del PDF generado
     */
    public byte[] generarFacturaPDF(Long ventaId) {
        // 1. Obtener la venta
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new IllegalArgumentException("La venta con ID " + ventaId + " no existe."));

        // 2. Obtener el cliente
        Cliente cliente = clienteRepository.findById(venta.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("El cliente no existe."));

        // 3. Crear el documento PDF
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // --- ENCABEZADO ---
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Paragraph title = new Paragraph("FACTURA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" ")); // Espacio

            // Número de factura y fecha
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            document.add(new Paragraph("Factura No: FAC-" + venta.getId(), normalFont));

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            document.add(new Paragraph("Fecha: " + venta.getFecha().format(formatter), normalFont));
            document.add(new Paragraph("Estado: " + venta.getEstado(), normalFont));

            document.add(new Paragraph(" ")); // Espacio

            // --- INFORMACIÓN DEL CLIENTE ---
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            document.add(new Paragraph("Datos del Cliente:", boldFont));
            document.add(new Paragraph("Nombre: " + cliente.getNombreCompleto(), normalFont));
            document.add(new Paragraph("Email: " + cliente.getCorreoElectronico(), normalFont));
            document.add(new Paragraph("Teléfono: " + cliente.getTelefono(), normalFont));
            document.add(new Paragraph("Dirección: " + cliente.getDireccion(), normalFont));

            document.add(new Paragraph(" ")); // Espacio

            // --- TABLA DE PRODUCTOS ---
            document.add(new Paragraph("Detalle de Productos:", boldFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5); // 5 columnas
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1, 3, 2, 2, 2});

            // Encabezados de tabla
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            PdfPCell headerCell;

            String[] headers = {"ID", "Producto", "Cantidad", "Precio Unit.", "Subtotal"};
            for (String header : headers) {
                headerCell = new PdfPCell(new Phrase(header, headerFont));
                headerCell.setBackgroundColor(BaseColor.DARK_GRAY);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setPadding(5);
                table.addCell(headerCell);
            }

            // Filas de productos
            BigDecimal subtotalGeneral = BigDecimal.ZERO;
            for (Map.Entry<Long, Integer> entry : venta.getProductos().entrySet()) {
                Long productoId = entry.getKey();
                Integer cantidad = entry.getValue();

                Producto producto = productoRepository.findById(productoId)
                        .orElse(null);

                if (producto != null) {
                    BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(cantidad));
                    subtotalGeneral = subtotalGeneral.add(subtotal);

                    table.addCell(String.valueOf(productoId));
                    table.addCell(producto.getNombre());
                    table.addCell(String.valueOf(cantidad));
                    table.addCell("$" + producto.getPrecio().toString());
                    table.addCell("$" + subtotal.toString());
                }
            }

            document.add(table);

            document.add(new Paragraph(" ")); // Espacio

            // --- TOTALES ---
            BigDecimal impuesto = venta.getTotalVenta().multiply(new BigDecimal("0.16")); // 16% de impuesto
            BigDecimal subtotal = venta.getTotalVenta().subtract(impuesto);

            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(40);
            totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            totalsTable.addCell("Subtotal:");
            totalsTable.addCell("$" + subtotal.setScale(2, BigDecimal.ROUND_HALF_UP));

            totalsTable.addCell("Impuesto (16%):");
            totalsTable.addCell("$" + impuesto.setScale(2, BigDecimal.ROUND_HALF_UP));

            PdfPCell totalCell = new PdfPCell(new Phrase("TOTAL:", boldFont));
            totalCell.setBorder(Rectangle.NO_BORDER);
            totalsTable.addCell(totalCell);

            PdfPCell totalAmountCell = new PdfPCell(new Phrase("$" + venta.getTotalVenta().toString(), boldFont));
            totalAmountCell.setBorder(Rectangle.NO_BORDER);
            totalsTable.addCell(totalAmountCell);

            document.add(totalsTable);

            document.add(new Paragraph(" ")); // Espacio
            document.add(new Paragraph(" ")); // Espacio

            // --- PIE DE PÁGINA ---
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);
            Paragraph footer = new Paragraph("Gracias por su compra - PuppyHugs", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage());
        }

        return baos.toByteArray();
    }
}