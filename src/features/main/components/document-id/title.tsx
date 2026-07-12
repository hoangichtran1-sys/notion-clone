import { useRef, useState } from "react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedCallback } from "use-debounce";

interface TitleProps {
    initialData: Doc<"documents">;
}

export const Title = ({ initialData }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditting, setIsEditting] = useState(false);
    const [title, setTitle] = useState(initialData.title || "Untitled");

    const update = useMutation(api.public.documents.update);

    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditting(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(
                0,
                inputRef.current.value.length,
            );
        }, 0);
    };

    const disableInput = () => {
        setIsEditting(false);
    };

    const debouncedUpdate = useDebouncedCallback((newValue: string) => {
        if (newValue === initialData.title) return;

        update({ id: initialData._id, title: newValue })
            .then(() => toast.success("Document updated"))
            .catch((error) => {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            });
    }, 500);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setTitle(newValue);
        debouncedUpdate(newValue);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            disableInput();
        }
    };

    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditting ? (
                <Input
                    ref={inputRef}
                    //onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate">{initialData?.title}</span>
                </Button>
            )}
        </div>
    );
};

export const TitleSkeleton = () => {
    return <Skeleton className="h-6 w-20 rounded-md" />;
};
