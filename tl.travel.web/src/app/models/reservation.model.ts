export interface ReservationPaymentDTO {
  id?: number;
  reservationId?: number;
  dueDate?: string;
  paymentTypeId?: number;
  paymentTypeName?: string;
  paymentChannelId?: number;
  paymentChannelName?: string;
  amount?: number;
  isPaid?: boolean;
  isActive?: boolean;
}

export interface ReservationRoomDTO {
  id?: number;
  adults?: number;
  children?: number;
  babies?: number;
  price?: number;
  hotelRoomId?: number;
  hotelRoomName?: string;
  reservationId?: number;
  feedingTypeId?: number;
  feedingTypeName?: string;
  isActive?: boolean;
}

export interface EditReservationDTO {
  id?: number;
  hotelId?: number;
  hotelName?: string;
  clientId?: number;
  clientName?: string;
  operatorId?: number;
  operatorName?: string;
  reservationStatusId?: number;
  reservationStatusName?: string;
  dateFrom?: string;
  dateTo?: string;
  customerNotes?: string;
  totalPrice?: number;
  reservationRooms?: ReservationRoomDTO[];
  reservationPayments?: ReservationPaymentDTO[];
}

export interface ReservationDTO extends EditReservationDTO {
  // Additional display properties if needed
}

export interface OperatorDTO {
  id: number;
  name: string;
}

export interface HotelDTO {
  id: number;
  name: string;
}

export interface ReservationStatusDTO {
  id: number;
  name: string;
}

export interface HotelRoomDTO {
  id: number;
  name: string;
  hotelId?: number;
}

export interface FeedingTypeDTO {
  id: number;
  name: string;
  code?: string;
}

export interface PaymentTypeDTO {
  id: number;
  name: string;
}

export interface PaymentChannelDTO {
  id: number;
  name: string;
}

export interface ClientDTO {
  id: number;
  name: string;
  email?: string;
  phone?: string;
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