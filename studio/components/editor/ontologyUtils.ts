import type { Edge } from '@xyflow/react';

/** Pre-compute attribute/axiom counts for badge display on nodes */
export function computeBadgeCounts(classes: any[], attributes: any[], axioms: any[]) {
  const parentMap = Object.fromEntries(classes.map((c: any) => [c.id, c.parent]));
  const attrByOwner: Record<string, number> = {};
  for (const a of attributes) attrByOwner[a.owner_class] = (attrByOwner[a.owner_class] || 0) + 1;
  const attrCounts: Record<string, number> = {};
  for (const c of classes) {
    let total = 0; let cur: string | null = c.id; const visited = new Set<string>();
    while (cur && !visited.has(cur)) { visited.add(cur); total += attrByOwner[cur] || 0; cur = parentMap[cur] || null; }
    attrCounts[c.id] = total;
  }
  const axiomCounts: Record<string, number> = {};
  for (const ax of axioms) {
    for (const r of [ax.subject_class, ax.object_class, ...(ax.classes || [])].filter(Boolean))
      axiomCounts[r] = (axiomCounts[r] || 0) + 1;
  }
  return { attrCounts, axiomCounts };
}

/** Build disjoint axiom edges (red dotted, straight) */
export function buildAxiomEdges(axioms: any[], nodeIds: Set<string>): Edge[] {
  return axioms
    .filter((ax: any) => ax.type === 'disjoint' && ax.classes?.length === 2
      && nodeIds.has(ax.classes[0]) && nodeIds.has(ax.classes[1]))
    .map((ax: any) => ({
      id: `ax-${ax.id}`, source: ax.classes[0], target: ax.classes[1],
      type: 'straight', animated: false, label: '⊥',
      labelStyle: { fill: '#EF9A9A', fontSize: 9, fontWeight: 600, letterSpacing: '0.5px' },
      labelBgStyle: { fill: '#1A0A0A', stroke: '#3D1515', strokeWidth: 0.5, rx: 6, opacity: 0.95 },
      labelBgPadding: [5, 3] as [number, number],
      sourceHandle: 'right', targetHandle: 'left',
      data: { isRelation: true, isAxiom: true },
      style: { stroke: '#E53935', strokeDasharray: '3 3', strokeWidth: 1, opacity: 0.5 },
    }));
}

/** Convert snake_case to readable label: "governed_by_policy" → "governed by policy" */
function humanize(id: string): string {
  return id.replace(/_/g, ' ');
}

/** Build relation edges (indigo dashed, side handles) from relations array */
export function buildRelationEdges(relations: any[], nodeIds: Set<string>): Edge[] {
  return relations
    .filter((r: any) => r.domain && r.range && nodeIds.has(r.domain) && nodeIds.has(r.range))
    .map((r: any) => ({
      id: `rel-${r.id}`, source: r.domain, target: r.range,
      type: 'smoothstep', animated: false, label: humanize(r.id),
      labelStyle: { fill: '#B0BEC5', fontSize: 10, fontWeight: 400 },
      labelBgStyle: { fill: '#12121F', stroke: '#2A2D45', strokeWidth: 0.5, rx: 4, ry: 4, opacity: 0.92 },
      labelBgPadding: [6, 4] as [number, number],
      sourceHandle: 'right', targetHandle: 'left',
      data: { isRelation: true },
      style: { stroke: '#5C6BC0', strokeDasharray: '4 4', strokeWidth: 1.2, opacity: 0.5 },
    }));
}
