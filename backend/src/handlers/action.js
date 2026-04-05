/**
 * Action node handler.
 * Dispatches read / write / validate / transform actions.
 */
async function execute(data, inputs, log) {
  const { actionType = 'read', target = '', parameters = '{}' } = data;

  let params = {};
  try { params = JSON.parse(parameters); } catch { /* ignore */ }

  log('info', `Executing action: ${actionType.toUpperCase()}${target ? ` on "${target}"` : ''}`);

  const input = inputs[0] || {};
  let output = {};

  switch (actionType) {
    case 'read': {
      // Read a field value from upstream data using dot-notation target
      if (!target) {
        output = { ...input, _action: 'read', _result: 'No target specified — returning all data' };
        log('warn', 'No target specified — returning all upstream data');
      } else {
        const value = getNestedValue(input, target);
        output = { target, value, _action: 'read' };
        log('success', `Read "${target}": ${JSON.stringify(value)}`);
      }
      break;
    }
    case 'write': {
      // Write/merge parameters into the data
      output = { ...input, ...params, _action: 'write', _writtenAt: new Date().toISOString() };
      log('success', `Wrote ${Object.keys(params).length} field(s) to data`);
      break;
    }
    case 'validate': {
      const errors = validateData(input, params);
      output = { ...input, _action: 'validate', valid: errors.length === 0, errors };
      if (errors.length > 0) {
        log('warn', `Validation found ${errors.length} issue(s): ${errors.join(', ')}`);
      } else {
        log('success', 'Validation passed — all required fields present');
      }
      break;
    }
    case 'transform': {
      output = transformData(input, params, log);
      log('success', `Transform applied. Output: ${JSON.stringify(output).slice(0, 100)}...`);
      break;
    }
    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }

  return output;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function validateData(data, rules) {
  const errors = [];
  const required = rules.required || [];
  required.forEach(field => {
    if (getNestedValue(data, field) === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  return errors;
}

function transformData(data, rules, log) {
  const result = { ...data };
  if (rules.rename) {
    Object.entries(rules.rename).forEach(([from, to]) => {
      if (result[from] !== undefined) {
        result[to] = result[from];
        delete result[from];
        log('info', `Renamed field "${from}" → "${to}"`);
      }
    });
  }
  if (rules.remove) {
    rules.remove.forEach(field => {
      delete result[field];
      log('info', `Removed field "${field}"`);
    });
  }
  if (rules.add) {
    Object.entries(rules.add).forEach(([k, v]) => {
      result[k] = v;
      log('info', `Added field "${k}": ${v}`);
    });
  }
  result._transformedAt = new Date().toISOString();
  return result;
}

module.exports = { execute };
