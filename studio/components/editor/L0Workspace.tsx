"use client";

import React, { useState } from 'react';
import { Database, Code2, CheckCircle2, AlertCircle, FileJson, Server, Activity, ShieldCheck, Cpu, Play } from 'lucide-react';
import { motion } from 'framer-motion';

type TabType = 'gateway' | 'validator' | 'api-docs';

export function L0Workspace({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState<TabType>('gateway');
  const [jsonInput, setJsonInput] = useState('{\n  "class": "FastFoodRestaurant",\n  "properties": {\n    "name": "McDonalds"\n  }\n}');
  const [validationResult, setValidationResult] = useState<{status: 'idle'|'success'|'error', msg: string}>({status: 'idle', msg: ''});

  const validateJson = () => {
     try {
       const parsed = JSON.parse(jsonInput);
       const classIds = initialData.classes.map((c:any) => c.id);
       
       if (!parsed.class) {
          setValidationResult({ status: 'error', msg: 'Missing mandatory "class" property in payload.' });
          return;
       }
       
       if (!classIds.includes(parsed.class)) {
          // L0 defaults to L1 context
          setValidationResult({ status: 'error', msg: `Ontology Violation: Class "${parsed.class}" is not defined in the active Universe [L1 Core].` });
          return;
       }

       setValidationResult({ status: 'success', msg: 'Payload aligns perfectly with the Universal Ontology definition!' });
     } catch (e: any) {
       setValidationResult({ status: 'error', msg: `Invalid JSON format: ${e.message}` });
     }
  };

  return (
    <div className="w-full h-full flex flex-col pt-2 text-[#A0A0A0]">
       {/* Top Navigation */}
       <div className="flex items-center gap-6 border-b border-[#333] mb-6 px-4">
          <button onClick={() => setActiveTab('gateway')} className={`pb-3 border-b-2 font-medium flex items-center gap-2 transition-colors ${activeTab === 'gateway' ? 'border-[#86BC25] text-white' : 'border-transparent hover:text-white'}`}>
             <Server className="w-4 h-4" /> Operations Center
          </button>
          <button onClick={() => setActiveTab('validator')} className={`pb-3 border-b-2 font-medium flex items-center gap-2 transition-colors ${activeTab === 'validator' ? 'border-[#86BC25] text-white' : 'border-transparent hover:text-white'}`}>
             <Code2 className="w-4 h-4" /> Payload Validator
          </button>
          <button disabled className="pb-3 border-b-2 border-transparent text-[#555] font-medium flex items-center gap-2 cursor-not-allowed">
             <FileJson className="w-4 h-4" /> Swagger Gen <span className="text-[10px] bg-[#222] px-1 rounded text-[#777]">WIP</span>
          </button>
       </div>

       {/* Content Panels */}
       <div className="flex-1 min-h-0 overflow-y-auto px-4 custom-scrollbar">
          
          {activeTab === 'gateway' && (
             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="grid grid-cols-3 gap-6">
                
                {/* Intro Card */}
                <div className="col-span-3 bg-surface border border-[#333] rounded-xl p-6 shadow-xl flex items-start gap-4">
                   <div className="p-3 bg-black/40 rounded-lg border border-white/5 mt-1">
                      <ShieldCheck className="w-6 h-6 text-deloitte-green" />
                   </div>
                   <div>
                       <h2 className="text-xl text-white font-medium mb-2">L0 Global Architecture Governance</h2>
                       <p className="text-sm leading-relaxed max-w-4xl text-[#888]">
                         Welcome to the L0 Operations Center. Previously, L0 housed abstract compilation tools. Based on modern operational workflows, 
                         <strong> Context-Specific Code Exporters have now been embedded directly into L1, L2, and L3 visual canvases.</strong> 
                         This L0 portal now acts as the global API Gateway, centralizing security policies, active database integrations, and universal payload linting across the entire organization.
                       </p>
                   </div>
                </div>

                {/* Mock Governance Stats */}
                <div className="bg-[#050505] border border-[#222] rounded-xl p-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                   <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-4"><Database className="w-4 h-4 text-blue-400" /> Active Database Clusters</h3>
                   <div className="text-4xl font-light text-white mb-2">12</div>
                   <p className="text-xs text-[#666]">Relational DB instances synced with L1/L2 schemas.</p>
                </div>
                
                <div className="bg-[#050505] border border-[#222] rounded-xl p-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                   <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-4"><Cpu className="w-4 h-4 text-fuchsia-400" /> GraphQL Compute Nodes</h3>
                   <div className="text-4xl font-light text-white mb-2">100%</div>
                   <p className="text-xs text-[#666]">All generated endpoints passing real-time Linter checks.</p>
                </div>
                
                <div className="bg-[#050505] border border-[#222] rounded-xl p-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                   <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-emerald-400" /> Neo4j Knowledge Graphs</h3>
                   <div className="text-4xl font-light text-white mb-2">3</div>
                   <p className="text-xs text-[#666]">Agentic AI Graph engines currently active and indexing.</p>
                </div>

             </motion.div>
          )}

          {activeTab === 'validator' && (
             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="grid grid-cols-[1fr_300px] gap-6 h-[calc(100vh-20rem)] min-h-[400px]">
                <div className="bg-[#050505] border border-[#222] rounded-xl flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
                   <div className="bg-[#111] border-b border-[#222] p-3 flex justify-between items-center">
                     <span className="font-mono text-xs text-[#888]">Editor: INBOUND REST PAYLOAD</span>
                     <button onClick={validateJson} className="bg-[#86BC25] text-black font-medium px-4 py-1.5 rounded text-sm hover:brightness-110 flex items-center gap-2">
                        <Play className="w-4 h-4" fill="currentColor" /> Run Linter
                     </button>
                   </div>
                   <textarea 
                     className="flex-1 w-full bg-transparent text-[#CCC] font-mono text-sm p-4 resize-none focus:outline-none custom-scrollbar"
                     value={jsonInput}
                     onChange={(e) => setJsonInput(e.target.value)}
                   />
                </div>

                <div className="flex flex-col gap-4">
                   <div className="bg-surface border border-[#333] rounded-xl p-4 shadow-xl">
                      <h3 className="text-white font-medium mb-3">Validation Result</h3>
                      {validationResult.status === 'idle' && (
                         <div className="text-[#666] text-sm italic">Run linter to analyze payload.</div>
                      )}
                      {validationResult.status === 'success' && (
                         <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>{validationResult.msg}</span>
                         </div>
                      )}
                      {validationResult.status === 'error' && (
                         <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{validationResult.msg}</span>
                         </div>
                      )}
                   </div>

                   <div className="bg-black/30 border border-[#222] rounded-xl p-4">
                      <h4 className="text-xs text-[#888] font-mono mb-2">ACTIVE GLOBALE UNIVERSE</h4>
                      <p className="text-sm text-[#A0A0A0]">Global gateway validating against <span className="text-[#86BC25] font-bold">L1 Universal Core</span> rules.</p>
                      <ul className="text-xs text-[#666] mt-3 space-y-1 list-disc pl-4">
                         <li>Checks mandatory <code>class</code></li>
                         <li>Cross-verifies taxonomic existence strictly in the L1 Universal Core list.</li>
                         <li className="text-red-400/80">Rejects Extension (L2) or Bespoke (L3) subclasses by design to enforce Global conformity.</li>
                      </ul>
                   </div>
                </div>
             </motion.div>
          )}

       </div>

       <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
       `}</style>
    </div>
  );
}

