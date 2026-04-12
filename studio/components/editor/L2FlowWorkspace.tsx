"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ReactFlow, Controls, ControlButton, Background, BackgroundVariant, MiniMap, type ReactFlowInstance, Node, Edge, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { PropertiesPanel } from './PropertiesPanel';
import { SearchPanel } from './SearchPanel';
import { OnboardingGuide } from './OnboardingGuide';
import { fetchExtensionData } from '@/lib/actions';
import { useOntologyLayout, LayoutMode } from '@/hooks/useOntologyLayout';
import { CodeExportModal } from './CodeExportModal';
import { computeBadgeCounts, buildRelationEdges, buildAxiomEdges } from './ontologyUtils';

export function L2FlowWorkspace({ initialData, availableExtensions }: { initialData: any, availableExtensions: {id: string, name: string}[] }) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // States specific to L2 Workspace handling
  const [activeExtensions, setActiveExtensions] = useState<string[]>([]);
  const [loadedExtensionsData, setLoadedExtensionsData] = useState<Record<string, any>>({});
  const [isLoadingExtension, setIsLoadingExtension] = useState<boolean>(false);
  const [showRelations, setShowRelations] = useState(false);

  const [rawNodes, setRawNodes] = useState<Node[]>([]);
  const [rawEdges, setRawEdges] = useState<Edge[]>([]);

  // 1. Calculate Topology
  useEffect(() => {
    if (!initialData || !initialData.classes) return;

    const mergedClasses = initialData.classes.map((c: any) => ({...c, layerType: 'L1'}));
    
    activeExtensions.forEach(extId => {
       const extData = loadedExtensionsData[extId];
       if (extData && extData.classes) {
          extData.classes.forEach((c: any) => {
            mergedClasses.push({...c, layerType: 'L2', extensionId: extData.layer || extId});
          });
       }
    });

    // Merge all relations and attributes across layers for badges
    const allRelations = [
      ...(initialData.relations || []),
      ...activeExtensions.flatMap(eid => loadedExtensionsData[eid]?.relations || []),
    ];
    const allAttributes = [
      ...(initialData.attributes || []),
      ...activeExtensions.flatMap(eid => loadedExtensionsData[eid]?.attributes || []),
    ];
    const allAxioms = initialData.axioms || [];
    const { attrCounts, axiomCounts } = computeBadgeCounts(mergedClasses, allAttributes, allAxioms);
    const nodeIds = new Set<string>(mergedClasses.map((c: any) => c.id));

    const initialNodes: Node[] = mergedClasses.map((c: any) => ({
      id: c.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: c.id,
        label_zh: c.label_zh,
        abstract: c.abstract,
        layerType: c.layerType,
        extensionId: c.extensionId,
        fullData: c,
        attributeCount: attrCounts[c.id] || 0,
        axiomCount: axiomCounts[c.id] || 0,
      },
    }));

    const ROOT_ID = '__ROOT__';
    initialNodes.push({
      id: ROOT_ID,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        label: 'Universal Core',
        label_zh: '宇宙原点',
        abstract: true,
        layerType: 'L1',
        fullData: {
          id: 'Universal Core',
          label_en: 'Universal Core',
          label_zh: '宇宙原点 / 万物之源',
          definition_en: 'The singular absolute starting point of all ontology dimensions.',
          abstract: true,
          parent: null
        }
      }
    });

    const initialEdges: Edge[] = [];
    mergedClasses.forEach((c: any) => {
      const isL2 = c.layerType === 'L2';
      const edgeStyle = isL2 ? { stroke: '#00A3E0', strokeWidth: 1.5, opacity: 0.8 } : { stroke: '#86BC25', strokeWidth: 1.5, opacity: 0.6 };

      if (c.parent) {
        initialEdges.push({
          id: `e-${c.parent}-${c.id}`,
          source: c.parent,
          target: c.id,
          type: 'smoothstep',
          animated: true,
          style: edgeStyle
        });
      } else {
        initialEdges.push({
          id: `e-${ROOT_ID}-${c.id}`,
          source: ROOT_ID,
          target: c.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: isL2 ? '#00A3E0' : '#555', strokeWidth: 1.5, strokeDasharray: '4,4', opacity: 0.5 }
        });
      }
    });

    const relationEdges = showRelations ? buildRelationEdges(allRelations, nodeIds) : [];
    const axiomEdges = showRelations ? buildAxiomEdges(allAxioms, nodeIds) : [];

    setRawNodes(initialNodes);
    setRawEdges([...initialEdges, ...relationEdges, ...axiomEdges]);
  }, [initialData, activeExtensions, loadedExtensionsData, showRelations]);

  // 2. Pass RAW to Unified Layout Engine Hook
  const { 
      nodes: layoutedNodes, 
      edges: layoutedEdges, 
      layoutMode, 
      setLayoutMode, 
      toggleCollapse,
      onNodesChange,
      onEdgesChange
  } = useOntologyLayout(rawNodes, rawEdges, rfInstance);

  const finalNodes = layoutedNodes.map(n => ({
      ...n,
      data: {
          ...n.data,
          selected: selectedNodeData?.id === n.id,
          onToggleCollapse: toggleCollapse
      }
  }));

  const selectedId = selectedNodeData?.id;
  const finalEdges = layoutedEdges.map(e => {
    if (!(e.data as any)?.isRelation || !selectedId) return e;
    const connected = e.source === selectedId || e.target === selectedId;
    return {
      ...e,
      style: { ...e.style, opacity: connected ? 0.8 : 0.08 },
      labelStyle: { ...(e.labelStyle || {}), opacity: connected ? 1 : 0.1 },
    };
  });

  const handleResetLayout = () => {
    setSelectedNodeData(null);
    setTimeout(() => {
      rfInstance?.fitView({ duration: 800, padding: 0.2 });
    }, 50);
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
     setSelectedNodeData(node.data.fullData);
  };

  const onPaneClick = () => {
    setSelectedNodeData(null);
  }

  const onSearchSelect = (nodeId: string) => {
    const node = finalNodes.find(n => n.id === nodeId);
    if (node?.data) setSelectedNodeData((node.data as any).fullData);
  };

  // Toggle Extension Handler
  const toggleExtension = async (extId: string) => {
    if (activeExtensions.includes(extId)) {
       setActiveExtensions(prev => prev.filter(id => id !== extId));
    } else {
       if (!loadedExtensionsData[extId]) {
          setIsLoadingExtension(true);
          const data = await fetchExtensionData(extId);
          setIsLoadingExtension(false);
          if (data) {
             setLoadedExtensionsData(prev => ({...prev, [extId]: data}));
          }
       }
       setActiveExtensions(prev => [...prev, extId]);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col gap-3">
      
      {/* L2 Extension Floating Toolbar */}
      <div className="bg-[#111] border border-[#333] rounded-xl p-3 shadow-xl flex flex-col gap-3 z-10 sticky top-0 mt-2 mx-2">
        
        <div className="flex items-center justify-between">
            <div className="text-sm text-[#A0A0A0] flex items-center gap-3 ml-2 w-32">
               <span className="w-2 h-2 rounded-full bg-[#00A3E0] animate-pulse"></span>
               L2 Extensions:
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
               {availableExtensions.map(ext => {
                  const isActive = activeExtensions.includes(ext.id);
                  return (
                     <button
                       key={ext.id}
                       onClick={() => toggleExtension(ext.id)}
                       disabled={isLoadingExtension && !isActive}
                       className={`px-3 py-1 text-xs font-mono rounded-md border transition-all duration-300 ${
                         isActive 
                         ? 'bg-[#00A3E0]/20 text-[#00A3E0] border-[#00A3E0]/50 shadow-[0_0_10px_rgba(0,163,224,0.2)]' 
                         : 'bg-[#222] text-[#666] border-[#333] hover:text-white hover:border-[#555]'
                       }`}
                     >
                       {isActive ? '✓ ' : '+ '}{ext.name}
                     </button>
                  );
               })}
            </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#333]">
            <div className="text-sm text-[#A0A0A0] flex items-center gap-3 ml-2 w-32">
               <span className={`w-2 h-2 rounded-full ${showRelations ? 'bg-[#5C6BC0] animate-pulse' : 'bg-[#444]'}`}></span>
               Relations:
            </div>
            <button
               onClick={() => setShowRelations(v => !v)}
               className={`px-3 py-1 text-xs font-mono rounded-md border transition-all duration-300 ${
                 showRelations
                 ? 'bg-[#5C6BC0]/20 text-[#7986CB] border-[#5C6BC0]/50 shadow-[0_0_10px_rgba(92,107,192,0.2)]'
                 : 'bg-[#222] text-[#666] border-[#333] hover:text-white hover:border-[#555]'
               }`}
            >
               {showRelations ? '✓ ON' : '+ OFF'}
            </button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="w-full flex-1 relative">
          <OnboardingGuide />
          <style>{`
            .react-flow__controls {
              background-color: #111 !important;
              border: 1px solid #333 !important;
              border-radius: 8px !important;
              overflow: hidden !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8) !important;
            }
            .react-flow__controls-button {
              background-color: #111 !important;
              border-bottom: 1px solid #333 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
            .react-flow__controls-button:last-child {
              border-bottom: none !important;
            }
            .react-flow__controls-button:hover {
              background-color: #222 !important;
            }
            .react-flow__controls-button svg {
              fill: #86BC25 !important;
              stroke: #86BC25 !important;
            }
            .react-flow__attribution {
              display: none !important;
            }
          `}</style>
          
          <ReactFlow
            nodes={finalNodes}
            edges={finalEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.01}
            maxZoom={3}
            className="bg-[#050505] rounded-xl border border-[#222] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"
          >
            <Panel position="top-left" className="z-50 ml-2 mt-2">
               <button 
                  onClick={() => setIsExportOpen(true)}
                  className="bg-[#111] hover:bg-black border border-[#333] text-[#00A3E0] hover:text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-xl transition-all hover:scale-105"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  &lt;/&gt; L0 Compiler
               </button>
            </Panel>
            <Panel position="top-right" className="z-50 mr-2 mt-2">
              <SearchPanel nodes={finalNodes} rfInstance={rfInstance} onNodeSelect={onSearchSelect} />
            </Panel>
            <Panel position="bottom-center" className="mb-[15px] z-50">
               <div className="flex bg-[#111] p-1 rounded-lg border border-[#333] shadow-xl">
                 {(["TB-COMPACT", "TB", "LR", "FORCE"] as LayoutMode[]).map(mode => (
                    <button
                       key={mode}
                       onClick={() => setLayoutMode(mode)}
                       className={`px-3 py-1 text-xs rounded transition-all ${
                           layoutMode === mode
                           ? 'bg-[#333] text-white shadow'
                           : 'text-[#666] hover:text-[#AAA]'
                       }`}
                    >
                       {mode === "TB" ? "Standard (TB)" : mode === "TB-COMPACT" ? "Compact Tree" : mode === "LR" ? "Horizontal (LR)" : "Physics Force"}
                    </button>
                 ))}
               </div>
            </Panel>
            <Controls showFitView={false} position="bottom-left">
              <ControlButton onClick={handleResetLayout} title="Recalculate Layout & Fit View">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/>
                </svg>
              </ControlButton>
            </Controls>
            <MiniMap
              nodeColor={(n) => {
                const lt = (n.data as any)?.layerType;
                if (lt === 'L2') return '#00A3E0';
                return n.data?.abstract ? '#333' : '#86BC25';
              }}
              maskColor="rgba(0,0,0,0.7)"
              style={{ backgroundColor: '#111', borderRadius: 8, border: '1px solid #333' }}
              pannable
              zoomable
            />
            <Background color="#1A1A1A" gap={24} variant={BackgroundVariant.Dots} />
          </ReactFlow>
          
          {selectedNodeData && (
            <PropertiesPanel
              data={selectedNodeData}
              context={{
                relations: [
                  ...(initialData.relations || []),
                  ...Object.values(loadedExtensionsData).flatMap((ext: any) => ext?.relations || []),
                ],
                attributes: [
                  ...(initialData.attributes || []),
                  ...Object.values(loadedExtensionsData).flatMap((ext: any) => ext?.attributes || []),
                ],
                axioms: initialData.axioms || [],
                classes: [
                  ...(initialData.classes || []),
                  ...Object.values(loadedExtensionsData).flatMap((ext: any) => ext?.classes || []),
                ],
              }}
              onClose={() => onPaneClick()}
            />
          )}

          <CodeExportModal 
             isOpen={isExportOpen} 
             onClose={() => setIsExportOpen(false)} 
             classes={rawNodes.filter(n => n.id !== '__ROOT__').map(n => n.data.fullData)} 
             contextName="L2 Industry Workspace"
          />
      </div>
    </div>
  );
}
