export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string; // JWT or session token returned by backend
  user: {
    id: number | string;
    username: string;
  };
}

export interface User {
  id: number | string;
  username: string;
}
