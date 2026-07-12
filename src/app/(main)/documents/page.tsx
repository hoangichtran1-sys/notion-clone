import { DocumentsView } from "@/features/main/views/documents-view";
import { getCurrentUser } from "@/lib/auth-utils";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

const Page = async () => {
    const token = await getToken();

    if (!token) {
        redirect("/sign-in");
    }

    const user = await getCurrentUser();

    const preloadedDocuments = await preloadQuery(
        api.public.documents.getDocuments,
        {},
        { token },
    );

    return (
        <DocumentsView preloadedDocuments={preloadedDocuments} user={user} />
    );
};

export default Page;
