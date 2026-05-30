'use strict';

const axios = require('axios');
const { ELEVENLABS_API_KEY, ELEVENLABS_BASE_URL } = require('./config');

const client = axios.create({
  baseURL: ELEVENLABS_BASE_URL,
  headers: {
    'xi-api-key': ELEVENLABS_API_KEY,
  },
  timeout: 120000,
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response ? err.response.status : 'NO_RESPONSE';
    const detail = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`[ElevenLabs API] Error ${status}: ${detail}`);
    return Promise.reject(err);
  }
);

module.exports = client;
