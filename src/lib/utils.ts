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

type BlockNoteBlock = {
    type?: string;
    content?: string | Array<{ type: string; text?: string }>;
    children?: BlockNoteBlock[];
};

export function convertBlockNoteToText(blocks: BlockNoteBlock[]): string {
    if (!Array.isArray(blocks)) return "";

    return blocks
        .map((block) => {
            let blockText = "";

            // 1. Trích xuất text từ mảng content của block hiện tại
            if (Array.isArray(block.content)) {
                blockText = block.content.map((item) => item.text || "").join("");
            } else if (typeof block.content === "string") {
                blockText = block.content;
            }

            // 2. Đệ quy lấy thêm text từ các block con (children) nếu có
            let childrenText = "";
            if (Array.isArray(block.children) && block.children.length > 0) {
                childrenText = convertBlockNoteToText(block.children);
            }

            // 3. Ghép nội dung
            return [blockText, childrenText].filter(Boolean).join("\n");
        })
        .filter(Boolean)
        .join("\n");
}

export function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
