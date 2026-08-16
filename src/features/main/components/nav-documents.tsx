import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/sidebar-resizable";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { DocumentList } from "./document-list";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrashBox } from "./trash-box";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { AppErrorData } from "@/types";
import { useUpgradePlan } from "@/hooks/use-upgrade-plan";

export const NavDocuments = () => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const { triggerUpgradeModal } = useUpgradePlan();

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

    const sidePosition =
        isMobile === undefined ? "right" : isMobile ? "bottom" : "right";

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <DocumentList />
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Add a page"
                            onClick={handleCreate}
                        >
                            <PlusIcon />
                            <span>Add a page</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mt-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <SidebarMenuButton>
                                    <TrashIcon />
                                    <span>Trash</span>
                                </SidebarMenuButton>
                            </PopoverTrigger>
                            <PopoverContent
                                className="p-0 w-72"
                                side={sidePosition}
                            >
                                <TrashBox />
                            </PopoverContent>
                        </Popover>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
