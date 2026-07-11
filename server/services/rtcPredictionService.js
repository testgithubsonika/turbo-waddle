const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

function buildRtcPredictionPayload({ train, classType, quota, availability }) {
  let currentStatus;

  if (availability.available_seats > 0) {
    currentStatus = 'CNF';
  } else if (availability.rac_used < availability.rac_limit) {
    currentStatus = 'RAC';
  } else {
    currentStatus = 'WL';
  }

  return {
    class: classType,
    quota,
    wl_used: Number(availability.wl_used || 0),
    available_seats: Number(availability.available_seats || 0),
    current_status: currentStatus,
    train_category: String(train?.category || train?.trainType || 'EXPRESS'),
  };
}

async function sendRtcPrediction(payload) {
  if (!payload) return null;

  const isSinglePayload = !Array.isArray(payload);
  const batchPayload = isSinglePayload ? [payload] : payload;

  console.log('Sending payload:', JSON.stringify(batchPayload, null, 2));

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-batch`, batchPayload, {
      timeout: 4000,
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (isSinglePayload) {
      return response.data?.[0] ?? null;
    }

    return response.data;
  } catch (err) {
    console.log('==============');
    console.log('AI ERROR');
    console.log(err.message);
    console.log(err.response?.status);
    console.log(err.response?.data);
    console.log('==============');
    return null;
  }
}

module.exports = {
  buildRtcPredictionPayload,
  sendRtcPrediction,
};
