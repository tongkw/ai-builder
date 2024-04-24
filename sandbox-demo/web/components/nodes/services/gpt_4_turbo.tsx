import clsx from "clsx";
import { MoveDown } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NodeData } from "../data";
import { dataBlockBgColorMap } from "@/lib/constants/data-io-property";

function Gpt4TurboNode({ data }: NodeData) {
  return (
    <div className="shadow-md rounded-md border-2 border-stone-400 w-40 h-40 relative select-none">
      <p
        className="text-center absolute top-0 pb-2 whitespace-nowrap pointer-events-none"
        style={{
          transform: "translateX(80px) translateX(-50%) translateY(-100%)",
        }}
      >
        {data.title}
      </p>
      <Gpt4TurboNodeUi
        status={data.status ?? "idle"}
        description={data.description}
      />

      <Handle
        id="input.0"
        type="target"
        position={Position.Top}
        className="w-6 h-6 border-2 border-stone-400 flex items-center justify-center"
        style={{
          backgroundColor: dataBlockBgColorMap[data.input[0]?.type ?? "txt"],
          animation:
            data.input[0].status === "ready" ? "pulse 1s infinite" : undefined,
          boxShadow:
            data.input[0].status === "ready"
              ? "0 0 20px rgba(252, 211, 77, 1.0)"
              : undefined,
        }}
      >
        <MoveDown className="pointer-events-none w-4 h-4" />
      </Handle>

      <Handle
        id="output.0"
        type="source"
        position={Position.Bottom}
        className="w-6 h-6 !bg-white border-2 border-stone-400 flex items-center justify-center"
        style={{
          backgroundColor: dataBlockBgColorMap[data.output[0]?.type ?? "txt"],
          animation:
            data.output[0].status === "ready" ? "pulse 1s infinite" : undefined,
          boxShadow:
            data.output[0].status === "ready"
              ? "0 0 20px rgba(252, 211, 77, 1.0)"
              : undefined,
        }}
      >
        <MoveDown className="pointer-events-none w-4 h-4" />
      </Handle>
    </div>
  );
}

export function Gpt4TurboNodeUi({
  status,
  description,
  size = 80,
}: {
  status: string;
  description?: string;
  size?: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={clsx(
              "flex justify-center items-center relative w-full h-full rounded-md",
              {
                "bg-white hover:bg-gray-100": status === "idle",
                "bg-green-100 hover:bg-green-200": status === "ready",
                "bg-gray-100 animate-pulse": status === "pending",
              }
            )}
          >
            <Image
              width={size}
              height={size}
              src={"/node_icons/gpt_4_turbo.png"}
              alt="gpt_4_turbo"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Gpt4TurboNodeSelect({
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
        <Gpt4TurboNodeUi status="idle" size={40} />
      </div>
      <p className="text-[10px] max-w-20 text-center">{title}</p>
    </div>
  );
}

export default memo(Gpt4TurboNode);
