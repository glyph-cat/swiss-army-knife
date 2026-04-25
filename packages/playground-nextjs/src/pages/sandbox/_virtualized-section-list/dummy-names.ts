import { Charset, StringRecord } from '@glyph-cat/foundation'
import { HashFactory, objectMap } from '@glyph-cat/swiss-army-knife'
import { ISection } from '@glyph-cat/swiss-army-knife-react'

/**
 * Names are generated from http://random-name-generator.info
 */
const BASE_NAMES: Readonly<StringRecord<Array<string>>> = { 'a': ['Aaron Chavez', 'Abel Ellis', 'Abraham Valdez', 'Alma Guzman', 'Arturo Mckenzie'], 'b': ['Billie Hawkins'], 'c': ['Caleb Cain', 'Candace Obrien', 'Cassandra Webb', 'Catherine Poole', 'Charlotte Ramsey', 'Claire Sullivan', 'Constance Fields', 'Courtney Freeman'], 'd': ['Daniel Logan', 'Darrel Little', 'Darrin Berry', 'Deanna Gilbert', 'Dewey Keller', 'Diana Romero', 'Donald Wilkerson', 'Duane Nash'], 'e': ['Eileen Austin', 'Ellen Griffith', 'Eric Phelps'], 'f': ['Fernando Dawson', 'Frances Munoz', 'Francis Norris', 'Freda Banks'], 'g': ['Geoffrey Reynolds', 'Gilbert Walters', 'Glenda Flowers', 'Gwendolyn Russell'], 'i': ['Ida Blair', 'Ignacio Barton', 'Ivan Hudson'], 'j': ['Javier Simmons', 'Jean Newman', 'Jeremy Morrison', 'Jill Ramirez', 'Joanne Tate', 'Jodi Kelley', 'Johanna Chandler', 'Juan Norton'], 'k': ['Kara Jensen', 'Kelly Reese', 'Ken Morris', 'Kendra Alvarado', 'Kenneth Lynch', 'Kristopher Marshall'], 'l': ['Lee Cannon', 'Leslie Stone', 'Linda Reid', 'Lionel Burke', 'Loretta Vasquez', 'Louis Santiago', 'Lucy Porter', 'Lydia Garza', 'Lyle Hardy'], 'm': ['Mack Aguilar', 'Margie Collier', 'Marie Yates', 'Marlon Cortez', 'Marty Gross', 'Matt Tran', 'Meghan Craig', 'Michele Garner', 'Milton Parker'], 'n': ['Nadine Hoffman', 'Nathaniel Arnold'], 'o': ['Olive Potter', 'Otis Lyons'], 'p': ['Pat Daniel', 'Patsy Campbell', 'Phil Lewis', 'Priscilla Moody'], 'r': ['Randolph Adams', 'Raymond Collins', 'Richard Tyler', 'Rita Clayton', 'Roberta Medina', 'Ronnie Douglas', 'Rosemary Gordon', 'Roxanne Caldwell', 'Ryan Moss'], 's': ['Samantha Luna', 'Saul Salazar', 'Sharon Bennett', 'Shawn Brady', 'Sheldon Beck', 'Shelia Williamson', 'Sue Curtis'], 't': ['Terry Payne', 'Traci West'], 'v': ['Vanessa Pittman', 'Vera Park'], 'w': ['Wendy Becker', 'Wilbur Matthews', 'Willis Hanson', 'Wm Butler'] }

function getEmail(name: string): string {
  return `${name.toLowerCase().replace(/\s/g, '_')}@example.com`
}

const phoneNumberFactory = new HashFactory(10, Charset.NUMERIC)

const idFactory = new HashFactory(6)

export interface DummySectionData {
  group: string
}

export interface DummyItemData {
  id: string
  name: string
  email: string
  phone: string
}

export const DUMMY_SECTIONS: Array<ISection<DummySectionData, DummyItemData>> = objectMap(
  BASE_NAMES,
  (listInGroup, alphabetGroup) => ({
    data: {
      group: alphabetGroup.toUpperCase(),
    },
    items: listInGroup.map((name) => ({
      id: idFactory.create(),
      name,
      email: getEmail(name),
      phone: phoneNumberFactory.create(),
    })),
  }),
)
