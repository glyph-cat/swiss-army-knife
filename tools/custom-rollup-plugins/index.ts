import { Plugin } from 'rollup'

export function assignDisplayName(enabled: boolean): Plugin {
  // For now it seems like we need to rely on `global`, would this work in RN though?
  return {
    name: 'assign-display-name',
    transform(code) {
      let counter = 0
      const pattern = /__assignDisplayName\([a-zA-Z0-9_-]+\)/g
      if (enabled) {
        return code.replace(pattern, (str) => {
          const nameVariableName = `$name${counter++}`
          const itemName = str.replace(/^__assignDisplayName\(/, '').replace(/\)$/, '')
          return [
            `const ${nameVariableName} = '${itemName}'`,
            `${itemName}.displayName = ${nameVariableName}`,
            `${itemName}.name = ${nameVariableName}`,
          ].join(';') + ';'
        })
      } else {
        return code.replace(pattern, '')
      }
    },
  }
}
