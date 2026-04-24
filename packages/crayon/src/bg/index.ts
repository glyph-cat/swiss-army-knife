import { ConsoleColors } from '../constants'

/**
 * @public
 */
export function bgBlack(value: string): string {
  return ConsoleColors.bg.black + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgRed(value: string): string {
  return ConsoleColors.bg.red + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgGreen(value: string): string {
  return ConsoleColors.bg.green + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgYellow(value: string): string {
  return ConsoleColors.bg.yellow + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgBlue(value: string): string {
  return ConsoleColors.bg.blue + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgMagenta(value: string): string {
  return ConsoleColors.bg.magenta + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgCyan(value: string): string {
  return ConsoleColors.bg.cyan + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgWhite(value: string): string {
  return ConsoleColors.bg.white + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgGray(value: string): string {
  return ConsoleColors.bg.gray + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgRedBright(value: string): string {
  return ConsoleColors.bg.redBright + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgGreenBright(value: string): string {
  return ConsoleColors.bg.greenBright + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgYellowBright(value: string): string {
  return ConsoleColors.bg.yellowBright + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgBlueBright(value: string): string {
  return ConsoleColors.bg.blueBright + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgMagentaBright(value: string): string {
  return ConsoleColors.bg.magentaBright + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgCyanBright(value: string): string {
  return ConsoleColors.bg.cyanBright + value + ConsoleColors.bg.clear
}

/**
 * @public
 */
export function bgWhiteBright(value: string): string {
  return ConsoleColors.bg.whiteBright + value + ConsoleColors.bg.clear
}
