const { generateSessionToken, isSessionTokenValid } = require('./index');

const SIGNING_KEY = 'My secret';

test('unmodified session token is valid', () => {
  const sessionToken = generateSessionToken(SIGNING_KEY);
  expect(isSessionTokenValid(sessionToken, SIGNING_KEY)).toBe(true);
});

test('modified session token is invalid', () => {
  const sessionToken = generateSessionToken(SIGNING_KEY);
  const modifiedSessionToken = 'hello' + sessionToken;
  expect(isSessionTokenValid(modifiedSessionToken, SIGNING_KEY)).toBe(false);
});

test('unmodified session token with different signing key is invalid', () => {
  const sessionToken = generateSessionToken('Your secret');
  expect(isSessionTokenValid(sessionToken, SIGNING_KEY)).toBe(false);
});
