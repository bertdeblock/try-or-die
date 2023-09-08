import { cwd, env } from "node:process";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { withPrettyErrors } from "../errors.js";
import { runScenario } from "./run-scenario.js";
import { runScenarios } from "./run-scenarios.js";

yargs(hideBin(process.argv))
  .command({
    command: "scenario [name]",
    describe: "Run a single scenario",

    builder(yargs) {
      return yargs
        .positional("name", {
          description: "The scenario's name",
          type: "string",
        })
        .option("config-path", {
          description: "A custom path to a `try-or-die` config file",
          type: "string",
        })
        .option("restore", {
          default: Boolean(env.CI) === false,
          description: "Restore the project's state after running the scenario",
          type: "boolean",
        });
    },
    handler(options) {
      withPrettyErrors(() =>
        runScenario(cwd(), options.name, {
          configPath: options.configPath,
          restore: options.restore,
        }),
      );
    },
  })
  .command({
    command: "scenarios",
    describe: "Run multiple scenarios",

    builder(yargs) {
      return yargs
        .option("config-path", {
          description: "A custom path to a `try-or-die` config file",
          type: "string",
        })
        .option("names", {
          description: "The scenario names",
          type: "array",
        });
    },
    handler(options) {
      withPrettyErrors(() =>
        runScenarios(cwd(), {
          configPath: options.configPath,
          names: options.names,
        }),
      );
    },
  })
  .demandCommand()
  .strict().argv;
