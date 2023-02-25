const onRE = /^on[^a-z]/;
export const isOn = (key: string) => onRE.test(key);

export const isArray = Array.isArray;

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null;
}

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null;
}

export function isTrue(v: any): boolean {
  return v === true;
}

export function isFalse(v: any): boolean {
  return v === false;
}

/**
 * Check if value is primitive.
 */
export function isPrimitive(value: unknown): boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    // $flow-disable-line
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
}

export function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === "object";
}
