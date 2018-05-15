import { NODE_FLAGS } from "./flags";

/**
 * @description
 * Extracts out nodejs flags from a list of arguments.
 *
 * @param {string[]} args The arguments list to look through (usually process.argv.slice(2) for cli's).
 */
function parse(args) {
  const cliArgs = [];
  const nodeArgs = [];

  for (const arg of args) {
    if (NODE_FLAGS.test(arg)) {
      nodeArgs.push(arg);
    } else {
      cliArgs.push(arg);
    }
  }

  return {
    cliArgs,
    nodeArgs
  };
}

module.exports = exports = parse;
export default parse;
