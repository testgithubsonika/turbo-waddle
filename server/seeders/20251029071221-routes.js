'use strict';

const ROUTES = [
  // 🔴 North India
  { code: 'NDLS_LKO', source: 'NDLS', destination: 'LKO' },
  { code: 'NDLS_JP', source: 'NDLS', destination: 'JP' },
  { code: 'NDLS_BCT', source: 'NDLS', destination: 'BCT' },
  { code: 'NDLS_ASR', source: 'NDLS', destination: 'ASR' },
  { code: 'NDLS_DDN', source: 'NDLS', destination: 'DDN' },

  // 🔵 East India
  { code: 'HWH_NDLS', source: 'HWH', destination: 'NDLS' },
  { code: 'HWH_PNBE', source: 'HWH', destination: 'PNBE' },
  { code: 'HWH_GAYA', source: 'HWH', destination: 'GAYA' },

  // 🟢 West India
  { code: 'BCT_PUNE', source: 'BCT', destination: 'PUNE' },
  { code: 'BCT_ADI', source: 'BCT', destination: 'ADI' },
  { code: 'ADI_RJT', source: 'ADI', destination: 'RJT' },

  // 🟣 Central India
  { code: 'BPL_NGP', source: 'BPL', destination: 'NGP' },
  { code: 'BPL_JBP', source: 'BPL', destination: 'JBP' },

  // 🟠 South India
  { code: 'MAS_SBC', source: 'MAS', destination: 'SBC' },
  { code: 'MAS_MDU', source: 'MAS', destination: 'MDU' },
  { code: 'SBC_CBE', source: 'SBC', destination: 'CBE' },
  { code: 'ERS_TVC', source: 'ERS', destination: 'TVC' },

  // 🔶 Long-distance
  { code: 'NDLS_MAS', source: 'NDLS', destination: 'MAS' },
  { code: 'NDLS_SBC', source: 'NDLS', destination: 'SBC' },
   { code: 'HWH_MAS', source: 'HWH', destination: 'MAS' },
  { code: 'PNBE_HYB', source: 'PNBE', destination: 'HYB' },

  // 🟢 West → South
  { code: 'BCT_MAS', source: 'BCT', destination: 'MAS' },
  { code: 'PUNE_SBC', source: 'PUNE', destination: 'SBC' },

  // 🔴 North → East
  { code: 'NDLS_PNBE', source: 'NDLS', destination: 'PNBE' },
  { code: 'NDLS_GHY', source: 'NDLS', destination: 'GHY' },

  // 🟣 Central / Long
  { code: 'BPL_HYB', source: 'BPL', destination: 'HYB' },
  { code: 'ADI_PUNE', source: 'ADI', destination: 'PUNE' },
  // ====== EXTRA 20 ROUTES ======

{ code: 'NDLS_BBS', source: 'NDLS', destination: 'BBS' },
{ code: 'NDLS_RNC', source: 'NDLS', destination: 'RNC' },
{ code: 'NDLS_TVC', source: 'NDLS', destination: 'TVC' },

{ code: 'HWH_GHY', source: 'HWH', destination: 'GHY' },
{ code: 'HWH_RNC', source: 'HWH', destination: 'RNC' },

{ code: 'PNBE_ASR', source: 'PNBE', destination: 'ASR' },
{ code: 'PNBE_MAS', source: 'PNBE', destination: 'MAS' },

{ code: 'BCT_JBP', source: 'BCT', destination: 'JBP' },
{ code: 'BCT_NGP', source: 'BCT', destination: 'NGP' },

{ code: 'ADI_BPL', source: 'ADI', destination: 'BPL' },
{ code: 'ADI_NGP', source: 'ADI', destination: 'NGP' },

{ code: 'PUNE_HYB', source: 'PUNE', destination: 'HYB' },
{ code: 'PUNE_BBS', source: 'PUNE', destination: 'BBS' },

{ code: 'MAS_VSKP', source: 'MAS', destination: 'VSKP' },
{ code: 'MAS_TVC', source: 'MAS', destination: 'TVC' },

{ code: 'SBC_HYB', source: 'SBC', destination: 'HYB' },
{ code: 'SBC_PUNE', source: 'SBC', destination: 'PUNE' },

{ code: 'GHY_DBRG', source: 'GHY', destination: 'DBRG' },
{ code: 'JAT_UHP', source: 'JAT', destination: 'UHP' },
// ====== BATCH 3 : ROUTES ======

{ code: 'NDLS_KOTA', source: 'NDLS', destination: 'KOTA' },
{ code: 'NDLS_UJN', source: 'NDLS', destination: 'UJN' },
{ code: 'NDLS_BKN', source: 'NDLS', destination: 'BKN' },

{ code: 'HWH_BBS', source: 'HWH', destination: 'BBS' },
{ code: 'HWH_TATA', source: 'HWH', destination: 'TATA' },

{ code: 'PNBE_RPR', source: 'PNBE', destination: 'RPR' },
{ code: 'PNBE_BSP', source: 'PNBE', destination: 'BSP' },

{ code: 'BCT_SUR', source: 'BCT', destination: 'SUR' },
{ code: 'BCT_MRJ', source: 'BCT', destination: 'MRJ' },

{ code: 'ADI_SUR', source: 'ADI', destination: 'SUR' },
{ code: 'ADI_UJN', source: 'ADI', destination: 'UJN' },

{ code: 'PUNE_NGP', source: 'PUNE', destination: 'NGP' },
{ code: 'PUNE_RPR', source: 'PUNE', destination: 'RPR' },

{ code: 'MAS_CBE', source: 'MAS', destination: 'CBE' },
{ code: 'MAS_SA', source: 'MAS', destination: 'SA' },

{ code: 'SBC_MAS', source: 'SBC', destination: 'MAS' },
{ code: 'SBC_TVC', source: 'SBC', destination: 'TVC' },

{ code: 'HYB_NGP', source: 'HYB', destination: 'NGP' },
{ code: 'HYB_RNC', source: 'HYB', destination: 'RNC' },
// ====== BATCH 4 : ROUTES ======

{ code: 'NDLS_ALD', source: 'NDLS', destination: 'ALD' },
{ code: 'NDLS_GKP', source: 'NDLS', destination: 'GKP' },
{ code: 'NDLS_JBP', source: 'NDLS', destination: 'JBP' },

{ code: 'HWH_BJU', source: 'HWH', destination: 'BJU' },
{ code: 'HWH_SGR', source: 'HWH', destination: 'SGR' },

{ code: 'PNBE_DURG', source: 'PNBE', destination: 'DURG' },
{ code: 'PNBE_RNC', source: 'PNBE', destination: 'RNC' },

{ code: 'BCT_KOTA', source: 'BCT', destination: 'KOTA' },
{ code: 'BCT_BPL', source: 'BCT', destination: 'BPL' },

{ code: 'ADI_KOTA', source: 'ADI', destination: 'KOTA' },
{ code: 'ADI_JBP', source: 'ADI', destination: 'JBP' },

{ code: 'PUNE_JBP', source: 'PUNE', destination: 'JBP' },
{ code: 'PUNE_BSP', source: 'PUNE', destination: 'BSP' },

{ code: 'MAS_SBC', source: 'MAS', destination: 'SBC' }, // reverse direction
{ code: 'MAS_RMM', source: 'MAS', destination: 'RMM' },

{ code: 'SBC_CBE', source: 'SBC', destination: 'CBE' }, // reverse
{ code: 'SBC_MDU', source: 'SBC', destination: 'MDU' },

{ code: 'HYB_BZA', source: 'HYB', destination: 'BZA' },
{ code: 'HYB_TATA', source: 'HYB', destination: 'TATA' },

// ====== BATCH 5 : ROUTES ======

{ code: 'NDLS_CN B', source: 'NDLS', destination: 'CNB' },
{ code: 'NDLS_ET', source: 'NDLS', destination: 'ET' },
{ code: 'NDLS_RPR', source: 'NDLS', destination: 'RPR' },

{ code: 'HWH_ALD', source: 'HWH', destination: 'ALD' },
{ code: 'HWH_CN B', source: 'HWH', destination: 'CNB' },

{ code: 'PNBE_ALD', source: 'PNBE', destination: 'ALD' },
{ code: 'PNBE_GKP', source: 'PNBE', destination: 'GKP' },

{ code: 'BCT_ET', source: 'BCT', destination: 'ET' },
{ code: 'BCT_UJN', source: 'BCT', destination: 'UJN' },

{ code: 'ADI_ET', source: 'ADI', destination: 'ET' },
{ code: 'ADI_JP', source: 'ADI', destination: 'JP' },

{ code: 'PUNE_ET', source: 'PUNE', destination: 'ET' },
{ code: 'PUNE_UJN', source: 'PUNE', destination: 'UJN' },

{ code: 'MAS_BZA', source: 'MAS', destination: 'BZA' },
{ code: 'MAS_WL', source: 'MAS', destination: 'WL' },

{ code: 'SBC_WL', source: 'SBC', destination: 'WL' },
{ code: 'SBC_BZA', source: 'SBC', destination: 'BZA' },

{ code: 'HYB_GKP', source: 'HYB', destination: 'GKP' },
{ code: 'HYB_ALD', source: 'HYB', destination: 'ALD' },
// ====== BATCH 6 : ROUTES ======

{ code: 'NDLS_ET', source: 'NDLS', destination: 'ET' },
{ code: 'NDLS_BPL', source: 'NDLS', destination: 'BPL' },
{ code: 'NDLS_NGP', source: 'NDLS', destination: 'NGP' },

{ code: 'HWH_BPL', source: 'HWH', destination: 'BPL' },
{ code: 'HWH_ET', source: 'HWH', destination: 'ET' },

{ code: 'PNBE_BPL', source: 'PNBE', destination: 'BPL' },
{ code: 'PNBE_NGP', source: 'PNBE', destination: 'NGP' },

{ code: 'BCT_ET', source: 'BCT', destination: 'ET' },
{ code: 'BCT_NGP', source: 'BCT', destination: 'NGP' },

{ code: 'ADI_ET', source: 'ADI', destination: 'ET' },
{ code: 'ADI_BPL', source: 'ADI', destination: 'BPL' },

{ code: 'PUNE_BPL', source: 'PUNE', destination: 'BPL' },
{ code: 'PUNE_ET', source: 'PUNE', destination: 'ET' },

{ code: 'MAS_NGP', source: 'MAS', destination: 'NGP' },
{ code: 'MAS_BPL', source: 'MAS', destination: 'BPL' },

{ code: 'SBC_NGP', source: 'SBC', destination: 'NGP' },
{ code: 'SBC_ET', source: 'SBC', destination: 'ET' },

{ code: 'HYB_BPL', source: 'HYB', destination: 'BPL' },
{ code: 'HYB_ET', source: 'HYB', destination: 'ET' },
// ====== BATCH 7 : ROUTES ======

{ code: 'NDLS_GAYA', source: 'NDLS', destination: 'GAYA' },
{ code: 'NDLS_BJU', source: 'NDLS', destination: 'BJU' },

{ code: 'HWH_ALD', source: 'HWH', destination: 'ALD' },
{ code: 'HWH_CN B', source: 'HWH', destination: 'CNB' },

{ code: 'PNBE_CN B', source: 'PNBE', destination: 'CNB' },
{ code: 'PNBE_LKO', source: 'PNBE', destination: 'LKO' },

{ code: 'BCT_KYN', source: 'BCT', destination: 'KYN' },
{ code: 'BCT_LTT', source: 'BCT', destination: 'LTT' },

{ code: 'ADI_RTM', source: 'ADI', destination: 'RTM' },
{ code: 'ADI_UJN', source: 'ADI', destination: 'UJN' },

{ code: 'PUNE_SUR', source: 'PUNE', destination: 'SUR' },
{ code: 'PUNE_MRJ', source: 'PUNE', destination: 'MRJ' },

{ code: 'MAS_SA', source: 'MAS', destination: 'SA' },
{ code: 'MAS_CBE', source: 'MAS', destination: 'CBE' },

{ code: 'SBC_SA', source: 'SBC', destination: 'SA' },
{ code: 'SBC_CBE', source: 'SBC', destination: 'CBE' },

{ code: 'HYB_WL', source: 'HYB', destination: 'WL' },
{ code: 'HYB_BZA', source: 'HYB', destination: 'BZA' },

{ code: 'NGP_BPL', source: 'NGP', destination: 'BPL' },
{ code: 'ET_BPL', source: 'ET', destination: 'BPL' },
// ====== BATCH 8 : ROUTES ======

{ code: 'NDLS_BPL', source: 'NDLS', destination: 'BPL' },
{ code: 'NDLS_NGP', source: 'NDLS', destination: 'NGP' },

{ code: 'HWH_GAYA', source: 'HWH', destination: 'GAYA' },
{ code: 'HWH_BBS', source: 'HWH', destination: 'BBS' },

{ code: 'PNBE_BJU', source: 'PNBE', destination: 'BJU' },
{ code: 'PNBE_CN B', source: 'PNBE', destination: 'CNB' },

{ code: 'BCT_ADI', source: 'BCT', destination: 'ADI' },
{ code: 'BCT_PUNE', source: 'BCT', destination: 'PUNE' },

{ code: 'ADI_BCT', source: 'ADI', destination: 'BCT' },
{ code: 'ADI_PUNE', source: 'ADI', destination: 'PUNE' },

{ code: 'PUNE_SUR', source: 'PUNE', destination: 'SUR' },
{ code: 'PUNE_NGP', source: 'PUNE', destination: 'NGP' },

{ code: 'MAS_BZA', source: 'MAS', destination: 'BZA' },
{ code: 'MAS_VSKP', source: 'MAS', destination: 'VSKP' },

{ code: 'SBC_MAS', source: 'SBC', destination: 'MAS' },
{ code: 'SBC_HYB', source: 'SBC', destination: 'HYB' },

{ code: 'HYB_BZA', source: 'HYB', destination: 'BZA' },
{ code: 'HYB_NGP', source: 'HYB', destination: 'NGP' },

{ code: 'NGP_ET', source: 'NGP', destination: 'ET' },
{ code: 'ET_BPL', source: 'ET', destination: 'BPL' },
// ====== BATCH 9 : ROUTES ======

{ code: 'NDLS_LKO', source: 'NDLS', destination: 'LKO' },
{ code: 'NDLS_CN B', source: 'NDLS', destination: 'CNB' },

{ code: 'HWH_PNBE', source: 'HWH', destination: 'PNBE' },
{ code: 'HWH_GAYA', source: 'HWH', destination: 'GAYA' },

{ code: 'PNBE_BBS', source: 'PNBE', destination: 'BBS' },
{ code: 'PNBE_RNC', source: 'PNBE', destination: 'RNC' },

{ code: 'BCT_SUR', source: 'BCT', destination: 'SUR' },
{ code: 'BCT_RTM', source: 'BCT', destination: 'RTM' },

{ code: 'ADI_RJT', source: 'ADI', destination: 'RJT' },
{ code: 'ADI_SUR', source: 'ADI', destination: 'SUR' },

{ code: 'PUNE_MRJ', source: 'PUNE', destination: 'MRJ' },
{ code: 'PUNE_ET', source: 'PUNE', destination: 'ET' },

{ code: 'MAS_MDU', source: 'MAS', destination: 'MDU' },
{ code: 'MAS_CBE', source: 'MAS', destination: 'CBE' },

{ code: 'SBC_SA', source: 'SBC', destination: 'SA' },
{ code: 'SBC_MAS', source: 'SBC', destination: 'MAS' },

{ code: 'HYB_WL', source: 'HYB', destination: 'WL' },
{ code: 'HYB_BZA', source: 'HYB', destination: 'BZA' },

{ code: 'NGP_BPL', source: 'NGP', destination: 'BPL' },
{ code: 'ET_JBP', source: 'ET', destination: 'JBP' },
// ====== BATCH 10 : ROUTES ======

{ code: 'NDLS_CN B', source: 'NDLS', destination: 'CNB' },
{ code: 'NDLS_BJU', source: 'NDLS', destination: 'BJU' },

{ code: 'HWH_BWN', source: 'HWH', destination: 'BWN' },
{ code: 'HWH_KGP', source: 'HWH', destination: 'KGP' },

{ code: 'PNBE_GAYA', source: 'PNBE', destination: 'GAYA' },
{ code: 'PNBE_BJU', source: 'PNBE', destination: 'BJU' },

{ code: 'BCT_KYN', source: 'BCT', destination: 'KYN' },
{ code: 'BCT_LTT', source: 'BCT', destination: 'LTT' },

{ code: 'ADI_RTM', source: 'ADI', destination: 'RTM' },
{ code: 'ADI_BPL', source: 'ADI', destination: 'BPL' },

{ code: 'PUNE_SUR', source: 'PUNE', destination: 'SUR' },
{ code: 'PUNE_MRJ', source: 'PUNE', destination: 'MRJ' },

{ code: 'MAS_SA', source: 'MAS', destination: 'SA' },
{ code: 'MAS_BZA', source: 'MAS', destination: 'BZA' },

{ code: 'SBC_SA', source: 'SBC', destination: 'SA' },
{ code: 'SBC_KZJ', source: 'SBC', destination: 'KZJ' },

{ code: 'HYB_KZJ', source: 'HYB', destination: 'KZJ' },
{ code: 'HYB_WL', source: 'HYB', destination: 'WL' },

{ code: 'NGP_ET', source: 'NGP', destination: 'ET' },
{ code: 'ET_JBP', source: 'ET', destination: 'JBP' },
// ====== BATCH 11 : ROUTES ======

{ code: 'NDLS_LKO', source: 'NDLS', destination: 'LKO' },
{ code: 'NDLS_BPL', source: 'NDLS', destination: 'BPL' },

{ code: 'NDLS_RNC', source: 'NDLS', destination: 'RNC' },
{ code: 'NDLS_GKP', source: 'NDLS', destination: 'GKP' },

{ code: 'HWH_PNBE', source: 'HWH', destination: 'PNBE' },
{ code: 'HWH_RNC', source: 'HWH', destination: 'RNC' },

{ code: 'PNBE_GAYA', source: 'PNBE', destination: 'GAYA' },
{ code: 'PNBE_BBS', source: 'PNBE', destination: 'BBS' },

{ code: 'BCT_PUNE', source: 'BCT', destination: 'PUNE' },
{ code: 'BCT_NGP', source: 'BCT', destination: 'NGP' },

{ code: 'ADI_BPL', source: 'ADI', destination: 'BPL' },
{ code: 'ADI_JBP', source: 'ADI', destination: 'JBP' },

{ code: 'PUNE_NGP', source: 'PUNE', destination: 'NGP' },
{ code: 'PUNE_BPL', source: 'PUNE', destination: 'BPL' },

{ code: 'MAS_SBC', source: 'MAS', destination: 'SBC' },
{ code: 'MAS_MDU', source: 'MAS', destination: 'MDU' },

{ code: 'SBC_HYB', source: 'SBC', destination: 'HYB' },
{ code: 'SBC_CBE', source: 'SBC', destination: 'CBE' },

{ code: 'HYB_BZA', source: 'HYB', destination: 'BZA' },
{ code: 'HYB_NGP', source: 'HYB', destination: 'NGP' },
// ====== BATCH 12 : ROUTES ======

{ code: 'NDLS_BPL', source: 'NDLS', destination: 'BPL' },
{ code: 'NDLS_LKO', source: 'NDLS', destination: 'LKO' },

{ code: 'NDLS_PNBE', source: 'NDLS', destination: 'PNBE' },
{ code: 'NDLS_GAYA', source: 'NDLS', destination: 'GAYA' },

{ code: 'HWH_PNBE', source: 'HWH', destination: 'PNBE' },
{ code: 'HWH_GAYA', source: 'HWH', destination: 'GAYA' },

{ code: 'PNBE_CN B', source: 'PNBE', destination: 'CNB' },
{ code: 'PNBE_LKO', source: 'PNBE', destination: 'LKO' },

{ code: 'BCT_PUNE', source: 'BCT', destination: 'PUNE' },
{ code: 'BCT_SUR', source: 'BCT', destination: 'SUR' },

{ code: 'ADI_BPL', source: 'ADI', destination: 'BPL' },
{ code: 'ADI_NGP', source: 'ADI', destination: 'NGP' },

{ code: 'PUNE_NGP', source: 'PUNE', destination: 'NGP' },
{ code: 'PUNE_BPL', source: 'PUNE', destination: 'BPL' },

{ code: 'MAS_SBC', source: 'MAS', destination: 'SBC' },
{ code: 'MAS_CBE', source: 'MAS', destination: 'CBE' },

{ code: 'SBC_HYB', source: 'SBC', destination: 'HYB' },
{ code: 'SBC_SA', source: 'SBC', destination: 'SA' },

{ code: 'HYB_BZA', source: 'HYB', destination: 'BZA' },
{ code: 'HYB_NGP', source: 'HYB', destination: 'NGP' },

];

module.exports = {
  async up(queryInterface, Sequelize) {
    const stations = await queryInterface.sequelize.query(
      'SELECT id, station_code FROM stations',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const stationMap = Object.fromEntries(
      stations.map(s => [s.station_code, s.id])
    );

    const routes = ROUTES.map(r => ({
      source_station_id: stationMap[r.source],
      destination_station_id: stationMap[r.destination],
    })).filter(r => r.source_station_id && r.destination_station_id);

    const dedupedRoutes = [];
    const existingRoutes = await queryInterface.sequelize.query(
      'SELECT source_station_id, destination_station_id FROM routes',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingRouteKeys = new Set(
      existingRoutes.map(r => `${r.source_station_id}:${r.destination_station_id}`)
    );

    const seenRouteKeys = new Set();

    for (const route of routes) {
      const key = `${route.source_station_id}:${route.destination_station_id}`;
      if (!seenRouteKeys.has(key)) {
        seenRouteKeys.add(key);
        dedupedRoutes.push(route);
      }
    }

    const routesToInsert = dedupedRoutes.filter(
      route => !existingRouteKeys.has(`${route.source_station_id}:${route.destination_station_id}`)
    );

    if (routesToInsert.length > 0) {
      await queryInterface.bulkInsert('routes', routesToInsert);
      console.log(`✅ Inserted ${routesToInsert.length} new routes (skipped ${dedupedRoutes.length - routesToInsert.length} already existing)`);
    } else {
      console.log('⚠️ No new routes to insert');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('routes', null);
  },
};
