"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import type { ReactFlowInstance, Node } from '@xyflow/react';

interface SearchPanelProps {
  nodes: Node[];
  rfInstance: ReactFlowInstance | null;
  onNodeSelect?: (nodeId: string) => void;
}

export function SearchPanel({ nodes, rfInstance, onNodeSelect }: SearchPanelProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [open]);

  const results = query.length > 0
    ? nodes.filter(n => {
        const q = query.toLowerCase();
        const label = String(n.data?.label || '').toLowerCase();
        const labelZh = String(n.data?.label_zh || '').toLowerCase();
        return label.includes(q) || labelZh.includes(q) || String(n.id).toLowerCase().includes(q);
      }).slice(0, 12)
    : [];

  const handleSelect = useCallback((nodeId: string) => {
    if (rfInstance) {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        rfInstance.fitView({
          nodes: [{ id: nodeId }],
          duration: 600,
          padding: 0.5,
          maxZoom: 1.5,
        });
      }
    }
    onNodeSelect?.(nodeId);
    setOpen(false);
  }, [rfInstance, nodes, onNodeSelect]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] rounded-lg text-xs text-[#666] hover:text-[#AAA] hover:border-[#555] transition-all"
        title="Search nodes (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="ml-1 px-1.5 py-0.5 bg-[#222] border border-[#444] rounded text-[10px] text-[#555] font-mono">⌘K</kbd>
      </button>
    );
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        className="relative w-[520px] bg-[#111] border border-[#333] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#222]">
          <Search className="w-4 h-4 text-[#555] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search classes by name, Chinese label, or ID..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#444]"
          />
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-[#222] rounded transition-colors">
            <X className="w-4 h-4 text-[#555]" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto">
          {query.length === 0 ? (
            <div className="px-5 py-8 text-center text-[#444] text-sm">
              Type to search {nodes.length} nodes...
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center text-[#444] text-sm">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map(n => (
              <button
                key={n.id}
                onClick={() => handleSelect(n.id)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#1A1A1A] transition-colors text-left group"
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  n.data?.layerType === 'L2' ? 'bg-cyan-400' :
                  n.data?.layerType === 'L3' ? 'bg-fuchsia-400' :
                  'bg-[#86BC25]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-mono truncate">{String(n.data?.label || n.id)}</div>
                  {Boolean(n.data?.label_zh) && (
                    <div className="text-xs text-[#555] truncate">{String(n.data.label_zh)}</div>
                  )}
                </div>
                {Boolean(n.data?.abstract) && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#222] border border-[#333] rounded text-[#666]">abstract</span>
                )}
                <span className="text-[10px] text-[#333] group-hover:text-[#555] font-mono">
                  {String(n.data?.layerType || 'L1')}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#222] text-[10px] text-[#444]">
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
