"use client";

import { Title, TitleSkeleton } from "../components/document-id/title";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { SidebarTrigger } from "@/components/sidebar-resizable";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Banner } from "../components/document-id/banner";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu, MenuSkeleton } from "../components/document-id/menu";
import { Publish } from "../components/publish";
import { HistorySheet } from "../components/document-id/history";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlarmClockIcon } from "lucide-react";
import { AiSummary } from "../components/document-id/ai-summary";
import { Hint } from "@/components/hint";

export const AppNavbar = ({ documentId }: { documentId: Id<"documents"> }) => {
    const [openSheetHistory, setOpenSheetHistory] = useState(false);

    const document = useQuery(api.public.documents.getPrivateDocument, {
        id: documentId,
    });

    if (document === undefined) {
        return (
            <header className="flex h-14 shrink-0 items-center gap-2 dark:bg-[#1F1F1F]">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <Skeleton className="h-5 w-5 rounded-sm" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 ml-2 data-[orientation=vertical]:h-4 mt-3"
                    />
                    <div className="flex items-center justify-between w-full">
                        <TitleSkeleton />
                        <div className="flex items-center gap-x-2">
                            <MenuSkeleton />
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <>
            <HistorySheet
                document={document}
                open={openSheetHistory}
                onOpenChange={setOpenSheetHistory}
            />
            <header className="flex h-14 shrink-0 items-center gap-2 dark:bg-[#1F1F1F]">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger className="-ml-1" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start">
                            Toggle Sidebar <Kbd>⌘+B</Kbd>
                        </TooltipContent>
                    </Tooltip>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4 mt-2"
                    />
                    <div className="flex items-center justify-between w-full">
                        <Title initialData={document} />
                        <div className="flex items-center gap-x-2">
                            <AiSummary document={document} />
                            <Publish initialData={document} />
                            <Hint text="History document">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setOpenSheetHistory(true)}
                                    //title="History document"
                                >
                                    <AlarmClockIcon className="size-4" />
                                </Button>
                            </Hint>
                            <Menu documentId={document._id} />
                        </div>
                    </div>
                </div>
            </header>
            {document.isArchived && <Banner documentId={document._id} />}
        </>
    );
};
