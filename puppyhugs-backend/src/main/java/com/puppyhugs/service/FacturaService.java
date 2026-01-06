/* src/main/java/com/puppyhugs/service/FacturaService.java */
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
            document.add(new Paragraph("Teléfono: " + (cliente.getTelefono() != null ? cliente.getTelefono() : "N/A"), normalFont));
            document.add(new Paragraph("Dirección: " + (cliente.getDireccion() != null ? cliente.getDireccion() : "N/A"), normalFont));

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
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

            for (Map.Entry<Long, Integer> entry : venta.getProductos().entrySet()) {
                Long productoId = entry.getKey();
                Integer cantidad = entry.getValue();

                try {
                    Producto producto = productoRepository.findById(productoId)
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoId));

                    BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(cantidad));

                    // Agregar celdas con formato
                    PdfPCell cell1 = new PdfPCell(new Phrase(String.valueOf(productoId), cellFont));
                    cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(cell1);

                    PdfPCell cell2 = new PdfPCell(new Phrase(producto.getNombre(), cellFont));
                    table.addCell(cell2);

                    PdfPCell cell3 = new PdfPCell(new Phrase(String.valueOf(cantidad), cellFont));
                    cell3.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(cell3);

                    PdfPCell cell4 = new PdfPCell(new Phrase("$" + producto.getPrecio().setScale(2, BigDecimal.ROUND_HALF_UP), cellFont));
                    cell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    table.addCell(cell4);

                    PdfPCell cell5 = new PdfPCell(new Phrase("$" + subtotal.setScale(2, BigDecimal.ROUND_HALF_UP), cellFont));
                    cell5.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    table.addCell(cell5);

                } catch (Exception e) {
                    System.out.println("Error al procesar producto " + productoId + ": " + e.getMessage());
                }
            }

            document.add(table);
            document.add(new Paragraph(" ")); // Espacio

            // --- CÁLCULO DE TOTALES (Lógica corregida) ---
            BigDecimal subtotalCalculado = BigDecimal.ZERO;

            for (Map.Entry<Long, Integer> entry : venta.getProductos().entrySet()) {
                Long productoId = entry.getKey();
                Integer cantidad = entry.getValue();

                try {
                    Producto producto = productoRepository.findById(productoId).orElse(null);
                    if (producto != null) {
                        BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(cantidad));
                        subtotalCalculado = subtotalCalculado.add(subtotal);
                    }
                } catch (Exception e) {
                    System.out.println("Error calculando total: " + e.getMessage());
                }
            }

            // Calcular impuesto (16% del subtotal)
            BigDecimal impuestoCalculado = subtotalCalculado.multiply(new BigDecimal("0.16"));

            // Calcular total (subtotal + impuesto)
            BigDecimal totalCalculado = subtotalCalculado.add(impuestoCalculado);

            // --- TABLA DE TOTALES (Actualizada) ---
            PdfPTable totalsTable = new PdfPTable(2);
            totalsTable.setWidthPercentage(40);
            totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.setWidths(new float[]{3, 2});

            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            // Subtotal
            PdfPCell labelCell1 = new PdfPCell(new Phrase("Subtotal:", totalFont));
            labelCell1.setBorder(Rectangle.NO_BORDER);
            labelCell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.addCell(labelCell1);

            PdfPCell valueCell1 = new PdfPCell(new Phrase("$" + subtotalCalculado.setScale(2, BigDecimal.ROUND_HALF_UP), totalFont));
            valueCell1.setBorder(Rectangle.NO_BORDER);
            valueCell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.addCell(valueCell1);

            // Impuesto
            PdfPCell labelCell2 = new PdfPCell(new Phrase("Impuesto (16%):", totalFont));
            labelCell2.setBorder(Rectangle.NO_BORDER);
            labelCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.addCell(labelCell2);

            PdfPCell valueCell2 = new PdfPCell(new Phrase("$" + impuestoCalculado.setScale(2, BigDecimal.ROUND_HALF_UP), totalFont));
            valueCell2.setBorder(Rectangle.NO_BORDER);
            valueCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.addCell(valueCell2);

            // Total Final
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("TOTAL:", boldFont));
            totalLabelCell.setBorder(Rectangle.NO_BORDER);
            totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.addCell(totalLabelCell);

            PdfPCell totalValueCell = new PdfPCell(new Phrase("$" + totalCalculado.setScale(2, BigDecimal.ROUND_HALF_UP), boldFont));
            totalValueCell.setBorder(Rectangle.NO_BORDER);
            totalValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalsTable.addCell(totalValueCell);

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
