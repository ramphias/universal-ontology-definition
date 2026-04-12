import { Handle, Position } from '@xyflow/react';
import { Database, Shield } from 'lucide-react';

export function CustomNode({ data }: { data: any }) {
  const isL2 = data.layerType === 'L2';
  const isL3 = data.layerType === 'L3';
  
  let themeColor = 'border-deloitte-green/40 hover:border-deloitte-green hover:shadow-[0_0_15px_rgba(134,188,37,0.15)] ring-deloitte-green';
  let textHoverColor = 'group-hover:text-deloitte-green';
  let handleColor = '!bg-deloitte-green';
  let badgeColor = 'text-deloitte-green border-deloitte-green/30';
  
  if (isL2) {
      themeColor = 'border-[#0082aa] hover:border-[#00A3E0] hover:shadow-[0_0_15px_rgba(0,163,224,0.15)] ring-[#00A3E0]';
      textHoverColor = 'group-hover:text-[#00A3E0]';
      handleColor = '!bg-[#00A3E0]';
      badgeColor = 'text-[#00A3E0] border-[#00A3E0]/30';
  } else if (isL3) {
      themeColor = 'border-[#a21caf] hover:border-[#D946EF] hover:shadow-[0_0_15px_rgba(217,70,239,0.15)] ring-[#D946EF]';
      textHoverColor = 'group-hover:text-[#D946EF]';
      handleColor = '!bg-[#D946EF]';
      badgeColor = 'text-[#D946EF] border-[#D946EF]/30';
  }

  return (
    <div className={`px-5 py-4 shadow-2xl rounded-lg bg-[#0F0F0F] border ${data.abstract ? 'border-[#333]' : themeColor} min-w-[220px] group transition-all duration-300 relative ${data.selected ? `ring-1 ${themeColor} scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]` : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-[#333] !w-3 !h-3 !border-[#111] transition-colors group-hover:!bg-[#666]" />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
           <div className={`text-base font-mono text-white transition-colors ${textHoverColor}`}>{data.label}</div>
           {(isL2 || isL3) && (
              <span className={`text-[9px] uppercase border bg-[#111] px-1 py-0.5 rounded shadow-inner w-fit ${badgeColor}`}>
                [{isL2 ? 'L2' : 'L3'}] {data.extensionId}
              </span>
           )}
        </div>
        {data.abstract && <span className={`text-[10px] uppercase bg-black px-1.5 py-0.5 border rounded shadow-inner ${badgeColor}`}>Abstract</span>}
      </div>
      
      <div className="text-xs text-[#A0A0A0] flex items-center justify-between mt-2 pt-2 border-t border-[#222]">
         <span className="truncate max-w-[120px]">{data.label_zh || "-"}</span>
         <div className="flex items-center gap-2">
           {data.attributeCount > 0 && (
             <span className="flex items-center gap-0.5 text-[9px] text-[#555]" title={`${data.attributeCount} attributes`}>
               <Database className="w-2.5 h-2.5" />{data.attributeCount}
             </span>
           )}
           {data.axiomCount > 0 && (
             <span className="flex items-center gap-0.5 text-[9px] text-amber-500/70" title={`${data.axiomCount} axioms`}>
               <Shield className="w-2.5 h-2.5" />{data.axiomCount}
             </span>
           )}
         </div>
      </div>

      {/* Collapse/Expand UI Button */}
      {data.hasChildren && (
          <div 
             className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#111] border border-[#333] hover:border-[#666] text-[#A0A0A0] hover:text-white px-2 py-0.5 rounded-full text-[10px] cursor-pointer shadow-lg transition-colors flex items-center gap-1 z-10`}
             onClick={(e) => {
                 e.stopPropagation();
                 if (data.onToggleCollapse) data.onToggleCollapse(data.id);
             }}
          >
              <span className="font-bold">{data.isCollapsed ? '+' : '-'}</span> 
              {data.isCollapsed && <span>{data.childrenCount}</span>}
          </div>
      )}

      <Handle type="source" position={Position.Bottom} className={`${handleColor} !w-3 !h-3 !border-[#111] shadow-xl`} />
      <Handle type="source" position={Position.Right} id="right" className={`${handleColor} !w-3 !h-3 !border-[#111] shadow-xl`} style={{ right: -6 }} />
      <Handle type="target" position={Position.Left} id="left" className="!bg-[#333] !w-3 !h-3 !border-[#111]" style={{ left: -6 }} />
    </div>
  );
}
