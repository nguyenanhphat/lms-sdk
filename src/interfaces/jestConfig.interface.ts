export interface JestConfig {
  collectCoverageFrom: string[];

  coverageDirectory: string;
  coveragePathIgnorePatterns: string[];
  coverageReporters: CoverageDirectoryEnum[];

  globals?: { [k: string]: any };

  haste?: { [k: string]: any };

  moduleFileExtensions: string[];

  moduleNameMapper?: { [k: string]: string };
  rootDir: string;
  roots: string[];

  setupFilesAfterEnv?: string[];
  testEnvironment?: string;
  testMatch: string[];
  testPathIgnorePatterns: string[];

  testRunner?: string;
  testURL: string;

  transform: { [key: string]: string };
  transformIgnorePatterns: string[];
  verbose: boolean;

  watchPlugins?: string[];
}

export enum CoverageDirectoryEnum {
  clover = 'clover',
  cobertura = 'cobertura',
  html = 'html',
  'json-summary' = 'json-summary',
  json = 'json',
  lcov = 'lcov',
  lcovonly = 'lcovonly',
  none = 'none',
  teamcity = 'teamcity',
  'text-lcov' = 'text-lcov',
  'text-summary' = 'text-summary',
  text = 'text',
}
