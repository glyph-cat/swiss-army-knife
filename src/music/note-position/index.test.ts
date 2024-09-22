import { NotePosition } from '.'

describe('Instantiation', () => {

  describe('By note position key', () => {

    test('with sensor ID', () => {
      const position = new NotePosition('2/2-1-3-2')
      expect(position.toJSON()).toStrictEqual([2, 1, 3, 2])
    })

    test('without sensor ID', () => {
      const position = new NotePosition('2-1-3-2')
      expect(position.toJSON()).toStrictEqual([2, 1, 3, 2])
    })

  })

  test('By tuple', () => {
    const position = new NotePosition([2, 1, 3, 2])
    expect(position.toJSON()).toStrictEqual([2, 1, 3, 2])
  })

})
