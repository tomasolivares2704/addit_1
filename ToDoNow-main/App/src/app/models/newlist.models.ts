export interface NewList {
  id: string;
  nombre: string;
  alimentos: AlimentoListaCompra[]; // Array para almacenar los alimentos seleccionados
}

export interface AlimentoListaCompra {
  id: string; // ID del alimento seleccionado
  listaId: string; // ID de la lista asociada
  nombre: string; // Nombre del alimento
  cantidad: number; // Cantidad del alimento
  subtotal: number; // Subtotal del alimento (precio * cantidad)
}