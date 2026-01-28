export interface CloudEvent<T = any> {
    specversion: string;
    type: string;
    source: string;
    id: string;
    time: string;
    datacontenttype: string;
    data: T;
}

export interface ReservationCreatedData {
    reservationId: string;
    restaurantId: string;
    userId: string;
    confirmationCode: string;
    date: string;
    time: string;
    guests: number;
    customerEmail: string;
    customerName: string;
    status: string;
    specialRequest?: string;
    createdAt: string;
}

export interface ReservationCancelledData {
    reservationId: string;
    restaurantId: string;
    userId: string;
    reason?: string;
    cancelledAt: string;
}

export interface ReservationStatusChangedData {
    reservationId: string;
    restaurantId: string;
    userId: string;
    status: string;
    updatedAt: string;
}

export enum EventType {
    RESERVATION_CREATED = 'com.bookabite.reservation.created.v1',
    RESERVATION_CANCELLED = 'com.bookabite.reservation.cancelled.v1',
    RESERVATION_CONFIRMED = 'com.bookabite.reservation.confirmed.v1',
    RESERVATION_COMPLETED = 'com.bookabite.reservation.completed.v1',
    RESERVATION_STATUS_CHANGED = 'com.bookabite.reservation.status-changed.v1',
}

export enum EventTopic {
    RESERVATION_EVENTS = 'reservation-events',
}
