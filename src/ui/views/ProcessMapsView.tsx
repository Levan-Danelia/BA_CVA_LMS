import React from 'react';
import { GitBranch } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';
import {
    ReactFlow,
    Background,
    MarkerType,
    Position,
    type Node,
    type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ============================================================================
// SHARED STYLES & INDIVIDUAL CONFIGURATION
// ============================================================================
// Base style for all nodes (colors, borders, fonts) - width/height overridden below
const BASE_NODE_STYLE = {
    border: '2px solid #7B9CC4',
    backgroundColor: 'rgba(123, 156, 196, 0.03)',
    color: '#7B9CC4',
    fontSize: '10px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
};

// 1. K FULL CONFIGURATION
const K_FULL_NODE_STYLE = { ...BASE_NODE_STYLE, width: 100, height: 50 };

// 2. SNH & HMA CONFIGURATION
const SNH_NODE_STYLE = { ...BASE_NODE_STYLE, width: 100, height: 50 };

// 3. IH CONFIGURATION
const IH_NODE_STYLE = { ...BASE_NODE_STYLE, width: 80, height: 50 };

// 4. SCVA CONFIGURATION
const SCVA_NODE_STYLE = { ...BASE_NODE_STYLE, width: 100, height: 50 };

// 5. RW CONFIGURATION
const RW_NODE_STYLE = { ...BASE_NODE_STYLE, width: 80, height: 50 };

const EDGE_STYLE = {
    stroke: '#7B9CC4',
    strokeWidth: 2,
};

const MARKER_END = { type: MarkerType.ArrowClosed, color: '#7B9CC4' };

// ============================================================================
// 1. K FULL FLOW DATA
// ============================================================================
const K_COL_1 = 50;      // Inputs
const K_COL_2 = 220;     // Hedges
const K_COL_3 = 390;     // Aggregates
const K_COL_4 = 560;     // K Full & DS
const K_COL_5 = 730;     // K Final

const K_ROW_1 = 50;
const K_ROW_2 = 130;
const K_ROW_3 = 210;
const K_ROW_4 = 290;

const kFullNodes: Node[] = [
    // Column 1: Inputs
    { id: 'scva', position: { x: K_COL_1, y: K_ROW_1 }, data: { label: 'SCVA' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: 'snh', position: { x: K_COL_1, y: K_ROW_2 }, data: { label: 'SNH' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: 'hma', position: { x: K_COL_1, y: K_ROW_3 }, data: { label: 'HMA' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: 'ih', position: { x: K_COL_1, y: K_ROW_4 }, data: { label: 'IH' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },

    // Column 2: Hedges aggregator
    { id: 'hedges', position: { x: K_COL_2, y: K_ROW_3 }, data: { label: 'Hedges' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },

    // Column 3: K values
    { id: 'k_reduced', position: { x: K_COL_3, y: K_ROW_1 }, data: { label: 'K Reduced' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: 'k_hedged', position: { x: K_COL_3, y: K_ROW_2 }, data: { label: 'K Hedged' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },

    // Column 4: Beta parameter
    { id: 'beta', position: { x: K_COL_3, y: K_ROW_3 }, data: { label: 'β' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },

    // Column 5: K Full
    { id: 'k_full', position: { x: K_COL_4, y: K_ROW_2 }, data: { label: 'K Full' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },

    // Column 6: DS and K Final
    { id: 'ds', position: { x: K_COL_4, y: K_ROW_3 }, data: { label: 'DS' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },
    { id: 'k_final', position: { x: K_COL_5, y: K_ROW_2 }, data: { label: 'K Final' }, className: 'flow-node', style: K_FULL_NODE_STYLE, sourcePosition: Position.Right, targetPosition: Position.Left },
];

const kFullEdges: Edge[] = [
    { id: 'scva-k_reduced', source: 'scva', target: 'k_reduced', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'scva-k_hedged', source: 'scva', target: 'k_hedged', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'snh-hedges', source: 'snh', target: 'hedges', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'hma-hedges', source: 'hma', target: 'hedges', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'ih-hedges', source: 'ih', target: 'hedges', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'hedges-k_hedged', source: 'hedges', target: 'k_hedged', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'k_reduced-k_full', source: 'k_reduced', target: 'k_full', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'k_hedged-k_full', source: 'k_hedged', target: 'k_full', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'beta-k_full', source: 'beta', target: 'k_full', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'k_full-k_final', source: 'k_full', target: 'k_final', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'ds-k_final', source: 'ds', target: 'k_final', style: EDGE_STYLE, markerEnd: MARKER_END },
];

// ============================================================================
// 2. SNH & HMA FLOW DATA (HORIZONTAL TOP-DOWN)
// ============================================================================
// 5 Inputs (Removed mismatch node)
// Layout: Single row of inputs (Top), Target centered below.
const SNH_START_X = 10;
const SNH_START_Y = 20;
const SNH_NODE_W = SNH_NODE_STYLE.width;
const SNH_GAP_X = 10; // Tight gap to ensure fit
const SNH_ROW_2_Y = 150;

const snhNodes: Node[] = [
    // Inputs (Top Row)
    { id: 'rhc', position: { x: SNH_START_X + (SNH_NODE_W + SNH_GAP_X) * 0, y: SNH_START_Y }, data: { label: <>r<sub>hc</sub></> }, className: 'flow-node', style: SNH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'rwh', position: { x: SNH_START_X + (SNH_NODE_W + SNH_GAP_X) * 1, y: SNH_START_Y }, data: { label: <>RW<sub>h</sub></> }, className: 'flow-node', style: SNH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'mh', position: { x: SNH_START_X + (SNH_NODE_W + SNH_GAP_X) * 2, y: SNH_START_Y }, data: { label: <>M<sub>h</sub><sup>SN</sup></> }, className: 'flow-node', style: SNH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'bh', position: { x: SNH_START_X + (SNH_NODE_W + SNH_GAP_X) * 3, y: SNH_START_Y }, data: { label: <>B<sub>h</sub><sup>SN</sup></> }, className: 'flow-node', style: SNH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'dfh', position: { x: SNH_START_X + (SNH_NODE_W + SNH_GAP_X) * 4, y: SNH_START_Y }, data: { label: <>DF<sub>h</sub><sup>SN</sup></> }, className: 'flow-node', style: SNH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },

    // Target (Centered Below)
    // Width = 5*100 + 4*15 = 560px. Center = 280. StartX=20 => 300. TargetWidth=100 => left=300 - 50 = 240.
    { id: 'snh_hma_target', position: { x: SNH_START_X + 220, y: SNH_ROW_2_Y }, data: { label: 'SNH & HMA' }, className: 'flow-node', style: SNH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
];

const snhEdges: Edge[] = [
    { id: 'rhc-target', source: 'rhc', target: 'snh_hma_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'rwh-target', source: 'rwh', target: 'snh_hma_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'mh-target', source: 'mh', target: 'snh_hma_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'bh-target', source: 'bh', target: 'snh_hma_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'dfh-target', source: 'dfh', target: 'snh_hma_target', style: EDGE_STYLE, markerEnd: MARKER_END },
];

// ============================================================================
// 3. IH FLOW DATA (HORIZONTAL TOP-DOWN)
// ============================================================================
// 4 Inputs
const IH_START_X = 10;
const IH_START_Y = 20;
const IH_NODE_W = IH_NODE_STYLE.width;
const IH_GAP_X = 20; // Tight gap
const IH_ROW_2_Y = 150;

const ihNodes: Node[] = [
    // Inputs (Top Row)
    { id: 'rwi', position: { x: IH_START_X + (IH_NODE_W + IH_GAP_X) * 0, y: IH_START_Y }, data: { label: <>RW<sub>i</sub><sup>ind</sup></> }, className: 'flow-node', style: IH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'mi', position: { x: IH_START_X + (IH_NODE_W + IH_GAP_X) * 1, y: IH_START_Y }, data: { label: <>M<sub>i</sub><sup>ind</sup></> }, className: 'flow-node', style: IH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'bi', position: { x: IH_START_X + (IH_NODE_W + IH_GAP_X) * 2, y: IH_START_Y }, data: { label: <>B<sub>i</sub><sup>ind</sup></> }, className: 'flow-node', style: IH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'dfi', position: { x: IH_START_X + (IH_NODE_W + IH_GAP_X) * 3, y: IH_START_Y }, data: { label: <>DF<sub>i</sub><sup>ind</sup></> }, className: 'flow-node', style: IH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },

    // Target (Centered Below)
    // Width = 4*80 + 3*20 = 400px. Center = 200. StartX=20 => 220. TargetW=100 => left=220 - 50 = 170.
    { id: 'ih_target', position: { x: IH_START_X + 150, y: IH_ROW_2_Y }, data: { label: 'IH' }, className: 'flow-node', style: IH_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
];

const ihEdges: Edge[] = [
    { id: 'rwi-target', source: 'rwi', target: 'ih_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'mi-target', source: 'mi', target: 'ih_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'bi-target', source: 'bi', target: 'ih_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'dfi-target', source: 'dfi', target: 'ih_target', style: EDGE_STYLE, markerEnd: MARKER_END },
];


// ============================================================================
// 4. SCVA FLOW DATA (HORIZONTAL TOP-DOWN)
// ============================================================================
// Layout: Single row of inputs (Top), Target centered below.
const SCVA_START_X = 10;
const SCVA_START_Y = 20;
const SCVA_NODE_W = SCVA_NODE_STYLE.width;
const SCVA_GAP_X = 10;
const SCVA_ROW_2_Y = 150;

const scvaNodes: Node[] = [
    // Inputs (Top Row)
    // Order: Alpha, RW, M, EAD, DF
    { id: 'alpha', position: { x: SCVA_START_X + (SCVA_NODE_W + SCVA_GAP_X) * 0, y: SCVA_START_Y }, data: { label: 'α' }, className: 'flow-node', style: SCVA_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'rw_scva_in', position: { x: SCVA_START_X + (SCVA_NODE_W + SCVA_GAP_X) * 1, y: SCVA_START_Y }, data: { label: <>RW<sub>C</sub></> }, className: 'flow-node', style: SCVA_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'm_scva', position: { x: SCVA_START_X + (SCVA_NODE_W + SCVA_GAP_X) * 2, y: SCVA_START_Y }, data: { label: <>M<sub>NS</sub></> }, className: 'flow-node', style: SCVA_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'ead_scva', position: { x: SCVA_START_X + (SCVA_NODE_W + SCVA_GAP_X) * 3, y: SCVA_START_Y }, data: { label: <>EAD<sub>NS</sub></> }, className: 'flow-node', style: SCVA_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'df_scva', position: { x: SCVA_START_X + (SCVA_NODE_W + SCVA_GAP_X) * 4, y: SCVA_START_Y }, data: { label: <>DF<sub>NS</sub></> }, className: 'flow-node', style: SCVA_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },

    // Target (Centered Below)
    // Width similar to SNH: 540px total. Center approx 270.
    // X = 10 + 220 = 230.
    { id: 'scva_target', position: { x: SCVA_START_X + 220, y: SCVA_ROW_2_Y }, data: { label: 'SCVA' }, className: 'flow-node', style: SCVA_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
];

const scvaEdges: Edge[] = [
    { id: 'alpha-scva', source: 'alpha', target: 'scva_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'rw-scva', source: 'rw_scva_in', target: 'scva_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'm-scva', source: 'm_scva', target: 'scva_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'ead-scva', source: 'ead_scva', target: 'scva_target', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'df-scva', source: 'df_scva', target: 'scva_target', style: EDGE_STYLE, markerEnd: MARKER_END },
];

// ============================================================================
// 5. RISK WEIGHT FLOW DATA (TREE STRUCTURE)
// ============================================================================
// Level 1: Sector, Credit Quality
// Level 2: Risk Weight
// Level 3: SCVA RW, SNH RW, HMA RW, IH RW

const RW_START_X = 10;
const RW_START_Y = 20;
const RW_NODE_W = RW_NODE_STYLE.width;
const RW_GAP_X = 20;
const RW_ROW_H = 90;

const rwNodes: Node[] = [
    // Level 1: Sector, Credit Quality (Centered relative to L3)
    // L3 Width = 4*100 + 3*20 = 460. Center = 230 + StartX.
    // Let's position L1 nodes symmetrically.
    { id: 'sector', position: { x: RW_START_X + 50, y: RW_START_Y }, data: { label: 'Sector' }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'credit_quality', position: { x: RW_START_X + 230, y: RW_START_Y }, data: { label: 'Credit Quality' }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },

    // Level 2: Risk Weight (Centered)
    // Approx Center of L3 (width 460) is 230. Node w=100 -> x=180.
    { id: 'risk_weight', position: { x: RW_START_X + 150, y: RW_START_Y + RW_ROW_H }, data: { label: 'Risk Weight' }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },

    // Level 3: Breakdown (Widest Row)
    { id: 'rw_scva_out', position: { x: RW_START_X + (RW_NODE_W + RW_GAP_X) * 0, y: RW_START_Y + RW_ROW_H * 2 }, data: { label: <>RW<sub>c</sub></> }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'rw_snh_out', position: { x: RW_START_X + (RW_NODE_W + RW_GAP_X) * 1, y: RW_START_Y + RW_ROW_H * 2 }, data: { label: <>RW<sub>h</sub></> }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'rw_hma_out', position: { x: RW_START_X + (RW_NODE_W + RW_GAP_X) * 2, y: RW_START_Y + RW_ROW_H * 2 }, data: { label: <>RW<sub>hma</sub></> }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { id: 'rw_ih_out', position: { x: RW_START_X + (RW_NODE_W + RW_GAP_X) * 3, y: RW_START_Y + RW_ROW_H * 2 }, data: { label: <>RW<sub>i</sub></> }, className: 'flow-node', style: RW_NODE_STYLE, sourcePosition: Position.Bottom, targetPosition: Position.Top },
];

const rwEdges: Edge[] = [
    // L1 -> L2
    { id: 'sector-rw', source: 'sector', target: 'risk_weight', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'cq-rw', source: 'credit_quality', target: 'risk_weight', style: EDGE_STYLE, markerEnd: MARKER_END },

    // L2 -> L3
    { id: 'rw-scva', source: 'risk_weight', target: 'rw_scva_out', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'rw-snh', source: 'risk_weight', target: 'rw_snh_out', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'rw-hma', source: 'risk_weight', target: 'rw_hma_out', style: EDGE_STYLE, markerEnd: MARKER_END },
    { id: 'rw-ih', source: 'risk_weight', target: 'rw_ih_out', style: EDGE_STYLE, markerEnd: MARKER_END },
];

export const ProcessMapsView: React.FC = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <div className="view-header-content">
                    <GitBranch className="view-header-icon" />
                    <h1 className="view-header-title">Process Maps</h1>
                </div>
            </header>

            <div className="view-content">
                <div className="content-wrapper">

                    {/* INTRODUCTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Process Maps</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                This page provides visual process maps that illustrate how each component of the BA-CVA capital charge is calculated. These flowcharts show the inputs, intermediate calculations, and outputs for each step of the standardized approach, helping you understand how data flows through the framework from individual trade-level inputs to the final capital requirement.
                            </p>
                        </div>
                    </section>

                    {/* K FULL SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>K Full</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                The K Full calculation represents the complete BA-CVA capital charge when hedges are recognized. It combines the Standalone CVA (SCVA) with hedge adjustments from Single Name Hedges (SNH), Hedge Mismatch Adjustment (HMA), and Index Hedges (IH). The reduced capital charge (K Reduced) reflects only counterparty exposures, while the hedged capital charge (K Hedged) incorporates the benefit of eligible hedges. The beta parameter determines the relative weight between these components to produce K Full, which is then adjusted by the Discount Scalar (DS) to arrive at the final capital requirement (K Final).
                            </p>
                        </div>

                        <div className="card card-v1">
                            <div className="card-body">
                                <h3 className="card-subtitle mb-2">K Full</h3>
                                <div className="card-body-large">
                                    <div className="flow-container">
                                        <ReactFlow
                                            defaultNodes={kFullNodes}
                                            defaultEdges={kFullEdges}
                                            defaultViewport={{ x: 20, y: 0, zoom: 1.0 }}
                                            nodesDraggable={false}
                                            nodesConnectable={false}
                                            elementsSelectable={false}
                                            zoomOnScroll={false}
                                            zoomOnPinch={false}
                                            panOnDrag={false}
                                            preventScrolling={false}
                                            proOptions={{ hideAttribution: true }}
                                        >
                                            <Background color="#cbd5e1" gap={20} size={1} />
                                        </ReactFlow>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* DETAILED HEDGES SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>SNH & HMA & IH</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                This section details the hedge components that reduce CVA capital requirements. Single Name Hedges (SNH) represent direct credit protection on specific counterparties, calculated using the hedge correlation factor, risk weight, effective maturity, notional amount, and discount factor. The Hedge Mismatch Adjustment (HMA) uses the same inputs to account for basis risk between the hedge and the underlying CVA exposure. Index Hedges (IH) provide broader market-based protection through credit index instruments, with their own risk weight, maturity, notional, and discount factor parameters.
                            </p>
                        </div>
                        <div className="grid grid-cols-12 gap-6 items-stretch">
                            {/* SNH & HMA FLOW (Wider: col-span-7) */}
                            <div className="col-span-12 lg:col-span-7 card card-v1 h-full">
                                <div className="card-body">
                                    <h3 className="card-subtitle mb-2">Single Name Hedges (SNH) & Hedge Mismatch Adjustment (HMA)</h3>
                                    <div className="card-body-compact">
                                        <div className="flow-container">
                                            <ReactFlow
                                                defaultNodes={snhNodes}
                                                defaultEdges={snhEdges}
                                                defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
                                                nodesDraggable={false}
                                                nodesConnectable={false}
                                                elementsSelectable={false}
                                                zoomOnScroll={false}
                                                zoomOnPinch={false}
                                                panOnDrag={false}
                                                preventScrolling={false}
                                                proOptions={{ hideAttribution: true }}
                                            >
                                                <Background color="#cbd5e1" gap={20} size={1} />
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* IH FLOW (Narrower: col-span-5) */}
                            <div className="col-span-12 lg:col-span-5 card card-v1 h-full">
                                <div className="card-body">
                                    <h3 className="card-subtitle mb-2">Index Hedges (IH)</h3>
                                    <div className="card-body-compact">
                                        <div className="flow-container">
                                            <ReactFlow
                                                defaultNodes={ihNodes}
                                                defaultEdges={ihEdges}
                                                defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
                                                nodesDraggable={false}
                                                nodesConnectable={false}
                                                elementsSelectable={false}
                                                zoomOnScroll={false}
                                                zoomOnPinch={false}
                                                panOnDrag={false}
                                                preventScrolling={false}
                                                proOptions={{ hideAttribution: true }}
                                            >
                                                <Background color="#cbd5e1" gap={20} size={1} />
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RISK WEIGHTS & SCVA SECTION */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>SCVA & Risk Weights</span>
                        </div>
                        <div className="text-block">
                            <p className="text_body">
                                The Standalone CVA (SCVA) represents the unhedged CVA capital charge for each counterparty. It is calculated by multiplying the supervisory correlation factor (alpha), the counterparty risk weight, effective maturity, exposure at default (EAD), and the supervisory discount factor. Risk Weights are determined based on two key factors: the counterparty's sector classification and credit quality rating. These risk weights flow into the SCVA calculation for counterparties and into the hedge calculations (SNH, HMA, IH) for the corresponding hedge instruments.
                            </p>
                        </div>
                        <div className="grid grid-cols-12 gap-6 items-stretch">
                            {/* SCVA FLOW (Left: consistent with SNH) */}
                            <div className="col-span-12 lg:col-span-7 card card-v1 h-full">
                                <div className="card-body">
                                    <h3 className="card-subtitle mb-2">Standalone CVA (SCVA)</h3>
                                    <div className="card-body-compact">
                                        <div className="flow-container">
                                            <ReactFlow
                                                defaultNodes={scvaNodes}
                                                defaultEdges={scvaEdges}
                                                defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
                                                nodesDraggable={false}
                                                nodesConnectable={false}
                                                elementsSelectable={false}
                                                zoomOnScroll={false}
                                                zoomOnPinch={false}
                                                panOnDrag={false}
                                                preventScrolling={false}
                                                proOptions={{ hideAttribution: true }}
                                            >
                                                <Background color="#cbd5e1" gap={20} size={1} />
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RISK WEIGHT FLOW (Right: Tree Structure) */}
                            <div className="col-span-12 lg:col-span-5 card card-v1 h-full">
                                <div className="card-body">
                                    <h3 className="card-subtitle mb-2">Risk Weights (RW)</h3>
                                    <div className="card-body-compact">
                                        <div className="flow-container">
                                            <ReactFlow
                                                defaultNodes={rwNodes}
                                                defaultEdges={rwEdges}
                                                defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
                                                nodesDraggable={false}
                                                nodesConnectable={false}
                                                elementsSelectable={false}
                                                zoomOnScroll={false}
                                                zoomOnPinch={false}
                                                panOnDrag={false}
                                                preventScrolling={false}
                                                proOptions={{ hideAttribution: true }}
                                            >
                                                <Background color="#cbd5e1" gap={20} size={1} />
                                            </ReactFlow>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <NavigationButtons />
                </div>
            </div>
        </div>
    );
};
