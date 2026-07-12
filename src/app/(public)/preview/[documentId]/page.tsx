import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DocumentView } from "@/features/main/views/document-view";

interface PageProps {
    params: Promise<{
        documentId: Id<"documents">;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { documentId } = await params;

    const preloadedDocument = await preloadQuery(
        api.public.documents.getPublishedDocument,
        {
            id: documentId,
        },
    );

    return (
        <DocumentView preloadedDocument={preloadedDocument} preview={true} />
    );
};

export default Page;
