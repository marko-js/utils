# parse-node-args

Utility to extract all valid node flags from a list of process args.

## Install

```bash
npm install --save parse-node-args
```

# Usage

**cmd**

```bash
node ./cli.js --inspect-brk --custom-option
```

**cli.js**

```javascript
import { deepEqual } from "assert";
import parseNodeArgs from "parse-node-args";

const { nodeArgs, cliArgs } = parseNodeArgs(process.argv);

deepEqual(nodeArgs, ["--inspect-brk"]);
deepEqual(cliArgs, ["--custom-option"]);
```
