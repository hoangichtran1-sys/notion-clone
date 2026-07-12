"use client";

import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import { FileIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();

    const documents = useQuery(api.public.documents.getTrash);
    const restore = useMutation(api.public.documents.restore);
    const remove = useMutation(api.public.documents.destroy);

    const onRestore = (documentId: Id<"documents">) => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore.",
        });
    };

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will permanently remove this document",
    );

    const onRemove = async (documentId: Id<"documents">) => {
        const ok = await confirmRemove();
        if (!ok) return;

        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete.",
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    };

    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <>
            <RemoveConfirmation />
            <Command className="max-w-sm rounded-lg">
                <CommandInput placeholder="Search a document..." />
                <CommandList>
                    <CommandEmpty>
                        <p className="text-sm text-muted-foreground italic">
                            No documents found.
                        </p>
                    </CommandEmpty>
                    <CommandGroup
                        heading="Documents"
                        className={cn(documents.length === 0 && "hidden")}
                    >
                        {documents.map((item) => (
                            <CommandItem
                                key={item._id}
                                value={item._id}
                                keywords={[item.title]}
                                title={item.title}
                                onSelect={() =>
                                    router.push(`/documents/${item._id}`)
                                }
                            >
                                {item.icon ? (
                                    <p className="mr-2 text-[18pxs]">
                                        {item.icon}
                                    </p>
                                ) : (
                                    <FileIcon className="size-4" />
                                )}
                                <span className="line-clamp-1">
                                    {item.title}
                                </span>

                                <CommandShortcut>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRestore(item._id);
                                        }}
                                        variant="ghost"
                                        size="icon-sm"
                                    >
                                        <UndoIcon className="size-3.5" />
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(item._id);
                                        }}
                                        variant="destructive"
                                        size="icon-sm"
                                    >
                                        <Trash2Icon className="size-3.5" />
                                    </Button>
                                </CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </>
    );
};
