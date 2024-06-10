import { Foods } from "./food.models";

export interface List {
    id: string;  
    title: string;
    image?: string;
    purchaseFrequency: string;
    createdAt: Date; 
    food: Foods[];  
  }
