"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

export const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const lastLoadedContent = useRef<string | undefined>(initialContent);

    const editor = useCreateBlockNote({
        initialContent: initialContent
            ? (JSON.parse(initialContent) as PartialBlock[])
            : undefined,
        uploadFile: async (file) => {
            try {
                const res = await edgestore.publicFiles.upload({ file });

                return res.url;
            } catch (error) {
                console.error(error);
                return "";
            }
        },
    });

    useEffect(() => {
        if (!editor || initialContent === undefined) return;

        if (
            initialContent !== lastLoadedContent.current &&
            initialContent !== JSON.stringify(editor.document)
        ) {
            lastLoadedContent.current = initialContent;

            const parsedBlocks = JSON.parse(initialContent) as PartialBlock[];
            editor.replaceBlocks(editor.document, parsedBlocks);
        }
    }, [initialContent, editor]);

    useEffect(() => {
        if (!editor || !editable) return;

        const unsubscribe = editor.onChange(() => {
            const jsonString = JSON.stringify(editor.document, null, 2);
            onChange(jsonString);
        });

        return () => {
            unsubscribe();
        };
    }, [editor, onChange, editable]);

    return (
        <div>
            <BlockNoteView
                editor={editor}
                editable={editable}
                // onChange={(editor) => {
                //     onChange(JSON.stringify(editor.document, null, 2));
                // }}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
            />
        </div>
    );
};
