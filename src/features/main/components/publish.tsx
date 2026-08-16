import { useOrigin } from "@/hooks/use-origin";
import { Doc } from "../../../../convex/_generated/dataModel";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlobeIcon, CheckIcon, CopyIcon } from "lucide-react";
import { useUpgradePlan } from "@/hooks/use-upgrade-plan";

interface PublishProps {
    initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.public.documents.update);

    const { shouldBlock, triggerUpgradeModal, isLoading } = useUpgradePlan();

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = async () => {
        if (shouldBlock) {
            triggerUpgradeModal();
            return;
        }

        try {
            setIsSubmitting(true);
            update({
                id: initialData._id,
                isPublished: true,
            });
            toast.success("Note published!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to publish note.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const onUnpublish = async () => {
        try {
            setIsSubmitting(true);
            update({
                id: initialData._id,
                isPublished: false,
            });
            toast.success("Note unpublished!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to unpublish note.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Url copied to the clipboard.");

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {initialData.isPublished && (
                        <GlobeIcon className="size-4 text-sky-500" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <GlobeIcon className="text-sky-500 animate-pulse size-4" />
                            <p className="text-xs text-sky-500 font-medium">
                                This note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                disabled
                                value={url}
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <CheckIcon className="size-4" />
                                ) : (
                                    <CopyIcon className="size-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            className="text-xs w-full"
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <GlobeIcon className="size-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share the work with others.
                        </span>
                        <Button
                            disabled={isSubmitting || isLoading}
                            onClick={onPublish}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
