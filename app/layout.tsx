import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://kinerelay.site"),
    title: {
        default: "KineRelay — The Motion Layer for Embodied Intelligence",
        template: "%s | KineRelay",
    },
    description: "On-demand robot teleoperation and structured motion data for embodied AI, robot learning, and robotics research.",
    alternates: {
        canonical: "https://kinerelay.site",
    },
    openGraph: {
        title: "KineRelay — The Motion Layer for Embodied Intelligence",
        description: "On-demand robot teleoperation and structured motion data for embodied AI, robot learning, and robotics research.",
        url: "https://kinerelay.site",
        siteName: "KineRelay",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "KineRelay — The Motion Layer for Embodied Intelligence",
        description: "On-demand robot teleoperation and structured motion data for embodied AI, robot learning, and robotics research.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <head>
                <script src="/trusted-types.js"></script>
            </head>
            <body className={`${inter.className} min-h-screen bg-slate-950 text-gray-200 antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
