export interface HotelRoomDTO {
  id?: number;
  hotelId?: number;
  hotelName?: string;
  name: string;
  price?: number;
  description?: string;
  maxAdults?: number;
  maxChildren?: number;
  maxBabies?: number;
}

export interface HotelDTO {
  id: number;
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