import { ConsoleColors } from '../constants'

/**
 * @public
 */
export function black(value: string): string {
  return ConsoleColors.fg.black + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function red(value: string): string {
  return ConsoleColors.fg.red + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function green(value: string): string {
  return ConsoleColors.fg.green + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function yellow(value: string): string {
  return ConsoleColors.fg.yellow + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function blue(value: string): string {
  return ConsoleColors.fg.blue + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function magenta(value: string): string {
  return ConsoleColors.fg.magenta + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function cyan(value: string): string {
  return ConsoleColors.fg.cyan + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function white(value: string): string {
  return ConsoleColors.fg.white + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function gray(value: string): string {
  return ConsoleColors.fg.gray + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function redBright(value: string): string {
  return ConsoleColors.fg.redBright + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function greenBright(value: string): string {
  return ConsoleColors.fg.greenBright + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function yellowBright(value: string): string {
  return ConsoleColors.fg.yellowBright + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function blueBright(value: string): string {
  return ConsoleColors.fg.blueBright + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function magentaBright(value: string): string {
  return ConsoleColors.fg.magentaBright + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function cyanBright(value: string): string {
  return ConsoleColors.fg.cyanBright + value + ConsoleColors.fg.clear
}

/**
 * @public
 */
export function whiteBright(value: string): string {
  return ConsoleColors.fg.whiteBright + value + ConsoleColors.fg.clear
}
