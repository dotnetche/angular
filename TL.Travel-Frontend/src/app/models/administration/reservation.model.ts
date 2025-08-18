import { NgClass } from "@angular/common";

export class ReservationPaymentDTO {
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

export class ReservationRoomDTO {
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

export class EditReservationDTO {
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

export class ReservationDTO extends EditReservationDTO {
  // Additional display properties if needed
}

export class OperatorDTO {
  id: number;
  name: string;
}

export class HotelDTO {
  id: number;
  name: string;
}

export class ReservationStatusDTO {
  id: number;
  name: string;
}

export class HotelRoomDTO {
  id: number;
  name: string;
  hotelId?: number;
}

export class FeedingTypeDTO {
  id: number;
  name: string;
  code?: string;
}

export class PaymentTypeDTO {
  id: number;
  name: string;
}

export class PaymentChannelDTO {
  id: number;
  name: string;
}

export class ClientDTO {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export class BaseGridRequestModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export class GridResponse<T> {
  data?: T[];
  records?: T[];
  totalCount: number;
  totalRecordsCount?: number;
  page: number;
  pageSize: number;
}