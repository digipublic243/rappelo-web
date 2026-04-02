export const CONGO_PHONE_PREFIX = "+243";
export const LOCAL_PHONE_LENGTH = 9;

export function extractLocalPhoneDigits(input: string) {
  return input.replace(/\D/g, "").slice(-LOCAL_PHONE_LENGTH);
}

export function toPrefixedPhoneNumber(input: string, prefix = CONGO_PHONE_PREFIX) {
  const digits = extractLocalPhoneDigits(input);
  return digits ? `${prefix}${digits}` : prefix;
}

export function toBackendPhoneNumber(input: string) {
  const digits = extractLocalPhoneDigits(input);
  if (digits.length !== LOCAL_PHONE_LENGTH) {
    return null;
  }

  return `${CONGO_PHONE_PREFIX}${digits}`;
}

export function formatPhonePreview(input: string) {
  const digits = extractLocalPhoneDigits(input);
  return digits ? `${CONGO_PHONE_PREFIX} ${digits}` : `${CONGO_PHONE_PREFIX} ---------`;
}
