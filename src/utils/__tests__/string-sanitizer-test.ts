import { sanitizeString } from "../data-sanitizers/string-sanitizer";

describe('sanitizeString', () => {
  it('should trim valid string', () => {
    const validString = '     abacate ';

    const result = sanitizeString(validString);

    expect(result).toBe('abacate');
  });

  it('should return undefined for any non-string value', () => {
    const numberValue = 3;
    const booleanValue = true;
    const nullValue = null;

    expect(sanitizeString(numberValue as any)).toBeUndefined();
    expect(sanitizeString(booleanValue as any)).toBeUndefined();
    expect(sanitizeString(nullValue as any)).toBeUndefined();
  })
})