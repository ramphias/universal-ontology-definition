"use client";
import React, { useMemo } from 'react';
import { ArrowRight, ArrowLeft, Database, Shield, GitBranch } from 'lucide-react';

interface OntologyContext {
  relations?: any[];
  attributes?: any[];
  axioms?: any[];
  classes?: any[];
}

export function PropertiesPanel({ data, context, onClose }: { data: any, context?: OntologyContext, onClose: () => void }) {
  if (!data) return null;

  const classId = data.id;

  // Compute ancestors for inherited attributes
  const ancestors = useMemo(() => {
    if (!context?.classes) return [];
    const result: string[] = [];
    const classMap = Object.fromEntries(context.classes.map((c: any) => [c.id, c]));
    let cur = data.parent;
    const visited = new Set<string>();
    while (cur && classMap[cur] && !visited.has(cur)) {
      visited.add(cur);
      result.push(cur);
      cur = classMap[cur].parent;
    }
    return result;
  }, [data, context?.classes]);

  // Relations: outgoing (domain = this class) and incoming (range = this class)
  const outgoing = useMemo(() =>
    (context?.relations || []).filter((r: any) => r.domain === classId),
    [context?.relations, classId]
  );
  const incoming = useMemo(() =>
    (context?.relations || []).filter((r: any) => r.range === classId),
    [context?.relations, classId]
  );

  // Attributes: own + inherited from ancestors
  const ownAttrs = useMemo(() =>
    (context?.attributes || []).filter((a: any) => a.owner_class === classId),
    [context?.attributes, classId]
  );
  const inheritedAttrs = useMemo(() =>
    (context?.attributes || []).filter((a: any) => ancestors.includes(a.owner_class)),
    [context?.attributes, ancestors]
  );

  // Axioms referencing this class
  const relatedAxioms = useMemo(() =>
    (context?.axioms || []).filter((ax: any) => {
      const refs = [ax.subject_class, ax.object_class, ...(ax.classes || [])].filter(Boolean);
      return refs.includes(classId);
    }),
    [context?.axioms, classId]
  );

  return (
    <div className="absolute top-6 right-6 w-[400px] max-h-[calc(100%-3rem)] overflow-y-auto bg-black/80 backdrop-blur-xl border border-[#333] shadow-2xl rounded-2xl p-6 z-10 animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
        <div>
           <div className="text-[10px] text-deloitte-green font-mono uppercase tracking-widest mb-1 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-deloitte-green animate-pulse"></span>
             Node Blueprint
           </div>
           <h3 className="text-2xl text-white font-light tracking-tight">{data.id}</h3>
        </div>
        <button onClick={onClose} className="p-2 bg-[#111] hover:bg-[#222] rounded-full text-[#666] hover:text-white transition-colors border border-[#333]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12M13 1L1 13" /></svg>
        </button>
      </div>

      <div className="space-y-5">
        {/* Labels */}
        <div>
          <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 block">Multilingual Terminology</label>
          <div className="bg-[#111] border border-[#222] rounded-t-lg px-4 py-3 text-sm text-white flex justify-between items-center hover:border-[#444] transition-colors">
             <span className="text-[#A0A0A0] text-xs">EN</span>
             <span className="font-medium text-right">{data.label_en || "-"}</span>
          </div>
          <div className="bg-[#111] border border-[#222] border-t-0 rounded-b-lg px-4 py-3 text-sm text-white flex justify-between items-center hover:border-[#444] transition-colors">
             <span className="text-[#A0A0A0] text-xs">ZH</span>
             <span className="font-medium text-right">{data.label_zh || "-"}</span>
          </div>
        </div>

        {/* Definition */}
        <div>
          <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 block">Semantic Definition</label>
          <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm leading-relaxed text-[#A0A0A0] min-h-[60px] hover:border-[#444] transition-colors">
             {data.definition_en || data.definition || "No formal definition provided."}
          </div>
        </div>

        {/* Parent */}
        {data.parent && (
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 block">Parent</label>
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] px-3 py-2 border border-[#333] rounded-lg text-sm text-white font-mono hover:border-deloitte-green cursor-pointer transition-colors">
               <span className="w-1 h-3 bg-deloitte-green rounded-sm"></span>
               {data.parent}
            </div>
          </div>
        )}

        {/* Abstract Badge */}
        {data.abstract && (
          <div className="bg-[#051505] border border-deloitte-green/30 rounded-lg p-3">
             <div className="text-[11px] text-deloitte-green font-medium uppercase flex items-center gap-1.5">
               <GitBranch className="w-3 h-3" />
               Abstract — cannot be directly instantiated
             </div>
          </div>
        )}

        {/* ── Relations ── */}
        {(outgoing.length > 0 || incoming.length > 0) && (
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <ArrowRight className="w-3 h-3" /> Relations ({outgoing.length + incoming.length})
            </label>
            <div className="space-y-1">
              {outgoing.map((r: any) => (
                <div key={r.id} className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs hover:border-[#444] transition-colors group">
                  <ArrowRight className="w-3 h-3 text-deloitte-green flex-shrink-0" />
                  <span className="text-deloitte-green font-mono font-medium">{r.id}</span>
                  <span className="text-[#555]">&rarr;</span>
                  <span className="text-white font-mono">{r.range}</span>
                  {r.cardinality && <span className="text-[#444] ml-auto text-[10px]">{r.cardinality}</span>}
                </div>
              ))}
              {incoming.map((r: any) => (
                <div key={r.id + '_in'} className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs hover:border-[#444] transition-colors group">
                  <ArrowLeft className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="text-white font-mono">{r.domain}</span>
                  <span className="text-[#555]">&rarr;</span>
                  <span className="text-cyan-400 font-mono font-medium">{r.id}</span>
                  {r.cardinality && <span className="text-[#444] ml-auto text-[10px]">{r.cardinality}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Attributes ── */}
        {(ownAttrs.length > 0 || inheritedAttrs.length > 0) && (
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <Database className="w-3 h-3" /> Attributes ({ownAttrs.length + inheritedAttrs.length})
            </label>
            <div className="space-y-1">
              {ownAttrs.map((a: any) => (
                <div key={a.id} className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs hover:border-[#444] transition-colors">
                  <span className="text-white font-mono font-medium flex-1">{a.id}</span>
                  <span className="text-[#555] font-mono">{a.datatype}</span>
                  {a.required && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px]">req</span>}
                </div>
              ))}
              {inheritedAttrs.map((a: any) => (
                <div key={a.id + '_inh'} className="flex items-center gap-2 bg-[#111] border border-[#1A1A1A] rounded-lg px-3 py-2 text-xs hover:border-[#333] transition-colors opacity-60">
                  <span className="text-[#888] font-mono flex-1">{a.id}</span>
                  <span className="text-[#444] font-mono">{a.datatype}</span>
                  <span className="px-1.5 py-0.5 bg-[#222] text-[#555] rounded text-[9px]">from {a.owner_class}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Axioms ── */}
        {relatedAxioms.length > 0 && (
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
              <Shield className="w-3 h-3" /> Axioms ({relatedAxioms.length})
            </label>
            <div className="space-y-1">
              {relatedAxioms.map((ax: any) => (
                <div key={ax.id} className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 hover:border-[#444] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
                      ax.type === 'disjoint' ? 'bg-red-500/20 text-red-400' :
                      ax.type === 'existential' ? 'bg-purple-500/20 text-purple-400' :
                      ax.type === 'universal' ? 'bg-blue-500/20 text-blue-400' :
                      ax.type === 'transitive' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-[#222] text-[#888]'
                    }`}>{ax.type}</span>
                    <span className="text-[10px] text-[#666] font-mono">{ax.id}</span>
                  </div>
                  <div className="text-xs text-[#A0A0A0] leading-relaxed">
                    {ax.definition_en || ax.label_en || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#222] flex items-center gap-2">
         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#444] flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
         <span className="text-[10px] text-[#555]">Viewing mode — select nodes on the canvas to inspect</span>
      </div>
    </div>
  );
}
