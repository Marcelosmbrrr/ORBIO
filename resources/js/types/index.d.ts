export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Object[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}
