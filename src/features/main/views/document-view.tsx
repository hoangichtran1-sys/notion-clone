"use client";

import dynamic from "next/dynamic";
import { api } from "../../../../convex/_generated/api";
import { Cover } from "../components/document-id/cover";
import { CoverImageDialog } from "../components/document-id/cover-image-dialog";
import { Toolbar } from "../components/document-id/toolbar";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const Editor = dynamic(
    () =>
        import("@/features/main/components/document-id/editor").then(
            (mod) => mod.Editor,
        ),
    {
        ssr: false,
    },
);

interface DocumentViewProps {
    preloadedDocument: Preloaded<
        | typeof api.public.documents.getPrivateDocument
        | typeof api.public.documents.getPublishedDocument
    >;
    preview?: boolean;
}

export const DocumentView = ({
    preloadedDocument,
    preview = false,
}: DocumentViewProps) => {
    const document = usePreloadedQuery(preloadedDocument);
    const update = useMutation(api.public.documents.update);
    const [content, setContent] = useState(document.content);

    const onDebounceEditor = useDebouncedCallback(
        (newContent: string) => {
            if (newContent === document.content) return;

            update({ id: document._id, content: newContent })
                .then(() => console.log("Updated content"))
                .catch((error) => console.error(error));
        },
        1500,
        { maxWait: 5000 },
    );

    const onEditor = (newContent: string) => {
        setContent(newContent);
        onDebounceEditor(newContent);
    };

    console.log(content);

    return (
        <>
            <CoverImageDialog
                documentId={document._id}
                oldImageUrl={document.coverImage}
            />
            <div className="pb-40">
                <Cover
                    url={document.coverImage}
                    preview={preview}
                    documentId={document._id}
                />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                    <Toolbar initialData={document} preview={preview} />
                    <Editor
                        onChange={onEditor}
                        initialContent={document.content}
                        editable={!preview}
                    />
                </div>
            </div>
        </>
    );
};
