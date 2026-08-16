"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/sidebar-resizable";
import { NavUser } from "../components/nav-user";
import { GalleryVerticalEndIcon, LifeBuoyIcon, SendIcon } from "lucide-react";
import { NavDocuments } from "../components/nav-documents";
import { NavMain } from "../components/nav-main";
import { NavSecondary } from "../components/nav-secondary";

const navSecondary = [
    {
        title: "Support",
        url: "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=hoangichtran@gmail.com",
        icon: LifeBuoyIcon,
    },
    {
        title: "Feedback",
        url: "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=hoangichtran@gmail.com",
        icon: SendIcon,
    },
];

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Sidebar collapsible="offcanvas">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GalleryVerticalEndIcon className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">Acme Inc</span>
                                        <span className="truncate text-xs">My Workspace</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain />
                    <NavDocuments />
                    <NavSecondary items={navSecondary} className="mt-auto" />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            {children}
        </>
    );
};
