"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export const Footer = () => {
    const router = useRouter();

    return (
        <div className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
            <Logo />
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button variant="ghost" onClick={() => router.push("/privacy")}>
                    Privacy Policy
                </Button>
                <Separator orientation="vertical" />
                <Button variant="ghost" onClick={() => router.push("/terms")}>
                    Terms & Conditions
                </Button>
            </div>
        </div>
    );
};
