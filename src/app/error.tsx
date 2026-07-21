"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HomeIcon, RefreshCcwIcon } from "lucide-react";

const Error = () => {
    const router = useRouter();

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/coffee.svg"
                height={300}
                width={300}
                alt="Error"
                className="dark:hidden"
            />
            <Image
                src="/coffee-dark.svg"
                height={300}
                width={300}
                alt="Error"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-semibold">Error Oops!</h2>
            <p className="text-sm font-medium">
                Some thing went wrong. Please try again later.
            </p>
            <div className="flex items-center gap-x-2">
                <Button onClick={() => router.push("/")}>
                    <HomeIcon />
                    Return Home
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcwIcon className="size-4" />
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default Error;
