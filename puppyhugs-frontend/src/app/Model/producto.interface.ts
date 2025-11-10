// Archivo: src/app/model/producto.interface.ts
// (Define el modelo Producto, debe ser idéntico al del backend)

// Definimos los Enums (tipos fijos)
export enum CategoriaProducto {
  JUGUETE = 'JUGUETE',
  ACCESORIO = 'ACCESORIO',
  MEDICINA = 'MEDICINA',
  ARTICULO = 'ARTICULO'
}

export enum EstadoProducto {
  ACTIVO = 'ACTIVO',
  AGOTADO = 'AGOTADO'
}

// Definimos la interfaz principal
export interface Producto {
  id: number;
  nombre: string;
  codigoInterno: string;
  categoria: CategoriaProducto;
  cantidadDisponible: number;
  precio: number;
  estado: EstadoProducto;
}
