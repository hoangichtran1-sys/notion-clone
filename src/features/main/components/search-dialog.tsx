"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import { FileIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchModal } from "@/hooks/use-search-modal";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export const SearchDialog = () => {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const {
        onCloseSearchModal,
        openSearchModal,
        setOpenSearchModal,
        onToggleSearchModal,
    } = useSearchModal();

    const user = useQuery(api.public.user.getCurrentUser);
    const documents = useQuery(api.public.documents.getSearch);

    const archive = useMutation(api.public.documents.archive);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const onArchive = (documentId: Id<"documents">) => {
        const promise = archive({ id: documentId });

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note.",
        });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                onToggleSearchModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onToggleSearchModal]);

    if (!isMounted || documents === undefined) {
        return null;
    }

    return (
        <CommandDialog open={openSearchModal} onOpenChange={setOpenSearchModal}>
            <Command>
                <CommandInput
                    placeholder={`Search ${user?.name}'s Notion...`}
                />
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
                                onSelect={() => {
                                    router.push(`/documents/${item._id}`);
                                    onCloseSearchModal();
                                }}
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
                                        onClick={() => onArchive(item._id)}
                                        variant="ghost"
                                        size="icon-sm"
                                    >
                                        <XIcon className="size-3.5" />
                                    </Button>
                                </CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
};
