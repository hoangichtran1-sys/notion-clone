import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function safeRedirect(url: string | null) {
    if (!url) return "/";

    if (url.startsWith("/")) return url;

    return "/";
}
