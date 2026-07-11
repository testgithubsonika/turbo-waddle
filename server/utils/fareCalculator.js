const CLASS_MULTIPLIER = {
  Sleeper: 1.0,
  '3A': 2.5,
  '2A': 3.5,
  CC: 1.8
};

exports.calculateFare = (distanceKm, baseFare, classType) => {
  const multiplier = CLASS_MULTIPLIER[classType];
  if (!multiplier) throw new Error('Invalid class');
  return Math.round(distanceKm * baseFare * multiplier);
};
