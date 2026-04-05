const axios = require('axios');

/**
 * AAS Server node handler.
 * Attempts to connect to the AAS server and fetch available shells or return metadata.
 */
async function execute(data, inputs, log) {
  const { endpoint = 'http://localhost:4000', authType = 'none', username, password, token } = data;

  log('info', `Connecting to AAS Server at ${endpoint}`);

  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (authType === 'basic' && username && password) {
    const encoded = Buffer.from(`${username}:${password}`).toString('base64');
    headers['Authorization'] = `Basic ${encoded}`;
  } else if (authType === 'bearer' && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let result;
  try {
    const response = await axios.get(`${endpoint}/shells`, { headers, timeout: 8000 });
    const shells = response.data?.result || response.data || [];
    const count = Array.isArray(shells) ? shells.length : '?';
    log('success', `Connected to AAS server. Found ${count} Asset Administration Shell(s).`);
    result = { endpoint, shells };
  } catch (err) {
    // If server is unreachable, return simulated data for demo
    log('warn', `Could not reach AAS server (${err.message}). Using simulated response.`);
    result = {
      endpoint,
      simulated: true,
      shells: [
        {
          id: 'ExampleAAS-001',
          assetInformation: { globalAssetId: 'urn:example:asset:001' },
          submodels: [{ type: 'ExternalReference', keys: [{ type: 'Submodel', value: 'urn:example:submodel:DPP' }] }],
        },
      ],
    };
  }

  return result;
}

module.exports = { execute };
