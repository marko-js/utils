# RENAME: src/folder/file.js => src/file-moved.js

## src/c.js
```js
import x from "./file-moved";
import x from "./file-moved.js";

```
## src/d.browser.json
```json
{
  "dependencies": [
    { "path": "./file-moved" },
    "require: ./file-moved.js"
  ]
}
```
## src/folder/a.js
```js
import x from "../file-moved.js";
import x from "../file-moved";
import x from "../file-moved.js";
import x from "../file-moved";

```
## src/folder/b.browser.json
```json
{
  "dependencies": [
    { "path": "../file-moved" },
    "require: ../file-moved.js"
  ]
}
```