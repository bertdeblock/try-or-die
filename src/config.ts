import { findUp } from "find-up";
import { isAbsolute, join } from "node:path";
import { pathToFileURL } from "node:url";
import { debugFactory } from "./debug-factory.js";
import { PrettyError } from "./errors.js";
import { type Config } from "./types.js";

const CONFIG_FILE_NAMES = [
  "try-or-die.config.js",
  "try-or-die.config.cjs",
  "try-or-die.config.mjs",
];

const DEFAULT_CONFIG: Partial<Config> = {
  packageManager: "npm",
  packageManagerInstallOptions: [],
  scenarios: [],
};

const debug = debugFactory.extend("config");

/**
 * Read a project's config.
 */
export async function readConfig(cwd: string, _configPath?: string) {
  const configPath = _configPath
    ? isAbsolute(_configPath)
      ? _configPath
      : join(cwd, _configPath)
    : await findUp(CONFIG_FILE_NAMES, { cwd });

  if (configPath === undefined) {
    throw new PrettyError("Could not find a try-or-die config file.");
  }

  let configFactory;
  try {
    const { default: _configFactory } = await import(
      pathToFileURL(configPath).toString()
    );

    configFactory = _configFactory;
  } catch {
    throw new PrettyError(
      `Could not find or import config file \`${configPath}\`.`,
    );
  }

  const config = generateConfig(
    typeof configFactory === "function" ? await configFactory() : configFactory,
  );

  debug("Resolved config path: %s", configPath);
  debug("Resolved config:");
  debug(config);

  return config;
}

/**
 * Generate a final config, based on a provided config.
 */
export function generateConfig(providedConfig: Partial<Config>) {
  const config: Record<any, any> = { ...DEFAULT_CONFIG, ...providedConfig };

  if (config.testCommand === undefined) {
    config.testCommand = [config.packageManager, "test"];
  }

  return config as Config;
}
