'use strict';

const ROUTE_STATIONS = {
  // NDLS based
  NDLS_LKO: ['NDLS', 'CNB', 'LKO'],
  NDLS_JP: ['NDLS', 'FDB', 'JP'],
  NDLS_BCT: ['NDLS', 'KOTA', 'RTM', 'BCT'],
  NDLS_ASR: ['NDLS', 'UMB', 'ASR'],
  NDLS_DDN: ['NDLS', 'FDB', 'DDN'],

  // East
  HWH_NDLS: ['HWH', 'BWN', 'ALD', 'CNB', 'NDLS'],
  HWH_PNBE: ['HWH', 'BWN', 'BJU', 'PNBE'],
  HWH_GAYA: ['HWH', 'BWN', 'GAYA'],

  // West
  BCT_PUNE: ['BCT', 'KYN', 'LTT', 'PUNE'],
  BCT_ADI: ['BCT', 'SUR', 'ADI'],
  ADI_RJT: ['ADI', 'RJT'],

  // Central
  BPL_NGP: ['BPL', 'ET', 'NGP'],
  BPL_JBP: ['BPL', 'ET', 'JBP'],

  // South
  MAS_SBC: ['MAS', 'SA', 'SBC'],
  MAS_MDU: ['MAS', 'MDU'],
  SBC_CBE: ['SBC', 'CBE'],
  ERS_TVC: ['ERS', 'TVC'],

  // Long-distance
  NDLS_MAS: ['NDLS', 'BPL', 'NGP', 'HYB', 'MAS'],
  NDLS_SBC: ['NDLS', 'BPL', 'NGP', 'HYB', 'SBC'],
   // 🔵 East → South
  HWH_MAS: ['HWH', 'KGP', 'BBS', 'VSKP', 'BZA', 'MAS'],
  PNBE_HYB: ['PNBE', 'GAYA', 'ALD', 'BPL', 'NGP', 'HYB'],

  // 🟢 West → South
  BCT_MAS: ['BCT', 'SUR', 'MRJ', 'CBE', 'MAS'],
  PUNE_SBC: ['PUNE', 'SUR', 'MRJ', 'SBC'],

  // 🔴 North → East
  NDLS_PNBE: ['NDLS', 'CNB', 'ALD', 'BJU', 'PNBE'],
  NDLS_GHY: ['NDLS', 'CNB', 'PNBE', 'DBRG', 'GHY'],

  // 🟣 Central
  BPL_HYB: ['BPL', 'NGP', 'WL', 'HYB'],
  ADI_PUNE: ['ADI', 'RJT', 'SUR', 'PUNE'],// ====== EXTRA 20 ROUTE STATIONS ======

NDLS_BBS: ['NDLS', 'CNB', 'ALD', 'BJU', 'BBS'],
NDLS_RNC: ['NDLS', 'CNB', 'ALD', 'RNC'],
NDLS_TVC: ['NDLS', 'BPL', 'NGP', 'HYB', 'ERS', 'TVC'],

HWH_GHY: ['HWH', 'BWN', 'KGP', 'GHY'],
HWH_RNC: ['HWH', 'BWN', 'TATA', 'RNC'],

PNBE_ASR: ['PNBE', 'CNB', 'NDLS', 'UMB', 'ASR'],
PNBE_MAS: ['PNBE', 'GAYA', 'ALD', 'BPL', 'NGP', 'MAS'],

BCT_JBP: ['BCT', 'RTM', 'BPL', 'ET', 'JBP'],
BCT_NGP: ['BCT', 'RTM', 'BPL', 'NGP'],

ADI_BPL: ['ADI', 'RJT', 'RTM', 'BPL'],
ADI_NGP: ['ADI', 'RTM', 'BPL', 'NGP'],

PUNE_HYB: ['PUNE', 'SUR', 'WL', 'HYB'],
PUNE_BBS: ['PUNE', 'SUR', 'BPL', 'BBS'],

MAS_VSKP: ['MAS', 'BZA', 'VSKP'],
MAS_TVC: ['MAS', 'SA', 'ERS', 'TVC'],

SBC_HYB: ['SBC', 'KZJ', 'HYB'],
SBC_PUNE: ['SBC', 'MRJ', 'SUR', 'PUNE'],

GHY_DBRG: ['GHY', 'DBRG'],
JAT_UHP: ['JAT', 'UHP'],
// ====== BATCH 3 : ROUTE STATIONS ======

NDLS_KOTA: ['NDLS', 'CNB', 'KOTA'],
NDLS_UJN: ['NDLS', 'CNB', 'RTM', 'UJN'],
NDLS_BKN: ['NDLS', 'JP', 'BKN'],

HWH_BBS: ['HWH', 'KGP', 'BBS'],
HWH_TATA: ['HWH', 'KGP', 'TATA'],

PNBE_RPR: ['PNBE', 'BJU', 'RPR'],
PNBE_BSP: ['PNBE', 'BJU', 'BSP'],

BCT_SUR: ['BCT', 'KYN', 'SUR'],
BCT_MRJ: ['BCT', 'SUR', 'MRJ'],

ADI_SUR: ['ADI', 'RJT', 'SUR'],
ADI_UJN: ['ADI', 'RTM', 'UJN'],

PUNE_NGP: ['PUNE', 'SUR', 'NGP'],
PUNE_RPR: ['PUNE', 'SUR', 'RPR'],

MAS_CBE: ['MAS', 'SA', 'CBE'],
MAS_SA: ['MAS', 'SA'],

SBC_MAS: ['SBC', 'SA', 'MAS'],
SBC_TVC: ['SBC', 'ERS', 'TVC'],

HYB_NGP: ['HYB', 'WL', 'NGP'],
HYB_RNC: ['HYB', 'WL', 'RNC'],
// ====== BATCH 4 : ROUTE STATIONS ======

NDLS_ALD: ['NDLS', 'CNB', 'ALD'],
NDLS_GKP: ['NDLS', 'LKO', 'GKP'],
NDLS_JBP: ['NDLS', 'BPL', 'ET', 'JBP'],

HWH_BJU: ['HWH', 'BWN', 'BJU'],
HWH_SGR: ['HWH', 'KGP', 'NJP', 'SGR'],

PNBE_DURG: ['PNBE', 'BJU', 'RPR', 'DURG'],
PNBE_RNC: ['PNBE', 'GAYA', 'RNC'],

BCT_KOTA: ['BCT', 'RTM', 'KOTA'],
BCT_BPL: ['BCT', 'RTM', 'BPL'],

ADI_KOTA: ['ADI', 'RTM', 'KOTA'],
ADI_JBP: ['ADI', 'RTM', 'BPL', 'JBP'],

PUNE_JBP: ['PUNE', 'SUR', 'BPL', 'JBP'],
PUNE_BSP: ['PUNE', 'SUR', 'RPR', 'BSP'],

MAS_SBC: ['MAS', 'SA', 'SBC'],
MAS_RMM: ['MAS', 'MDU', 'RMM'],

SBC_CBE: ['SBC', 'SA', 'CBE'],
SBC_MDU: ['SBC', 'SA', 'MDU'],

HYB_BZA: ['HYB', 'KZJ', 'BZA'],
HYB_TATA: ['HYB', 'WL', 'TATA'],
// ====== BATCH 5 : ROUTE STATIONS ======

NDLS_CNB: ['NDLS', 'CNB'],
NDLS_ET: ['NDLS', 'BPL', 'ET'],
NDLS_RPR: ['NDLS', 'CNB', 'RPR'],

HWH_ALD: ['HWH', 'BWN', 'ALD'],
HWH_CNB: ['HWH', 'BWN', 'CNB'],

PNBE_ALD: ['PNBE', 'GAYA', 'ALD'],
PNBE_GKP: ['PNBE', 'GKP'],

BCT_ET: ['BCT', 'RTM', 'ET'],
BCT_UJN: ['BCT', 'RTM', 'UJN'],

ADI_ET: ['ADI', 'RTM', 'ET'],
ADI_JP: ['ADI', 'RJT', 'JP'],

PUNE_ET: ['PUNE', 'SUR', 'ET'],
PUNE_UJN: ['PUNE', 'SUR', 'UJN'],

MAS_BZA: ['MAS', 'BZA'],
MAS_WL: ['MAS', 'WL'],

SBC_WL: ['SBC', 'WL'],
SBC_BZA: ['SBC', 'BZA'],

HYB_GKP: ['HYB', 'GKP'],
HYB_ALD: ['HYB', 'ALD'],
// ====== BATCH 6 : ROUTE STATIONS ======

NDLS_ET: ['NDLS', 'BPL', 'ET'],
NDLS_BPL: ['NDLS', 'BPL'],
NDLS_NGP: ['NDLS', 'BPL', 'NGP'],

HWH_BPL: ['HWH', 'BWN', 'BPL'],
HWH_ET: ['HWH', 'BWN', 'ET'],

PNBE_BPL: ['PNBE', 'GAYA', 'BPL'],
PNBE_NGP: ['PNBE', 'GAYA', 'NGP'],

BCT_ET: ['BCT', 'RTM', 'ET'],
BCT_NGP: ['BCT', 'RTM', 'NGP'],

ADI_ET: ['ADI', 'RTM', 'ET'],
ADI_BPL: ['ADI', 'RTM', 'BPL'],

PUNE_BPL: ['PUNE', 'SUR', 'BPL'],
PUNE_ET: ['PUNE', 'SUR', 'ET'],

MAS_NGP: ['MAS', 'BZA', 'NGP'],
MAS_BPL: ['MAS', 'BZA', 'BPL'],

SBC_NGP: ['SBC', 'WL', 'NGP'],
SBC_ET: ['SBC', 'WL', 'ET'],

HYB_BPL: ['HYB', 'NGP', 'BPL'],
HYB_ET: ['HYB', 'NGP', 'ET'],
// ====== BATCH 7 : ROUTE STATIONS ======

NDLS_GAYA: ['NDLS', 'CNB', 'GAYA'],
NDLS_BJU: ['NDLS', 'CNB', 'BJU'],

HWH_ALD: ['HWH', 'BWN', 'ALD'],
HWH_CNB: ['HWH', 'BWN', 'CNB'],

PNBE_CNB: ['PNBE', 'CNB'],
PNBE_LKO: ['PNBE', 'LKO'],

BCT_KYN: ['BCT', 'KYN'],
BCT_LTT: ['BCT', 'LTT'],

ADI_RTM: ['ADI', 'RTM'],
ADI_UJN: ['ADI', 'UJN'],

PUNE_SUR: ['PUNE', 'SUR'],
PUNE_MRJ: ['PUNE', 'MRJ'],

MAS_SA: ['MAS', 'SA'],
MAS_CBE: ['MAS', 'SA', 'CBE'],

SBC_SA: ['SBC', 'SA'],
SBC_CBE: ['SBC', 'SA', 'CBE'],

HYB_WL: ['HYB', 'WL'],
HYB_BZA: ['HYB', 'BZA'],

NGP_BPL: ['NGP', 'BPL'],
ET_BPL: ['ET', 'BPL'],
// ====== BATCH 8 : ROUTE STATIONS ======

NDLS_BPL: ['NDLS', 'BPL'],
NDLS_NGP: ['NDLS', 'BPL', 'NGP'],

HWH_GAYA: ['HWH', 'BWN', 'GAYA'],
HWH_BBS: ['HWH', 'KGP', 'BBS'],

PNBE_BJU: ['PNBE', 'BJU'],
PNBE_CNB: ['PNBE', 'CNB'],

BCT_ADI: ['BCT', 'ADI'],
BCT_PUNE: ['BCT', 'KYN', 'PUNE'],

ADI_BCT: ['ADI', 'BCT'],
ADI_PUNE: ['ADI', 'SUR', 'PUNE'],

PUNE_SUR: ['PUNE', 'SUR'],
PUNE_NGP: ['PUNE', 'SUR', 'NGP'],

MAS_BZA: ['MAS', 'BZA'],
MAS_VSKP: ['MAS', 'BZA', 'VSKP'],

SBC_MAS: ['SBC', 'SA', 'MAS'],
SBC_HYB: ['SBC', 'KZJ', 'HYB'],

HYB_BZA: ['HYB', 'BZA'],
HYB_NGP: ['HYB', 'NGP'],

NGP_ET: ['NGP', 'ET'],
ET_BPL: ['ET', 'BPL'],
// ====== BATCH 9 : ROUTE STATIONS ======

NDLS_LKO: ['NDLS', 'CNB', 'LKO'],
NDLS_CNB: ['NDLS', 'CNB'],

HWH_PNBE: ['HWH', 'BWN', 'PNBE'],
HWH_GAYA: ['HWH', 'BWN', 'GAYA'],

PNBE_BBS: ['PNBE', 'BJU', 'BBS'],
PNBE_RNC: ['PNBE', 'GAYA', 'RNC'],

BCT_SUR: ['BCT', 'KYN', 'SUR'],
BCT_RTM: ['BCT', 'RTM'],

ADI_RJT: ['ADI', 'RJT'],
ADI_SUR: ['ADI', 'RJT', 'SUR'],

PUNE_MRJ: ['PUNE', 'MRJ'],
PUNE_ET: ['PUNE', 'SUR', 'ET'],

MAS_MDU: ['MAS', 'MDU'],
MAS_CBE: ['MAS', 'SA', 'CBE'],

SBC_SA: ['SBC', 'SA'],
SBC_MAS: ['SBC', 'SA', 'MAS'],

HYB_WL: ['HYB', 'WL'],
HYB_BZA: ['HYB', 'BZA'],

NGP_BPL: ['NGP', 'BPL'],
ET_JBP: ['ET', 'JBP'],
// ====== BATCH 10 : ROUTE STATIONS ======

NDLS_CNB: ['NDLS', 'CNB'],
NDLS_BJU: ['NDLS', 'CNB', 'BJU'],

HWH_BWN: ['HWH', 'BWN'],
HWH_KGP: ['HWH', 'KGP'],

PNBE_GAYA: ['PNBE', 'GAYA'],
PNBE_BJU: ['PNBE', 'BJU'],

BCT_KYN: ['BCT', 'KYN'],
BCT_LTT: ['BCT', 'LTT'],

ADI_RTM: ['ADI', 'RTM'],
ADI_BPL: ['ADI', 'RTM', 'BPL'],

PUNE_SUR: ['PUNE', 'SUR'],
PUNE_MRJ: ['PUNE', 'MRJ'],

MAS_SA: ['MAS', 'SA'],
MAS_BZA: ['MAS', 'BZA'],

SBC_SA: ['SBC', 'SA'],
SBC_KZJ: ['SBC', 'KZJ'],

HYB_KZJ: ['HYB', 'KZJ'],
HYB_WL: ['HYB', 'WL'],

NGP_ET: ['NGP', 'ET'],
ET_JBP: ['ET', 'JBP'],
// ====== BATCH 11 : ROUTE STATIONS ======

NDLS_LKO: ['NDLS', 'CNB', 'LKO'],
NDLS_BPL: ['NDLS', 'BPL'],

NDLS_RNC: ['NDLS', 'CNB', 'RNC'],
NDLS_GKP: ['NDLS', 'LKO', 'GKP'],

HWH_PNBE: ['HWH', 'BWN', 'PNBE'],
HWH_RNC: ['HWH', 'BWN', 'TATA', 'RNC'],

PNBE_GAYA: ['PNBE', 'GAYA'],
PNBE_BBS: ['PNBE', 'BJU', 'BBS'],

BCT_PUNE: ['BCT', 'KYN', 'PUNE'],
BCT_NGP: ['BCT', 'RTM', 'NGP'],

ADI_BPL: ['ADI', 'RTM', 'BPL'],
ADI_JBP: ['ADI', 'RTM', 'BPL', 'JBP'],

PUNE_NGP: ['PUNE', 'SUR', 'NGP'],
PUNE_BPL: ['PUNE', 'SUR', 'BPL'],

MAS_SBC: ['MAS', 'SA', 'SBC'],
MAS_MDU: ['MAS', 'MDU'],

SBC_HYB: ['SBC', 'KZJ', 'HYB'],
SBC_CBE: ['SBC', 'SA', 'CBE'],

HYB_BZA: ['HYB', 'BZA'],
HYB_NGP: ['HYB', 'NGP'],
// ====== BATCH 12 : ROUTE STATIONS ======

NDLS_BPL: ['NDLS', 'BPL'],
NDLS_LKO: ['NDLS', 'CNB', 'LKO'],

NDLS_PNBE: ['NDLS', 'CNB', 'PNBE'],
NDLS_GAYA: ['NDLS', 'CNB', 'GAYA'],

HWH_PNBE: ['HWH', 'BWN', 'PNBE'],
HWH_GAYA: ['HWH', 'BWN', 'GAYA'],

PNBE_CNB: ['PNBE', 'CNB'],
PNBE_LKO: ['PNBE', 'LKO'],

BCT_PUNE: ['BCT', 'KYN', 'PUNE'],
BCT_SUR: ['BCT', 'KYN', 'SUR'],

ADI_BPL: ['ADI', 'RTM', 'BPL'],
ADI_NGP: ['ADI', 'RTM', 'NGP'],

PUNE_NGP: ['PUNE', 'SUR', 'NGP'],
PUNE_BPL: ['PUNE', 'SUR', 'BPL'],

MAS_SBC: ['MAS', 'SA', 'SBC'],
MAS_CBE: ['MAS', 'SA', 'CBE'],

SBC_HYB: ['SBC', 'KZJ', 'HYB'],
SBC_SA: ['SBC', 'SA'],

HYB_BZA: ['HYB', 'BZA'],
HYB_NGP: ['HYB', 'NGP'],

};

const avgSpeedKmPerHr = 60;

function addMinutes(timeStr, mins) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch routes with their codes to match ROUTE_STATIONS
    const routes = await queryInterface.sequelize.query(
      `SELECT r.id, r.source_station_id, r.destination_station_id, 
              s1.station_code as source_code, s2.station_code as dest_code,
              MIN(ts.departure_time) AS start_time
       FROM routes r
       JOIN stations s1 ON r.source_station_id = s1.id
       JOIN stations s2 ON r.destination_station_id = s2.id
       LEFT JOIN trains tr ON tr.route_id = r.id
       LEFT JOIN train_schedules ts ON tr.id = ts.train_id
       GROUP BY r.id, s1.station_code, s2.station_code`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Fetch all stations
    const stations = await queryInterface.sequelize.query(
      `SELECT id, station_code FROM stations`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const stationMap = Object.fromEntries(
      stations.map(s => [s.station_code, s.id])
    );

    const rows = [];

    for (const route of routes) {
      const routeCode = `${route.source_code}_${route.dest_code}`;
      const stationCodes = ROUTE_STATIONS[routeCode];

      if (!stationCodes) continue;

      const trainStartTime = route.start_time || '06:00';
      let currentTime = trainStartTime;
      let prevDistance = 0;

      for (let i = 0; i < stationCodes.length; i++) {
        const stationCode = stationCodes[i];
        const stationId = stationMap[stationCode];
        if (!stationId) continue;

        // Calculate cumulative distances (120 km between stations)
        const distance = i * 120;
        const travelMinutes = ((distance - prevDistance) / avgSpeedKmPerHr) * 60;
        currentTime = addMinutes(currentTime, Math.round(travelMinutes));

        rows.push({
          route_id: route.id,
          station_id: stationId,
          sequence_no: i + 1,
          distance_from_source_km: distance,
          arrival_time: i === 0 ? null : currentTime,
          departure_time: i === stationCodes.length - 1 ? null : addMinutes(currentTime, 7),
        });

        currentTime = addMinutes(currentTime, 7);
        prevDistance = distance;
      }
    }

    await queryInterface.bulkInsert('route_stations', rows);
    console.log(`✅ Inserted ${rows.length} route_stations`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('route_stations', null);
  },
};
