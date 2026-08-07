const test = require('node:test');
const assert = require('node:assert/strict');
const { buildComplaintImageRecord } = require('../utils/complaintImage');

test('buildComplaintImageRecord returns a normalized complaint image record', () => {
  const record = buildComplaintImageRecord(
    { originalname: 'issue-photo.JPG', mimetype: 'image/jpeg' },
    '/uploads/complaints/issue-photo-123.JPG'
  );

  assert.equal(record.filename, 'issue-photo.JPG');
  assert.equal(record.path, '/uploads/complaints/issue-photo-123.JPG');
  assert.equal(record.mimetype, 'image/jpeg');
  assert.ok(record.uploadedAt instanceof Date);
});
