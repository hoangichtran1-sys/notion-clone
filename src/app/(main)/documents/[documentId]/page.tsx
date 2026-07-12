import { getToken } from "@/lib/auth-server";
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
    const token = await getToken();

    const preloadedDocument = await preloadQuery(
        api.public.documents.getPrivateDocument,
        {
            id: documentId,
        },
        { token },
    );

    return <DocumentView preloadedDocument={preloadedDocument} />;
};

export default Page;
