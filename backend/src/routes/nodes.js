const express = require('express');
const router = express.Router();

const NODE_TYPE_DEFINITIONS = [
  {
    type: 'aasServer',
    label: 'AAS Server',
    description: 'Connect to an Asset Administration Shell server (e.g. Eclipse BaSyx)',
    color: '#3b82f6',
    inputs: 0,
    outputs: 1,
    configFields: ['endpoint', 'authType', 'username', 'password', 'token'],
  },
  {
    type: 'submodel',
    label: 'Submodel',
    description: 'Represents an AAS Submodel such as a Digital Product Passport',
    color: '#10b981',
    inputs: 1,
    outputs: 1,
    configFields: ['semanticId', 'submodelIdShort', 'schemaType'],
  },
  {
    type: 'converter',
    label: 'Converter',
    description: 'Transform data between formats (e.g. AAS JSON → DPP JSON)',
    color: '#f59e0b',
    inputs: 1,
    outputs: 1,
    configFields: ['inputFormat', 'outputFormat', 'mapping'],
  },
  {
    type: 'action',
    label: 'Action',
    description: 'Perform read / write / validate / transform actions on data',
    color: '#8b5cf6',
    inputs: 1,
    outputs: 1,
    configFields: ['actionType', 'target', 'parameters'],
  },
];

router.get('/types', (req, res) => {
  res.json(NODE_TYPE_DEFINITIONS);
});

module.exports = router;
