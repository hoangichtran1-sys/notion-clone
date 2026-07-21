import { IconPicker } from "@/components/icon-picker";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon, SmilePlusIcon, XIcon } from "lucide-react";
import { type ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useDebouncedCallback } from "use-debounce";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const { onOpenCoverImage } = useCoverImage();

    const [isEditting, setIsEditting] = useState(false);
    const [value, setValue] = useState(initialData.title);

    const update = useMutation(api.public.documents.update);
    const removeIcon = useMutation(api.public.documents.removeIcon);

    const enableInput = () => {
        if (preview) return;

        setIsEditting(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const disableInput = () => setIsEditting(false);

    const onDebounceInput = useDebouncedCallback((newValue: string) => {
        if (newValue === initialData.title) return;
        update({ id: initialData._id, title: newValue })
            .then(() => console.log("Updated title"))
            .catch((error) => console.error(error));
    }, 300);

    const onInput = (newValue: string) => {
        setValue(newValue);
        onDebounceInput(newValue);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            disableInput();
        }
    };

    const onIconSelect = (icon: string) => {
        update({
            id: initialData._id,
            icon,
        }).then(() => toast.success("Icon selected"));
    };

    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id,
        }).then(() => toast.success("Icon removed"));
    };

    return (
        <div className="pl-13.5 group relative">
            {!!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6 relative">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        size="icon-xs"
                        onClick={onRemoveIcon}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs absolute bottom-0 left-1"
                        variant="outline"
                    >
                        <XIcon className="size-3" />
                    </Button>
                </div>
            )}
            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">{initialData.icon}</p>
            )}

            <div className="opacity-0 group-hover:opacity-100 flex flex-1 items-center gap-x-2 py-4">
                {!initialData.icon && !preview && (
                    <IconPicker asChild={true} onChange={onIconSelect}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-muted-foreground"
                        >
                            <SmilePlusIcon className="size-4" />
                            Add icon
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button
                        onClick={onOpenCoverImage}
                        variant="outline"
                        size="sm"
                        className="text-xs text-muted-foreground"
                    >
                        <ImagePlusIcon className="size-4" />
                        Add cover
                    </Button>
                )}
            </div>

            {isEditting && !preview ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className="text-5xl bg-transparent font-bold wrap-break-word outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl font-bold wrap-break-word outlinne-none text-[#3F3F3F] dark:text-[#CFCFCF]"
                >
                    {initialData.title}
                </div>
            )}
        </div>
    );
};
