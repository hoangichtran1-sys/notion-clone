"use client";

import Image from "next/image";
import { format } from "date-fns";
import {
    FileTextIcon,
    GlobeIcon,
    ArchiveIcon,
    MoreHorizontalIcon,
    ArchiveRestoreIcon,
    TrashIcon,
    UploadIcon,
} from "lucide-react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useCoverImage } from "@/hooks/use-cover-image";
import { CoverImageDialog } from "./document-id/cover-image-dialog";
import { useRouter } from "next/navigation";

interface DocumentCardProps {
    document: Doc<"documents">;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
    // Format thời gian tạo cho dễ đọc
    const formattedDate = format(document._creationTime, "MMM d, yyyy");
    const router = useRouter();

    const { onOpenCoverImage } = useCoverImage();

    const restore = useMutation(api.public.documents.restore);
    const remove = useMutation(api.public.documents.destroy);
    const archive = useMutation(api.public.documents.archive);

    const onArchived = (documentId: Id<"documents">) => {
        const promise = archive({ id: documentId });

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note.",
        });
    };

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
    };

    const onRedirect = () => {
        router.push(`/documents/${document._id}`);
    };

    return (
        <>
            <RemoveConfirmation />
            <CoverImageDialog
                documentId={document._id}
                oldImageUrl={document.coverImage}
            />
            <Card className="h-full p-0 overflow-hidden hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                {/* 1. Phần Cover Image (Ảnh bìa) */}
                <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {document.coverImage ? (
                        <Image
                            src={document.coverImage}
                            alt={document.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                            onClick={onRedirect}
                        />
                    ) : (
                        <>
                            <div
                                onClick={onRedirect}
                                className="w-full h-full bg-linear-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:cursor-pointer"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-x-1.5 z-10">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onOpenCoverImage}
                                    className="text-xs"
                                >
                                    <UploadIcon className="size-3" />
                                    Upload cover
                                </Button>
                            </div>
                        </>
                    )}

                    {/* 2. Badge Trạng thái (Archived / Published) */}
                    <div className="absolute top-2 right-2 flex items-center gap-x-1.5 z-10">
                        {document.isArchived && (
                            <Badge
                                variant="destructive"
                                className="flex items-center gap-x-1 text-[10px] px-1.5 py-0.5"
                            >
                                <ArchiveIcon className="size-3" />
                                Archived
                            </Badge>
                        )}
                        {document.isPublished && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-x-1 text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                            >
                                <GlobeIcon className="size-3" />
                                Published
                            </Badge>
                        )}
                    </div>
                </div>

                {/* 3. Phần Icon & Title */}
                <CardHeader className="p-4 pb-2 space-y-1">
                    <div
                        className="flex items-center gap-x-2 hover:underline hover:cursor-pointer"
                        onClick={onRedirect}
                    >
                        {document.icon ? (
                            <span className="text-xl leading-none">
                                {document.icon}
                            </span>
                        ) : (
                            <FileTextIcon className="size-5 text-muted-foreground shrink-0" />
                        )}
                        <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                            {document.title}
                        </CardTitle>
                    </div>
                </CardHeader>

                {/* 4. Footer hiển thị ngày khởi tạo */}
                <CardFooter className="flex justify-between gap-1.5 p-4 pt-2 text-xs text-muted-foreground">
                    <p>Created {formattedDate}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreHorizontalIcon className="size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {document.isArchived ? (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => onRestore(document._id)}
                                    >
                                        <ArchiveRestoreIcon className="size-3" />
                                        Restore
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => onRemove(document._id)}
                                    >
                                        <TrashIcon className="size-3" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => onArchived(document._id)}
                                >
                                    <ArchiveIcon className="size-3" />
                                    Archive
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            </Card>
        </>
    );
};
