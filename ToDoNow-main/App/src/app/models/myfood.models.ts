export interface myfood {
  id: string;
  name: string;
  imagen: string; 
  stock: number;
  stock_ideal: number; 
  activo: boolean;
  bgColor?: string;
  showStockEditor?: boolean;
  stockToShow?: number;
  showIdealStockEditor?: boolean; // Nueva propiedad
  codigoBarras: string; 
}
