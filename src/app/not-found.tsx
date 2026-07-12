"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HomeIcon, RefreshCcwIcon } from "lucide-react";

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                src="/not-found.svg"
                height={300}
                width={300}
                alt="Not found"
                className="dark:hidden"
            />
            <Image
                src="/not-found-dark.svg"
                height={300}
                width={300}
                alt="Not found"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-semibold">Page Not Found</h2>
            <p className="text-sm font-medium">
                Could not find requested resource.
            </p>
            <div className="flex items-center gap-x-2">
                <Button onClick={() => router.push("/")}>
                    <HomeIcon />
                    Return Home
                </Button>
                <Button variant="outline" onClick={() => router.refresh()}>
                    <RefreshCcwIcon className="size-4" />
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
