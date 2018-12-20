# RENAME: src/folder/file.js => src/index.js

## src/c.browser.json
```json
{
  "dependencies": [
    { "path": "." },
    "require: ."
  ]
}
```
## src/d.js
```js
import x from ".";
import x from ".";
import x from ".";
import x from ".";

```
## src/folder/a.js
```js
import x from "..";
import x from "..";
import x from "..";
import x from "..";
import x from "..";
import x from "..";

```
## src/folder/b.browser.json
```json
{
  "dependencies": [
    { "path": ".." },
    "require: .."
  ]
}
```