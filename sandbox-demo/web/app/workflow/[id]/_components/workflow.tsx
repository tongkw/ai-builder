"use client";

import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  updateEdge,
} from "reactflow";

import "reactflow/dist/base.css";

import { useDebouncedCallback } from "use-debounce";
import { NodeSidePanel } from "@/components/panel/node-select";
import { reactFlowNodeTypes } from "@/components/nodes/data";
import { validateEdge } from "@/components/nodes/utils/flow-graph/validate-edge";
import { assignNodesDataIO } from "@/components/nodes/utils/flow-graph/nodes-data-io";
import { reactFlowToYaml } from "@/lib/parser/react-flow-to-yaml";
import { YamlDebugPanel } from "@/components/panel/yaml-debug";
import { SavePanel } from "@/components/panel/save";

export default function Workflow({
  workflowId,
  initWorkflowSrc,
  initNodes,
  initEdges,
}: {
  workflowId: string;
  initWorkflowSrc: string;
  initNodes: any[];
  initEdges: any[];
}) {
  const defaultEdgeOptions = {
    animated: true,
    type: "bazier",
  };

  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [workflowSrc, setWorkflowSrc] = useState(initWorkflowSrc);

  const [isEdited, setEdited] = useState(false);

  // Create a debounced function that will be called after 1 second of inactivity
  const debouncedUpdate = useDebouncedCallback(
    () => {
      console.log(
        "Debounced function called with latest nodes and edges",
        nodes,
        edges
      );
      // Implement the logic you want to execute after the debounce period here.
      const yamlStr = reactFlowToYaml(nodes, edges);
      setWorkflowSrc(yamlStr);

      // Update yaml `unsaved` state
      setEdited(true);
    },
    500 // delay in milliseconds
  );

  // Effect that triggers the debounced function on changes to nodes or edges
  React.useEffect(() => {
    debouncedUpdate();
  }, [nodes, edges, debouncedUpdate]);

  const onConnect = useCallback(
    (params: any) => {
      if (validateEdge(nodes, edges, params)) {
        // 1. generate and assign a data id corresponding to the two ends of the connection
        setNodes((nodes) => assignNodesDataIO(nodes, params));

        // 2. update edges
        setEdges((eds) => {
          return addEdge(params, eds);
        });
      }
    },
    [nodes, edges, setEdges, setNodes]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: any, newConnection: any) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: any, edge: any) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    },
    [setEdges]
  );

  return (
    <div className="flex flex-col w-screen h-screen">
      <NodeSidePanel
        onNodeCreate={(node: any) => setNodes((nodes) => [...nodes, node])}
      />
      <YamlDebugPanel yamlSrc={workflowSrc} />
      <SavePanel
        isEdited={isEdited}
        setEdited={setEdited}
        workflowId={workflowId}
        workflowSrc={workflowSrc}
        nodes={nodes}
        edges={edges}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        nodeTypes={reactFlowNodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        // fitView
        // contentEditable={} // TODO: turn to false when workflow is running
        className="bg-teal-50 h-100 w-100"
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}