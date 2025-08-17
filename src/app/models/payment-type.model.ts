export interface PaymentTypeDTO {
  id?: number;
  name: string;
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