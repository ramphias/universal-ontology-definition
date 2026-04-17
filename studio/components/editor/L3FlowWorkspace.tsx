"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { ReactFlow, Controls, ControlButton, Background, BackgroundVariant, MiniMap, type ReactFlowInstance, Node, Edge, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { PropertiesPanel } from './PropertiesPanel';
import { SearchPanel } from './SearchPanel';
import { OnboardingGuide } from './OnboardingGuide';
import { fetchExtensionData, fetchL3EnterpriseData, resolveLayerFile } from '@/lib/actions';
import { useOntologyLayout, LayoutMode } from '@/hooks/useOntologyLayout';
import { CodeExportModal } from './CodeExportModal';
import { computeBadgeCounts, buildRelationEdges, buildAxiomEdges } from './ontologyUtils';

export function L3FlowWorkspace({ 
  initialData, 
  availableExtensions,
  availableEnterprises 
}: { 
  initialData: any, 
  availableExtensions: {id: string, name: string}[],
  availableEnterprises: {id: string, name: string}[]
}) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // States specific to L2 and L3 Workspace handling
  const [activeExtensions, setActiveExtensions] = useState<string[]>([]);
  const [loadedExtensionsData, setLoadedExtensionsData] = useState<Record<string, any>>({});
  const [isLoadingExtension, setIsLoadingExtension] = useState<boolean>(false);

  const [activeEnterprises, setActiveEnterprises] = useState<string[]>([]);
  const [loadedEnterprisesData, setLoadedEnterprisesData] = useState<Record<string, any>>({});
  const [isLoadingEnterprise, setIsLoadingEnterprise] = useState<boolean>(false);
  const [showRelations, setShowRelations] = useState(false);

  const [extensionFiles, setExtensionFiles] = useState<Record<string, string>>({});
  const [enterpriseFiles, setEnterpriseFiles] = useState<Record<string, string>>({});

  const layerFileForClass = (classId: string): string | undefined => {
    if ((initialData.classes || []).some((c: any) => c.id === classId)) {
      return "l1-core/universal_ontology_v1.json";
    }
    for (const [extId, data] of Object.entries(loadedExtensionsData)) {
      if ((data as any)?.classes?.some((c: any) => c.id === classId)) {
        return extensionFiles[extId];
      }
    }
    for (const [entId, data] of Object.entries(loadedEnterprisesData)) {
      if ((data as any)?.classes?.some((c: any) => c.id === classId)) {
        return enterpriseFiles[entId];
      }
    }
    return undefined;
  };

  const [rawNodes, setRawNodes] = useState<Node[]>([]);
  const [rawEdges, setRawEdges] = useState<Edge[]>([]);

  // 1. Calculate Topology (Generates RAW nodes/edges without layout)
  useEffect(() => {
    if (!initialData || !initialData.classes) return;

    const mergedClasses = initialData.classes.map((c: any) => ({...c, layerType: 'L1'}));
    
    activeExtensions.forEach(extId => {
       const extData = loadedExtensionsData[extId];
       if (extData && extData.classes) {
          extData.classes.forEach((c: any) => {
            mergedClasses.push({...c, layerType: 'L2', layerId: extData.layer || extId});
          });
       }
    });

    activeEnterprises.forEach(entId => {
       const entData = loadedEnterprisesData[entId];
       if (entData && entData.classes) {
          entData.classes.forEach((c: any) => {
            mergedClasses.push({...c, layerType: 'L3', layerId: entData.layer || entId});
          });
       }
    });

    // Merge all relations/attributes/axioms across layers for badges & relation edges
    const allRelations = [
      ...(initialData.relations || []),
      ...activeExtensions.flatMap(eid => loadedExtensionsData[eid]?.relations || []),
      ...activeEnterprises.flatMap(eid => loadedEnterprisesData[eid]?.relations || []),
    ];
    const allAttributes = [
      ...(initialData.attributes || []),
      ...activeExtensions.flatMap(eid => loadedExtensionsData[eid]?.attributes || []),
      ...activeEnterprises.flatMap(eid => loadedEnterprisesData[eid]?.attributes || []),
    ];
    const allAxioms = [
      ...(initialData.axioms || []),
      ...activeEnterprises.flatMap(eid => loadedEnterprisesData[eid]?.axioms || []),
    ];
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
        extensionId: c.layerId,
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
      let strokeColor = '#86BC25'; 
      if (c.layerType === 'L2') strokeColor = '#00A3E0';
      if (c.layerType === 'L3') strokeColor = '#D946EF'; 
      
      const edgeStyle = { stroke: strokeColor, strokeWidth: 1.5, opacity: 0.8 };

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
          style: { stroke: strokeColor, strokeWidth: 1.5, strokeDasharray: '4,4', opacity: 0.5 }
        });
      }
    });

    const relationEdges = showRelations ? buildRelationEdges(allRelations, nodeIds) : [];
    const axiomEdges = showRelations ? buildAxiomEdges(allAxioms, nodeIds) : [];

    setRawNodes(initialNodes);
    setRawEdges([...initialEdges, ...relationEdges, ...axiomEdges]);
  }, [initialData, activeExtensions, loadedExtensionsData, activeEnterprises, loadedEnterprisesData, showRelations]);


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

  // Inject toggleCollapse callback into node data
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

  // Toggle Extension Handler (L2)
  const toggleExtension = async (extId: string) => {
    if (activeExtensions.includes(extId)) {
       setActiveExtensions(prev => prev.filter(id => id !== extId));
    } else {
       if (!loadedExtensionsData[extId]) {
          setIsLoadingExtension(true);
          const [data, file] = await Promise.all([
            fetchExtensionData(extId),
            resolveLayerFile("L2", extId),
          ]);
          setIsLoadingExtension(false);
          if (data) setLoadedExtensionsData(prev => ({...prev, [extId]: data}));
          if (file) setExtensionFiles(prev => ({...prev, [extId]: file}));
       }
       setActiveExtensions(prev => [...prev, extId]);
    }
  };

  // Toggle Enterprise Handler (L3)
  const toggleEnterprise = async (entId: string) => {
    if (activeEnterprises.includes(entId)) {
       setActiveEnterprises(prev => prev.filter(id => id !== entId));
    } else {
       if (!loadedEnterprisesData[entId]) {
          setIsLoadingEnterprise(true);
          const [data, file] = await Promise.all([
            fetchL3EnterpriseData(entId),
            resolveLayerFile("L3", entId),
          ]);
          setIsLoadingEnterprise(false);
          if (file) setEnterpriseFiles(prev => ({...prev, [entId]: file}));
          if (data) {
             setLoadedEnterprisesData(prev => ({...prev, [entId]: data}));
             
             if (data.extends && Array.isArray(data.extends)) {
                data.extends.forEach((dep: string) => {
                    const potentialExtIds = availableExtensions.filter(e => dep.toLowerCase().includes(e.id.toLowerCase().replace('-industry', '')));
                    potentialExtIds.forEach(async ex => {
                        if (!activeExtensions.includes(ex.id)) {
                             if (!loadedExtensionsData[ex.id]) {
                                 const extData = await fetchExtensionData(ex.id);
                                 if (extData) setLoadedExtensionsData(p => ({...p, [ex.id]: extData}));
                             }
                             setActiveExtensions(p => p.includes(ex.id) ? p : [...p, ex.id]);
                        }
                    });
                })
             }
          }
       }
       setActiveEnterprises(prev => [...prev, entId]);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col gap-3">
      
      {/* Universal Floating Toolbar for Layers and Layout */}
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

        <div className="flex items-center justify-between">
            <div className="text-sm text-[#A0A0A0] flex items-center gap-3 ml-2 w-32">
               <span className="w-2 h-2 rounded-full bg-[#D946EF] animate-pulse"></span>
               L3 Instance:
            </div>
            <div className="flex flex-wrap gap-2 flex-1">
               {availableEnterprises.map(ent => {
                  const isActive = activeEnterprises.includes(ent.id);
                  return (
                     <button
                       key={ent.id}
                       onClick={() => toggleEnterprise(ent.id)}
                       disabled={isLoadingEnterprise && !isActive}
                       className={`px-3 py-1 text-xs font-mono rounded-md border transition-all duration-300 ${
                         isActive 
                         ? 'bg-[#D946EF]/20 text-[#D946EF] border-[#D946EF]/50 shadow-[0_0_10px_rgba(217,70,239,0.2)]' 
                         : 'bg-[#222] text-[#666] border-[#333] hover:text-white hover:border-[#555]'
                       }`}
                     >
                       {isActive ? '✓ ' : '+ '}{ent.name}
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
      <div className="w-full flex-1 relative mt-1">
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
                  className="bg-[#111] hover:bg-black border border-[#333] text-[#D946EF] hover:text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-xl transition-all hover:scale-105"
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
                if (lt === 'L3') return '#D946EF';
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
                  ...Object.values(loadedEnterprisesData).flatMap((ent: any) => ent?.relations || []),
                ],
                attributes: [
                  ...(initialData.attributes || []),
                  ...Object.values(loadedExtensionsData).flatMap((ext: any) => ext?.attributes || []),
                  ...Object.values(loadedEnterprisesData).flatMap((ent: any) => ent?.attributes || []),
                ],
                axioms: [
                  ...(initialData.axioms || []),
                  ...Object.values(loadedEnterprisesData).flatMap((ent: any) => ent?.axioms || []),
                ],
                classes: [
                  ...(initialData.classes || []),
                  ...Object.values(loadedExtensionsData).flatMap((ext: any) => ext?.classes || []),
                  ...Object.values(loadedEnterprisesData).flatMap((ent: any) => ent?.classes || []),
                ],
              }}
              onClose={() => onPaneClick()}
              layerFile={layerFileForClass(selectedNodeData.id)}
            />
          )}

          <CodeExportModal 
             isOpen={isExportOpen} 
             onClose={() => setIsExportOpen(false)} 
             classes={rawNodes.filter(n => n.id !== '__ROOT__').map(n => n.data.fullData)} 
             contextName="L3 Enterprise Workspace"
          />
      </div>
    </div>
  );
}
