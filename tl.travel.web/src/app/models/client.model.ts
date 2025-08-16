export interface ClientDTO {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface BaseGridRequestModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface GridResponse<T> {
  data?: T[];
  records?: T[];
  totalCount: number;
  totalRecordsCount?: number;
  page: number;
  pageSize: number;
}