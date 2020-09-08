export type Empty = null | undefined;

/**
 * Check if value is any of null | undefined;
 */
export function isEmpty(value: any): value is Empty {
  return value === null || value === undefined;
}

/**
 * Check if value is not {@link isEmpty}.
 */
export function isNotEmpty<T>(value: T): value is NonNullable<T> {
  return !isEmpty(value);
}

/**
 * Check if value is not {@link isEmpty}.
 *
 * Variant of {@link isNotEmpty} with positive naming.
 */
export function hasValue<T>(value: T): value is NonNullable<T> {
  return isNotEmpty(value);
}
