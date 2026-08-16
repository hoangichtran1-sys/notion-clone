export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    userId?: string | null | undefined;
    bio?: string | null | undefined;
};

export type AppErrorCode = "FORBIDDEN" | "PAYMENT_REQUIRED" | "NOT_FOUND" | "BAD_REQUEST" | "UNAUTHORIZED" | "INTERNAL_SERVER";

export interface AppErrorData {
    code: AppErrorCode;
    message: string;
    severity?: "low" | "medium" | "high";
}
