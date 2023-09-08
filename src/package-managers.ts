import { PackageManager } from "./types.js";

export const PACKAGE_MANAGER_LOCKFILE: Record<PackageManager, string> = {
  bun: "bun.lockb",
  npm: "package-lock.json",
  pnpm: "pnpm-lock.yaml",
  yarn: "yarn.lock",
};
