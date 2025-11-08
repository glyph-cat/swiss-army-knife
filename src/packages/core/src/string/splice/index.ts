/**
 * Removes characters from a string and, if necessary, inserts new elements in their place.
 * @param value - The string to manipulate.
 * @param start - The zero-based location in the string from which to start removing characters.
 * @param deleteCount - The number of elements to remove. If value of this argument is either a negative number, zero, undefined, or a type that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements.
 * @param items - Characters to insert into the string in place of the deleted elements.
 * @returns A tuple containing the spliced value and the removed characters.
 * @public
 */
export function splice(
  value: string,
  start: number,
  deleteCount: number,
  ...items: Array<string>
): [newValue: string, deletedValue: string] {
  const characters = value.split('')
  const deletedCharacters = characters.splice(start, deleteCount, ...items)
  return [characters.join(''), deletedCharacters.join('')]
}
