"use client";

import { SidebarInset, SidebarTrigger } from "@/components/sidebar-resizable";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";

export const AppSidebarInset = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <SidebarInset className="h-svh overflow-hidden">
            <main className="flex-1 h-full overflow-y-auto px-4 py-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SidebarTrigger className="-ml-1" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start">
                        Toggle Sidebar <Kbd>⌘+B</Kbd>
                    </TooltipContent>
                </Tooltip>
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            </main>
        </SidebarInset>
    );
};
