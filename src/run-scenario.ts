import { execa } from "execa";
import { flattenObject } from "flatten-anything";
import set from "lodash.set";
import { stderr, stdout } from "node:process";
import { debugFactory } from "./debug-factory.js";
import { isEmberTryScenario, transformEmberTryScenario } from "./ember-try.js";
import { applyScenarioEnv } from "./env.js";
import { PrettyError } from "./errors.js";
import { backUpFiles, readPackageFile, writePackageFile } from "./files.js";
import { PACKAGE_MANAGER_LOCKFILE } from "./package-managers.js";
import { type Command, type Config, type Scenario } from "./types.js";
import { printBanner, printInfo, printSuccess } from "./ui.js";

const DEFAULT_SCENARIO = {
  env: {},
  name: "default",
  packageJson: {},
};

const debug = debugFactory.extend("run-scenario");

/**
 * Run a scenario.
 */
export async function runScenario(
  cwd: string,
  providedScenario: Scenario,
  config: Config,
  { restore = true } = {},
) {
  const scenario = { ...DEFAULT_SCENARIO };
  const scenarioStartTime = Date.now();

  if (isEmberTryScenario(providedScenario)) {
    Object.assign(scenario, transformEmberTryScenario(providedScenario));
  } else {
    Object.assign(scenario, providedScenario);
  }

  debug("Running scenario:");
  debug(scenario);

  printBanner(`START ${scenario.name}`);

  const lockfile = PACKAGE_MANAGER_LOCKFILE[config.packageManager];
  const packageJson = await readPackageFile(cwd);

  const restoreProcessEnv = applyScenarioEnv(scenario.env);
  const restoreFiles = await backUpFiles(cwd, ["package.json", lockfile]);
  const restoreState = async () => {
    restoreProcessEnv();
    await restoreFiles();
  };

  applyScenarioPackageJson(packageJson, scenario.packageJson);

  await writePackageFile(cwd, packageJson);
  await runCommand({
    command: [
      config.packageManager,
      "install",
      ...config.packageManagerInstallOptions,
    ],
    cwd,
    onFailure: restore ? restoreState : undefined,
    scenario,
    stage: "SETUP",
  });

  await runCommand({
    command: config.testCommand,
    cwd,
    onFailure: restore ? restoreState : undefined,
    scenario,
    stage: "TEST",
  });

  if (restore) {
    await restoreState();
    await runCommand({
      command: [config.packageManager, "install"],
      cwd,
      scenario,
      stage: "RESTORE",
    });
  } else {
    printInfo("Skipping restoring the project's state.", { id: scenario.name });
  }

  printSuccess(`Finished in ${Date.now() - scenarioStartTime}ms.`, {
    id: scenario.name,
    prefix: "TRIED AND TESTED",
  });
}

function applyScenarioPackageJson(
  packageJson: object,
  packageJsonScenario: object,
) {
  const packageJsonScenarioFlat = flattenObject(packageJsonScenario);

  Object.keys(packageJsonScenarioFlat).forEach((key) => {
    set(packageJson, key, packageJsonScenarioFlat[key]);
  });

  return packageJson;
}

async function runCommand({
  command,
  cwd,
  onFailure,
  scenario,
  stage,
}: {
  command: Command;
  cwd: string;
  onFailure?: () => void;
  scenario: Scenario;
  stage: string;
}) {
  const commandString = command.join(" ");

  printInfo(`Running \`${commandString}\``, {
    id: scenario.name,
    prefix: stage,
  });

  try {
    const [commandFile, ...commandArgs] = command;
    await execa(commandFile, commandArgs, { cwd })
      .pipeStderr?.(stderr)
      .pipeStdout?.(stdout);
  } catch (cause: any) {
    await onFailure?.();
    throw new PrettyError(`Failed to run \`${commandString}\`.`, {
      cause,
      printOptions: { id: scenario.name, prefix: "TRIED BUT DIED" },
    });
  }
}
