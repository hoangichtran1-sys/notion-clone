"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { User } from "@/types";
import { useSettingsProfileModal } from "@/hooks/use-settings-profile-modal";

interface UserMenuProps {
    user: User;
}

export const UserMenu = ({ user }: UserMenuProps) => {
    const router = useRouter();
    const { onOpenSettingsProfileModal } = useSettingsProfileModal();

    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logout successfully");
                    router.refresh();
                },
            },
        });
    };

    return (
        <div className="flex flex-row items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger className="border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    {user.image ? (
                        <Avatar>
                            <AvatarImage src={user.image} />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar seed={user.name || user.email} />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    sideOffset={10}
                    className="w-64 md:w-48 rounded-xl shadow-md bg-white dark:bg-black overflow-hidden right-1 top-12 text-sm font-semibold"
                >
                    <DropdownMenuItem className="mt-2" onClick={onOpenSettingsProfileModal}>
                        <CgProfile className="size-5" />
                        My profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="mt-4" onClick={onLogout}>
                        <LogOutIcon className="size-5" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
