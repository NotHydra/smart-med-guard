export interface FormattedResponseInterface<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

export interface SuccessResponseInterface<T> {
    status: number;
    message: string;
    data: T;
}
