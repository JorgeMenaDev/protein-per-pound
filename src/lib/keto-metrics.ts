/**
 * Utility functions for calculating keto-friendliness metrics
 *
 * Keto diet typically aims for:
 * - 70-80% calories from fat
 * - 15-20% calories from protein
 * - 5-10% calories from carbs (the key metric)
 */

/**
 * Calculate percentage of calories from carbs
 * Formula: (carbs_g × 4 ÷ total_kcal) × 100
 * Returns null if no calories data, 0 if carbs are 0
 */
export function calculateCarbPercentage(
  carbs: number,
  calories: number,
): number | null {
  if (!calories || calories === 0) return null; // No calorie data
  if (!carbs || carbs === 0) return 0; // 0 carbs = 0% (very keto!)
  return Math.round(((carbs * 4) / calories) * 100 * 10) / 10;
}

/**
 * Get keto-friendliness label based on carb percentage
 * - null = N/A (no data)
 * - 0-5% = Very Keto
 * - 5-10% = Keto
 * - 10-20% = Low-Carb
 * - >20% = Not Keto
 */
export function getKetoLabel(carbPercentage: number | null): string {
  if (carbPercentage === null) return "N/A";
  if (carbPercentage < 5) return "Very Keto"; // 0% is very keto!
  if (carbPercentage <= 10) return "Keto";
  if (carbPercentage <= 20) return "Low-Carb";
  return "Not Keto";
}

/**
 * Get color class for keto badge based on carb percentage
 */
export function getKetoColor(carbPercentage: number | null): string {
  if (carbPercentage === null) return "text-gray-400";
  if (carbPercentage < 5) return "text-green-600"; // 0% is very keto!
  if (carbPercentage <= 10) return "text-emerald-500";
  if (carbPercentage <= 20) return "text-yellow-600";
  return "text-red-500";
}

/**
 * Format tooltip content for keto metrics
 */
export function formatKetoTooltip(carbs: number, calories: number): string {
  const carbPercentage = calculateCarbPercentage(carbs, calories);
  if (carbPercentage === null) return "No calorie data";
  const label = getKetoLabel(carbPercentage);
  return `${carbs}g carbs • ${carbPercentage}% of calories • ${label}`;
}
