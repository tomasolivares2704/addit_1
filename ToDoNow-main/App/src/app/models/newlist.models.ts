// newlist.models.ts
export interface NewList {
    id: string;
    nombre: string;
    total: number;
    total2: number;
    // Descomentar la propiedad alimentos
    alimentos: AlimentoListaCompra[];
    frecuenciaCompra: string; 
  }
  
  export interface AlimentoListaCompra {
    id: string;
    nombre: string;
    imagen: string;
    cantidad: number;
    precio: number;
    precio2: number;
    subtotal: number;
    subtotal2: number;
    precioSeleccionado: number; // Añadir esta propiedad para almacenar el precio seleccionado
  }