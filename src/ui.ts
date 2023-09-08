import chalk, { supportsColor } from "chalk";
import { stdout } from "node:process";
import { type PrintOptions } from "./types.js";

/**
 * Format a list.
 */
export function formatList(list: string[]) {
  const formatter = new Intl.ListFormat("en-US", {
    style: "long",
    type: "conjunction",
  });

  return formatter.format(list.map((item) => `\`${item}\``));
}

/**
 * Print a banner.
 */
export function printBanner(message: string) {
  const banner = inlineBlock(message);
  const totalChars = (stdout.columns || 120) - banner.length;
  const leadingChars = "─".repeat(Math.round(totalChars / 2));
  const trailingChars = "─".repeat(totalChars - leadingChars.length);

  console.log(
    chalk.blue(`\n${leadingChars}${chalk.inverse(banner)}${trailingChars}`),
  );
}

/**
 * Print an error message.
 */
export function printError(message: string, options?: PrintOptions) {
  console.error(
    chalk.red(prefixMessage(options?.prefix || "ERROR", message, options?.id)),
  );
}

/**
 * Print an info message.
 */
export function printInfo(message: string, options?: PrintOptions) {
  console.log(
    chalk.blue(prefixMessage(options?.prefix || "INFO", message, options?.id)),
  );
}

/**
 * Print a success message.
 */
export function printSuccess(message: string, options?: PrintOptions) {
  console.log(
    chalk.green(
      prefixMessage(options?.prefix || "SUCCESS", message, options?.id),
    ),
  );
}

/**
 * Print a warning message.
 */
export function printWarning(message: string, options?: PrintOptions) {
  console.error(
    chalk.yellow(
      prefixMessage(options?.prefix || "WARNING", message, options?.id),
    ),
  );
}

/**
 * Inline block a message.
 */
function inlineBlock(message: string) {
  return supportsColor ? ` ${message} ` : `[ ${message} ]`;
}

/**
 * Prefix a message.
 */
function prefixMessage(providedPrefix: string, message: string, id?: string) {
  const prefix = providedPrefix + (id ? " " + id : "");
  const prefixStyled = chalk.inverse(inlineBlock(prefix));

  return `\n${prefixStyled} ${message}\n`;
}
