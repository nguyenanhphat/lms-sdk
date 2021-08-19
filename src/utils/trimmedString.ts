export function trimmedString(input: string, length: number): string {
  const str = input.toString();
  return str.length > length - 3
    ? str.substring(0, length - 3) + '...'
    : str;
}
