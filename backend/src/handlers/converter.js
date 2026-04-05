/**
 * Converter node handler.
 * Transforms data from input format to output format.
 */
async function execute(data, inputs, log) {
  const { inputFormat = 'AAS JSON', outputFormat = 'DPP JSON', mapping = '{}' } = data;

  log('info', `Converting from ${inputFormat} → ${outputFormat}`);

  let mappingRules = {};
  try { mappingRules = JSON.parse(mapping); } catch { /* ignore invalid JSON */ }

  const input = inputs[0] || {};
  let output = {};

  if (inputFormat.includes('AAS') && outputFormat.includes('DPP')) {
    output = aasToDP(input, mappingRules);
    log('info', 'Applied AAS → Digital Product Passport transformation');
  } else if (inputFormat === outputFormat) {
    output = { ...input, _passthrough: true };
    log('warn', 'Input/output formats are the same — passing data through unchanged');
  } else {
    // Generic field remapping
    if (Object.keys(mappingRules).length > 0) {
      output = applyMapping(input, mappingRules);
      log('info', `Applied ${Object.keys(mappingRules).length} custom field mapping rule(s)`);
    } else {
      output = { ...input, _converted: true, inputFormat, outputFormat };
      log('warn', 'No mapping rules defined — copying input data as-is');
    }
  }

  log('success', `Conversion complete. Output has ${Object.keys(output).length} top-level field(s).`);
  return output;
}

function aasToDP(aasData, mapping) {
  // Extract submodel elements into a flat DPP JSON structure
  const elements = aasData?.submodelElements || [];
  const dpp = {
    '@context': 'https://www.w3.org/2018/credentials/v1',
    type: 'DigitalProductPassport',
    id: `urn:dpp:${Date.now()}`,
    generatedAt: new Date().toISOString(),
    product: {},
    sustainability: {},
    materials: [],
  };

  elements.forEach(el => {
    if (el.idShort === 'ProductIdentifier') dpp.product.id = el.value;
    else if (el.idShort === 'ManufacturerName') dpp.product.manufacturer = el.value;
    else if (el.idShort === 'MaterialComposition') dpp.materials.push({ description: el.value });
    else if (el.idShort === 'CarbonFootprint') dpp.sustainability.carbonFootprint = parseFloat(el.value);
    else if (el.idShort === 'RecyclabilityRate') dpp.sustainability.recyclabilityRate = parseFloat(el.value);
    else dpp.product[el.idShort] = el.value;
  });

  // Apply custom field overrides from mapping rules
  Object.entries(mapping).forEach(([src, dest]) => {
    if (aasData[src] !== undefined) dpp[dest] = aasData[src];
  });

  return dpp;
}

function applyMapping(input, rules) {
  const output = {};
  Object.entries(rules).forEach(([src, dest]) => {
    if (input[src] !== undefined) output[dest] = input[src];
    else output[dest] = null;
  });
  // Copy unmapped fields
  Object.entries(input).forEach(([k, v]) => {
    if (!rules[k]) output[k] = v;
  });
  return output;
}

module.exports = { execute };
