"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/upload/single-image";
import {
    UploaderProvider,
    type UploadFn,
} from "@/components/upload/uploader-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { useCallback, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface CoverImageDialogProps {
    documentId: Id<"documents">;
    oldImageUrl?: string;
}

export const CoverImageDialog = ({
    documentId,
    oldImageUrl,
}: CoverImageDialogProps) => {
    const { openCoverImage, setOpenCoverImage, onCloseCoverImage } =
        useCoverImage();
    const { edgestore } = useEdgeStore();

    const update = useMutation(api.public.documents.update);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onUpload: UploadFn = useCallback(
        async ({ file, onProgressChange, signal }) => {
            try {
                setIsSubmitting(true);
                const res = await edgestore.publicFiles.upload({
                    file,
                    signal,
                    onProgressChange,
                    options: {
                        replaceTargetUrl: oldImageUrl,
                    },
                });

                await update({
                    id: documentId,
                    coverImage: res.url,
                });

                toast.success("Cover image uploaded");

                return res;
            } catch (error) {
                console.error(error);
                toast.error("Failed to upload cover");
                throw error;
            } finally {
                setIsSubmitting(false);
                onCloseCoverImage();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [edgestore, documentId, oldImageUrl],
    );

    return (
        <Dialog open={openCoverImage} onOpenChange={setOpenCoverImage}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <UploaderProvider uploadFn={onUpload} autoUpload>
                    <SingleImageDropzone
                        className="w-full"
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 4,
                        }}
                        disabled={isSubmitting}
                    />
                </UploaderProvider>
            </DialogContent>
        </Dialog>
    );
};
