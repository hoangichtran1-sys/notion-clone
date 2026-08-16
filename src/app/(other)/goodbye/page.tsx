"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HomeIcon, LogInIcon } from "lucide-react";

const Error = () => {
    const router = useRouter();

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/ice-cream.svg"
                height={300}
                width={300}
                alt="Delete"
                className="dark:hidden"
            />
            <Image
                src="/ice-cream-dark.svg"
                height={300}
                width={300}
                alt="Delete"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-semibold">Delete user success!</h2>
            <p className="text-sm font-medium">
                The account has been deleted, please log in again immediately.
            </p>
            <div className="flex items-center gap-x-2">
                <Button onClick={() => router.push("/")}>
                    <HomeIcon />
                    Return Home
                </Button>
                <Button variant="outline" onClick={() => router.push("/sign-in")}>
                    <LogInIcon />
                    Sign In
                </Button>
            </div>
        </div>
    );
};

export default Error;
