import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarNav } from "@/components/SidebarNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ontology Studio | Deloitte Theme",
  description: "Collaborative Ontology Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full overflow-hidden bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 bg-surface border-r border-[#333] flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-[#333]">
            <h1 className="text-xl font-bold tracking-tight">
              Ontology<span className="text-deloitte-green">Studio</span>
            </h1>
          </div>
          <SidebarNav />
          <div className="p-4 border-t border-[#333] text-xs text-[#666] flex justify-between items-center">
            <span>Git Backend</span>
            <span className="w-2 h-2 rounded-full bg-deloitte-green"></span>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 bg-surface border-b border-[#333] flex items-center justify-between px-6">
            <div className="text-sm text-[#A0A0A0]">
              Universal Ontology Definition
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs px-3 py-1.5 bg-[#333] rounded text-white font-medium hover:bg-[#444] cursor-pointer transition-colors">
                Connect GitHub Account
              </span>
            </div>
          </header>
          {/* Page */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
