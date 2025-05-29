export function nullableToUndefined<T>(value: T | null): T | undefined {
  return value ?? undefined;
}
