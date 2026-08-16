"use client";
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCardIcon,
    LogOut,
    SparklesIcon,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/sidebar-resizable";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useHasActiveSubscription } from "@/hooks/use-subscription";
import { useSettingsProfileModal } from "@/hooks/use-settings-profile-modal";
export function NavUser() {
    const router = useRouter();

    const { isMobile } = useSidebar();
    const { data, isPending } = authClient.useSession();

    const { onOpenSettingsProfileModal } = useSettingsProfileModal();

    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logout successfully");
                    router.push("/sign-in");
                },
            },
        });
    };

    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

    if (isPending || !data?.user) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {data.user.image ? (
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={data.user.image}
                                        alt={data.user.name}
                                    />
                                </Avatar>
                            ) : (
                                <GeneratedAvatar
                                    seed={data.user.name || data.user.email}
                                />
                            )}
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {data.user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {data.user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                {data.user.image ? (
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={data.user.image}
                                            alt={data.user.name}
                                        />
                                    </Avatar>
                                ) : (
                                    <GeneratedAvatar
                                        seed={data.user.name || data.user.email}
                                    />
                                )}
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {data.user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {data.user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {!hasActiveSubscription && !isLoading && (
                            <>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            authClient.checkout({
                                                slug: "Notion-Pro",
                                            })
                                        }
                                    >
                                        <SparklesIcon />
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={onOpenSettingsProfileModal}
                            >
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => authClient.customer.portal()}
                            >
                                <CreditCardIcon />
                                Billing Portal
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
