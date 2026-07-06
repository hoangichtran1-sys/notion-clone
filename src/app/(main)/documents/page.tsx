import { DocumentsView } from "@/features/main/views/documents-view";
import { getCurrentUser } from "@/lib/auth-utils";

const Page = async () => {
    const user = await getCurrentUser();

    return <DocumentsView user={user} />;
};

export default Page;
