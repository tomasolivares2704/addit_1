export interface Foods {
  id: string;
  name: string;
  calories: number;
  imagen: string;
  fat: number;
  fat_sat: number;
  fat_trans: number;
  sodio: number;
  carbs: number;
  protein: number;
  colesterol: number;
  fibra: number;
  medida: string;
  price: number;
  categoria: CategoriaAlimento;
}


export enum CategoriaAlimento {
  Verduras = 'Verduras',
  Carnes = 'Carnes',
  Pescado = 'Pescado',
  Legumbres = 'Legumbres',
  Otros = 'Otros',
  Frutas = 'Frutas',
  Lácteos = 'Lácteos',
  Panadería = 'Panadería',
  Bebidas = 'Bebidas',
  Postres = 'Postres',
  Snacks = 'Snacks',
  Salsas = 'Salsas',
  Cereales = 'Cereales',
  Vegano = 'Vegano',
  Alcohol = 'Alcohol',
  Arroz = 'Arroz',
Pastas = 'Pastas',
Sopas = 'Sopas'

}


