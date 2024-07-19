export interface FlightPlanRecord {
    id: string;
    name: string;
    coordinates: string;
    state: string;
    city: string;
    file: {
        single: string;
        multi: string[];
    };
    status: {
        style_key: string;
        title: string;
    },
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface FlightPlanSelected {
    id: string;
    is_deleted: boolean;
}