'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ArchitectureNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  details: string[];
  position: { x: number; y: number };
}

const nodes: ArchitectureNode[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    description: 'Next.js Application',
    details: ['React 18', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    position: { x: 50, y: 20 },
  },
  {
    id: 'api',
    name: 'API Gateway',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    description: 'GraphQL & REST',
    details: ['Rate Limiting', 'Authentication', 'Caching', 'Load Balancing'],
    position: { x: 50, y: 40 },
  },
  {
    id: 'ai',
    name: 'AI Engine',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    description: 'ML Models',
    details: ['GPT-4', 'Custom Models', 'RAG Pipeline', 'Vector DB'],
    position: { x: 20, y: 60 },
  },
  {
    id: 'cloud',
    name: 'Cloud Infra',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    description: 'AWS / GCP / Azure',
    details: ['Kubernetes', 'Terraform', 'CloudFront', 'RDS'],
    position: { x: 80, y: 60 },
  },
  {
    id: 'data',
    name: 'Data Layer',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    description: 'Database & Storage',
    details: ['PostgreSQL', 'Redis', 'S3', 'Snowflake'],
    position: { x: 50, y: 80 },
  },
];

const connections = [
  { from: 'frontend', to: 'api', label: 'HTTPS' },
  { from: 'api', to: 'ai', label: 'gRPC' },
  { from: 'api', to: 'cloud', label: 'REST' },
  { from: 'ai', to: 'data', label: 'SQL' },
  { from: 'cloud', to: 'data', label: 'JDBC' },
];

export function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-8 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366F1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Title */}
        <div className="relative mb-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Platform Architecture</h3>
          <p className="text-[#6B7280]">Interactive system diagram - click nodes for details</p>
        </div>

        {/* Diagram */}
        <div className="relative w-full aspect-[16/9]">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <g key={i}>
                  <line
                    x1={`${fromNode.position.x}%`}
                    y1={`${fromNode.position.y}%`}
                    x2={`${toNode.position.x}%`}
                    y2={`${toNode.position.y}%`}
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    strokeDasharray="5,5"
                  />
                  <text
                    x={`${(fromNode.position.x + toNode.position.x) / 2}%`}
                    y={`${(fromNode.position.y + toNode.position.y) / 2 - 2}%`}
                    fill="#6B7280"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {conn.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.button
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: node.position.y / 100 }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                activeNode === node.id ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
              }}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
                activeNode === node.id
                  ? 'bg-gradient-to-br from-[#6366F1] to-[#22D3EE] scale-110 shadow-lg shadow-[#6366F1]/30'
                  : 'bg-[#1A1A1A] hover:bg-[#252525] hover:scale-105'
              }`}>
                <svg
                  className={`w-8 h-8 ${activeNode === node.id ? 'text-white' : 'text-[#6366F1]'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={node.icon} />
                </svg>
              </div>
              <div className={`mt-2 text-center transition-all ${
                activeNode === node.id ? 'text-white' : 'text-[#9CA3AF]'
              }`}>
                <div className="font-medium text-sm">{node.name}</div>
                <div className="text-xs text-[#6B7280]">{node.description}</div>
              </div>

              {/* Details Popup */}
              {activeNode === node.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-48 bg-[#1A1A1A] border border-[#252525] rounded-xl p-4 shadow-xl z-30"
                >
                  <h4 className="font-semibold text-white mb-2">{node.name}</h4>
                  <ul className="space-y-1">
                    {node.details.map((detail, i) => (
                      <li key={i} className="text-xs text-[#9CA3AF] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Legend */}
        <div className="relative mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
            <span className="text-xs text-[#6B7280]">Active Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border border-[#252525]" />
            <span className="text-xs text-[#6B7280]">Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22D3EE]" />
            <span className="text-xs text-[#6B7280]">AI/ML</span>
          </div>
        </div>
      </div>
    </div>
  );
}
