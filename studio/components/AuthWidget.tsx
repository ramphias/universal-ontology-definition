"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthWidget() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="text-sm text-[#A0A0A0]">Loading...</div>;
    }

    if (session && session.user) {
        return (
            <div className="flex items-center space-x-3">
                <div className="text-right flex flex-col justify-center">
                    <span className="text-sm text-foreground">{session.user.name || session.user.login}</span>
                    <span className="text-xs text-[#888] flex items-center justify-end space-x-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${session.user.role === 'admin' ? 'bg-red-500' : session.user.role === 'editor' ? 'bg-deloitte-green' : 'bg-gray-500'}`}></span>
                        <span className="capitalize">{session.user.role || "viewer"}</span>
                    </span>
                </div>
                {session.user.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-[#333]" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[#333] border border-[#444]"></div>
                )}
                <button 
                    onClick={() => signOut()}
                    className="ml-2 text-xs px-3 py-1.5 bg-transparent border border-[#333] rounded text-[#888] font-medium hover:text-white hover:border-[#555] transition-colors"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button 
            onClick={() => signIn("github")}
            className="text-xs px-3 py-1.5 bg-[#333] rounded text-white font-medium hover:bg-[#444] cursor-pointer transition-colors"
        >
            Connect GitHub Account
        </button>
    );
}
