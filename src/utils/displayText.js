import { translateText } from './localizeVi';

export function displayText(value) {
  if (value === null || value === undefined) return value;
  return typeof value === 'string' ? translateText(value) : value;
}
