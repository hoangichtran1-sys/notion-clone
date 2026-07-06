"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useMutation } from "convex/react";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

interface DocumentsViewProps {
    user: User | null;
}

export const DocumentsView = ({ user }: DocumentsViewProps) => {
    const create = useMutation(api.public.documents.create);

    const handleCreate = () => {
        const promise = create({ title: "Untitled" });

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New notr created!",
            error: "Failed to create a new note.",
        });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/empty.svg"
                height={300}
                width={300}
                alt="Empty"
                className="dark:hidden"
            />
            <Image
                src="/empty-dark.svg"
                height={300}
                width={300}
                alt="Empty"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.name}&apos;s Notion
            </h2>
            <Button onClick={handleCreate}>
                <PlusCircleIcon className="size-4" />
                Create a note
            </Button>
        </div>
    );
};
