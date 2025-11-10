// Representa el DTO de información que el cliente ingresa para simular el pago
export interface InfoPago {
  nombreTitular: string;
  numeroTarjeta: string; // En un proyecto real, esto no se manejaría así
  expiracion: string; // MM/AA
  cvv: string;
}

// Representa la Venta a ser registrada en el backend
// (Es un DTO simplificado para el proceso de checkout)
export interface VentaRegistroDTO {
  idCliente: number;
  totalVenta: number;
  // Solo necesitamos la lista de IDs de producto y su cantidad
  items: {
    idProducto: number;
    cantidad: number;
  }[];
}
