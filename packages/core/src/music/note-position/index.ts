import { NotePositionTuple } from '../abstractions'

// this should contain methods that help to convert note position to milliseconds and vice versa, while taking into consideration variable tempo and variable time signature

/**
 * @alpha
 */
export class NotePosition {

  static readonly DELIMITER = '-'

  readonly bar: number
  readonly beat: number
  readonly position: number
  readonly tick: number

  constructor(notePositionKey: string)
  constructor(tuple: NotePositionTuple)

  /**
   * @internal
   */
  constructor(notePosition: NotePositionTuple | string) {
    if (Array.isArray(notePosition)) {
      this.bar = notePosition[0]
      this.beat = notePosition[1]
      this.position = notePosition[2]
      this.tick = notePosition[3]
    } else {
      const rawPosition = notePosition.match(NOTE_POSITION_PATTERN)[0].split(NotePosition.DELIMITER)
      this.bar = Number(rawPosition[0])
      this.beat = Number(rawPosition[1])
      this.position = Number(rawPosition[2])
      this.tick = Number(rawPosition[3])
    }
    // todo: this.validateParameters() ???
    this.equals = this.equals.bind(this)
    this.isGreaterThan = this.isGreaterThan.bind(this)
    this.isLessThan = this.isLessThan.bind(this)
    this.toJSON = this.toJSON.bind(this)
    this.toTuple = this.toTuple.bind(this)
    this.toString = this.toString.bind(this)
  }

  equals(position: NotePosition): boolean {
    if (this.bar !== position.bar) {
      return false
    } else if (this.beat !== position.beat) {
      return false
    } else if (this.position !== position.position) {
      return false
    } else if (this.tick !== position.tick) {
      return false
    } else {
      return true
    }
  }

  isGreaterThan(position: NotePosition): boolean {
    if (this.bar !== position.bar) {
      return this.bar > position.bar
    } else if (this.beat !== position.beat) {
      return this.beat > position.beat
    } else if (this.position !== position.position) {
      return this.position > position.position
    } else if (this.tick !== position.tick) {
      return this.tick > position.tick
    } else {
      return false
    }
  }

  isLessThan(position: NotePosition): boolean {
    if (this.bar !== position.bar) {
      return this.bar < position.bar
    } else if (this.beat !== position.beat) {
      return this.beat < position.beat
    } else if (this.position !== position.position) {
      return this.position < position.position
    } else if (this.tick !== position.tick) {
      return this.tick < position.tick
    } else {
      return false
    }
  }

  // moveForwardBy(offset: NotePositionDifference): NotePosition {
  //   // ...
  // }

  // moveBackwardBy(offset: NotePositionDifference): NotePosition {
  //   // ...
  // }

  toJSON(): NotePositionTuple {
    return this.toTuple()
  }

  toTuple(): NotePositionTuple {
    return [this.bar, this.beat, this.position, this.tick]
  }

  toString(): string {
    return this.toTuple().join(NotePosition.DELIMITER)
  }

}

const NOTE_POSITION_PATTERN = new RegExp(new Array(4).fill('\\d+').join(NotePosition.DELIMITER))
