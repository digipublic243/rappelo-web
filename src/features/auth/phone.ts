export const CONGO_PHONE_PREFIX = "+243";
export const LOCAL_PHONE_LENGTH = 9;

function extractDigits(input: string) {
  return input.replace(/\D/g, "");
}

export function extractLocalPhoneDigits(input: string) {
  const digits = extractDigits(input);
  const normalizedPrefix = CONGO_PHONE_PREFIX.replace(/\D/g, "");

  if (digits.startsWith(normalizedPrefix)) {
    return digits.slice(normalizedPrefix.length).slice(0, LOCAL_PHONE_LENGTH);
  }

  return digits.slice(0, LOCAL_PHONE_LENGTH);
}

export function toPrefixedPhoneNumber(input: string, prefix = CONGO_PHONE_PREFIX) {
  const digits = extractLocalPhoneDigits(input);
  return digits ? `${prefix}${digits}` : "";
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
