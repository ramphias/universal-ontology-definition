"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileCode2, Network, CheckCircle2, X } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: any[];
  contextName?: string;
}

export function CodeExportModal({ isOpen, onClose, classes, contextName = "Active Workspace" }: CodeExportModalProps) {
  const [exportTarget, setExportTarget] = useState<'sql' | 'graphql' | 'neo4j'>('sql');

  const generatedCode = useMemo(() => {
    if (!classes || classes.length === 0) return "// No ontological classes available in this context.";
    
    if (exportTarget === 'sql') {
       let sql = `-- Generated PostgreSQL DDL from [${contextName}]\n\n`;
       classes.forEach((c: any) => {
           const tableName = c.id.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
           sql += `CREATE TABLE ${tableName} (\n`;
           sql += `  id VARCHAR(255) PRIMARY KEY,\n`;
           sql += `  label_en VARCHAR(255),\n`;
           sql += `  label_zh VARCHAR(255),\n`;
           if (c.parent) {
               const parentTable = c.parent.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
               sql += `  parent_id VARCHAR(255) REFERENCES ${parentTable}(id),\n`;
           }
           sql += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
           sql += `);\n\n`;
       });
       return sql;
    }

    if (exportTarget === 'graphql') {
       let gql = `# Generated GraphQL Schema from [${contextName}]\n\n`;
       classes.forEach((c: any) => {
           const typeName = c.id.replace(/[^a-zA-Z0-9]/g, '');
           gql += `type ${typeName} {\n`;
           gql += `  id: ID!\n`;
           gql += `  label_en: String\n`;
           gql += `  label_zh: String\n`;
           if (c.parent) {
               const parentType = c.parent.replace(/[^a-zA-Z0-9]/g, '');
               gql += `  parent: ${parentType}\n`;
           }
           gql += `  abstract: Boolean\n`;
           
           if (c.properties) {
               Object.keys(c.properties).forEach(prop => {
                   gql += `  ${prop.replace(/[^a-zA-Z0-9_]/g, '')}: String\n`;
               });
           }
           gql += `}\n\n`;
       });
       return gql;
    }

    if (exportTarget === 'neo4j') {
       let cypher = `// Cypher script to initialize Knowledge Graph from [${contextName}]\n\n`;
       classes.forEach((c: any) => {
           const labelName = c.id.replace(/[^a-zA-Z0-9]/g, '');
           cypher += `CREATE CONSTRAINT IF NOT EXISTS FOR (n:${labelName}) REQUIRE n.id IS UNIQUE;\n`;
       });
       cypher += `\n// Relationship templates\n`;
       classes.forEach((c: any) => {
           if (c.parent) {
               const src = c.id.replace(/[^a-zA-Z0-9]/g, '');
               const tgt = c.parent.replace(/[^a-zA-Z0-9]/g, '');
               cypher += `// MATCH (a:${src} {id: 'x'}), (b:${tgt} {id: 'y'}) CREATE (a)-[:INHERITS_FROM]->(b);\n`;
           }
       });
       return cypher;
    }

    return "";
  }, [classes, exportTarget, contextName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-surface border border-[#333] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#222] bg-[#0A0A0A]">
              <div>
                 <h2 className="text-white font-medium flex items-center gap-2">
                   <Database className="w-5 h-5 text-deloitte-green" /> Contextual System Compiler
                 </h2>
                 <p className="text-xs text-[#888] mt-1">Generating runtime bindings for: <span className="text-[#A0A0A0] font-mono">{contextName}</span></p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[#222] rounded-lg transition-colors text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 flex bg-[#050505]">
               {/* Sidebar */}
               <div className="w-[240px] border-r border-[#222] p-4 flex flex-col gap-3 bg-[#0A0A0A]">
                 <h3 className="text-xs font-mono text-[#666] mb-2 uppercase tracking-wider">Target Physical Schema</h3>
                 
                 <button onClick={() => setExportTarget('sql')} className={`flex items-center gap-3 p-3 text-sm rounded-lg border transition-all text-left ${exportTarget === 'sql' ? 'bg-blue-500/10 border-blue-500/50 text-blue-100 shadow-[inset_4px_0_0_rgb(59,130,246)]' : 'bg-[#111] border-[#222] text-[#888] hover:bg-[#151515] hover:text-[#CCC]'}`}>
                    <Database className="w-4 h-4 text-blue-400" /> PostgreSQL DDL
                 </button>
                 <button onClick={() => setExportTarget('graphql')} className={`flex items-center gap-3 p-3 text-sm rounded-lg border transition-all text-left ${exportTarget === 'graphql' ? 'bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-100 shadow-[inset_4px_0_0_rgb(217,70,239)]' : 'bg-[#111] border-[#222] text-[#888] hover:bg-[#151515] hover:text-[#CCC]'}`}>
                    <FileCode2 className="w-4 h-4 text-fuchsia-400" /> GraphQL Schema
                 </button>
                 <button onClick={() => setExportTarget('neo4j')} className={`flex items-center gap-3 p-3 text-sm rounded-lg border transition-all text-left ${exportTarget === 'neo4j' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100 shadow-[inset_4px_0_0_rgb(16,185,129)]' : 'bg-[#111] border-[#222] text-[#888] hover:bg-[#151515] hover:text-[#CCC]'}`}>
                    <Network className="w-4 h-4 text-emerald-400" /> Neo4j Cypher
                 </button>
               </div>
               
               {/* Code Area */}
               <div className="flex-1 flex flex-col relative overflow-hidden">
                 <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-xs text-white transition-colors">
                       Copy to Clipboard
                    </button>
                 </div>
                 <textarea 
                   readOnly
                   className="flex-1 w-full bg-transparent text-[#CCC] font-mono text-[13px] p-6 resize-none focus:outline-none leading-relaxed custom-scrollbar"
                   value={generatedCode}
                 />
                 <div className="h-8 bg-[#111] border-t border-[#222] flex items-center px-4 text-xs font-mono text-[#666]">
                    <CheckCircle2 className="w-3 h-3 text-deloitte-green mr-2" /> Compilation complete. {classes.length} entities analyzed.
                 </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
