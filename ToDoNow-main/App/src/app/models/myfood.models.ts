export interface myfood {
  id: string;
  name: string;
  imagen: string; 
  stock: number;
  stock_ideal: number; 
  activo: boolean;  // Nuevo atributo
  bgColor?: string;
  showStockEditor?: boolean;
  stockToShow?: number; 
}
