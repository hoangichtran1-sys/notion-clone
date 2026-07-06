import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

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
        <html
            lang="en"
            suppressHydrationWarning
            className={`${inter.className} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <ConvexClientProvider initialToken={token}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        storageKey="notion-theme"
                    >
                        <TooltipProvider>
                            {children}
                            <Toaster />
                        </TooltipProvider>
                    </ThemeProvider>
                </ConvexClientProvider>
            </body>
        </html>
    );
}
