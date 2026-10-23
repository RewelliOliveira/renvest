const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 60;
const MAX_CONSONANT_RUN = 4;

const ALLOWED_CHARS = /^[\p{L}\s'-]+$/u;
const VOWELS = /[aeiouyøæœ]/;
const CONSONANT_RUN = new RegExp(`[^aeiouyøæœ'-]{${MAX_CONSONANT_RUN + 1},}`);
const REPEATED_CHAR = /(.)\1\1/;
const REPEATED_CHUNK = /(.{2,})\1\1/;
const DOUBLED_CHUNK = /(.{3,})\1/;
const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const KEYBOARD_SEQUENCE_LENGTH = 5;
const KEYBOARD_SEQUENCES = KEYBOARD_ROWS.flatMap((row) =>
  Array.from({ length: row.length - KEYBOARD_SEQUENCE_LENGTH + 1 }, (_, i) =>
    row.slice(i, i + KEYBOARD_SEQUENCE_LENGTH),
  ),
);

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
}

function looksLikeGibberish(word: string) {
  return (
    (word.length > 2 && !VOWELS.test(word)) ||
    CONSONANT_RUN.test(word) ||
    REPEATED_CHAR.test(word) ||
    REPEATED_CHUNK.test(word) ||
    DOUBLED_CHUNK.test(word) ||
    KEYBOARD_SEQUENCES.some((sequence) => word.includes(sequence))
  );
}

export function validateName(rawName: string): string | null {
  const name = rawName.trim().replace(/\s+/g, " ");

  if (name.length < MIN_NAME_LENGTH) {
    return `O nome deve ter pelo menos ${MIN_NAME_LENGTH} letras.`;
  }

  if (name.length > MAX_NAME_LENGTH) {
    return `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`;
  }

  if (!ALLOWED_CHARS.test(name)) {
    return "O nome deve conter apenas letras.";
  }

  const words = stripAccents(name).toLowerCase().split(" ");

  if (words[0].replace(/['-]/g, "").length < MIN_NAME_LENGTH) {
    return "Digite um nome válido.";
  }

  if (words.some(looksLikeGibberish)) {
    return "Digite um nome válido.";
  }

  return null;
}
