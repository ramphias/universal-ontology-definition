"use client";

import { useEffect, useState } from "react";
import { fetchAllUsers, addUserRole, removeUserAccess } from "./actions";
import { type Role } from "@/lib/permissions";
import { useSession } from "next-auth/react";

export default function AdminPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<Record<string, Role>>({});
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [newUsername, setNewUsername] = useState("");
    const [newRole, setNewRole] = useState<Role>("viewer");
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
            setError("");
        } catch (err: any) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addUserRole(newUsername, newRole);
            setNewUsername("");
            setNewRole("viewer");
            await loadUsers();
        } catch (err: any) {
            setError(err.message || "Failed to add user");
        }
    };

    const handleRemoveUser = async (username: string) => {
        if (!confirm(`Are you sure you want to revoke access for ${username}?`)) return;
        try {
            await removeUserAccess(username);
            await loadUsers();
        } catch (err: any) {
            setError(err.message || "Failed to remove user");
        }
    };

    if (session?.user?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
                <p className="text-[#888]">You must be a Super Admin to view this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 border-b border-[#333] pb-6">
                <h1 className="text-2xl font-bold mb-2">Access Management</h1>
                <p className="text-sm text-[#888]">Manage roles for GitHub users accessing the Ontology Studio. Data is stored securely in Netlify Blobs.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-[#111] border border-[#333] rounded p-6 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Grant Access</h2>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[#888] mb-1">GitHub Username</label>
                            <input 
                                required
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-deloitte-green"
                                placeholder="e.g. ramphias"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[#888] mb-1">Assigned Role</label>
                            <select 
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value as Role)}
                                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-deloitte-green"
                            >
                                <option value="viewer">Viewer (Read-Only)</option>
                                <option value="editor">Editor (Can push commits)</option>
                                <option value="admin">Admin (Full Access)</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full py-2 bg-deloitte-green text-black font-semibold rounded text-sm hover:bg-opacity-90 transition-opacity">
                            Grant Permission
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-[#111] border border-[#333] rounded overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#222] text-[#888] text-xs">
                                <tr>
                                    <th className="px-4 py-3 font-medium">GitHub Account</th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#333]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-[#888]">Loading user directory...</td>
                                    </tr>
                                ) : Object.entries(users).length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-[#888]">No users found in database.</td>
                                    </tr>
                                ) : (
                                    Object.entries(users).map(([username, role]) => (
                                        <tr key={username} className="hover:bg-[#1a1a1a] transition-colors">
                                            <td className="px-4 py-3 text-white font-medium">@{username}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${role === 'admin' ? 'bg-red-500/10 text-red-500' : role === 'editor' ? 'bg-deloitte-green/10 text-deloitte-green' : 'bg-[#333] text-[#A0A0A0]'}`}>
                                                    {role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    onClick={() => handleRemoveUser(username)}
                                                    className="text-xs text-red-500 hover:text-red-400 disabled:opacity-50"
                                                    disabled={username.toLowerCase() === 'ramphias'}
                                                >
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
