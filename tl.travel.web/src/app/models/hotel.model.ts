export interface HotelDTO {
  id?: number;
  name: string;
  stars?: number;
  contacts: string;
  isTemporaryClosed?: boolean;
  locationId?: number;
  locationName?: string;
  partnerId?: number;
  partnerName?: string;
}

export interface LocationDTO {
  id: number;
  name: string;
}

export interface PartnerDTO {
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