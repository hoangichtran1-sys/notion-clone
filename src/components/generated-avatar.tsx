"use client";

import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("", {
    variants: {
        size: {
            default: "h-9 w-9",
            sm: "h-6 w-6",
            lg: "h-20 w-20",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

interface GeneratedAvatarProps extends VariantProps<typeof avatarVariants> {
    seed: string;
    className?: string;
}
export function GeneratedAvatar({
    seed,
    className,
    size,
}: GeneratedAvatarProps) {
    const avatar = createAvatar(initials, {
        seed,
        fontWeight: 500,
        fontSize: 42,
    });

    return (
        <Avatar className={cn(avatarVariants({ size }), className)}>
            <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
            <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}
