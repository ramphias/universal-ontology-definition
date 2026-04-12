"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Network, Layers, Building2, Briefcase, ChevronRight, Activity, Database, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const layers = [
  {
    id: "L0",
    name: "Platform",
    title: "Platform Bindings",
    description: "The syntactic baseline export generator: converting abstract concepts into SQL DDL, GraphQL, JSON-LD, and API Schemas.",
    icon: Database,
    color: "from-blue-500/20 to-indigo-500/0",
    border: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    iconColor: "text-blue-400",
  },
  {
    id: "L1",
    name: "Core",
    title: "Universal Baselines",
    description: "Cross-industry foundational domains and semantics serving as the universal truth for enterprise networks.",
    icon: Network,
    color: "from-[#86BC25]/20 to-emerald-500/0",
    border: "group-hover:border-[#86BC25]/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(134,188,37,0.15)]",
    iconColor: "text-[#86BC25]",
  },
  {
    id: "L2",
    name: "Industry",
    title: "Industry Extensions",
    description: "Pre-packaged architectural blueprints customized for verticals such as Retail, F&B, and Manufacturing.",
    icon: Briefcase,
    color: "from-cyan-500/20 to-teal-500/0",
    border: "group-hover:border-cyan-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    iconColor: "text-cyan-400",
  },
  {
    id: "L3",
    name: "Enterprise",
    title: "Client Instances",
    description: "Highly customized, bespoke namespaces representing the operational reality of actual enterprise clients.",
    icon: Building2,
    color: "from-fuchsia-500/20 to-pink-500/0",
    border: "group-hover:border-fuchsia-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]",
    iconColor: "text-fuchsia-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export type DashboardStat = { label: string; value: string; detail: string; statusColor?: string; };

export function DashboardClient({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col relative w-full overflow-hidden pb-12">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#86BC25]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full px-6 md:px-8 z-10 space-y-16 py-8">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-6 pt-12 pb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#A0A0A0] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#86BC25]" />
            <span>Universal Ontology Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-2 leading-tight">
            Ontology <span className="font-medium bg-gradient-to-r from-white to-[#86BC25] text-transparent bg-clip-text">Studio</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            The next-generation visual workspace for infinite-dimensional enterprise knowledge alignment and architectural co-creation.
          </p>
        </motion.header>

        {/* Stats Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#86BC25]/30 transition-colors duration-300 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#86BC25]/0 to-[#86BC25]/0 group-hover:from-[#86BC25]/5 group-hover:to-transparent transition-all duration-500" />
              <p className="text-3xl font-light text-white mb-1 group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                 {stat.statusColor && (
                     <span className={`w-3 h-3 rounded-full ${stat.statusColor} animate-pulse`}></span>
                 )}
                 {stat.value}
              </p>
              <p className="text-sm font-medium text-[#86BC25] mb-1">{stat.label}</p>
              <p className="text-xs text-[#666]">{stat.detail}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Topology Layers Overview */}
        <div className="space-y-6">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="flex items-center gap-3"
          >
            <Layers className="text-[#A0A0A0] w-6 h-6" />
            <h2 className="text-2xl text-white font-light">Topology <span className="font-medium">Layers</span></h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {layers.map((layer) => (
              <motion.div key={layer.id} variants={itemVariants}>
                <Link 
                  href={`/layer/${layer.id}`} 
                  className={cn(
                    "group relative flex flex-col justify-between h-full p-8 rounded-3xl bg-surface border border-[#222] transition-all duration-500 overflow-hidden cursor-pointer",
                    layer.border,
                    layer.glow
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", layer.color)} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={cn("p-4 rounded-2xl bg-black/40 border border-white/5", layer.iconColor)}>
                         <layer.icon strokeWidth={1.5} className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-mono px-3 py-1 bg-black/50 border border-white/10 rounded-full text-[#A0A0A0] group-hover:text-white transition-colors">
                        {layer.id} {layer.id === "L0" ? "Platform API" : "Node Graph"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-medium text-white mb-3 flex items-center gap-2">
                       {layer.title}
                    </h3>
                    
                    <p className="text-[#888] group-hover:text-[#AAA] transition-colors leading-relaxed mb-6">
                      {layer.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-[#333] border border-black flex items-center justify-center">
                            <Activity className="w-3 h-3 text-[#666]" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-[#555]">Live Sync</span>
                    </div>
                    <div className={cn("flex items-center gap-1 font-medium transition-transform duration-300 group-hover:translate-x-2", layer.iconColor)}>
                      Explore Layer <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
