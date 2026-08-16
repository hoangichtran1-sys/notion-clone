import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { JotaiProvider } from "@/providers/jotai-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

import "./globals.css";
import { SettingsProfile } from "@/components/settings-profile";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Notion Clone",
    description: "The connected workspace where better, faster work happens.",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/logo.svg",
                href: "/logo.svg",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/logo-dark.svg",
                href: "/logo-dark.svg",
            },
        ],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const token = await getToken();

    return (
        <html lang="en" suppressHydrationWarning className={`${inter.className} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <ConvexClientProvider initialToken={token}>
                    <JotaiProvider>
                        <EdgeStoreProvider>
                            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="notion-theme">
                                <TooltipProvider>
                                    {children}
                                    <Toaster />
                                    <SettingsProfile className="min-w-200" />
                                </TooltipProvider>
                            </ThemeProvider>
                        </EdgeStoreProvider>
                    </JotaiProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
