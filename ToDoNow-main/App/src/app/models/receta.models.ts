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
    ingredients: { name: string; stock: number;faltante: number;  }[];
  }
  
  