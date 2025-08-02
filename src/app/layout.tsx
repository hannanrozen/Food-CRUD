import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food CRUD App | Manage Your Food Collection",
  description:
    "A modern food management application built with Next.js, TypeScript, and Supabase. Create, discover, and manage your favorite recipes.",
  keywords: "food, recipes, cooking, CRUD, Next.js, TypeScript",
  authors: [{ name: "Food CRUD App Team" }],
  openGraph: {
    title: "Food CRUD App",
    description: "Manage your food collection with style",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className={`${inter.className} h-full`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
