import { User } from "@/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { GeneratedAvatar } from "../generated-avatar";
import { CameraIcon } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
    UploaderProvider,
    type UploadFn,
} from "@/components/upload/uploader-provider";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { authClient } from "@/lib/auth-client";

interface AvatarUploadProps {
    user: User;
}

export const AvatarUpload = ({ user }: AvatarUploadProps) => {
    const { edgestore } = useEdgeStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const onUpload: UploadFn = useCallback(
        async ({ file, onProgressChange, signal }) => {
            try {
                setIsSubmitting(true);
                const res = await edgestore.publicFiles.upload({
                    file,
                    signal,
                    onProgressChange,
                });

                await authClient.updateUser({
                    image: res.url,
                });

                toast.success("Avatar uploaded");

                return res;
            } catch (error) {
                console.error(error);
                toast.error("Failed to upload avatar");
                throw error;
            } finally {
                setIsSubmitting(false);
                setOpenDialog(false);
            }
        },
        [edgestore],
    );

    return (
        <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="text-center text-lg font-semibold">
                            User Profile
                        </h2>
                    </DialogHeader>
                    <UploaderProvider uploadFn={onUpload} autoUpload>
                        <SingleImageDropzone
                            className="w-full"
                            dropzoneOptions={{ maxSize: 1024 * 1024 * 4 }}
                            disabled={isSubmitting}
                        />
                    </UploaderProvider>
                </DialogContent>
            </Dialog>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpenDialog(true)}
                    type="button"
                    className="group relative size-20 shrink-0 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    {/* Avatar Upload */}
                    {user.image ? (
                        <Avatar className="size-20">
                            <AvatarImage src={user.image} />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar
                            seed={user.name || user.email}
                            size="lg"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <CameraIcon className="size-6 text-white" />
                    </div>
                </button>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Profile Photo</p>
                    <p className="text-xs text-muted-foreground">
                        Click the avatar to upload a new photo
                    </p>
                    <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 4MB.
                    </p>
                </div>
            </div>
        </>
    );
};
