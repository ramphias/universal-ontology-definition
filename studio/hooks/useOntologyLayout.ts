import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Position, type ReactFlowInstance } from "@xyflow/react";
import * as dagre from "dagre";
import * as d3 from "d3-force";

export type LayoutMode = "TB" | "TB-COMPACT" | "LR" | "FORCE";

export function useOntologyLayout(initialNodes: Node[], initialEdges: Edge[], rfInstance: ReactFlowInstance | null) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("TB-COMPACT");
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // We need a ref to nodes to grab current positions without triggering useEffect
  const nodesRef = useRef<Node[]>(nodes);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
      setNodes((nds) => {
          const nextNds = applyNodeChanges(changes, nds);

          // If we are in physics mode, inject dragging into the simulation
          if (simulationRef.current) {
              const sim = simulationRef.current;
              let shouldRestart = false;

              changes.forEach(c => {
                  if (c.type === 'position' && c.dragging) {
                      const simNode = sim.nodes().find(n => n.id === c.id);
                      if (simNode) {
                          simNode.fx = c.positionAbsolute?.x ?? c.position?.x ?? simNode.x;
                          simNode.fy = c.positionAbsolute?.y ?? c.position?.y ?? simNode.y;
                          shouldRestart = true;
                      }
                  } else if (c.type === 'position' && c.dragging === false) {
                      const simNode = sim.nodes().find(n => n.id === c.id);
                      if (simNode) {
                          simNode.fx = null;
                          simNode.fy = null;
                      }
                  }
              });

              if (shouldRestart) {
                  sim.alphaTarget(0.3).restart();
              } else {
                  sim.alphaTarget(0); // Let it settle when released
              }
          }

          return nextNds;
      });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const [layoutTriggerCounter, setLayoutTriggerCounter] = useState(0);
  const triggerLayoutRecalculation = useCallback(() => {
     setLayoutTriggerCounter(c => c + 1);
  }, []);

  // Compute derived view data
  useEffect(() => {
    if (!initialNodes.length) return;

    // 1. Resolve collapsed nodes (exclude their descendants)
    const descendantsToHide = new Set<string>();
    
    // Quick lookup maps
    const childrenMap = new Map<string, string[]>();
    const parentMap = new Map<string, string[]>(); // node -> parents
    
    initialEdges.forEach(e => {
        if (!childrenMap.has(e.source)) childrenMap.set(e.source, []);
        childrenMap.get(e.source)!.push(e.target);
        
        if (!parentMap.has(e.target)) parentMap.set(e.target, []);
        parentMap.get(e.target)!.push(e.source);
    });

    const traverseHide = (nodeId: string) => {
        const children = childrenMap.get(nodeId) || [];
        children.forEach(child => {
            if (!descendantsToHide.has(child)) {
                descendantsToHide.add(child);
                traverseHide(child);
            }
        });
    };

    collapsedNodeIds.forEach(id => traverseHide(id));

    // Filtered arrays
    const visibleNodes = initialNodes.filter(n => !descendantsToHide.has(n.id))
       // Inject child count so CustomNode can render the toggle button
       .map(n => {
           const children = childrenMap.get(n.id) || [];
           return {
               ...n,
               data: {
                   ...n.data,
                   hasChildren: children.length > 0,
                   childrenCount: children.length,
                   isCollapsed: collapsedNodeIds.has(n.id)
               }
           };
       });

    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    const visibleEdges = initialEdges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

    // 2. Apply Layout Algorithm
    let layoutedNodes: Node[] = [];
    let layoutedEdges: Edge[] = [...visibleEdges];

    if (layoutMode === "FORCE") {
        // --- d3-force LIVE PHYSICS SIMULATION ---
        if (simulationRef.current) {
            simulationRef.current.stop();
        }

        const posMap = new Map(nodesRef.current.map(n => [n.id, n.position]));
        const simNodes = visibleNodes.map(n => {
            const pos = posMap.get(n.id) || { x: (Math.random()-0.5)*100, y: (Math.random()-0.5)*100 };
            return {...n, x: pos.x, y: pos.y };
        });
        const simEdges = visibleEdges.map(e => ({source: e.source, target: e.target}));

        const simulation = d3.forceSimulation(simNodes as any)
            .force("link", d3.forceLink(simEdges).id((d: any) => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-800)) // Strong repel
            .force("center", d3.forceCenter(0, 0))
            .force("collide", d3.forceCollide(100));

        simulationRef.current = simulation;

        simulation.on("tick", () => {
             // Synchronize back to React Flow exactly what simulation output is
             setNodes((currentNds) => {
                 let changed = false;
                 const next = currentNds.map(n => {
                     const sn = (simulation.nodes() as any[]).find(sn => sn.id === n.id);
                     if (sn && (sn.x !== n.position.x || sn.y !== n.position.y)) {
                         changed = true;
                         return { ...n, position: { x: sn.x, y: sn.y } };
                     }
                     return n;
                 });
                 return changed ? next : currentNds;
             });
        });

        // Initialize immediately
        setNodes(simNodes.map(n => ({
            ...n,
            position: { x: (n as any).x, y: (n as any).y }
        })));
        setEdges(visibleEdges);

        setTimeout(() => {
           rfInstance?.fitView({ duration: 800, padding: 0.2 });
        }, 50);

        return () => {
            if (simulationRef.current) {
                simulationRef.current.stop();
                simulationRef.current = null;
            }
        };
    } else {
        // --- DAGRE ALGORITHMS (TB, LR, TB-COMPACT) ---
        if (simulationRef.current) {
            simulationRef.current.stop();
            simulationRef.current = null;
        }

        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        
        const isHorizontal = layoutMode === "LR";
        const rankDir = layoutMode === "LR" ? "LR" : "TB";
        dagreGraph.setGraph({ rankdir: rankDir, nodesep: 80, ranksep: 180 });

        let nodesToDagre = [...visibleNodes];
        
        // **TB-COMPACT Logic**: Identify leaf nodes with exactly 1 parent. We pull them out of Dagre 
        // to prevent extreme horizontal width, and pack them vertically after Dagre finishes.
        const compactedLeaves = new Map<string, Node[]>(); // parentId -> leafNodes[]
        let isolatedLeafIds = new Set<string>();

        if (layoutMode === "TB-COMPACT") {
           const potentialLeaves = visibleNodes.filter(n => {
               const children = childrenMap.get(n.id) || [];
               const parents = parentMap.get(n.id) || [];
               return children.length === 0 && parents.length === 1; 
           });

           // Only compact if a parent has > 3 leaves to actually save space
           const tempParentGrouping = new Map<string, Node[]>();
           potentialLeaves.forEach(leaf => {
               const parent = parentMap.get(leaf.id)![0];
               if (!tempParentGrouping.has(parent)) tempParentGrouping.set(parent, []);
               tempParentGrouping.get(parent)!.push(leaf);
           });

           tempParentGrouping.forEach((leaves, parentId) => {
              if (leaves.length > 1) { // Compact any parent with > 1 leaf
                 compactedLeaves.set(parentId, leaves);
                 leaves.forEach(l => isolatedLeafIds.add(l.id));
              }
           });

           nodesToDagre = visibleNodes.filter(n => !isolatedLeafIds.has(n.id));
        }

        // Add to Dagre
        nodesToDagre.forEach((node) => {
            dagreGraph.setNode(node.id, { width: 220, height: 100 });
        });

        visibleEdges.forEach((edge) => {
            // Skip relation edges from dagre layout — only inheritance edges define tree structure
            if ((edge.data as any)?.isRelation) return;
            if (!isolatedLeafIds.has(edge.source) && !isolatedLeafIds.has(edge.target)) {
                dagreGraph.setEdge(edge.source, edge.target);
            }
        });

        // [TB-COMPACT] Add dummy nodes underneath parents to cleanly reserve necessary vertical bounding box
        if (layoutMode === "TB-COMPACT") {
            compactedLeaves.forEach((leaves, parentId) => {
                 const leafCount = leaves.length;
                 const dummyId = `__DUMMY_FOR_${parentId}__`;
                 dagreGraph.setNode(dummyId, { width: 220, height: leafCount * 160 });
                 dagreGraph.setEdge(parentId, dummyId);
            });
        }

        dagre.layout(dagreGraph);

        // Apply Dagre coordinates
        nodesToDagre.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            
            layoutedNodes.push({
                ...node,
                targetPosition: isHorizontal ? Position.Left : Position.Top,
                sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
                position: {
                    x: nodeWithPosition.x - 110,
                    y: nodeWithPosition.y - 50,
                },
            });
        });

        // **TB-COMPACT Logic**: Post-process leaves
        if (layoutMode === "TB-COMPACT") {
            const mappedLayoutNodes = new Map(layoutedNodes.map(n => [n.id, n]));

            compactedLeaves.forEach((leaves, parentId) => {
                const parentNode = mappedLayoutNodes.get(parentId);
                if (!parentNode) return;

                // Sort leaves alphabetically for stability
                leaves.sort((a, b) => (a.data?.label as string || '').localeCompare(b.data?.label as string || ''));

                leaves.forEach((leaf, idx) => {
                    layoutedNodes.push({
                        ...leaf,
                        targetPosition: Position.Top,
                        sourcePosition: Position.Left, // Connect from left for orthogonal look
                        position: {
                            // Slightly offset right to indicate child structure visually
                            x: parentNode.position.x + 80,
                            // Stack vertically below
                            y: parentNode.position.y + 150 + (idx * 160)
                        }
                    });

                    // Add Custom Edge Style to make it look like orthogonal tree folder structure
                    const relatedEdge = layoutedEdges.find(e => e.source === parentId && e.target === leaf.id);
                    if (relatedEdge) {
                       relatedEdge.type = 'smoothstep'; 
                    }
                });
            });
        }

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        // Auto-refit after a tiny delay for DOM measurement
        setTimeout(() => {
           rfInstance?.fitView({ duration: 800, padding: 0.2 });
        }, 50);

        return () => {};
    }

  }, [initialNodes, initialEdges, layoutMode, collapsedNodeIds, layoutTriggerCounter, rfInstance]);

  const toggleCollapse = useCallback((nodeId: string) => {
      setCollapsedNodeIds(prev => {
          const next = new Set(prev);
          if (next.has(nodeId)) next.delete(nodeId);
          else next.add(nodeId);
          return next;
      });
  }, []);

  return {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      layoutMode,
      setLayoutMode,
      toggleCollapse,
      triggerLayoutRecalculation
  };
}
