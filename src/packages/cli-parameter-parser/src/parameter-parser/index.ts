import { argPatternGenerator } from './arg-pattern-generator'

/**
 * @public
 */
export class ParameterParser {

  /**
   * @internal
   */
  private readonly M$usedParameterIndexes: Record<number, true> = {}

  constructor(readonly parameters: Readonly<Array<string>>) { }

  getOne(alias: string | null, name: string): string | null {
    const pattern = argPatternGenerator(alias, name)
    for (let i = 0; i < this.parameters.length; i++) {
      if (pattern.test(this.parameters[i])) {
        this.M$usedParameterIndexes[i] = true
        this.M$usedParameterIndexes[i + 1] = true
        return this.parameters[i + 1] ?? null
      }
    }
    return null
  }

  getBoolean(alias: string | null, name: string): boolean {
    const pattern = argPatternGenerator(alias, name)
    for (let i = 0; i < this.parameters.length; i++) {
      if (pattern.test(this.parameters[i])) {
        // Boolean parameters are automatically true if specified without a trailing value.
        // But if a trailing value is specified, then it must not have leading slashes
        // in order for it to be recognized.
        this.M$usedParameterIndexes[i] = true
        if (
          typeof this.parameters[i + 1] === 'string' &&
          !/^-/.test(this.parameters[i + 1])
        ) {
          this.M$usedParameterIndexes[i + 1] = true
          return /^(1|true|t|yes|y)$/i.test(this.parameters[i + 1])
        }
        return true
      }
    }
    return false
  }

  getAll(alias: string | null, name: string): Array<string> {
    const pattern = argPatternGenerator(alias, name)
    const collectedValues: Array<string> = []
    for (let i = 0; i < this.parameters.length; i++) {
      if (pattern.test(this.parameters[i])) {
        this.M$usedParameterIndexes[i] = true
        let offset = 1
        // While following items do not have leading dash, we treat it as a value
        while (
          ((i + offset) < this.parameters.length) &&
          (!/^-/.test(this.parameters[i + offset]))
        ) {
          this.M$usedParameterIndexes[i + offset] = true
          collectedValues.push(this.parameters[i + offset] ?? null)
          offset += 1
        }
        i += offset - 1
      }
    }
    return collectedValues
  }

  getTrailing(alias: string | null, name: string): Array<string> {
    const pattern = argPatternGenerator(alias, name)
    for (let i = 0; i < this.parameters.length; i++) {
      if (pattern.test(this.parameters[i])) {
        this.M$usedParameterIndexes[i] = true
        const sliced = this.parameters.slice(i + 1) as Array<string>
        for (let j = 0; j < sliced.length; j++) {
          this.M$usedParameterIndexes[i + 1 + j] = true
        }
        return sliced
      }
    }
    return []
  }

  getRemaining(): Array<string> {
    const remainingParameters: Array<string> = []
    for (let i = 0; i < this.parameters.length; i++) {
      if (!this.M$usedParameterIndexes[i]) {
        remainingParameters.push(this.parameters[i])
      }
    }
    return remainingParameters
  }

}
