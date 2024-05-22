import { Foods } from "./food.models";

export interface List {
    id: string;  
    title: string;
    image?: string;
    purchaseFrequency: string;
    createdAt: Date; 
    products: Product[];  
  }
  
  export interface Product {
    id?: string;  
    listId: string;  
    food: Foods;
    quantity: number;
  }