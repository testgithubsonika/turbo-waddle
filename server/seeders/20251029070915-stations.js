'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingStations = await queryInterface.sequelize.query(
      'SELECT station_code FROM stations;',
      { type: Sequelize.QueryTypes.SELECT }
    );
//
    const existingCodes = existingStations.map(s => s.station_code);

    const newStations = [
      { station_code: 'NDLS', station_name: 'New Delhi', city: 'Delhi', state: 'Delhi' },
      { station_code: 'BCT', station_name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
{ station_code: 'HWH', station_name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
      { station_code: 'MAS', station_name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
      { station_code: 'SBC', station_name: 'Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
      { station_code: 'LKO', station_name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh' },
      { station_code: 'ADI', station_name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
      { station_code: 'BBS', station_name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha' },
      { station_code: 'PUNE', station_name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
      { station_code: 'NGP', station_name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra' },
      { station_code: 'CNB', station_name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
      { station_code: 'BPL', station_name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh' },
      { station_code: 'JP', station_name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
      { station_code: 'CSTM', station_name: 'Chhatrapati Shivaji Terminus', city: 'Mumbai', state: 'Maharashtra' },
      { station_code: 'GAYA', station_name: 'Gaya Junction', city: 'Gaya', state: 'Bihar' },
      { station_code: 'VSKP', station_name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
      { station_code: 'TVC', station_name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala' },
      { station_code: 'RNC', station_name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand' },
      { station_code: 'GKP', station_name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh' },
      { station_code: 'PNBE', station_name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
      { station_code: 'ERS', station_name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala' },
      { station_code: 'LTT', station_name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra' },
      { station_code: 'UHP', station_name: 'Udhampur', city: 'Udhampur', state: 'Jammu and Kashmir' },
      { station_code: 'DBRG', station_name: 'Dibrugarh', city: 'Dibrugarh', state: 'Assam' },
      { station_code: 'JAT', station_name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir' },
      { station_code: 'ASR', station_name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab' },
      { station_code: 'UMB', station_name: 'Ambala Cantt Junction', city: 'Ambala', state: 'Haryana' },
      { station_code: 'GHY', station_name: 'Guwahati', city: 'Guwahati', state: 'Assam' },
      { station_code: 'JBP', station_name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh' },
      { station_code: 'KGP', station_name: 'Kharagpur Junction', city: 'Kharagpur', state: 'West Bengal' },
      { station_code: 'SUR', station_name: 'Solapur Junction', city: 'Solapur', state: 'Maharashtra' },
      { station_code: 'MDU', station_name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu' },
      { station_code: 'RTM', station_name: 'Ratlam Junction', city: 'Ratlam', state: 'Madhya Pradesh' },
      { station_code: 'BKN', station_name: 'Bikaner Junction', city: 'Bikaner', state: 'Rajasthan' },
      { station_code: 'ET', station_name: 'Itarsi Junction', city: 'Itarsi', state: 'Madhya Pradesh' },
      { station_code: 'DNR', station_name: 'Danapur', city: 'Patna', state: 'Bihar' },
      { station_code: 'ALD', station_name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh' },
      { station_code: 'KYN', station_name: 'Kalyan Junction', city: 'Kalyan', state: 'Maharashtra' },
      { station_code: 'FDB', station_name: 'Faridabad', city: 'Faridabad', state: 'Haryana' },
      { station_code: 'KOTA', station_name: 'Kota Junction', city: 'Kota', state: 'Rajasthan' },
      { station_code: 'BJU', station_name: 'Barauni Junction', city: 'Begusarai', state: 'Bihar' },
      { station_code: 'AII', station_name: 'Ajmer Junction', city: 'Ajmer', state: 'Rajasthan' },
      { station_code: 'BWN', station_name: 'Barddhaman Junction', city: 'Barddhaman', state: 'West Bengal' },
      { station_code: 'BZA', station_name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh' },
      { station_code: 'RJT', station_name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat' },   
      { station_code: 'SGR', station_name: 'Siliguri Junction', city: 'Siliguri', state: 'West Bengal' },
      { station_code: 'TATA', station_name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand' },
      { station_code: 'UJN', station_name: 'Ujjain Junction', city: 'Ujjain', state: 'Madhya Pradesh' },
      { station_code: 'KZJ', station_name: 'Kazipet Junction', city: 'Kazipet', state: 'Telangana' },
      { station_code: 'BBSR', station_name: 'Balasore', city: 'Balasore', state: 'Odisha' },
      { station_code: 'WL', station_name: 'Warangal', city: 'Warangal', state: 'Telangana' },
      { station_code: 'RMM', station_name: 'Rameswaram', city: 'Rameswaram', state: 'Tamil Nadu' },
      { station_code: 'SA', station_name: 'Salem Junction', city: 'Salem', state: 'Tamil Nadu' },
      { station_code: 'NJP', station_name: 'New Jalpaiguri', city: 'Siliguri', state: 'West Bengal' },
      { station_code: 'DDN', station_name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand' },
      { station_code: 'BE', station_name: 'Bareilly Junction', city: 'Bareilly', state: 'Uttar Pradesh' },
      { station_code: 'RPR', station_name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh' },
      { station_code: 'BSP', station_name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh' },
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
      { station_code: 'SC', station_name: 'Secunderabad Junction', city: 'Secunderabad', state: 'Telangana' },
      { station_code: 'DURG', station_name: 'Durg Junction', city: 'Durg', state: 'Chhattisgarh' },
      { station_code: 'MRJ', station_name: 'Miraj Junction', city: 'Miraj', state: 'Maharashtra' },
      { station_code: 'BDTS', station_name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra' },
      { station_code: 'CBE', station_name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu' },
    ].filter(s => !existingCodes.includes(s.station_code));

    if (newStations.length > 0) {
      await queryInterface.bulkInsert('stations', newStations, {});
    } else {
      console.log('✅ No new stations to insert.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stations', null, {});
  }
};


