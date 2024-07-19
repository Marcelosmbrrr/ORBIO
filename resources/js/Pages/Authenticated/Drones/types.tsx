export interface DroneRecord {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    record_number: string;
    serial_number: string;
    weight: number;
    image: string;
    status: {
        title: string;
        style_key: string;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface DroneSelected {
    id: string;
    is_deleted: boolean;
}