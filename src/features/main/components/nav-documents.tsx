import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/sidebar-resizable";
import { DocumentList } from "./document-list";

export const NavDocuments = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <DocumentList />
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
