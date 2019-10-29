import { generateSessionToken, validateSessionToken } from '../src';

const SIGNING_KEY = 'My secret';

test('unmodified session token is valid', () => {
  const sessionToken = generateSessionToken(SIGNING_KEY);
  expect(validateSessionToken(sessionToken, SIGNING_KEY)).toBe(true);
});

test('modified session token is invalid', () => {
  const sessionToken = generateSessionToken(SIGNING_KEY);
  const modifiedSessionToken = 'hello' + sessionToken;
  expect(validateSessionToken(modifiedSessionToken, SIGNING_KEY)).toBe(false);
});

test('unmodified session token with different signing key is invalid', () => {
  const sessionToken = generateSessionToken('Your secret');
  expect(validateSessionToken(sessionToken, SIGNING_KEY)).toBe(false);
});
