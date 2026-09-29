/**
 * Utilities for text normalization and simplified typing modes
 */

/**
 * Normalizes text to lower-case, accent-free, and punctuation-free,
 * leaving only letters (a-z), numbers, and single spaces between words.
 */
export function simplifyText(text: string): string {
  return text
    .normalize('NFD') // Decompose combined graphemes (e.g. "é" -> "e" + acute)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ç/gi, 'c') // Ensure cedilla is replaced by c
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Replace punctuation with space to prevent words from sticking together
    .replace(/\s+/g, ' ') // Collapse multiple spaces to a single space
    .trim();
}

/**
 * Normalizes live typed input without trimming spaces while typing.
 */
export function normalizeTypedInput(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, 'c')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ''); // Keep single/multiple spaces as user types
}

/**
 * Normalizes a single character or typed string according to simplified rules.
 */
export function normalizeChar(char: string): string {
  return char
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/gi, 'c')
    .toLowerCase();
}
