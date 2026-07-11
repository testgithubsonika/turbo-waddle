// src/components/ConfirmationBadge.jsx
import React from 'react';

const getBadgeStyles = (probability) => {
  if (probability == null) {
    return 'bg-gray-100 text-gray-500 border-gray-200';
  }
  if (probability >= 90) return 'w-18 bg-green-600 text-white border-green-600';
  if (probability >= 60) return 'bg-green-100 text-green-700 border-green-200';
  if (probability >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  if (probability >= 20) return 'bg-orange-100 text-orange-700 border-orange-300';
  return 'bg-red-100 text-red-700 border-red-300';
};

const ConfirmationBadge = ({ probability, aiServiceAvailable }) => {
  if (!aiServiceAvailable) {
    return (
      <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-500 border-gray-200">
        Prediction unavailable
      </span>
    );
  }

  if (probability == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-400 border-gray-200">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />
        Calculating…
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeStyles(probability)}`}>
      {probability}% chance
    </span>
  );
};

export default ConfirmationBadge;