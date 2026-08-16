import {
    Timeline,
    TimelineContent,
    TimelineDate,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
} from "@/components/reui/timeline";
import {
    format,
    formatDistanceToNow,
    differenceInCalendarDays,
} from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import {
    ClockIcon,
    EyeIcon,
    FileIcon,
    MoreHorizontalIcon,
    RefreshCcwIcon,
    RotateCcwIcon,
    TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Hint } from "@/components/hint";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { PreviewVersionModal } from "./preview-version-modal";
import { useUpgradePlan } from "@/hooks/use-upgrade-plan";

interface HistorySheetProps {
    document: Doc<"documents">;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const getColorStatus = (createdAt: Date) => {
    const difference = differenceInCalendarDays(
        new Date(),
        new Date(createdAt),
    );

    if (difference < 3) {
        return "bg-emerald-500";
    }

    if (difference >= 3 && difference < 7) {
        return "bg-blue-500";
    }

    if (difference >= 7 && difference < 30) {
        return "bg-orange-500";
    }

    return "bg-red-500";
};

export type VersionPeview = {
    versionId: Id<"documentsSnapshot">;
    title: string;
    content: string;
    createdAt: Date;
};

export const HistorySheet = ({
    document,
    open,
    onOpenChange,
}: HistorySheetProps) => {
    const [mounted, setMounted] = useState(false);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [versionPreview, setVersionPreview] = useState<null | VersionPeview>(
        null,
    );

    const { shouldBlock, triggerUpgradeModal, isLoading } = useUpgradePlan();

    const documentsVersion = useQuery(
        api.public.documents_snapshot.getDocumentsHistory,
        {
            id: document._id,
        },
    );

    const documentsVersionFormatted = (documentsVersion ?? []).map((item) => ({
        ...item,
        color: getColorStatus(new Date(item._creationTime)),
    }));

    const restoreVersion = useMutation(
        api.public.documents_snapshot.restoreVersion,
    );
    const removeVersion = useMutation(
        api.public.documents_snapshot.removeVersion,
    );

    const onRestore = (versionId: Id<"documentsSnapshot">) => {
        if (shouldBlock) {
            triggerUpgradeModal();
            return;
        }

        const promise = restoreVersion({ versionId, documentId: document._id });

        toast.promise(promise, {
            loading: "Restoring version...",
            success: "Version resotred!",
            error: "Failed to restore version.",
        });
    };

    const onRemove = (versionId: Id<"documentsSnapshot">) => {
        if (shouldBlock) {
            triggerUpgradeModal();
            return;
        }

        const promise = removeVersion({ versionId, documentId: document._id });

        toast.promise(promise, {
            loading: "Deleting version...",
            success: "Version deleted!",
            error: "Failed to delete version.",
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            {versionPreview && (
                <PreviewVersionModal
                    key={versionPreview.versionId}
                    isOpen={isOpenPreview}
                    onClose={() => {
                        setIsOpenPreview(false);
                        setVersionPreview(null);
                    }}
                    versionData={versionPreview}
                />
            )}
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="overflow-y-auto scroll-fade">
                    <SheetHeader>
                        <SheetTitle>
                            <div className="flex items-center gap-x-2">
                                {document.icon ? (
                                    <p>{document.icon}</p>
                                ) : (
                                    <FileIcon />
                                )}
                                <h2 className="text-lg font-semibold line-clamp-1">
                                    {document.title}
                                </h2>
                                <Hint text="Save document version">
                                    <Badge className="px-2" variant="secondary">
                                        ⌘+S
                                    </Badge>
                                </Hint>
                            </div>
                        </SheetTitle>
                        <SheetDescription>
                            Created at{" "}
                            {format(document._creationTime, "MMMM do, yyyy")}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="w-full max-w-lg mt-2">
                        {documentsVersionFormatted.length === 0 && (
                            <Empty className="h-full bg-muted/30">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <ClockIcon />
                                    </EmptyMedia>
                                    <EmptyTitle>No history</EmptyTitle>
                                    <EmptyDescription className="max-w-xs text-pretty">
                                        You&apos;re all caught up. New history
                                        edit document will appear here.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <Button variant="outline">
                                        <RefreshCcwIcon />
                                        Refresh
                                    </Button>
                                </EmptyContent>
                            </Empty>
                        )}
                        <Timeline defaultValue={0} className="gap-4 p-4">
                            {documentsVersionFormatted.map((item, index) => (
                                <TimelineItem
                                    key={index}
                                    step={index + 1}
                                    className="has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-foreground/20 group-data-[orientation=vertical]/timeline:not-last:pb-0"
                                >
                                    <TimelineHeader className="flex items-center gap-2.5">
                                        <TimelineSeparator className="dark:bg-gray-600" />
                                        <TimelineIndicator
                                            className={cn(
                                                "size-2.5 border-none",
                                                item.color,
                                            )}
                                        />
                                        <div className="flex items-center justify-between gap-1 w-full">
                                            <TimelineDate className="text-muted-foreground/60 mb-0 text-[10px] font-semibold uppercase flex-1">
                                                {format(
                                                    item._creationTime,
                                                    "MMM do, yyyy",
                                                )}
                                            </TimelineDate>
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <MoreHorizontalIcon className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    className="w-48"
                                                    side="bottom"
                                                    align="start"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setIsOpenPreview(
                                                                true,
                                                            );
                                                            setVersionPreview({
                                                                versionId:
                                                                    item._id,
                                                                title: item.title,
                                                                content:
                                                                    item.content,
                                                                createdAt:
                                                                    new Date(
                                                                        item._creationTime,
                                                                    ),
                                                            });
                                                        }}
                                                    >
                                                        <EyeIcon className="size-4" />
                                                        Review version
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onRestore(item._id)
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        <RotateCcwIcon className="size-4" />
                                                        Restore version
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onRemove(item._id)
                                                        }
                                                        disabled={isLoading}
                                                    >
                                                        <TrashIcon className="size-4" />
                                                        Remove version
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TimelineHeader>
                                    <TimelineContent className="text-foreground text-sm font-medium">
                                        <span className="text-muted-foreground">
                                            {item.event === "create" &&
                                                "Started:"}
                                            {item.event === "update" &&
                                                "Updated:"}
                                            {item.event === "restore" &&
                                                "Restored:"}
                                        </span>{" "}
                                        {item.message}
                                        <TimelineDate className="mt-2 mb-0">
                                            {formatDistanceToNow(
                                                new Date(item._creationTime),
                                                { addSuffix: true },
                                            )}
                                        </TimelineDate>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};
