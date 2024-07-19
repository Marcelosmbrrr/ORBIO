export interface TenantRecord {
    id: string;
    name: string;
    role: string;
    email: string;
    status: {
        value: number;
        title: string;
        style_key: string;
    };
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface TenantSelected {
    id: string;
    is_deleted: boolean;
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