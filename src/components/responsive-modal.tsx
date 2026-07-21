"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "./ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    isSeparator?: boolean;
    className?: string;
}

export function ResponsiveModal({
    title,
    description,
    children,
    isOpen,
    onClose,
    isSeparator = false,
    className,
}: ResponsiveModalProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent
                    className={cn("max-h-[90vh] flex flex-col", className)}
                >
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        {description && (
                            <DrawerDescription>{description}</DrawerDescription>
                        )}
                    </DrawerHeader>
                    {isSeparator && <Separator />}
                    <div className="flex-1 overflow-y-auto scroll-fade p-4 pb-8">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-6">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>
                {isSeparator && <Separator />}
                {children}
            </DialogContent>
        </Dialog>
    );
}
