export function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function calculateOtpExpiry(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
