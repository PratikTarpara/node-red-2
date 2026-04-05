/**
 * Submodel node handler.
 * Extracts or validates a specific submodel from AAS server output.
 */
async function execute(data, inputs, log) {
  const { semanticId, submodelIdShort, schemaType } = data;

  log('info', `Processing submodel: ${submodelIdShort} (${schemaType})`);
  log('info', `Semantic ID: ${semanticId}`);

  // Try to find submodel data from upstream input (AAS Server output)
  const aasData = inputs.find(i => i?.shells || i?.simulated);
  let submodelData = null;

  if (aasData?.shells?.length) {
    const shell = aasData.shells[0];
    log('info', `Using upstream AAS shell: ${shell.id || 'unknown'}`);
    submodelData = {
      idShort: submodelIdShort,
      semanticId: { type: 'ExternalReference', keys: [{ type: 'GlobalReference', value: semanticId }] },
      schemaType,
      source: shell.id,
    };
  } else {
    // Simulate submodel structure
    log('warn', 'No upstream AAS data — generating simulated submodel.');
    submodelData = simulateSubmodel(schemaType, submodelIdShort, semanticId);
  }

  log('success', `Submodel "${submodelIdShort}" resolved successfully.`);
  return submodelData;
}

function simulateSubmodel(schemaType, idShort, semanticId) {
  const base = {
    modelType: 'Submodel',
    idShort,
    semanticId: { type: 'ExternalReference', keys: [{ type: 'GlobalReference', value: semanticId }] },
    submodelElements: [],
  };

  if (schemaType === 'DPP') {
    base.submodelElements = [
      { modelType: 'Property', idShort: 'ProductIdentifier', valueType: 'xs:string', value: 'EX-PRODUCT-001' },
      { modelType: 'Property', idShort: 'ManufacturerName', valueType: 'xs:string', value: 'Example Manufacturer GmbH' },
      { modelType: 'Property', idShort: 'MaterialComposition', valueType: 'xs:string', value: 'Aluminium 70%, Copper 30%' },
      { modelType: 'Property', idShort: 'CarbonFootprint', valueType: 'xs:float', value: '12.5' },
      { modelType: 'Property', idShort: 'RecyclabilityRate', valueType: 'xs:float', value: '0.85' },
    ];
  } else if (schemaType === 'TechnicalData') {
    base.submodelElements = [
      { modelType: 'Property', idShort: 'Weight', valueType: 'xs:float', value: '2.3' },
      { modelType: 'Property', idShort: 'Dimensions', valueType: 'xs:string', value: '200x150x50 mm' },
    ];
  } else {
    base.submodelElements = [
      { modelType: 'Property', idShort: 'CustomField', valueType: 'xs:string', value: 'CustomValue' },
    ];
  }
  return base;
}

module.exports = { execute };
