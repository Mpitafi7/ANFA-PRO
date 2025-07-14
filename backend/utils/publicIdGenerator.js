// Generate unique public user ID
function generatePublicId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'u_';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate public ID format
function isValidPublicId(publicId) {
  const pattern = /^u_[a-z0-9]{6}$/;
  return pattern.test(publicId);
}

// Sanitize public ID input
function sanitizePublicId(input) {
  if (!input) return null;
  const sanitized = input.toLowerCase().trim();
  return isValidPublicId(sanitized) ? sanitized : null;
}

module.exports = {
  generatePublicId,
  isValidPublicId,
  sanitizePublicId
}; 