import { requireUnauth } from "@/lib/auth-utils";
import Image from "next/image";
import { SiNotion } from "react-icons/si";
import Link from "next/link";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    await requireUnauth();

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <SiNotion className="size-4" />
                        </div>
                        Notion
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">{children}</div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="/placeholder.svg"
                    alt="Placeholder"
                    className="absolute inset-0 h-full w-full object-cover dark:hidden"
                    width={300}
                    height={600}
                    loading="eager"
                />
                <Image
                    src="/placeholder-dark.svg"
                    alt="Placeholder"
                    className="absolute inset-0 h-full w-full object-cover hidden dark:block"
                    width={300}
                    height={600}
                    loading="eager"
                />
            </div>
        </div>
    );
};

export default Layout;
