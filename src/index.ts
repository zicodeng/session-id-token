import crypto from 'crypto';

// Length of the session ID portion
const ID_LENGTH = 32;

/**
 * Generate a digitally-signed session ID (a.k.a session token).
 * This is a base64 URL encoded string created from a byte slice
 * where the first `ID_LENGTH` bytes are crytographically random
 * bytes representing the unique session ID, and the remaining bytes
 * are an HMAC hash of those ID bytes (i.e., a digital signature).
 * The byte slice layout is like so:
 * +-----------------------------------------------------+
 * |...32 crypto random bytes...|HMAC hash of those bytes|
 * +-----------------------------------------------------+
 */
export const generateSessionToken = (signingKey: string): string => {
  if (!signingKey) {
    throw new Error('Signing key is required');
  }

  // Cryptographically random bytes
  const sessionId = crypto.randomBytes(ID_LENGTH);

  // Create a new HMAC hasher
  const hmac = crypto.createHmac('sha256', signingKey);

  // Calculate the HMAC signature
  const signature = Buffer.from(hmac.update(sessionId).digest('base64'));

  // Decoded session token
  const sessionTokenBytes = Buffer.concat([sessionId, signature]);

  // Generate a new "base64 based and digitally signed Session ID",
  // which will be our session token
  const sessionToken = sessionTokenBytes.toString('base64');

  return sessionToken;
};

/**
 * Validate session token string,
 * using the `signingKey` as the HMAC signing key
 */
export const validateSessionToken = (
  sessionToken: string,
  signingKey: string,
): boolean => {
  if (!signingKey) {
    throw new Error('Signing key is required');
  }

  // Base64 decode the session token to a slice of bytes
  const sessionTokenBytes = Buffer.from(sessionToken, 'base64');

  // Get the old session ID and its signature
  const sessionId = sessionTokenBytes.slice(0, ID_LENGTH);
  const oldSignature = sessionTokenBytes.slice(ID_LENGTH);

  // Create a new HMAC hasher
  const hmac = crypto.createHmac('sha256', signingKey);

  // Calculate a new HMAC signature
  const newSignature = Buffer.from(hmac.update(sessionId).digest('base64'));

  // If the old HMAC signature and new one are not equal,
  // it means this session token is invalid
  if (Buffer.compare(oldSignature, newSignature)) {
    return false;
  }

  return true;
};
