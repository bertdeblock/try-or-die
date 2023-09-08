import process from "node:process";
import { type PrintOptions } from "./types.js";
import { printError } from "./ui.js";

interface PrettyErrorOptions {
  cause?: any;
  printOptions?: PrintOptions;
}

/**
 * An error that should be pretty printed.
 */
export class PrettyError extends Error {
  options: PrettyErrorOptions;

  /**
   * Create a pretty error.
   */
  constructor(message: string, options: PrettyErrorOptions = {}) {
    super(...arguments);

    this.options = options;
  }

  print() {
    printError(this.message, this.options.printOptions);

    if (this.options.cause) {
      console.error(this.options.cause);
    }
  }
}

/**
 * Execute a function and pretty print errors if thrown.
 */
export async function withPrettyErrors(func: Function) {
  try {
    await func();
  } catch (error) {
    if (error instanceof PrettyError) {
      error.print();
      process.exitCode = 1;
    } else {
      throw error;
    }
  }
}
