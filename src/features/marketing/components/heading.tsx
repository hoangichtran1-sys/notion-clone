import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth-server";

export const Heading = async () => {
    const hasToken = await isAuthenticated();
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents, & Plan. Unified. Welcome to{" "}
                <span className="underline">Notion</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Notion is the connected workspace where <br />
                better, faster work happens.
            </h3>
            {hasToken ? (
                <Button asChild>
                    <Link href="/documents">
                        Enter Notion
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </Button>
            ) : (
                <Button asChild>
                    <Link href="/sign-in">
                        Get Notion Free
                        <ArrowRightIcon className="size-4" />
                    </Link>
                </Button>
            )}
        </div>
    );
};
