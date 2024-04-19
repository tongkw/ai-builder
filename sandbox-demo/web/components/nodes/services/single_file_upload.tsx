import clsx from "clsx";
import { MoveDown, Upload } from "lucide-react";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NodeData, NodeDataIO } from "../data";
import { dataBlockBgColorMap } from "@/lib/constants/data-io-property";

function SingleFileUploadNode({ data }: NodeData) {
  return (
    <div className="shadow-md rounded-md border-2 border-stone-400 w-40 h-40 relative">
      <p
        className="text-center absolute min-w-40 pb-2 whitespace-nowrap pointer-events-none"
        style={{
          transform: "translateX(80px) translateX(-50%) translateY(-100%)",
        }}
      >
        {data.title}
      </p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SingleFileUploadNodeUi status={data.status ?? "idle"} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{data.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Handle
        id="output.0"
        type="source"
        position={Position.Bottom}
        className="w-6 h-6 border-2 border-stone-400 flex items-center justify-center"
        style={{
          backgroundColor: dataBlockBgColorMap[data.output[0]?.type ?? "txt"],
        }}
      >
        <MoveDown className="pointer-events-none w-4 h-4" />
      </Handle>
    </div>
  );
}

export function SingleFileUploadNodeUi({
  status,
  size = 60,
}: {
  status: string;
  size?: number;
}) {
  return (
    <div
      className={clsx(
        "flex justify-center items-center relative w-full h-full rounded-md hover:bg-gray-100",
        {
          "bg-white": status === "idle",
          "bg-green-100": status === "ready",
          "bg-gray-100 animate-pulse": status === "pending",
        }
      )}
    >
      <Upload
        style={{
          width: size,
          height: size,
          color: "black",
        }}
      />
    </div>
  );
}

export function SingleFileUploadNodeSelect({
  onClick,
  title = "",
  description = "",
}: {
  onClick: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="shadow-md rounded-md border-2 border-stone-400 w-20 h-20 relative cursor-pointer"
        onClick={onClick}
      >
        <SingleFileUploadNodeUi status="idle" size={30} />
      </div>
      <p className="text-[10px] max-w-20 text-center">{title}</p>
    </div>
  );
}

export default memo(SingleFileUploadNode);
