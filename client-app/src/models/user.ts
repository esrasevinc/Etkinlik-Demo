export interface User {
    id: string;
    email: string;
    token: string;
    role: string;
    displayName: string;
    userName: string;
  }
  
  export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
  }