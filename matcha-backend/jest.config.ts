// jest.config.ts
import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment : "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  testMatch:["**/**/*.test.ts"],
};
export default config