import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        documentId: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    await requireAuth();
    const { documentId } = await params;
    return <div className="">Page: {documentId}</div>;
};

export default Page;
