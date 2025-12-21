export const VALID_MEMBER_IDS = [
  "ELV001",
  "ELV002",
  "ELV003",
  "ELV004",
  "ELV010",
  "ELV123",
];

export function isValidMemberId(input: string): boolean {
  const normalized = input.trim().toUpperCase();
  return VALID_MEMBER_IDS.includes(normalized);
}
