"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Database, Shield, GitBranch, Pencil, X, Check, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { submitEdit } from '@/lib/edit-actions';
import type { EditableClassFields } from '@/lib/pending-edits';

interface OntologyContext {
  relations?: any[];
  attributes?: any[];
  axioms?: any[];
  classes?: any[];
}

interface PropertiesPanelProps {
  data: any;
  context?: OntologyContext;
  onClose: () => void;
  /** Repo-relative path to the JSON file containing this class. Required for editing. */
  layerFile?: string;
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; editId: string }
  | { kind: 'error'; message: string };

export function PropertiesPanel({ data, context, onClose, layerFile }: PropertiesPanelProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const canEdit = !!layerFile && (role === 'editor' || role === 'admin');

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditableClassFields>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: 'idle' });

  // Reset state when class selection changes
  useEffect(() => {
    setIsEditing(false);
    setDraft({});
    setSubmitState({ kind: 'idle' });
  }, [data?.id]);

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

  const outgoing = useMemo(() =>
    (context?.relations || []).filter((r: any) => r.domain === classId),
    [context?.relations, classId]
  );
  const incoming = useMemo(() =>
    (context?.relations || []).filter((r: any) => r.range === classId),
    [context?.relations, classId]
  );
  const ownAttrs = useMemo(() =>
    (context?.attributes || []).filter((a: any) => a.owner_class === classId),
    [context?.attributes, classId]
  );
  const inheritedAttrs = useMemo(() =>
    (context?.attributes || []).filter((a: any) => ancestors.includes(a.owner_class)),
    [context?.attributes, ancestors]
  );
  const relatedAxioms = useMemo(() =>
    (context?.axioms || []).filter((ax: any) => {
      const refs = [ax.subject_class, ax.object_class, ...(ax.classes || [])].filter(Boolean);
      return refs.includes(classId);
    }),
    [context?.axioms, classId]
  );

  const startEdit = () => {
    setDraft({
      label_en: data.label_en || '',
      label_zh: data.label_zh || '',
      definition_en: data.definition_en || data.definition || '',
      definition_zh: data.definition_zh || '',
      abstract: !!data.abstract,
    });
    setIsEditing(true);
    setSubmitState({ kind: 'idle' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft({});
    setSubmitState({ kind: 'idle' });
  };

  const handleSubmit = async () => {
    if (!layerFile) return;
    setSubmitState({ kind: 'submitting' });
    const result = await submitEdit({
      layerFile,
      classId,
      changes: draft,
    });
    if (result.success && result.editId) {
      setSubmitState({ kind: 'success', editId: result.editId });
      setIsEditing(false);
    } else {
      setSubmitState({ kind: 'error', message: result.error || 'Submission failed' });
    }
  };

  return (
    <div className="absolute top-6 right-6 w-[400px] max-h-[calc(100%-3rem)] overflow-y-auto bg-black/80 backdrop-blur-xl border border-[#333] shadow-2xl rounded-2xl p-6 z-10 animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
        <div>
           <div className="text-[10px] text-deloitte-green font-mono uppercase tracking-widest mb-1 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-deloitte-green animate-pulse"></span>
             {isEditing ? 'Edit Mode' : 'Node Blueprint'}
           </div>
           <h3 className="text-2xl text-white font-light tracking-tight">{data.id}</h3>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && !isEditing && (
            <button
              onClick={startEdit}
              title="Edit metadata (requires admin review)"
              className="p-2 bg-[#111] hover:bg-deloitte-green/20 hover:border-deloitte-green/50 rounded-full text-[#A0A0A0] hover:text-deloitte-green transition-colors border border-[#333]"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onClose} className="p-2 bg-[#111] hover:bg-[#222] rounded-full text-[#666] hover:text-white transition-colors border border-[#333]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Success banner */}
      {submitState.kind === 'success' && (
        <div className="mb-4 bg-deloitte-green/10 border border-deloitte-green/40 rounded-lg px-3 py-2 text-xs text-deloitte-green flex items-center gap-2">
          <Check className="w-3.5 h-3.5" /> Submitted for admin review (id: {submitState.editId.slice(0, 8)}…)
        </div>
      )}
      {submitState.kind === 'error' && (
        <div className="mb-4 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2 text-xs text-red-400">
          {submitState.message}
        </div>
      )}

      <div className="space-y-5">
        {/* Labels */}
        <div>
          <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 block">Multilingual Terminology</label>
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-[#888]">EN</span>
                <input
                  type="text"
                  value={draft.label_en || ''}
                  onChange={(e) => setDraft({ ...draft, label_en: e.target.value })}
                  className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-deloitte-green"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#888]">ZH</span>
                <input
                  type="text"
                  value={draft.label_zh || ''}
                  onChange={(e) => setDraft({ ...draft, label_zh: e.target.value })}
                  className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-deloitte-green"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#111] border border-[#222] rounded-t-lg px-4 py-3 text-sm text-white flex justify-between items-center hover:border-[#444] transition-colors">
                 <span className="text-[#A0A0A0] text-xs">EN</span>
                 <span className="font-medium text-right">{data.label_en || "-"}</span>
              </div>
              <div className="bg-[#111] border border-[#222] border-t-0 rounded-b-lg px-4 py-3 text-sm text-white flex justify-between items-center hover:border-[#444] transition-colors">
                 <span className="text-[#A0A0A0] text-xs">ZH</span>
                 <span className="font-medium text-right">{data.label_zh || "-"}</span>
              </div>
            </>
          )}
        </div>

        {/* Definition */}
        <div>
          <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 block">Semantic Definition</label>
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-[#888]">EN</span>
                <textarea
                  value={draft.definition_en || ''}
                  onChange={(e) => setDraft({ ...draft, definition_en: e.target.value })}
                  rows={3}
                  className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white leading-relaxed focus:outline-none focus:border-deloitte-green"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#888]">ZH</span>
                <textarea
                  value={draft.definition_zh || ''}
                  onChange={(e) => setDraft({ ...draft, definition_zh: e.target.value })}
                  rows={3}
                  className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white leading-relaxed focus:outline-none focus:border-deloitte-green"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-sm leading-relaxed text-[#A0A0A0] min-h-[60px] hover:border-[#444] transition-colors">
               {data.definition_en || data.definition || "No formal definition provided."}
            </div>
          )}
        </div>

        {/* Parent (read-only even in edit mode — id/parent require structural review) */}
        {data.parent && (
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider mb-2 block">Parent</label>
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] px-3 py-2 border border-[#333] rounded-lg text-sm text-white font-mono">
               <span className="w-1 h-3 bg-deloitte-green rounded-sm"></span>
               {data.parent}
            </div>
          </div>
        )}

        {/* Abstract Flag */}
        {isEditing ? (
          <label className="flex items-center gap-3 bg-[#111] border border-[#222] rounded-lg px-4 py-3 cursor-pointer hover:border-[#444]">
            <input
              type="checkbox"
              checked={!!draft.abstract}
              onChange={(e) => setDraft({ ...draft, abstract: e.target.checked })}
              className="w-4 h-4 accent-deloitte-green"
            />
            <div className="flex-1">
              <div className="text-sm text-white">Abstract class</div>
              <div className="text-[10px] text-[#666]">Cannot be directly instantiated</div>
            </div>
          </label>
        ) : (
          data.abstract && (
            <div className="bg-[#051505] border border-deloitte-green/30 rounded-lg p-3">
               <div className="text-[11px] text-deloitte-green font-medium uppercase flex items-center gap-1.5">
                 <GitBranch className="w-3 h-3" />
                 Abstract — cannot be directly instantiated
               </div>
            </div>
          )
        )}

        {/* Edit action bar */}
        {isEditing && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitState.kind === 'submitting'}
              className="flex-1 py-2 bg-deloitte-green text-black font-semibold rounded text-sm hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitState.kind === 'submitting' ? (
                <><Loader className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
              ) : (
                <><Check className="w-3.5 h-3.5" /> Submit for Review</>
              )}
            </button>
            <button
              onClick={cancelEdit}
              disabled={submitState.kind === 'submitting'}
              className="px-4 py-2 bg-[#222] border border-[#333] text-[#A0A0A0] rounded text-sm hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Relations (view-only) ── */}
        {!isEditing && (outgoing.length > 0 || incoming.length > 0) && (
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

        {/* ── Attributes (view-only) ── */}
        {!isEditing && (ownAttrs.length > 0 || inheritedAttrs.length > 0) && (
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

        {/* ── Axioms (view-only) ── */}
        {!isEditing && relatedAxioms.length > 0 && (
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
         <span className="text-[10px] text-[#555]">
           {isEditing
             ? 'Changes submit to admin review queue; no direct write to master.'
             : canEdit
               ? 'Click pencil to edit metadata (requires admin approval to merge)'
               : 'Viewing mode — select nodes on the canvas to inspect'}
         </span>
      </div>
    </div>
  );
}
