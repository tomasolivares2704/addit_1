export interface Ingredient {
  name: string;
  stock: number;
  faltante?: number; // Añade esta propiedad si la necesitas
}

  
export interface Receta {
  id?: string;
  name: string;
  imagen: string;
  calories: number;
  protein: number;
  fats: number;
  carbohydrates: number;
  video: string;
  categoria: CategoriaReceta;
  ingredients: Ingredient[];
}



  
export enum CategoriaReceta {
  Mariscos = 'Mariscos',
  Recetas_Marinas = 'Recetas Marinas',
  Asados = 'Asados',
  Ensaladas = 'Ensaladas',
  Vegano = 'Vegano',
  Frutas = 'Frutas',
  Sin_Gluten = 'Sin Gluten',
  Bajas_Calorías = 'Bajas Calorías',
  Alta_Proteína = 'Alta Proteína',
  Postres = 'Postres',
  Snacks = 'Snacks',
  Salsas = 'Salsas',
  Cereales = 'Cereales',
  Ricas_Fibra = 'Ricas en Fibra',
  Platos_Energéticos = 'Platos Energéticos',
  Pastas = 'Pastas',
  Sopas = 'Sopas',
  Platos_Sin_Lacteos = 'Platos Sin Lácteos',

}
  
  