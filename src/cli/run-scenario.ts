import { readConfig } from "../config.js";
import { PrettyError } from "../errors.js";
import { runScenario as _runScenario } from "../run-scenario.js";

export async function runScenario(
  cwd: string,
  name: string,
  {
    configPath,
    restore,
  }: {
    configPath?: string;
    restore?: boolean;
  },
) {
  if (name === undefined) {
    throw new PrettyError("A scenario name must be provided.");
  }

  const config = await readConfig(cwd, configPath);
  const scenario = config.scenarios.find((scenario) => scenario.name === name);

  if (scenario === undefined) {
    throw new PrettyError(`Could not find scenario \`${name}\`.`);
  }

  await _runScenario(cwd, scenario, config, { restore });
}
