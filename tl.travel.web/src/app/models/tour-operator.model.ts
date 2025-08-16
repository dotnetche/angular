export interface TourOperatorDTO {
  id?: number;
  name: string;
  commissionPercent?: number;
  isActive?: boolean;
}

export interface EditOperatorDTO {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface BaseGridRequestModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface GridResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}