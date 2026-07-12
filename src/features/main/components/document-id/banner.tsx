import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

interface BannerProps {
    documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();

    const remove = useMutation(api.public.documents.destroy);
    const restore = useMutation(api.public.documents.restore);

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will permanently remove this document",
    );

    const onRemove = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        const promise = remove({ id: documentId }).then(() =>
            router.push("/documents"),
        );

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note.",
        });
    };

    const onRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note.",
        });
    };

    return (
        <>
            <RemoveConfirmation />
            <div className="w-full bg-rose-500  text-center text-sx p-2 text-white flex items-center gap-x-2 justify-center">
                <p>This page is in the trash</p>
                <Button
                    size="sm"
                    onClick={onRestore}
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Restore page
                </Button>
                <Button
                    size="sm"
                    onClick={onRemove}
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </div>
        </>
    );
};
