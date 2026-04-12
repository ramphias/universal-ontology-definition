import { getOntologyLayer } from "@/lib/github";
import Link from "next/link";
import { Suspense } from "react";

export default async function LayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upperId = id.toUpperCase();
  
  // Layer validity check
  if (!["L0", "L1", "L2", "L3"].includes(upperId)) {
    return <div className="text-white p-8">Invalid Layer ID</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-9rem)] flex flex-col animate-in fade-in">
      <header className="mb-4 shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm text-[#A0A0A0]">
            <Link href="/" className="hover:text-deloitte-green transition-colors">&larr; Dashboard</Link>
            <span>/</span>
            <span>{upperId} Layer</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
             {upperId} <span className="font-medium text-deloitte-green">Ontology Viewer</span>
          </h1>
        </div>
        <div className="px-3 py-1 bg-[#111] border border-[#333] rounded text-xs text-white flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-deloitte-green shadow-[0_0_8px_rgba(134,188,37,0.8)] animate-pulse"></span>
           Live from GitHub Server
        </div>
      </header>

      {/* Streaming the GitHub fetching process */}
      <Suspense fallback={
        <div className="h-40 flex items-center justify-center text-[#A0A0A0] text-sm animate-pulse border border-[#333] rounded-lg bg-surface">
           Fetching live schema via GitHub API...
        </div>
      }>
         <OntologyContent layerId={upperId} />
      </Suspense>
    </div>
  );
}

// Ensure it loads dynamically and doesn't cache stale data infinitely during testing
export const dynamic = 'force-dynamic';

import { L0Workspace } from "@/components/editor/L0Workspace";
import { L1FlowEditor } from "@/components/editor/L1FlowEditor";
import { L2FlowWorkspace } from "@/components/editor/L2FlowWorkspace";
import { L3FlowWorkspace } from "@/components/editor/L3FlowWorkspace";
import { getAvailableL2Extensions, getAvailableL3Enterprises } from "@/lib/actions";

async function OntologyContent({ layerId }: { layerId: string }) {
  try {
     // L2 and L3 build their foundation visually from L1 Core. L0 builds its schema rules from L1 Core.
     const baseLayer = (layerId === 'L2' || layerId === 'L3' || layerId === 'L0') ? 'L1' : layerId;
     const data = await getOntologyLayer(baseLayer);
     
     if (layerId === 'L0') {
       return (
         <div className="w-full flex-1 min-h-0 relative animate-in fade-in zoom-in-95 duration-500 bg-[#050505] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-xl border border-[#222]">
            <L0Workspace initialData={data} />
         </div>
       );
     }
     
     if (layerId === 'L1') {
       return (
         <div className="w-full flex-1 min-h-0 relative animate-in fade-in zoom-in-95 duration-500">
            <L1FlowEditor initialData={data} />
         </div>
       );
     }

     if (layerId === 'L2') {
       const extensions = await getAvailableL2Extensions();
       return (
         <div className="w-full flex-1 min-h-0 relative animate-in fade-in zoom-in-95 duration-500">
           <L2FlowWorkspace initialData={data} availableExtensions={extensions} />
         </div>
       );
     }

     if (layerId === 'L3') {
       const [extensions, enterprises] = await Promise.all([
         getAvailableL2Extensions(),
         getAvailableL3Enterprises()
       ]);
       return (
         <div className="w-full flex-1 min-h-0 relative animate-in fade-in zoom-in-95 duration-500">
           <L3FlowWorkspace 
             initialData={data} 
             availableExtensions={extensions} 
             availableEnterprises={enterprises} 
           />
         </div>
       );
     }
     
     // Fallback UI for unsupported layers or debugging metadata
     return (
       <div className="space-y-12">
          {/* Metadata Section */}
          <section className="bg-surface border border-[#333] p-6 rounded-lg shadow-xl shadow-black/20">
            <h2 className="text-lg font-medium text-white mb-4 border-b border-[#333] pb-2 flex justify-between items-center">
              Metadata 
              <span className="text-xs bg-[#222] px-2 py-1 rounded text-[#A0A0A0] font-mono">{data.metadata?.namespace}</span>
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
               <div><span className="text-[#A0A0A0] inline-block w-20">Name:</span> <span className="text-white">{data.metadata?.name}</span></div>
               <div><span className="text-[#A0A0A0] inline-block w-20">Version:</span> <span className="text-white bg-[#333] px-2 py-0.5 rounded">{data.metadata?.version}</span></div>
               <div className="col-span-2"><span className="text-[#A0A0A0] block mb-1">Description:</span> <span className="text-white leading-relaxed">{data.metadata?.description_en}<br/>{data.metadata?.description}</span></div>
               <div><span className="text-[#A0A0A0] inline-block w-20">Updated:</span> <span className="text-white">{data.metadata?.updated}</span></div>
               <div><span className="text-[#A0A0A0] inline-block w-20">License:</span> <span className="text-white">{data.metadata?.license}</span></div>
            </div>
          </section>
       </div>
     );
  } catch (error: any) {
     return (
       <div className="p-8 bg-[#1E0505] border border-red-900 rounded-lg text-red-200 text-sm shadow-xl">
         <h3 className="text-base text-red-400 mb-2 font-medium flex gap-2 items-center">
            <span className="bg-red-500/20 px-2 py-0.5 rounded">Error</span> Fetch failed
         </h3>
         <p className="mb-4 text-red-300 font-mono">{error?.message || "Unknown Error"}</p>
         <div className="bg-black/40 p-4 rounded text-xs text-red-300 leading-relaxed max-w-2xl">
           If it says "file mapping is not yet fully configured", it means we haven't linked this layer to a specific JSON file in <code className="text-white px-1">lib/github.ts</code> yet.<br/><br/>
           If it says "API Rate Limit" or "Not Found", ensure your <code className="text-white px-1">GITHUB_TOKEN</code> is set correctly in <code className="text-white px-1">.env.local</code>.
         </div>
       </div>
     );
  }
}

