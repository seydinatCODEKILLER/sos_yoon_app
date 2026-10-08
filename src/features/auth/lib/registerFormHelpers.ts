export const INPUT_CLASS =
  "h-10 rounded-lg border-ink/10 bg-white px-3 text-sm shadow-none focus-visible:border-signal focus-visible:ring-signal/20";

export function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}