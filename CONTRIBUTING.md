# Contributing

## Dependency Management
- Run `rush update` in the monorepo's root directory to fetch all relevant dependencies.
- The package manager is `pnpm`, however, ***do not*** use it directly. Please use `rush` instead.

| PNPM commands                   | Rush equivalents              |
| ------------------------------- | ----------------------------- |
| `pnpm install`                  | `rush update`                 |
| `pnpm add <package>`            | `rush add -p <package>`       |
| `pnpm add --save-dev <package>` | `rush add --dev -p <package>` |
| `pnpm remove <package>`         | `rush remove -p <package>`    |

## Conventions
For coding conventions, please refer to [docs/Conventions.md](./docs/Conventions.md)
