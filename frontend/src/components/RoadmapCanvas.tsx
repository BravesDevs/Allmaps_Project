
import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, Position, MarkerType } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Box } from '@mui/material';

interface RoadmapCanvasProps {
    data: { nodes: any[]; edges: any[] } | null;
    onNodeClick: (node: any) => void;
}

// Premium Color Palettes for Paths
const COLOR_PALETTES = [
    { start: '#ef4444', end: '#b91c1c' }, // Red
    { start: '#3b82f6', end: '#1d4ed8' }, // Blue
    { start: '#10b981', end: '#047857' }, // Emerald
    { start: '#8b5cf6', end: '#6d28d9' }, // Violet
    { start: '#f59e0b', end: '#b45309' }, // Amber
    { start: '#ec4899', end: '#be185d' }, // Pink
    { start: '#06b6d4', end: '#0e7490' }, // Cyan
    { start: '#f43f5e', end: '#be123c' }, // Rose
];

const interpolateColor = (color1: string, color2: string, factor: number) => {
    try {
        if (!color1 || !color2 || isNaN(factor)) return color1 || '#ef4444';
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);

        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    } catch (e) {
        return color1;
    }
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Wider nodes for better readability
    const nodeWidth = 240;
    const nodeHeight = 60;

    // Switch to Left-to-Right layout
    dagreGraph.setGraph({ rankdir: 'LR', ranksep: 120, nodesep: 60 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // --- Path Coloring Logic ---
    // 1. Build Adjacency List & Find Roots
    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    nodes.forEach(n => {
        adj[n.id] = [];
        inDegree[n.id] = 0;
    });
    edges.forEach(e => {
        if (adj[e.source]) adj[e.source].push(e.target);
        if (inDegree[e.target] !== undefined) inDegree[e.target]++;
    });

    // 2. Assign Branch IDs
    const nodeBranch: Record<string, number> = {};
    let branchCounter = 0;
    const queue: { id: string, branch: number }[] = [];

    // Initialize roots
    nodes.forEach(n => {
        if (inDegree[n.id] === 0) {
            queue.push({ id: n.id, branch: branchCounter++ });
        }
    });

    // Helper for visited to handle cycles or multi-parent merges (keep first color)
    const visited = new Set<string>();

    while (queue.length > 0) {
        const { id, branch } = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);

        nodeBranch[id] = branch;

        const children = adj[id] || [];
        children.forEach((childId, index) => {
            // First child inherits branch (main path), others get new branch
            const nextBranch = index === 0 ? branch : branchCounter++;
            queue.push({ id: childId, branch: nextBranch });
        });
    }
    // ---------------------------

    // Calculate min/max X for horizontal gradient intensity
    let minX = Infinity;
    let maxX = -Infinity;
    nodes.forEach(node => {
        const layoutNode = dagreGraph.node(node.id);
        if (layoutNode) {
            if (layoutNode.x < minX) minX = layoutNode.x;
            if (layoutNode.x > maxX) maxX = layoutNode.x;
        }
    });
    const range = maxX - minX || 1;

    nodes.forEach((node) => {
        const layoutNode = dagreGraph.node(node.id);
        if (!layoutNode) return;

        const x = layoutNode.x - nodeWidth / 2;
        const y = layoutNode.y - nodeHeight / 2;

        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;
        node.position = { x, y };

        // Determine Color based on Branch ID
        const branchId = nodeBranch[node.id] ?? 0;
        const palette = COLOR_PALETTES[branchId % COLOR_PALETTES.length];

        // Gradient factor based on X position to add depth
        const rankFactor = range === 0 ? 0 : (layoutNode.x - minX) / range;

        // Blend palette start/end with a bit of the rank factor
        const baseColor = interpolateColor(palette.start, palette.end, rankFactor * 0.5); // 0.5 to keep it within the hue

        node.style = {
            background: `linear-gradient(135deg, ${baseColor} 0%, ${interpolateColor(baseColor, '#000000', 0.3)} 100%)`,
            color: 'white',
            border: `1px solid ${interpolateColor(baseColor, '#ffffff', 0.3)}`,
            borderRadius: '16px', // More rounded
            width: nodeWidth,
            padding: '12px',
            fontSize: '14px',
            fontFamily: 'Inter',
            fontWeight: 600,
            textAlign: 'center',
            boxShadow: `0 4px 15px ${baseColor}60, 0 1px 3px rgba(0,0,0,0.3)`, // Glow matches color
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backdropFilter: 'blur(4px)',
            opacity: 1
        };
    });

    return { nodes, edges };
};

// Neutral edge styles to not clash with colorful nodes
const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#71717a', strokeWidth: 2, opacity: 0.4 }, // Zinc-500
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#71717a',
    },
};

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({ data, onNodeClick }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (data && data.nodes && data.edges) {
            const initialNodes: Node[] = data.nodes.map((n: any) => ({
                id: n.id,
                data: { label: n.label, ...n },
                position: { x: 0, y: 0 },
                type: 'default'
            }));
            const initialEdges: Edge[] = data.edges.map((e: any) => ({
                id: e.id || `e${e.source}-${e.target}`,
                source: e.source,
                target: e.target,
                ...defaultEdgeOptions
            }));

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                initialNodes,
                initialEdges
            );
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [data, setNodes, setEdges]);

    if (!data) return null; // Handled by parent now

    return (
        <Box sx={{ width: '100%', height: '100%', bgcolor: 'transparent' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(_, node) => onNodeClick(node.data)}
                fitView
                proOptions={{ hideAttribution: true }}
                minZoom={0.5}
                maxZoom={2}
            >
                <Background color="#555" gap={20} size={1} style={{ opacity: 0.1 }} />
                <Controls
                    style={{
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        fill: 'white'
                    }}
                />
            </ReactFlow>
        </Box>
    );
};
