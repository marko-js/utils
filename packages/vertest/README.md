# vertest

test a package with the versions of dependencies it claims to support

## Install

```bash
npm install --save-dev vertest
```

## Usage

```
vertest [options] -- [test command]
```

```
Options:
-v, --versions        Versions to include in the test matrix
                      [choices: "latest", "latest-majors", "latest-minors", "min-max", "min-max-majors", "min-max-minors", "all"]
                      [default: "latest-majors"]
-p, --progress        Progress rendering style
                      [choices: "silent", "update", "verbose"]
                      [default: "update"]
-e, --epilogue        Epilogue rendering style
                      [choices: "silent", "failures", "verbose"]
                      [default: "failures"]
-c, --concurrency     Number of tests run at once  [number] [default: cores/2]
-t, --threshold       Maximum number of tests to run  [number] [default: 25]
-b, --bail            Exit on first failure  [boolean] [default: false]
-d, --dependencies    Dependency fields in package.json  [array]
                      [choices: "dependencies", "peerDependencies", "optionalDependencies"]
                      [default: ["peerDependencies"]]
--ignore-engines      Ignore current node version  [boolean] [default: false]
--include-deprecated  Test deprecated pkg versions  [boolean] [default: false]
--help                Show help  [boolean]
```

### Test command

```
vertest -- npm run my-test-script
```

The test command is optional and will default to `npm test`

### Versions

```
vertest --versions=latest-minors
```

Allows you to specify which versions of a package to include in the test matrix according the semver format (`<major>.<minor>.<patch>`).

> ⚠️ BE AWARE: The number of entries in the matrix is multiplicitive, so choosing a version mode that matches many versions can result in a very large test matrix!

#### Examples of versions matching each version mode

**Latest**<br>
~`❌1.0.0`~ ~`❌1.0.1`~ ~`❌1.1.0`~ ~`❌1.1.1`~ ~`❌1.1.2`~<br>
~`❌2.0.0`~ ~`❌2.0.1`~ ~`❌2.1.0`~ ~`❌2.2.0`~ **`✅2.2.1`**

**Latest Majors** (default)<br>
~`❌1.0.0`~ ~`❌1.0.1`~ ~`❌1.1.0`~ ~`❌1.1.1`~ **`✅1.1.2`**<br>
~`❌2.0.0`~ ~`❌2.0.1`~ ~`❌2.1.0`~ ~`❌2.2.0`~ **`✅2.2.1`**

**Latest Minors**<br>
~`❌1.0.0`~ **`✅1.0.1`** ~`❌1.1.0`~ ~`❌1.1.1`~ **`✅1.1.2`**<br>
~`❌2.0.0`~ **`✅2.0.1`** **`✅2.1.0`** ~`❌2.2.0`~ **`✅2.2.1`**

**Min-Max**<br>
**`✅1.0.0`** ~`❌1.0.1`~ ~`❌1.1.0`~ ~`❌1.1.1`~ ~`❌1.1.2`~<br>
~`❌2.0.0`~ ~`❌2.0.1`~ ~`❌2.1.0`~ ~`❌2.2.0`~ **`✅2.2.1`**

**Min-Max Majors**<br>
**`✅1.0.0`** ~`❌1.0.1`~ ~`❌1.1.0`~ ~`❌1.1.1`~ **`✅1.1.2`**<br>
**`✅2.0.0`** ~`❌2.0.1`~ ~`❌2.1.0`~ ~`❌2.2.0`~ **`✅2.2.1`**

**Min-Max Minors**<br>
**`✅1.0.0`** **`✅1.0.1`** **`✅1.1.0`** ~`❌1.1.1`~ **`✅1.1.2`**<br>
**`✅2.0.0`** **`✅2.0.1`** **`✅2.1.0`** **`✅2.2.0`** **`✅2.2.1`**

**All**<br>
**`✅1.0.0`** **`✅1.0.1`** **`✅1.1.0`** **`✅1.1.1`** **`✅1.1.2`**<br>
**`✅2.0.0`** **`✅2.0.1`** **`✅2.1.0`** **`✅2.2.0`** **`✅2.2.1`**

### Progress renderer

```
vertest --progress=silent
```

[Listr](https://github.com/SamVerschueren/listr) is used to render the test progress. The following renderers are available for Listr:

- [silent](https://github.com/SamVerschueren/listr-silent-renderer) - No output
- [update](https://github.com/SamVerschueren/listr-update-renderer) - Re-rendering progress list with spinners (default)
- [verbose](https://github.com/SamVerschueren/listr-verbose-renderer) - Sequential logs with timestamps

### Epilogue renderer

```
vertest --epilogue=verbose
```

- `silent` - No output
- `failures` - Test output for failures only (default)
- `verbose` - Test output for passes/failures and tests skipped due to engine/peer incompatibility

### Dependencies

By default only `peerDependencies` are used to generate the test matrix. `dependencies` and `optionalDependencies` are also available to be used.

> ⚠️ BE AWARE: The number of entries in the matrix is multiplicitive, so adding `dependencies` can result in a very large test matrix!
