/**
 * Convert probability percentage to readable chance description
 * @param {number} prob - Probability percentage (0-100)
 * @returns {string} - Human-readable chance description
 */
export function getChance(prob) {
  if (prob == null) return "Prediction Pending";

  if (prob >= 90) return "Very High Chance";
  if (prob >= 75) return "High Chance";
  if (prob >= 50) return "Moderate Chance";
  if (prob >= 25) return "Low Chance";
  return "Very Low Chance";
}

/**
 * Get color based on probability
 * @param {number} prob - Probability percentage (0-100)
 * @returns {string} - Color code
 */
export function getProbabilityColor(prob) {
  if (prob == null) return "#94a3b8"; // gray
  if (prob >= 90) return "#16a34a"; // darker green
  if (prob >= 75) return "#22c55e"; // green
  if (prob >= 50) return "#eab308"; // yellow
  if (prob >= 25) return "#f97316"; // orange
  return "#ef4444"; // red
}
