"use client";

import { SidebarInset } from "@/components/sidebar-resizable";
import { AppNavbar } from "./app-navbar";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

interface AppSidebarInsetProps {
    children: React.ReactNode;
}

export const AppSidebarInset = ({ children }: AppSidebarInsetProps) => {
    const params = useParams();

    const documentId = params.documentId as Id<"documents"> | undefined;

    return (
        <SidebarInset className="h-svh overflow-hidden">
            {documentId ? <AppNavbar documentId={documentId} /> : null}
            <main className="flex-1 h-full overflow-y-auto px-4 py-2 dark:bg-[#1F1F1F]">
                {children}
            </main>
        </SidebarInset>
    );
};
