import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import {
    backendHealth,
    listInstances,
    BackendUnauthenticatedError,
    type BackendHealth,
    type InstanceList,
} from "@/lib/backend";
import { authOptions } from "@/lib/auth";
import { FilterBar } from "@/components/instances/FilterBar";
import { InstancesTable } from "@/components/instances/InstancesTable";

// Always SSR — the backend changes constantly, no caching here.
export const dynamic = "force-dynamic";

type SP = {
    layer?: string;
    type?: string;
    status?: string;
    q?: string;
};

export default async function InstancesPage({
    searchParams,
}: {
    // Next.js 16: searchParams is a Promise (matches existing layer/[id] convention).
    searchParams: Promise<SP>;
}) {
    const params = await searchParams;
    const session = await getServerSession(authOptions);

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-[#A0A0A0]">
                        <Link
                            href="/"
                            className="hover:text-deloitte-green transition-colors"
                        >
                            ← Dashboard
                        </Link>
                        <span>/</span>
                        <span>Instances</span>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight text-white">
                        <span className="font-medium text-deloitte-green">Instance</span>{" "}
                        Store
                    </h1>
                    <p className="text-sm text-[#A0A0A0] mt-2 max-w-2xl">
                        Live data from{" "}
                        <code className="text-deloitte-green font-mono text-xs px-1.5 py-0.5 rounded bg-[#111]">
                            uod-backend
                        </code>{" "}
                        on Fly.io. Class definitions still live in this repo; instance
                        rows live in Neon Postgres.
                    </p>
                </div>
                <Suspense fallback={<HealthDot status="…" />}>
                    <BackendHealthBadge />
                </Suspense>
            </header>

            {!session?.user?.login ? (
                <SignedOutState />
            ) : (
                <>
                    <FilterBar current={params} />
                    <Suspense fallback={<LoadingState />}>
                        <InstancesView filters={params} />
                    </Suspense>
                </>
            )}
        </div>
    );
}

async function InstancesView({ filters }: { filters: SP }) {
    // Await OUTSIDE the JSX return — React lint forbids JSX-in-try because
    // render errors aren't caught by it. Only fetch errors are caught here.
    let result: InstanceList;
    try {
        result = await listInstances({
            layer: filters.layer,
            type: filters.type,
            status: filters.status as
                | "candidate"
                | "accepted"
                | "rejected"
                | "archived"
                | undefined,
            q: filters.q,
            limit: 50,
        });
    } catch (error) {
        if (error instanceof BackendUnauthenticatedError) {
            return <SignedOutState />;
        }
        const message = error instanceof Error ? error.message : String(error);
        return (
            <div className="bg-[#1E0505] border border-red-900 rounded-lg p-6 text-red-200">
                <h3 className="text-base text-red-400 mb-2 font-medium">
                    Backend unreachable
                </h3>
                <pre className="text-xs bg-black/40 p-3 rounded whitespace-pre-wrap max-w-2xl">
                    {message}
                </pre>
                <p className="text-xs text-red-300 mt-3">
                    Check that <code className="text-white">BACKEND_URL</code> is set in
                    Netlify env, and that the Fly app at{" "}
                    <code className="text-white">uod-backend.fly.dev</code> is running.
                </p>
            </div>
        );
    }
    return <InstancesTable result={result} />;
}

function LoadingState() {
    return (
        <div className="border border-[#333] rounded-lg bg-surface py-16 text-center">
            <div className="text-[#A0A0A0] animate-pulse text-sm">
                Querying instance store…
            </div>
        </div>
    );
}

function SignedOutState() {
    return (
        <div className="border border-[#333] rounded-lg bg-surface p-12 text-center">
            <h3 className="text-white text-lg mb-2">Instances are private</h3>
            <p className="text-[#A0A0A0] text-sm mb-6 max-w-md mx-auto">
                Sign in with GitHub to view the instance store. Class definitions
                (L1/L2/L3) remain public on GitHub.
            </p>
        </div>
    );
}

async function BackendHealthBadge() {
    let h: BackendHealth | null = null;
    try {
        h = await backendHealth();
    } catch {
        h = null;
    }

    if (!h) {
        return (
            <div className="px-3 py-1 bg-[#111] border border-red-900 rounded text-xs text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Backend offline
            </div>
        );
    }

    const dbUp = h.database === "up";
    return (
        <div
            className={`px-3 py-1 bg-[#111] border rounded text-xs flex items-center gap-2 ${
                dbUp ? "border-[#333] text-white" : "border-yellow-900 text-yellow-400"
            }`}
        >
            <span
                className={`w-2 h-2 rounded-full ${
                    dbUp
                        ? "bg-deloitte-green shadow-[0_0_8px_rgba(134,188,37,0.8)] animate-pulse"
                        : "bg-yellow-500"
                }`}
            />
            <span>
                {dbUp ? "Backend live" : "DB cold-starting"} · v{h.version}
            </span>
        </div>
    );
}

function HealthDot({ status }: { status: string }) {
    return (
        <div className="px-3 py-1 bg-[#111] border border-[#333] rounded text-xs text-[#A0A0A0]">
            {status}
        </div>
    );
}
