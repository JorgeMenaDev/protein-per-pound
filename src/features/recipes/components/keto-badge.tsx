"use client";

import { Leaf } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  calculateCarbPercentage,
  getKetoLabel,
  getKetoColor,
  formatKetoTooltip,
} from "@/lib/keto-metrics";

interface KetoBadgeProps {
  carbs: number;
  calories: number;
}

export function KetoBadge({ carbs, calories }: KetoBadgeProps) {
  const carbPercentage = calculateCarbPercentage(carbs, calories);
  const label = getKetoLabel(carbPercentage);
  const colorClass = getKetoColor(carbPercentage);
  const tooltipContent = formatKetoTooltip(carbs, calories);

  // Only show N/A if no calorie data (carbPercentage is null)
  if (carbPercentage === null) {
    return (
      <span className="text-sm text-gray-400">
        <Leaf className="w-4 h-4 inline-block mr-1" />
        N/A
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`text-sm cursor-help ${colorClass}`}>
          <Leaf className="w-4 h-4 inline-block mr-1" />
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );
}
