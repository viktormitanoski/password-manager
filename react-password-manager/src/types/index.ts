export interface User {
    email: string;
    password: string;
    salt?: string;
  }
  
  export interface PasswordEntry {
    id?: number;
    siteName: string;
    siteEmail: string;
    sitePassword: string;
    createdAt?: string;
  }
  
  export interface LoginResponse {
    token: string;
    vaultKey: string;
  }
  