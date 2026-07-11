/**
 * Route Validation Utility
 * Ensures data integrity for route_stations
 */
const db = require('../models');
const { Op } = require('sequelize');

/**
 * Validates that sequence_no values are contiguous (1, 2, 3, ... N)
 * @param {number} routeId
 * @returns {Promise<boolean>}
 */
exports.validateContiguousSequence = async (routeId) => {
  try {
    const stations = await db.RouteStation.findAll({
      where: { route_id: routeId },
      attributes: ['sequence_no'],
      order: [['sequence_no', 'ASC']],
      raw: true
    });

    if (stations.length === 0) return true;

    // Check that sequences are 1, 2, 3, ..., N
    for (let i = 0; i < stations.length; i++) {
      if (stations[i].sequence_no !== i + 1) {
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error validating contiguous sequence:', err);
    throw err;
  }
};

/**
 * Validates that distances are monotonically increasing
 * @param {number} routeId
 * @returns {Promise<boolean>}
 */
exports.validateMonotonicDistance = async (routeId) => {
  try {
    const stations = await db.RouteStation.findAll({
      where: { route_id: routeId },
      attributes: ['sequence_no', 'distance_from_source_km'],
      order: [['sequence_no', 'ASC']],
      raw: true
    });

    if (stations.length <= 1) return true;

    // Check that distances increase with sequence
    for (let i = 1; i < stations.length; i++) {
      if (stations[i].distance_from_source_km < stations[i - 1].distance_from_source_km) {
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error validating monotonic distance:', err);
    throw err;
  }
};

/**
 * Checks if a duplicate route already exists (source + destination + same stations)
 * @param {number} sourceStationId
 * @param {number} destinationStationId
 * @param {number} [excludeRouteId] - Optional: route id to exclude from check
 * @returns {Promise<object|null>}
 */
exports.findDuplicateRoute = async (sourceStationId, destinationStationId, excludeRouteId = null) => {
  try {
    // Find routes with same source/destination
    const routes = await db.Route.findAll({
      where: {
        source_station_id: sourceStationId,
        destination_station_id: destinationStationId,
        ...(excludeRouteId && { id: { [Op.ne]: excludeRouteId } })
      },
      attributes: ['id'],
      raw: true
    });

    return routes.length > 0 ? routes[0] : null;
  } catch (err) {
    console.error('Error finding duplicate route:', err);
    throw err;
  }
};

/**
 * Get route summary for validation/debugging
 * @param {number} routeId
 * @returns {Promise<object>}
 */
exports.getRouteSummary = async (routeId) => {
  try {
    const route = await db.Route.findByPk(routeId, {
      include: [{
        model: db.RouteStation,
        include: [{
          model: db.Station,
          attributes: ['station_name', 'station_code']
        }],
        order: [['sequence_no', 'ASC']]
      }],
      attributes: ['id', 'source_station_id', 'destination_station_id']
    });

    if (!route) return null;

    return {
      route_id: route.id,
      source_station_id: route.source_station_id,
      destination_station_id: route.destination_station_id,
      station_count: route.RouteStations?.length || 0,
      is_contiguous: await exports.validateContiguousSequence(routeId),
      is_monotonic_distance: await exports.validateMonotonicDistance(routeId),
      stations: route.RouteStations?.map(rs => ({
        sequence_no: rs.sequence_no,
        station_code: rs.Station?.station_code,
        station_name: rs.Station?.station_name,
        distance_km: rs.distance_from_source_km,
        arrival_time: rs.arrival_time,
        departure_time: rs.departure_time
      }))
    };
  } catch (err) {
    console.error('Error getting route summary:', err);
    throw err;
  }
};
