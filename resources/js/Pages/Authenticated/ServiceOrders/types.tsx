export interface ServiceOrderRecord {
    id: string;
    name: string;
    situation: {
        name: string;
        key: string;
    };
    pilot: string;
    client: string;
    attendant: string;
    observation: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ServiceOrderSelected {
    id: string;
    situation: { name: string, description: string };
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: Object[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}