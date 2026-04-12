"use client";
import React, { useState, useEffect } from 'react';
import { X, MousePointer2, Move, ZoomIn, Search, Maximize2 } from 'lucide-react';

const STORAGE_KEY = 'ontology-studio-onboarded';

const tips = [
  { icon: Move, label: "Pan", desc: "Drag on empty space to move the canvas" },
  { icon: ZoomIn, label: "Zoom", desc: "Scroll wheel or pinch to zoom in/out" },
  { icon: MousePointer2, label: "Inspect", desc: "Click any node to view its properties" },
  { icon: Search, label: "Search", desc: "Press Ctrl+K to search nodes by name" },
  { icon: Maximize2, label: "Layout", desc: "Use the bottom toolbar to switch layouts" },
];

export function OnboardingGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
  };

  if (!visible) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-[#111]/95 backdrop-blur-xl border border-[#333] rounded-2xl shadow-2xl px-6 py-4 max-w-[540px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#86BC25] uppercase tracking-wider">Quick Guide</span>
          <button onClick={dismiss} className="p-1 hover:bg-[#222] rounded-full transition-colors">
            <X className="w-3.5 h-3.5 text-[#555]" />
          </button>
        </div>
        <div className="flex gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1 text-center">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#333] flex items-center justify-center">
                <tip.icon className="w-3.5 h-3.5 text-[#86BC25]" />
              </div>
              <span className="text-[11px] text-white font-medium">{tip.label}</span>
              <span className="text-[9px] text-[#555] leading-tight">{tip.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
