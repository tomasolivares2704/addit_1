export interface Ingredient {
    name: string;
    stock: number;
    faltante: number;
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
    ingredients: { name: string; stock: number;faltante: number;  }[];
  }



  
export enum CategoriaReceta {
  Mariscos = 'Mariscos',
  Recetas_Marinas = 'Recetas Marinas',
  Asados = 'Asados',
  Ensaladas = 'Ensaladas',
  Vegano = 'Vegano',
  Frutas = 'Frutas',
  Sin_Gluten = 'Sin_Gluten',
  Bajas_Calorías = 'Bajas_Calorías',
  Alta_Proteína = 'Alta_Proteína',
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
  
  