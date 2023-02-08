export function stripTrailingSlash(str: string) {
  return str.endsWith("/") ? str.slice(0, -1) : str;
}

export function strToBool(str: string) {
  return str.toLowerCase() === "true";
}

export function assert(condition: unknown, errorMessage: string) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}
