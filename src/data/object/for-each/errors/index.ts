/**
 * @public
 */
export class MultipleBreakLoopError extends SyntaxError {

  /**
   * @internal
   */
  constructor(fnName: string) {
    super(`Attempted to break loop in \`${fnName}\` multiple times`)
  }

}

/**
 * @public
 */
export class BreakLoopSyntaxError extends SyntaxError {

  /**
   * @internal
   */
  constructor(fnName: string) {
    super(`Loops in \`${fnName}\` should only be broken by calling \`return breakLoop()\``)
  }

}

/**
 * @public
 */
export class MismatchedBreakLoopError extends SyntaxError {

  /**
   * @internal
   */
  constructor(fnName: string) {
    super(`Returned incorrect \`breakLoop()\` in \`${fnName}\``)
  }

}
