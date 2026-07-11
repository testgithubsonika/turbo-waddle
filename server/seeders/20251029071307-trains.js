'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingTrains = await queryInterface.sequelize.query(
      'SELECT train_number FROM trains',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingTrainNumbers = existingTrains.map(t => t.train_number);

    const routes = await queryInterface.sequelize.query(
      `
      SELECT r.id,
             s1.station_code AS source,
             s2.station_code AS destination
      FROM routes r
      JOIN stations s1 ON r.source_station_id = s1.id
      JOIN stations s2 ON r.destination_station_id = s2.id
      `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const routeMap = {};
    for (const r of routes) {
      routeMap[`${r.source}_${r.destination}`] = r.id;
    }

    const TRAINS = [
      {
        train_number: '12951',
        train_name: 'Mumbai Rajdhani',
        category: 'RAJDHANI',
        route_code: 'NDLS_BCT',
        base_fare_per_km: 1.9,
        fare_structure: { Sleeper: 700, '3A': 1800, '2A': 2500 }
      },
      {
        train_number: '12001',
        train_name: 'Bhopal Shatabdi',
        category: 'SHATABDI',
        route_code: 'NDLS_JP',
        base_fare_per_km: 2.2,
        fare_structure: { CC: 900, EC: 1600 }
      },
      {
        train_number: '12019',
        train_name: 'Dehradun Shatabdi',
        category: 'SHATABDI',
        route_code: 'NDLS_DDN',
        base_fare_per_km: 2.1,
        fare_structure: { CC: 850, EC: 1500 }
      },
      {
        train_number: '12301',
        train_name: 'Howrah Rajdhani',
        category: 'RAJDHANI',
        route_code: 'HWH_NDLS',
        base_fare_per_km: 2.0,
        fare_structure: { Sleeper: 800, '3A': 2000, '2A': 2800 }
      },
      {
        train_number: '12627',
        train_name: 'Karnataka Express',
        category: 'EXPRESS',
        route_code: 'NDLS_SBC',
        base_fare_per_km: 1.7,
        fare_structure: { Sleeper: 650, '3A': 1700, '2A': 2400 }
      },
      {
        train_number: '12621',
        train_name: 'Tamil Nadu Express',
        category: 'EXPRESS',
        route_code: 'NDLS_MAS',
        base_fare_per_km: 1.8,
        fare_structure: { Sleeper: 800, '3A': 1900, '2A': 2700 }
      },
      {
        train_number: '11029',
        train_name: 'Deccan Express',
        category: 'EXPRESS',
        route_code: 'BCT_PUNE',
        base_fare_per_km: 1.4,
        fare_structure: { Sleeper: 600, '3A': 1500 }
      },
      {
        train_number: '22691',
        train_name: 'Bangalore Rajdhani',
        category: 'RAJDHANI',
        route_code: 'MAS_SBC',
        base_fare_per_km: 1.6,
        fare_structure: { Sleeper: 900, '3A': 2200, '2A': 3000 }
      }, {
    train_number: '12841',
    train_name: 'Coromandel Express',
    category: 'SUPERFAST',
    route_code: 'HWH_MAS',
    base_fare_per_km: 1.6,
    fare_structure: { Sleeper: 750, '3A': 1800, '2A': 2600 }
  },
  {
    train_number: '12723',
    train_name: 'Telangana Express',
    category: 'SUPERFAST',
    route_code: 'NDLS_HYB',
    base_fare_per_km: 1.7,
    fare_structure: { Sleeper: 700, '3A': 1700, '2A': 2400 }
  },
  {
    train_number: '12163',
    train_name: 'Mumbai Chennai Express',
    category: 'EXPRESS',
    route_code: 'BCT_MAS',
    base_fare_per_km: 1.5,
    fare_structure: { Sleeper: 800, '3A': 1900 }
  },
  {
    train_number: '12785',
    train_name: 'Kacheguda SF Express',
    category: 'SUPERFAST',
    route_code: 'PNBE_HYB',
    base_fare_per_km: 1.6,
    fare_structure: { Sleeper: 700, '3A': 1800 }
  },
  {
    train_number: '22943',
    train_name: 'Udaipur SF Express',
    category: 'SUPERFAST',
    route_code: 'ADI_PUNE',
    base_fare_per_km: 1.4,
    fare_structure: { Sleeper: 650, '3A': 1600 }
  },// ====== EXTRA 20 TRAINS ======

{
  train_number: '12892',
  train_name: 'Puri SF Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BBS',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1800, '2A': 2600 }
},
{
  train_number: '12818',
  train_name: 'Jharkhand Swarna Jayanti',
  category: 'SUPERFAST',
  route_code: 'NDLS_RNC',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '22634',
  train_name: 'Hazrat Nizamuddin TVC SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_TVC',
  base_fare_per_km: 1.9,
  fare_structure: { Sleeper: 900, '3A': 2200, '2A': 3000 }
},
{
  train_number: '15657',
  train_name: 'Kanchanjunga Express',
  category: 'EXPRESS',
  route_code: 'HWH_GHY',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '18624',
  train_name: 'Hatia Rajdhani',
  category: 'RAJDHANI',
  route_code: 'HWH_RNC',
  base_fare_per_km: 2.0,
  fare_structure: { Sleeper: 850, '3A': 2100, '2A': 2900 }
},
{
  train_number: '14650',
  train_name: 'Saryu Yamuna Express',
  category: 'EXPRESS',
  route_code: 'PNBE_ASR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '12376',
  train_name: 'Patna Chennai Express',
  category: 'EXPRESS',
  route_code: 'PNBE_MAS',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 800, '3A': 1900 }
},
{
  train_number: '12192',
  train_name: 'Jabalpur SF Express',
  category: 'SUPERFAST',
  route_code: 'BCT_JBP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '12105',
  train_name: 'Vidarbha Express',
  category: 'SUPERFAST',
  route_code: 'BCT_NGP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '19484',
  train_name: 'Bhopal Express',
  category: 'EXPRESS',
  route_code: 'ADI_BPL',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '12834',
  train_name: 'Howrah Ahmedabad SF',
  category: 'SUPERFAST',
  route_code: 'ADI_NGP',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '17014',
  train_name: 'Hyderabad Pune Express',
  category: 'EXPRESS',
  route_code: 'PUNE_HYB',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '11020',
  train_name: 'Konark Express',
  category: 'EXPRESS',
  route_code: 'PUNE_BBS',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12842',
  train_name: 'Vizag Express',
  category: 'SUPERFAST',
  route_code: 'MAS_VSKP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '22639',
  train_name: 'Chennai Alleppey SF',
  category: 'SUPERFAST',
  route_code: 'MAS_TVC',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '12710',
  train_name: 'Charminar Express',
  category: 'SUPERFAST',
  route_code: 'SBC_HYB',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '11014',
  train_name: 'Lokmanya Tilak Express',
  category: 'EXPRESS',
  route_code: 'SBC_PUNE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '15928',
  train_name: 'Dibrugarh Express',
  category: 'EXPRESS',
  route_code: 'GHY_DBRG',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12426',
  train_name: 'Jammu Rajdhani',
  category: 'RAJDHANI',
  route_code: 'JAT_UHP',
  base_fare_per_km: 2.1,
  fare_structure: { Sleeper: 900, '3A': 2200, '2A': 3000 }
},
// ====== BATCH 3 : TRAINS ======

{
  train_number: '12465',
  train_name: 'Ranthambore Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_KOTA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '12904',
  train_name: 'Golden Temple Mail',
  category: 'MAIL',
  route_code: 'NDLS_UJN',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 600, '3A': 1500 }
},
{
  train_number: '22308',
  train_name: 'Bikaner SF Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BKN',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '12832',
  train_name: 'Dhauli Express',
  category: 'SUPERFAST',
  route_code: 'HWH_BBS',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '18005',
  train_name: 'Samaleswari Express',
  category: 'EXPRESS',
  route_code: 'HWH_TATA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '18525',
  train_name: 'Durg Express',
  category: 'EXPRESS',
  route_code: 'PNBE_RPR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '12834',
  train_name: 'Bilaspur SF Express',
  category: 'SUPERFAST',
  route_code: 'PNBE_BSP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12116',
  train_name: 'Siddheshwar Express',
  category: 'SUPERFAST',
  route_code: 'BCT_SUR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '17318',
  train_name: 'Lokmanya TT Express',
  category: 'EXPRESS',
  route_code: 'BCT_MRJ',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '22944',
  train_name: 'Indore SF Express',
  category: 'SUPERFAST',
  route_code: 'ADI_SUR',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '19309',
  train_name: 'Ujjain Express',
  category: 'EXPRESS',
  route_code: 'ADI_UJN',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '11407',
  train_name: 'Pune Nagpur Express',
  category: 'EXPRESS',
  route_code: 'PUNE_NGP',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '11050',
  train_name: 'Pune Raipur Express',
  category: 'EXPRESS',
  route_code: 'PUNE_RPR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '11013',
  train_name: 'Coimbatore Express',
  category: 'EXPRESS',
  route_code: 'MAS_CBE',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12674',
  train_name: 'Salem Express',
  category: 'EXPRESS',
  route_code: 'MAS_SA',
  base_fare_per_km: 1.3,
  fare_structure: { Sleeper: 550, '3A': 1300 }
},
{
  train_number: '12610',
  train_name: 'Chennai Express',
  category: 'SUPERFAST',
  route_code: 'SBC_MAS',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '16525',
  train_name: 'Island Express',
  category: 'EXPRESS',
  route_code: 'SBC_TVC',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '12722',
  train_name: 'Dakshin Express',
  category: 'SUPERFAST',
  route_code: 'HYB_NGP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '18636',
  train_name: 'Hatía Express',
  category: 'EXPRESS',
  route_code: 'HYB_RNC',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
// ====== BATCH 4 : TRAINS ======

{
  train_number: '12418',
  train_name: 'Prayagraj Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_ALD',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 600, '3A': 1500 }
},
{
  train_number: '12556',
  train_name: 'Gorakhdham Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_GKP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '12187',
  train_name: 'Jabalpur Garib Rath',
  category: 'GARIB_RATH',
  route_code: 'NDLS_JBP',
  base_fare_per_km: 1.4,
  fare_structure: { '3A': 1200 }
},
{
  train_number: '13020',
  train_name: 'Bagh Express',
  category: 'MAIL',
  route_code: 'HWH_BJU',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12344',
  train_name: 'Darjeeling SF',
  category: 'SUPERFAST',
  route_code: 'HWH_SGR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '18204',
  train_name: 'Betwa Express',
  category: 'EXPRESS',
  route_code: 'PNBE_DURG',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '18622',
  train_name: 'Patliputra Express',
  category: 'EXPRESS',
  route_code: 'PNBE_RNC',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12940',
  train_name: 'JP Pune Express',
  category: 'SUPERFAST',
  route_code: 'BCT_KOTA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '12111',
  train_name: 'Amravati Express',
  category: 'SUPERFAST',
  route_code: 'BCT_BPL',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '19808',
  train_name: 'Hadoti Express',
  category: 'EXPRESS',
  route_code: 'ADI_KOTA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '19314',
  train_name: 'Indore Jabalpur Exp',
  category: 'EXPRESS',
  route_code: 'ADI_JBP',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '12192',
  train_name: 'Pune Jabalpur SF',
  category: 'SUPERFAST',
  route_code: 'PUNE_JBP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '18230',
  train_name: 'Pune Bilaspur Exp',
  category: 'EXPRESS',
  route_code: 'PUNE_BSP',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '12658',
  train_name: 'Bangalore Mail',
  category: 'MAIL',
  route_code: 'MAS_SBC',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '16752',
  train_name: 'Rameswaram Express',
  category: 'EXPRESS',
  route_code: 'MAS_RMM',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '11021',
  train_name: 'Coimbatore SF',
  category: 'SUPERFAST',
  route_code: 'SBC_CBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1600 }
},
{
  train_number: '16236',
  train_name: 'Tuticorin Exp',
  category: 'EXPRESS',
  route_code: 'SBC_MDU',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '17234',
  train_name: 'Bhagyanagar Exp',
  category: 'EXPRESS',
  route_code: 'HYB_BZA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12774',
  train_name: 'Satavahana SF',
  category: 'SUPERFAST',
  route_code: 'HYB_TATA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
// ====== BATCH 5 : TRAINS (MULTIPLE PER ROUTE) ======

{
  train_number: '12309',
  train_name: 'Rajdhani Express',
  category: 'RAJDHANI',
  route_code: 'NDLS_BCT',
  base_fare_per_km: 2.0,
  fare_structure: { Sleeper: 850, '3A': 2200, '2A': 3000 }
},
{
  train_number: '12953',
  train_name: 'August Kranti Rajdhani',
  category: 'RAJDHANI',
  route_code: 'NDLS_BCT',
  base_fare_per_km: 2.1,
  fare_structure: { Sleeper: 900, '3A': 2300, '2A': 3200 }
},

{
  train_number: '12615',
  train_name: 'Grand Trunk Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_MAS',
  base_fare_per_km: 1.9,
  fare_structure: { Sleeper: 800, '3A': 2000 }
},
{
  train_number: '12433',
  train_name: 'Chennai Rajdhani',
  category: 'RAJDHANI',
  route_code: 'NDLS_MAS',
  base_fare_per_km: 2.2,
  fare_structure: { Sleeper: 900, '3A': 2400, '2A': 3300 }
},

{
  train_number: '12305',
  train_name: 'Howrah Rajdhani',
  category: 'RAJDHANI',
  route_code: 'HWH_NDLS',
  base_fare_per_km: 2.1,
  fare_structure: { Sleeper: 850, '3A': 2200, '2A': 3100 }
},
{
  train_number: '12303',
  train_name: 'Poorva Express',
  category: 'SUPERFAST',
  route_code: 'HWH_NDLS',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},

{
  train_number: '12802',
  train_name: 'Purushottam Express',
  category: 'EXPRESS',
  route_code: 'NDLS_PNBE',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12394',
  train_name: 'Sampoorna Kranti',
  category: 'SUPERFAST',
  route_code: 'NDLS_PNBE',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12723',
  train_name: 'Andhra Pradesh Express',
  category: 'SUPERFAST',
  route_code: 'HYB_NDLS',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '12603',
  train_name: 'Hyderabad Express',
  category: 'EXPRESS',
  route_code: 'HYB_NDLS',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '11077',
  train_name: 'Jhelum Express',
  category: 'EXPRESS',
  route_code: 'PUNE_JAT',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12169',
  train_name: 'Pune NZM SF',
  category: 'SUPERFAST',
  route_code: 'PUNE_JAT',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12295',
  train_name: 'Sanghamitra SF',
  category: 'SUPERFAST',
  route_code: 'MAS_PNBE',
  base_fare_per_km: 1.9,
  fare_structure: { Sleeper: 800, '3A': 1900 }
},
{
  train_number: '12322',
  train_name: 'Mithila Express',
  category: 'EXPRESS',
  route_code: 'MAS_PNBE',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
// ====== BATCH 6 : TRAINS (MULTI-TRAIN ROUTES) ======

{
  train_number: '12401',
  train_name: 'Magadh Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '12155',
  train_name: 'Bhopal SF Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},

{
  train_number: '12409',
  train_name: 'Gondwana SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_NGP',
  base_fare_per_km: 1.9,
  fare_structure: { Sleeper: 800, '3A': 1900 }
},
{
  train_number: '12621',
  train_name: 'Dakshin SF',
  category: 'EXPRESS',
  route_code: 'NDLS_NGP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '12810',
  train_name: 'Hatia SF',
  category: 'SUPERFAST',
  route_code: 'HWH_BPL',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '13026',
  train_name: 'Bhopal Mail',
  category: 'MAIL',
  route_code: 'HWH_BPL',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12357',
  train_name: 'Amritsar SF',
  category: 'SUPERFAST',
  route_code: 'PNBE_BPL',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '13201',
  train_name: 'Rajendra Nagar Exp',
  category: 'EXPRESS',
  route_code: 'PNBE_BPL',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12107',
  train_name: 'Vidarbha SF',
  category: 'SUPERFAST',
  route_code: 'BCT_NGP',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '11040',
  train_name: 'Maharashtra Exp',
  category: 'EXPRESS',
  route_code: 'BCT_NGP',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '22912',
  train_name: 'Shipra SF',
  category: 'SUPERFAST',
  route_code: 'ADI_BPL',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '19301',
  train_name: 'Indore Express',
  category: 'EXPRESS',
  route_code: 'ADI_BPL',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12169',
  train_name: 'Azad Hind Exp',
  category: 'SUPERFAST',
  route_code: 'PUNE_BPL',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '11058',
  train_name: 'Pune Patna Exp',
  category: 'EXPRESS',
  route_code: 'PUNE_BPL',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12616',
  train_name: 'Grand Trunk SF',
  category: 'SUPERFAST',
  route_code: 'MAS_NGP',
  base_fare_per_km: 1.9,
  fare_structure: { Sleeper: 800, '3A': 1900 }
},
{
  train_number: '16339',
  train_name: 'Nagarcoil Exp',
  category: 'EXPRESS',
  route_code: 'MAS_NGP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '16525',
  train_name: 'Island Express',
  category: 'EXPRESS',
  route_code: 'SBC_ET',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12628',
  train_name: 'Karnataka SF',
  category: 'SUPERFAST',
  route_code: 'SBC_ET',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
// ====== BATCH 7 : TRAINS ======

{
  train_number: '12391',
  train_name: 'Shramjeevi Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_GAYA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12818',
  train_name: 'Jharkhand SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_GAYA',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12367',
  train_name: 'Vikramshila Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BJU',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '15621',
  train_name: 'Barmer Guwahati Exp',
  category: 'EXPRESS',
  route_code: 'NDLS_BJU',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12307',
  train_name: 'Howrah Jodhpur SF',
  category: 'SUPERFAST',
  route_code: 'HWH_ALD',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},
{
  train_number: '13005',
  train_name: 'Amritsar Mail',
  category: 'MAIL',
  route_code: 'HWH_ALD',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '13225',
  train_name: 'Intercity Express',
  category: 'EXPRESS',
  route_code: 'PNBE_LKO',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12555',
  train_name: 'Gorakhdham SF',
  category: 'SUPERFAST',
  route_code: 'PNBE_LKO',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '22101',
  train_name: 'Rajya Rani Exp',
  category: 'EXPRESS',
  route_code: 'BCT_KYN',
  base_fare_per_km: 1.3,
  fare_structure: { Sleeper: 550, '3A': 1300 }
},
{
  train_number: '22109',
  train_name: 'Mumbai Suburban SF',
  category: 'SUPERFAST',
  route_code: 'BCT_KYN',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '22959',
  train_name: 'Vadodara SF',
  category: 'SUPERFAST',
  route_code: 'ADI_RTM',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '19303',
  train_name: 'Ratlam Express',
  category: 'EXPRESS',
  route_code: 'ADI_RTM',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '11027',
  train_name: 'Pune Solapur Exp',
  category: 'EXPRESS',
  route_code: 'PUNE_SUR',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '11417',
  train_name: 'Nagpur Pune Exp',
  category: 'EXPRESS',
  route_code: 'PUNE_SUR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12677',
  train_name: 'Ernakulam SF',
  category: 'SUPERFAST',
  route_code: 'MAS_SA',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '16187',
  train_name: 'Karaikal Exp',
  category: 'EXPRESS',
  route_code: 'MAS_SA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '16231',
  train_name: 'Mayiladuthurai Exp',
  category: 'EXPRESS',
  route_code: 'SBC_CBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '22638',
  train_name: 'West Coast SF',
  category: 'SUPERFAST',
  route_code: 'SBC_CBE',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
// ====== BATCH 8 : TRAINS ======

{
  train_number: '12155',
  train_name: 'Bhopal SF Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '12409',
  train_name: 'Gondwana SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_NGP',
  base_fare_per_km: 1.9,
  fare_structure: { Sleeper: 800, '3A': 1900 }
},

{
  train_number: '12391',
  train_name: 'Shramjeevi Express',
  category: 'EXPRESS',
  route_code: 'HWH_GAYA',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '12832',
  train_name: 'Dhauli Express',
  category: 'SUPERFAST',
  route_code: 'HWH_BBS',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '13246',
  train_name: 'Capital Express',
  category: 'EXPRESS',
  route_code: 'PNBE_BJU',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12394',
  train_name: 'Sampoorna Kranti',
  category: 'SUPERFAST',
  route_code: 'PNBE_CNB',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12901',
  train_name: 'Gujarat Mail',
  category: 'MAIL',
  route_code: 'BCT_ADI',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '11029',
  train_name: 'Deccan Express',
  category: 'EXPRESS',
  route_code: 'BCT_PUNE',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '22943',
  train_name: 'Udaipur SF Express',
  category: 'SUPERFAST',
  route_code: 'ADI_BCT',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12169',
  train_name: 'Pune SF Express',
  category: 'SUPERFAST',
  route_code: 'ADI_PUNE',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '11027',
  train_name: 'Solapur Express',
  category: 'EXPRESS',
  route_code: 'PUNE_SUR',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '11407',
  train_name: 'Pune Nagpur Express',
  category: 'EXPRESS',
  route_code: 'PUNE_NGP',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '17234',
  train_name: 'Bhagyanagar Express',
  category: 'EXPRESS',
  route_code: 'MAS_BZA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12842',
  train_name: 'Vizag Express',
  category: 'SUPERFAST',
  route_code: 'MAS_VSKP',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '12609',
  train_name: 'Chennai Mail',
  category: 'MAIL',
  route_code: 'SBC_MAS',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12710',
  train_name: 'Charminar Express',
  category: 'SUPERFAST',
  route_code: 'SBC_HYB',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '17231',
  train_name: 'Narsapur Express',
  category: 'EXPRESS',
  route_code: 'HYB_BZA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12721',
  train_name: 'Dakshin Express',
  category: 'SUPERFAST',
  route_code: 'HYB_NGP',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12106',
  train_name: 'Vidarbha Express',
  category: 'SUPERFAST',
  route_code: 'NGP_ET',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '22191',
  train_name: 'Indore Jabalpur Exp',
  category: 'EXPRESS',
  route_code: 'ET_BPL',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
// ====== BATCH 9 : TRAINS ======

{
  train_number: '12004',
  train_name: 'Lucknow Shatabdi',
  category: 'SHATABDI',
  route_code: 'NDLS_LKO',
  base_fare_per_km: 2.2,
  fare_structure: { CC: 900, EC: 1600 }
},
{
  train_number: '12583',
  train_name: 'Awadh Express',
  category: 'EXPRESS',
  route_code: 'NDLS_LKO',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12305',
  train_name: 'Poorva Express',
  category: 'SUPERFAST',
  route_code: 'HWH_PNBE',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '13007',
  train_name: 'U Abhatoofan Exp',
  category: 'MAIL',
  route_code: 'HWH_PNBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '18450',
  train_name: 'B Nath Dham Exp',
  category: 'EXPRESS',
  route_code: 'PNBE_BBS',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12802',
  train_name: 'Purushottam SF',
  category: 'SUPERFAST',
  route_code: 'PNBE_BBS',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12115',
  train_name: 'Siddheshwar SF',
  category: 'SUPERFAST',
  route_code: 'BCT_SUR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
{
  train_number: '11031',
  train_name: 'Solapur Exp',
  category: 'EXPRESS',
  route_code: 'BCT_SUR',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '22943',
  train_name: 'Udaipur SF',
  category: 'SUPERFAST',
  route_code: 'ADI_RJT',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1500 }
},
{
  train_number: '19567',
  train_name: 'Vivek Exp',
  category: 'EXPRESS',
  route_code: 'ADI_RJT',
  base_fare_per_km: 1.3,
  fare_structure: { Sleeper: 550, '3A': 1300 }
},

{
  train_number: '11020',
  train_name: 'Konark Express',
  category: 'EXPRESS',
  route_code: 'PUNE_MRJ',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '11404',
  train_name: 'Kolhapur Exp',
  category: 'EXPRESS',
  route_code: 'PUNE_MRJ',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '22692',
  train_name: 'Bangalore Rajdhani',
  category: 'RAJDHANI',
  route_code: 'MAS_CBE',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 800, '3A': 2000, '2A': 2800 }
},
{
  train_number: '11013',
  train_name: 'Coimbatore Exp',
  category: 'EXPRESS',
  route_code: 'MAS_CBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12609',
  train_name: 'Chennai Mail',
  category: 'MAIL',
  route_code: 'SBC_MAS',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12658',
  train_name: 'Bangalore Mail',
  category: 'MAIL',
  route_code: 'SBC_MAS',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '12773',
  train_name: 'Satavahana SF',
  category: 'SUPERFAST',
  route_code: 'HYB_BZA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '17201',
  train_name: 'Golconda Exp',
  category: 'EXPRESS',
  route_code: 'HYB_BZA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
// ====== BATCH 10 : TRAINS ======

{
  train_number: '12034',
  train_name: 'Kanpur Shatabdi',
  category: 'SHATABDI',
  route_code: 'NDLS_CNB',
  base_fare_per_km: 2.3,
  fare_structure: { CC: 950, EC: 1700 }
},
{
  train_number: '14114',
  train_name: 'Link Express',
  category: 'EXPRESS',
  route_code: 'NDLS_CNB',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '12313',
  train_name: 'Sealdah Rajdhani',
  category: 'RAJDHANI',
  route_code: 'HWH_KGP',
  base_fare_per_km: 2.0,
  fare_structure: { Sleeper: 850, '3A': 2200, '2A': 3000 }
},
{
  train_number: '12022',
  train_name: 'Kharagpur Shatabdi',
  category: 'SHATABDI',
  route_code: 'HWH_KGP',
  base_fare_per_km: 2.1,
  fare_structure: { CC: 900, EC: 1600 }
},

{
  train_number: '13330',
  train_name: 'Ganga Damodar Exp',
  category: 'EXPRESS',
  route_code: 'PNBE_GAYA',
  base_fare_per_km: 1.3,
  fare_structure: { Sleeper: 550, '3A': 1300 }
},
{
  train_number: '12390',
  train_name: 'Mahabodhi SF',
  category: 'SUPERFAST',
  route_code: 'PNBE_GAYA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '22107',
  train_name: 'Mumbai LTT SF',
  category: 'SUPERFAST',
  route_code: 'BCT_LTT',
  base_fare_per_km: 1.3,
  fare_structure: { Sleeper: 550, '3A': 1300 }
},
{
  train_number: '11005',
  train_name: 'Deccan Queen',
  category: 'SUPERFAST',
  route_code: 'BCT_KYN',
  base_fare_per_km: 1.4,
  fare_structure: { CC: 800 }
},

{
  train_number: '19324',
  train_name: 'Intercity Exp',
  category: 'EXPRESS',
  route_code: 'ADI_RTM',
  base_fare_per_km: 1.3,
  fare_structure: { Sleeper: 550, '3A': 1300 }
},
{
  train_number: '22943',
  train_name: 'Udaipur SF',
  category: 'SUPERFAST',
  route_code: 'ADI_RTM',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '11027',
  train_name: 'Solapur Exp',
  category: 'EXPRESS',
  route_code: 'PUNE_SUR',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12115',
  train_name: 'Siddheshwar SF',
  category: 'SUPERFAST',
  route_code: 'PUNE_SUR',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '16127',
  train_name: 'Guruvayur Exp',
  category: 'EXPRESS',
  route_code: 'MAS_SA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12679',
  train_name: 'Coimbatore SF',
  category: 'SUPERFAST',
  route_code: 'MAS_SA',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12702',
  train_name: 'Hussainsagar Exp',
  category: 'SUPERFAST',
  route_code: 'SBC_KZJ',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '17005',
  train_name: 'Hyderabad Exp',
  category: 'EXPRESS',
  route_code: 'SBC_KZJ',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '12740',
  train_name: 'Garib Rath',
  category: 'GARIB_RATH',
  route_code: 'HYB_KZJ',
  base_fare_per_km: 1.2,
  fare_structure: { '3A': 1100 }
},
{
  train_number: '12710',
  train_name: 'Satavahana SF',
  category: 'SUPERFAST',
  route_code: 'HYB_KZJ',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},
// ====== BATCH 11 : TRAINS ======

{
  train_number: '12003',
  train_name: 'Lucknow Shatabdi',
  category: 'SHATABDI',
  route_code: 'NDLS_LKO',
  base_fare_per_km: 2.2,
  fare_structure: { CC: 900, EC: 1600 }
},
{
  train_number: '12531',
  train_name: 'Lucknow Mail',
  category: 'MAIL',
  route_code: 'NDLS_LKO',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12155',
  train_name: 'Bhopal SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '11058',
  train_name: 'Bhopal Express',
  category: 'EXPRESS',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '12818',
  train_name: 'Jharkhand SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_RNC',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},
{
  train_number: '18624',
  train_name: 'Hatia Express',
  category: 'EXPRESS',
  route_code: 'NDLS_RNC',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12556',
  train_name: 'Gorakhdham SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_GKP',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},
{
  train_number: '15015',
  train_name: 'Gorakhpur Express',
  category: 'EXPRESS',
  route_code: 'NDLS_GKP',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12303',
  train_name: 'Poorva Express',
  category: 'SUPERFAST',
  route_code: 'HWH_PNBE',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '13007',
  train_name: 'U Abhatoofan Exp',
  category: 'MAIL',
  route_code: 'HWH_PNBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '18616',
  train_name: 'Kriya Yoga Exp',
  category: 'EXPRESS',
  route_code: 'HWH_RNC',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12810',
  train_name: 'Hatia SF',
  category: 'SUPERFAST',
  route_code: 'HWH_RNC',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '12390',
  train_name: 'Mahabodhi SF',
  category: 'SUPERFAST',
  route_code: 'PNBE_GAYA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '13330',
  train_name: 'Ganga Damodar',
  category: 'EXPRESS',
  route_code: 'PNBE_GAYA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '18450',
  train_name: 'Baijnath Dham Exp',
  category: 'EXPRESS',
  route_code: 'PNBE_BBS',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '12802',
  train_name: 'Purushottam SF',
  category: 'SUPERFAST',
  route_code: 'PNBE_BBS',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 750, '3A': 1700 }
},

{
  train_number: '12658',
  train_name: 'Bangalore Mail',
  category: 'MAIL',
  route_code: 'MAS_SBC',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12027',
  train_name: 'Chennai Shatabdi',
  category: 'SHATABDI',
  route_code: 'MAS_SBC',
  base_fare_per_km: 2.1,
  fare_structure: { CC: 900, EC: 1600 }
},
// ====== BATCH 12 : TRAINS ======

{
  train_number: '12156',
  train_name: 'Bhopal SF Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.8,
  fare_structure: { Sleeper: 750, '3A': 1800 }
},
{
  train_number: '11057',
  train_name: 'Bhopal Express',
  category: 'EXPRESS',
  route_code: 'NDLS_BPL',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},

{
  train_number: '12004',
  train_name: 'Lucknow Shatabdi',
  category: 'SHATABDI',
  route_code: 'NDLS_LKO',
  base_fare_per_km: 2.2,
  fare_structure: { CC: 900, EC: 1600 }
},
{
  train_number: '12532',
  train_name: 'Lucknow Mail',
  category: 'MAIL',
  route_code: 'NDLS_LKO',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12304',
  train_name: 'Poorva Express',
  category: 'SUPERFAST',
  route_code: 'NDLS_PNBE',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '13238',
  train_name: 'Patna Express',
  category: 'EXPRESS',
  route_code: 'NDLS_PNBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12390',
  train_name: 'Mahabodhi SF',
  category: 'SUPERFAST',
  route_code: 'NDLS_GAYA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1600 }
},
{
  train_number: '13329',
  train_name: 'Ganga Damodar Exp',
  category: 'EXPRESS',
  route_code: 'NDLS_GAYA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},

{
  train_number: '12303',
  train_name: 'Poorva Express',
  category: 'SUPERFAST',
  route_code: 'HWH_PNBE',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '13007',
  train_name: 'U Abhatoofan Exp',
  category: 'MAIL',
  route_code: 'HWH_PNBE',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '11029',
  train_name: 'Deccan Express',
  category: 'EXPRESS',
  route_code: 'BCT_PUNE',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12124',
  train_name: 'Intercity SF',
  category: 'SUPERFAST',
  route_code: 'BCT_PUNE',
  base_fare_per_km: 1.5,
  fare_structure: { CC: 750 }
},

{
  train_number: '22911',
  train_name: 'Shipra SF',
  category: 'SUPERFAST',
  route_code: 'ADI_BPL',
  base_fare_per_km: 1.7,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},
{
  train_number: '19301',
  train_name: 'Indore Express',
  category: 'EXPRESS',
  route_code: 'ADI_BPL',
  base_fare_per_km: 1.5,
  fare_structure: { Sleeper: 650, '3A': 1500 }
},

{
  train_number: '12658',
  train_name: 'Bangalore Mail',
  category: 'MAIL',
  route_code: 'MAS_SBC',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12028',
  train_name: 'Chennai Shatabdi',
  category: 'SHATABDI',
  route_code: 'MAS_SBC',
  base_fare_per_km: 2.1,
  fare_structure: { CC: 900, EC: 1600 }
},

{
  train_number: '17233',
  train_name: 'Bhagyanagar Exp',
  category: 'EXPRESS',
  route_code: 'HYB_BZA',
  base_fare_per_km: 1.4,
  fare_structure: { Sleeper: 600, '3A': 1400 }
},
{
  train_number: '12774',
  train_name: 'Satavahana SF',
  category: 'SUPERFAST',
  route_code: 'HYB_BZA',
  base_fare_per_km: 1.6,
  fare_structure: { Sleeper: 700, '3A': 1700 }
},

    ];

    const uniqueTrains = [];
    const seenTrainNumbers = new Set();

    for (const train of TRAINS) {
      if (!seenTrainNumbers.has(train.train_number)) {
        seenTrainNumbers.add(train.train_number);
        uniqueTrains.push(train);
      }
    }

    const trainsToInsert = uniqueTrains
      .filter(t => !existingTrainNumbers.includes(t.train_number))
      .map(t => {
        const routeId = routeMap[t.route_code];
        if (!routeId) return null;

        return {
          train_number: t.train_number,
          train_name: t.train_name,
          category: t.category,
          route_id: routeId,
          base_fare_per_km: t.base_fare_per_km,
          fare_structure: JSON.stringify(t.fare_structure),
        };
      })
      .filter(Boolean);

    if (trainsToInsert.length) {
      await queryInterface.bulkInsert('trains', trainsToInsert);
      console.log(`✅ Inserted ${trainsToInsert.length} trains (skipped ${TRAINS.length - uniqueTrains.length} duplicate train definitions)`);
    } else {
      console.log('✅ No new trains to insert');
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('trains', null);
  }
};
