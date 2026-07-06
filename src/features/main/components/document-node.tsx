"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
} from "@/components/sidebar-resizable";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon, FileIcon, PlusIcon } from "lucide-react";
import { DocumentList } from "./document-list";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

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
    const create = useMutation(api.public.documents.create);

    const handleCreate = () => {
        const promise = create({ title: "Untitled", parentDocument: id });

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note.",
        });
    };

    return (
        <SidebarMenuItem>
            <Collapsible
                key={id}
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={!!expanded}
                onOpenChange={onExpand}
            >
                <div className="flex items-start sidebar-item-group">
                    <CollapsibleTrigger asChild>
                        <button className="rounded-full h-8 w-5 hover:bg-sidebar-accent flex items-center justify-center">
                            <ChevronRightIcon className="size-4 transition-transform" />
                            <span className="sr-only">Toggle</span>
                        </button>
                    </CollapsibleTrigger>
                    <SidebarMenuButton onClick={onClick} isActive={active}>
                        {documentIcon ? (
                            <div>{documentIcon}</div>
                        ) : (
                            <FileIcon />
                        )}

                        {label}
                    </SidebarMenuButton>
                    <SidebarMenuAction
                        className="opacity-0 transition-opacity duration-200 pointer-events-none [.sidebar-item-group:hover>&]:opacity-100 [.sidebar-item-group:hover>&]:pointer-events-auto"
                        onClick={handleCreate}
                    >
                        <PlusIcon className="size-2" />
                        <span className="sr-only">New page</span>
                    </SidebarMenuAction>
                </div>
                <CollapsibleContent>
                    <DocumentList parenDocumentId={id} />
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
