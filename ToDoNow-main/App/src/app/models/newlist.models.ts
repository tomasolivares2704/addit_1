// newlist.models.ts
export interface NewList {
    id: string;
    nombre: string;
    total: number;
    total2: number;
    // Descomentar la propiedad alimentos
    alimentos: AlimentoListaCompra[]; 
  }
  
  export interface AlimentoListaCompra {
    id: string; // ID del alimento seleccionado
    nombre: string; // Nombre del alimento
    cantidad: number; // Cantidad del alimento
    precio: number;
    precio2: number;
    subtotal: number; // Subtotal del alimento (precio * cantidad)
    subtotal2: number; // Subtotal del alimento (precio * cantidad)
  }
  