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

type SelectItem = "1" | "2" | "3";

export const NavMain = () => {
    const [selectedItem, setSelectedItem] = useState<SelectItem | null>(null);
    const create = useMutation(api.public.documents.create);

    const handleCreate = () => {
        const promise = create({ title: "Untitled" });

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
