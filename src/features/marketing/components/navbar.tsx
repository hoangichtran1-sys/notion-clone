"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ToggleMode } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";

export const Navbar = () => {
    const scrolled = useScrollTop();
    const router = useRouter();
    const user = useQuery(api.public.user.getCurrentUser);

    return (
        <div
            className={cn(
                "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
                scrolled && "border-b shadow-sm",
            )}
        >
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-4">
                {/* <ToggleMode /> */}
                {user === undefined ? (
                    <>
                        <Skeleton className="h-6 w-16 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </>
                ) : user === null ? (
                    <>
                        <Button
                            onClick={() => router.push("/sign-in")}
                            variant="ghost"
                            size="sm"
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={() => router.push("/sign-up")}
                            size="sm"
                        >
                            Get Notion Free
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">Enter Notion</Link>
                        </Button>
                        <UserMenu user={user} />
                    </>
                )}
                <ToggleMode />
            </div>
        </div>
    );
};
