import { Foods } from './food.models';

export interface FoodList {
  food: Foods;
  cantidad: number;
  subtotal: number;
}

export function inicializarFoodList(foods: Foods[]): FoodList[] {
  return foods.map(food => {
    return {
      food,
      cantidad: 0,
      subtotal: 0
    };
  });
}
