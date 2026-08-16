import {
    MoreHorizontalIcon,
    PlusCircleIcon,
    SearchIcon,
    SettingsIcon,
} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
} from "@/components/sidebar-resizable";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { useRouter } from "next/navigation";
import { useSearchModal } from "@/hooks/use-search-modal";
import { useSettingDialog } from "@/hooks/use-setting-dialog";
import { ConvexError } from "convex/values";
import { AppErrorData } from "@/types";
import { useUpgradePlan } from "@/hooks/use-upgrade-plan";

type SelectItem = "1" | "2" | "3";

export const NavMain = () => {
    const router = useRouter();

    const { onOpenSearchModal } = useSearchModal();
    const { onOpenSettingDialog } = useSettingDialog();
    const { triggerUpgradeModal } = useUpgradePlan();

    const [selectedItem, setSelectedItem] = useState<SelectItem | null>(null);
    const create = useMutation(api.public.documents.create);

    const handleCreate = () => {
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`))
            .catch((error) => {
                if (error instanceof ConvexError) {
                    const errorData = error.data as AppErrorData;
                    console.log(errorData);

                    if (errorData.code === "PAYMENT_REQUIRED") {
                        triggerUpgradeModal();
                    }
                } else {
                    toast.error("Something went wrong!");
                }
            });

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note.",
        });
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Search"
                            isActive={selectedItem === "1"}
                            onClick={() => {
                                setSelectedItem("1");
                                onOpenSearchModal();
                            }}
                        >
                            <SearchIcon />
                            <span>Search</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>
                            <Kbd>⌘ K</Kbd>
                        </SidebarMenuBadge>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Settings"
                            isActive={selectedItem === "2"}
                            onClick={() => {
                                setSelectedItem("2");
                                onOpenSettingDialog();
                            }}
                        >
                            <SettingsIcon />
                            <span>Settings</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction showOnHover>
                            <MoreHorizontalIcon />
                            <span className="sr-only">Settings theme</span>
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="New page"
                            isActive={selectedItem === "3"}
                            onClick={() => {
                                setSelectedItem("3");
                                handleCreate();
                            }}
                        >
                            <PlusCircleIcon />
                            <span>New page</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
