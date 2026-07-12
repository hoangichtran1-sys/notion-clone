import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { cn } from "@/lib/utils";
import { ImageOffIcon, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverProps {
    url?: string;
    preview?: boolean;
    documentId: Id<"documents">;
}

export const Cover = ({ url, preview, documentId }: CoverProps) => {
    const { onOpenCoverImage } = useCoverImage();
    const { edgestore } = useEdgeStore();

    const removeCover = useMutation(api.public.documents.removeCover);

    const onRemove = async () => {
        if (url) {
            try {
                await edgestore.publicFiles.delete({ url });

                await removeCover({ id: documentId });

                toast("Cover image removed");
            } catch (error) {
                console.error(error);
                toast.error("Failed to remove image");
            }
        }
    };

    return (
        <div
            className={cn(
                "relative w-full h-[35vh] group",
                !url && "h-[12vh]",
                url && "bg-muted",
            )}
        >
            {!!url && (
                <Image src={url} alt="Cover" className="object-cover" fill />
            )}
            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        size="sm"
                        className="text-xs text-muted-foreground"
                        variant="outline"
                        onClick={onOpenCoverImage}
                    >
                        <ImageUpIcon className="size-4" />
                        Change cover
                    </Button>
                    <Button
                        size="sm"
                        className="text-xs text-muted-foreground"
                        variant="outline"
                        onClick={onRemove}
                    >
                        <ImageOffIcon className="size-4" />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    );
};

export const CoverSkeleton = () => {
    return <Skeleton className="w-full h-[12vh]" />;
};
