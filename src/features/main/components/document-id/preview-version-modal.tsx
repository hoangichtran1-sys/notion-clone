"use client";

import { useTheme } from "next-themes";
import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { format } from "date-fns";
import { VersionPeview } from "./history";
import { ResponsiveModal } from "@/components/responsive-modal";

interface PreviewVersionModalProps {
    isOpen: boolean;
    onClose: () => void;
    versionData: VersionPeview | null;
}

export const PreviewVersionModal = ({
    isOpen,
    onClose,
    versionData,
}: PreviewVersionModalProps) => {
    const { resolvedTheme } = useTheme();

    const editor = useCreateBlockNote({
        initialContent: versionData
            ? (JSON.parse(versionData.content) as PartialBlock[])
            : undefined,
    });

    if (!versionData) {
        return null;
    }

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Version created at ${format(versionData.createdAt, "MMM do, yyyy")}`}
            isSeparator={true}
            className="min-w-160"
        >
            <div className="flex flex-col gap-y-3">
                <div className="pb-2 text-3xl font-bold wrap-break-word outlinne-none text-[#3F3F3F] dark:text-[#CFCFCF] text-left ml-6">
                    {versionData.title}
                </div>
                <div>
                    <BlockNoteView
                        editor={editor}
                        editable={false}
                        theme={resolvedTheme === "dark" ? "dark" : "light"}
                    />
                </div>
            </div>
        </ResponsiveModal>
    );
};
