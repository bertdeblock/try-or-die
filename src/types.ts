import { PackageJson } from "type-fest";

export type Command = [string, ...string[]];
export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";

export interface Config {
  packageManager: PackageManager;
  packageManagerInstallOptions: string[];
  testCommand: Command;
  scenarios: Scenario[];
}

export interface PrintOptions {
  id?: string;
  prefix?: string;
}

export type FileHandler = (content: string) => string | Promise<string>;

export interface Scenario {
  env: Record<string, any>;
  files: { [filePath: string]: string | FileHandler };
  name: string;
  npm?: Record<string, any>;
  packageJson: PackageJson;
}
