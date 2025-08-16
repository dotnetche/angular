export interface FeedingTypeDTO {
  id?: number;
  code: string;
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
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}