import { AppSidebar } from "@/features/main/components/app-sidebar";
import { requireAuth } from "@/lib/auth-utils";
import { SidebarProvider } from "@/components/sidebar-resizable";
import { cookies } from "next/headers";
import { SIDEBAR_COOKIE_KEY } from "@/constants";
import { AppSidebarInset } from "@/features/main/components/app-sidebar-inset";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth();

    const cookieStore = await cookies();

    const sidebarState = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:state`)?.value;
    //* get sidebar width from cookie
    const sidebarWidth = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:width`)?.value;

    let defaultOpen = true;

    if (sidebarState) {
        defaultOpen = sidebarState === "true";
    }

    return (
        <SidebarProvider
            cookieKey={SIDEBAR_COOKIE_KEY}
            defaultOpen={defaultOpen}
            defaultWidth={sidebarWidth}
        >
            <AppSidebar>
                <AppSidebarInset>{children}</AppSidebarInset>
            </AppSidebar>
        </SidebarProvider>
    );
};

export default Layout;
