import { Foods } from "./food.models";

export interface List {
    id: string;  
    title: string;
    image?: string;
    purchaseFrequency: string;
    createdAt: Date; 
    product: Product[];  
  }

export interface Product{
  id: string;
  cantidad: number;
  product: Foods;
  Total: number;
}