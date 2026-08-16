import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import ReactMarkdown from "react-markdown";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { SparklesIcon, TextAlignStartIcon } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import { summaryDocumentIdAtom } from "@/atoms/summary-document-id";
import { format } from "date-fns";
import { aiSummaryGenerate } from "@/actions/ai-summary-generate";
import { useEffect, useState } from "react";
import { useUpgradePlan } from "@/hooks/use-upgrade-plan";

interface AiSummaryProps {
    document: Doc<"documents">;
}

export const AiSummary = ({ document }: AiSummaryProps) => {
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
    const summaryDocumentId = useAtomValue(summaryDocumentIdAtom(document._id));

    const {
        triggerUpgradeModal,
        shouldBlock,
        isLoading: isLoadingSubscription,
    } = useUpgradePlan();

    const setSummaryDocumentId = useSetAtom(
        summaryDocumentIdAtom(document._id),
    );

    const handleGenerate = async () => {
        if (shouldBlock) {
            triggerUpgradeModal();
            return;
        }

        try {
            setIsLoadingGenerate(true);
            const content = await aiSummaryGenerate({
                title: document.title,
                content: document.content,
            });

            setSummaryDocumentId({
                content,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingGenerate(false);
        }
    };

    const handleRepeat = async () => {
        if (shouldBlock) {
            triggerUpgradeModal();
            return;
        }

        try {
            setIsLoadingRepeat(true);
            const content = await aiSummaryGenerate({
                title: document.title,
                content: document.content,
            });

            setSummaryDocumentId({
                content,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingRepeat(false);
        }
    };

    const handleRemove = () => {
        setSummaryDocumentId(null);
    };

    useEffect(() => {
        return () => {
            summaryDocumentIdAtom.remove(document._id);
        };
    }, [document._id]);

    const isLoading = isLoadingGenerate || isLoadingRepeat;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                    <SparklesIcon />
                    Summary
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-100 border shadow-sm p-3"
                align="start"
                side="left"
                alignOffset={8}
                forceMount
            >
                <div className="space-y-4">
                    {(!summaryDocumentId || !summaryDocumentId.content) &&
                        !isLoading && (
                            <Empty className="h-full bg-muted/30">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <TextAlignStartIcon />
                                    </EmptyMedia>
                                    <EmptyTitle>No content</EmptyTitle>
                                    <EmptyDescription className="max-w-xs text-pretty">
                                        You&apos;re all caught up. Click
                                        generate to summarize this document.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <Button
                                        disabled={
                                            isLoadingGenerate ||
                                            isLoadingSubscription
                                        }
                                        variant="default"
                                        size="sm"
                                        onClick={handleGenerate}
                                    >
                                        Generate
                                    </Button>
                                </EmptyContent>
                            </Empty>
                        )}

                    {summaryDocumentId &&
                        summaryDocumentId.content &&
                        !isLoading && (
                            <>
                                <div className="prose dark:prose-invert max-w-none text-sm">
                                    <ReactMarkdown>
                                        {summaryDocumentId.content}
                                    </ReactMarkdown>
                                </div>
                                {summaryDocumentId.createdAt && (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {format(
                                            summaryDocumentId.createdAt,
                                            "MMMM do, yyyy",
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-end gap-2">
                                    <Button
                                        disabled={false}
                                        onClick={handleRemove}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        disabled={
                                            isLoadingRepeat ||
                                            isLoadingSubscription
                                        }
                                        variant="default"
                                        size="sm"
                                        onClick={handleRepeat}
                                    >
                                        Re-render
                                    </Button>
                                </div>
                            </>
                        )}
                    {isLoading && (
                        <Marker
                            variant="separator"
                            role="status"
                            className="mt-1 mb-2"
                        >
                            <MarkerIcon>
                                <Spinner />
                            </MarkerIcon>
                            <MarkerContent className="shimmer">
                                Thinking&hellip;
                            </MarkerContent>
                        </Marker>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
