export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link?: string;
    metadata?: Record<string, unknown>;
    referenceId?: string;
    createdAt: string;
}
