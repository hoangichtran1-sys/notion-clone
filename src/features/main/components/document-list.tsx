"use client";

import { useParams, useRouter } from "next/navigation";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DocumentNode, DocumentNodeSkeleton } from "./document-node";
import { useConvexAuth } from "convex/react";

interface DocumentListProps {
    parenDocumentId?: Id<"documents">;
    data?: Doc<"documents">[];
}

export const DocumentList = ({ parenDocumentId }: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();

    const { isAuthenticated } = useConvexAuth();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded((prev) => ({
            ...prev,
            [documentId]: !prev[documentId],
        }));
    };

    const documents = useQuery(api.public.documents.getTreeMany, isAuthenticated ? {
        parentDocument: parenDocumentId,
    }: "skip");

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if (documents === undefined) {
        return (
            <>
                <DocumentNodeSkeleton />
                <DocumentNodeSkeleton />
            </>
        );
    }

    return (
        <>
            {documents.length === 0 && (
                <p className="text-xs text-muted-foreground italic pl-6 line-clamp-2">
                    No pages inside
                </p>
            )}
            {documents.map((document) => (
                <DocumentNode
                    key={document._id}
                    id={document._id}
                    active={params.documentId === document._id}
                    onExpand={() => onExpand(document._id)}
                    expanded={expanded[document._id]}
                    documentIcon={document.icon}
                    label={document.title}
                    onClick={() => onRedirect(document._id)}
                />
            ))}
        </>
    );
};
