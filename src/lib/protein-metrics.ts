/**
 * Utility functions for calculating protein-related metrics
 */

/**
 * Calculate percentage of calories from protein
 * Formula: (protein_g × 4 ÷ total_kcal) × 100
 */
export function calculateProteinPercentage(
  protein: number,
  calories: number,
): number {
  if (!protein || !calories || calories === 0) return 0;
  return Math.round(((protein * 4) / calories) * 100 * 10) / 10;
}

/**
 * Calculate P:E ratio (protein to energy ratio)
 * Formula: protein_g ÷ (kcal ÷ 100) = grams protein per 100 kcal
 */
export function calculatePERatio(protein: number, calories: number): number {
  if (!protein || !calories || calories === 0) return 0;
  return Math.round((protein / (calories / 100)) * 10) / 10;
}

/**
 * Get P:E rating (1-3 bolts) based on protein percentage
 * - 3 bolts: >40% (Protein powerhouse)
 * - 2 bolts: 25-40% (Good ratio)
 * - 1 bolt: <25% (Lower protein)
 */
export function getPERating(proteinPercentage: number): 1 | 2 | 3 {
  if (proteinPercentage >= 40) return 3;
  if (proteinPercentage >= 25) return 2;
  return 1;
}

/**
 * Get label for P:E rating
 */
export function getPELabel(rating: 1 | 2 | 3): string {
  if (rating === 3) return "Protein powerhouse";
  if (rating === 2) return "Good ratio";
  return "Lower protein";
}

/**
 * Get color class for P:E rating
 */
export function getPEColor(rating: 1 | 2 | 3): string {
  if (rating === 3) return "text-yellow-500";
  if (rating === 2) return "text-yellow-400";
  return "text-gray-400";
}

/**
 * Format tooltip content for protein metrics
 */
export function formatProteinTooltip(
  protein: number,
  calories: number,
): string {
  const percentage = calculateProteinPercentage(protein, calories);
  const rating = getPERating(percentage);
  const label = getPELabel(rating);
  return `${percentage}% protein • ${label}`;
}
