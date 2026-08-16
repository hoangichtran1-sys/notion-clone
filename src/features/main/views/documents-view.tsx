"use client";

import { Button } from "@/components/ui/button";
import { AppErrorData, User } from "@/types";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { PlusCircleIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { useUpgradePlan } from "@/hooks/use-upgrade-plan";
import { DocumentCard } from "../components/document-card";

interface DocumentsViewProps {
    user: User | null;
    preloadedDocuments: Preloaded<typeof api.public.documents.getDocuments>;
}

export const DocumentsView = ({ user, preloadedDocuments }: DocumentsViewProps) => {
    const router = useRouter();

    const { triggerUpgradeModal } = useUpgradePlan();

    const create = useMutation(api.public.documents.create);

    const documents = usePreloadedQuery(preloadedDocuments);

    const handleCreate = () => {
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`))
            .catch((error) => {
                if (error instanceof ConvexError) {
                    const errorData = error.data as AppErrorData;
                    console.log(errorData);

                    if (errorData.code === "PAYMENT_REQUIRED") {
                        triggerUpgradeModal();
                    }
                } else {
                    toast.error("Something went wrong!");
                }
            });

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New notr created!",
            error: "Failed to create a new note.",
        });
    };

    if (documents.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Image src="/empty.svg" height={300} width={300} alt="Empty" className="dark:hidden" />
                <Image src="/empty-dark.svg" height={300} width={300} alt="Empty" className="hidden dark:block" />
                <h2 className="text-lg font-medium">Welcome to {user?.name}&apos;s Notion</h2>
                <Button onClick={handleCreate}>
                    <PlusCircleIcon className="size-4" />
                    Create a note
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-[#F1F3F4] min-h-full py-6">
            <div className="max-w-7xl mx-auto px-6 sm:px-16 flex flex-col gap-y-4">
                <div className="flex justify-between gap-2">
                    <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">My documents</h3>
                    <Button size="sm" onClick={handleCreate} className="rounded-md">
                        <PlusIcon className="size-4" />
                        New node
                    </Button>
                </div>

                {/* Chia cột Responsive: Mobile 1 cột, Tablet 2-3 cột, Desktop 4 cột */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {documents.map((document) => (
                        <DocumentCard document={document} key={document._id} />
                    ))}
                </div>
            </div>
        </div>
    );
};
