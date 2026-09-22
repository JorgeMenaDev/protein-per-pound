"use client";

import { Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  calculateProteinPercentage,
  formatProteinTooltip,
  getPERating,
  getPEColor,
} from "@/lib/protein-metrics";

interface ProteinPercentageBadgeProps {
  protein: number;
  calories: number;
}

export function ProteinPercentageBadge({
  protein,
  calories,
}: ProteinPercentageBadgeProps) {
  const proteinPercentage = calculateProteinPercentage(protein, calories);
  const tooltipContent = formatProteinTooltip(protein, calories);
  const rating = getPERating(proteinPercentage);
  const colorClass = getPEColor(rating);

  if (!protein || !calories || proteinPercentage === 0) {
    return (
      <span className="flex items-center gap-0.5 text-gray-300">
        <Zap className="w-3 h-3" />
        <Zap className="w-3 h-3" />
        <Zap className="w-3 h-3" />
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-0.5 cursor-help">
          {[1, 2, 3].map((level) => (
            <Zap
              key={level}
              className={`w-3 h-3 ${level <= rating ? colorClass : "text-gray-300"}`}
              fill={level <= rating ? "currentColor" : "none"}
            />
          ))}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );
}
