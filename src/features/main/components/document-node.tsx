"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/sidebar-resizable";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    ChevronRightIcon,
    FileIcon,
    MoreHorizontalIcon,
    PlusIcon,
    TrashIcon,
} from "lucide-react";
import { DocumentList } from "./document-list";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocumentNodeProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    onExpand?: () => void;
    onClick: () => void;
    label: string;
}

export const DocumentNode = ({
    id,
    onClick,
    label,
    active,
    documentIcon,
    onExpand,
    expanded,
}: DocumentNodeProps) => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const user = useQuery(api.public.user.getCurrentUser);

    const create = useMutation(api.public.documents.create);

    const archive = useMutation(api.public.documents.archive);

    const handleCreate = () => {
        const promise = create({ title: "Untitled", parentDocument: id }).then(
            (documentId) => {
                if (!expanded) {
                    onExpand?.();
                }

                router.push(`/documents/${documentId}`);
            },
        );

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note.",
        });
    };

    const handleArchived = () => {
        if (!id) return;

        const promise = archive({ id });

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note.",
        });
    };

    return (
        <SidebarMenuItem>
            <Collapsible
                key={id}
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                open={!!expanded}
                onOpenChange={onExpand}
            >
                <div className="flex items-start">
                    <CollapsibleTrigger asChild>
                        <button className="rounded-full h-8 w-5 hover:bg-sidebar-accent flex items-center justify-center">
                            <ChevronRightIcon className="size-4 transition-transform text-neutral-500" />
                            <span className="sr-only">Toggle</span>
                        </button>
                    </CollapsibleTrigger>
                    <div className="relative flex justify-between items-center gap-1 min-w-40 sidebar-item-group">
                        <SidebarMenuButton
                            className="flex-1"
                            onClick={onClick}
                            isActive={active}
                        >
                            {documentIcon ? (
                                <div>{documentIcon}</div>
                            ) : (
                                <FileIcon />
                            )}

                            {label}
                        </SidebarMenuButton>
                        <div className="flex items-center absolute right-1 opacity-0 transition-opacity duration-200 pointer-events-none [.sidebar-item-group:hover>&]:opacity-100 [.sidebar-item-group:hover>&]:pointer-events-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon-xs"
                                        variant="ghost"
                                        className="shrink-0 rounded-full"
                                        type="button"
                                    >
                                        <MoreHorizontalIcon className="size-4" />
                                        <span className="sr-only">
                                            Dropdown menu
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side={isMobile ? "bottom" : "right"}
                                    align="center"
                                    className="w-60"
                                >
                                    <DropdownMenuItem onClick={handleArchived}>
                                        <TrashIcon className="size-4" />
                                        Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <div className="text-xs text-muted-foreground p-2">
                                        Last edited by:{" "}
                                        {user?.name || user?.email}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                size="icon-xs"
                                variant="ghost"
                                className="shrink-0 rounded-full"
                                onClick={handleCreate}
                            >
                                <PlusIcon className="size-4" />
                                <span className="sr-only">New page</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        <DocumentList parenDocumentId={id} />
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
};

export const DocumentNodeSkeleton = () => {
    return (
        <div
            style={{
                paddingLeft: "36px",
            }}
            className="flex gap-x-2 py-0.75"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};
