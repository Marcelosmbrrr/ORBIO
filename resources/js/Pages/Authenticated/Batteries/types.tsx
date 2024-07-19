export interface BatteryRecord {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    serial_number: string;
    last_charge: string;
    image_url: string;
    status: {
        title: string;
        style_key: string;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface BatterySelected {
    id: string;
    is_deleted: boolean;
}

