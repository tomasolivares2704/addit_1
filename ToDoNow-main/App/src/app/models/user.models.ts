export interface User {
    uid: string;
    name: string;
    email: string;
    password?: string;
    isAdmin?: boolean; // Nuevo campo para indicar si es administrador
  }
  