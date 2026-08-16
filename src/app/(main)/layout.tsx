import { AppSidebar } from "@/features/main/sections/app-sidebar";
import { SidebarProvider } from "@/components/sidebar-resizable";
import { cookies } from "next/headers";
import { SIDEBAR_COOKIE_KEY } from "@/constants";
import { AppSidebarInset } from "@/features/main/sections/app-sidebar-inset";
import { SearchDialog } from "@/features/main/components/search-dialog";
import { SettingDialog } from "@/features/main/components/setting-dialog";
import { UpgradeModal } from "@/components/upgrade-modal";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
    const cookieStore = await cookies();

    const sidebarState = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:state`)?.value;
    //* get sidebar width from cookie
    const sidebarWidth = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:width`)?.value;

    let defaultOpen = true;

    if (sidebarState) {
        defaultOpen = sidebarState === "true";
    }

    return (
        <SidebarProvider cookieKey={SIDEBAR_COOKIE_KEY} defaultOpen={defaultOpen} defaultWidth={sidebarWidth}>
            <SearchDialog />
            <SettingDialog />
            <UpgradeModal />
            <AppSidebar>
                <AppSidebarInset>{children}</AppSidebarInset>
            </AppSidebar>
        </SidebarProvider>
    );
};

export default Layout;
