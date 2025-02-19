/**
 */
export default function asArray(value) {
  if (value === undefined) return [];

  if (!Array.isArray(value)) {
    return [value];
  }

  return value;
}
