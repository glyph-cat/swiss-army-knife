/**
 * @public
 */
export type NotePositionTuple = [bar: number, beat: number, position: number, tick: number]

/**
 * @public
 */
export type TimeSignature = [
  /**
   * The number of beats in a bar.
   */
  topNumber: number,
  /**
   * The note value for one beat.
   */
  bottomNumber: number,
]

// export type VariableMusicalDefinition<...>
// export type VariableTimeSignature = VariableMusicalDefinition<...>
