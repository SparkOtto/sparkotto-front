
export type Vehicle = {
    id_vehicle: number;
    brand: string;
    model: string;
    fuel_type: { fuel_name: string };
    fuelTypeId: number;
    license_plate: string;
    mileage: number;
    seat_count: number;
    agency_id: number;
    available: boolean;
    fuel_capacity?: number;
    transmission: { transmission_type: string };
    transmissionId: number;
    reservedSeats: number;
    image?: string;
    trips: Trip[];
    keys: Key[];
};

export type User = {
    id_user: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    agency_id: number;
    agency: Agency;
    active: boolean;
    deactivation_date: Date;
}

export type Trip = {
    id_trip: number;
    id_used_key: number;
    id_vehicle: number;
    id_driver: number;
    start_date: Date;
    end_date: Date;
    departure_agency: number;
    arrival_agency: number;
    reservation_status: string;
    carpooling: boolean;
    carpoolings: string[];
    meeting_time?: Date;
    meeting_comment?: string;
    driver: User;
    agency_departure: Agency;
    agency_arrival: Agency;
};

export type Key = {
    id_key: number;
    key_name: string;
    vehicle_key: Vehicle;
    vehicleKeyId: number;
    trips: Trip[];
};

export type Agency = {
    id_agency: number;
    city: string;
    postal_code: number;
    street: string;
    additional_info?: string;
    phone: string;
    head_office: boolean;
};
