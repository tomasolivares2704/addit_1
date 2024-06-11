// newlist.models.ts
export interface NewList {
  id: string;
  nombre: string;
  total: number;
  // Descomentar la propiedad alimentos
  alimentos: AlimentoListaCompra[]; 
}

export interface AlimentoListaCompra {
  id: string; // ID del alimento seleccionado
  nombre: string; // Nombre del alimento
  cantidad: number; // Cantidad del alimento
  precio: number;
  subtotal: number; // Subtotal del alimento (precio * cantidad)
}
