const test = require('node:test');
const assert = require('node:assert/strict');
const { validateConsultationRequest } = require('../utils/consultationRequest');

test('accepts a future consultation request', () => {
  const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const futureDateString = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`;
  const futureTime = `${String(futureDate.getHours()).padStart(2, '0')}:${String(futureDate.getMinutes()).padStart(2, '0')}`;

  const result = validateConsultationRequest({
    preferredDate: futureDateString,
    preferredTime: futureTime,
    reason: 'Need guidance on a service application',
    alternateEmail: 'alternate@example.com'
  });

  assert.equal(result.reason, 'Need guidance on a service application');
  assert.equal(result.alternateEmail, 'alternate@example.com');
  assert.ok(result.preferredDateTime instanceof Date);
});

test('rejects a past consultation request', () => {
  const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const pastDateString = `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${String(pastDate.getDate()).padStart(2, '0')}`;
  const pastTime = `${String(pastDate.getHours()).padStart(2, '0')}:${String(pastDate.getMinutes()).padStart(2, '0')}`;

  assert.throws(() => {
    validateConsultationRequest({
      preferredDate: pastDateString,
      preferredTime: pastTime,
      reason: 'Need guidance on a service application'
    });
  }, /future/i);
});

test('rejects an invalid alternate email', () => {
  assert.throws(() => {
    validateConsultationRequest({
      preferredDate: '2099-01-01',
      preferredTime: '14:00',
      reason: 'Need guidance',
      alternateEmail: 'not-an-email'
    });
  }, /alternate email/i);
});
