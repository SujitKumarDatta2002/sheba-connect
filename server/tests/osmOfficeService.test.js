const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyServiceForOfficeSearch } = require('../services/osmOfficeService');

test('maps passport services to passport-specific office keywords', () => {
  const result = classifyServiceForOfficeSearch({ name: 'E-Passport Application', department: 'Passport Office' });

  assert.equal(result.category, 'passport');
  assert.deepEqual(result.keywords, ['passport', 'immigration', 'passport office']);
});

test('maps birth certificate services to civic registration keywords', () => {
  const result = classifyServiceForOfficeSearch({ name: 'Birth Certificate Application', department: 'Municipal Services' });

  assert.equal(result.category, 'birth');
  assert.deepEqual(result.keywords, ['birth', 'certificate', 'registration', 'municipality', 'city corporation', 'union parishad', 'registrar']);
});

test('maps nid services to election office keywords', () => {
  const result = classifyServiceForOfficeSearch({ name: 'NID Registration', department: 'Election Commission' });

  assert.equal(result.category, 'nid');
  assert.deepEqual(result.keywords, ['nid', 'election', 'voter', 'national id', 'electoral']);
});

test('maps driving licence services to BRTA before considering certificate words', () => {
  const result = classifyServiceForOfficeSearch({ name: 'Driving License Certificate', department: 'BRTA' });

  assert.equal(result.category, 'driving');
  assert.ok(result.keywords.includes('brta'));
});

test('uses service-configured office keywords before inferred keywords', () => {
  const result = classifyServiceForOfficeSearch({
    name: 'Electricity Bill Payment',
    department: 'Electricity',
    officeSearchCategory: 'electricity-provider',
    officeSearchKeywords: ['DPDC', 'DESCO', 'BREB']
  });

  assert.equal(result.category, 'electricity-provider');
  assert.deepEqual(result.keywords, ['dpdc', 'desco', 'breb']);
});
