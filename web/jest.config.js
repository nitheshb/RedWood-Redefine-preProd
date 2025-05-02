// module.exports = require('@redwoodjs/testing/config/jest/web')
// module.exports = {
//   rootDir: ["."],
//   projects: [
//     "<rootDir>/packages/app",
//     "<rootDir>/packages/components",
//     "<rootDir>/packages/utils",
//   ],
// };
import { Config } from 'jest'
import { defaults } from 'jest-config'

const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
}

export default config
