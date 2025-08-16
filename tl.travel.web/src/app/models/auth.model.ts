export interface AuthCredentials {
  userName: string;
  password: string;
  revokeExistingToken?: boolean;
  rememberMe?: boolean;
}

export interface EditOperatorDTO {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface StatisticsResponse {
  count: number;
  label: string;
}