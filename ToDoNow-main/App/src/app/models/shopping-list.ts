export interface shoppinglist {
    id:string,
    title:string,
    frequency: string,
    items: Item[]
}


export interface Item {
    name: string,
    brand: string,
    quantity: number,
    description: string,
    calories: number;
    
}