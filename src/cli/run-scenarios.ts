import { readConfig } from "../config.js";
import { PrettyError } from "../errors.js";
import { runScenario } from "../run-scenario.js";
import { type Scenario } from "../types.js";
import { formatList } from "../ui.js";

export async function runScenarios(
  cwd: string,
  { configPath, names = [] }: { configPath?: string; names?: string[] },
) {
  const config = await readConfig(cwd, configPath);

  validateScenarioNames(names, config.scenarios);

  const scenarios =
    names.length > 0
      ? config.scenarios.filter((scenario) => names.includes(scenario.name))
      : config.scenarios;

  for (const scenario of scenarios) {
    await runScenario(cwd, scenario, config);
  }
}

function validateScenarioNames(names: string[], scenarios: Scenario[]) {
  const invalidNames = names.filter((name) => {
    return scenarios.find((scenario) => scenario.name === name) === undefined;
  });

  if (invalidNames.length === 1) {
    throw new PrettyError(`Could not find scenario \`${invalidNames[0]}\`.`);
  } else if (invalidNames.length > 1) {
    throw new PrettyError(
      `Could not find scenarios ${formatList(invalidNames)}.`,
    );
  }
}
