# svelte-window-variables

> This preprocessor should only be used as a last resort of if you have lost all sense of reason.

`svelte-window-variables` will attach all component methods to the `window` object (when it exists) to give easy access to private component methods. Do no use this unless you have exhausted all other possibilities but if you have to...

## Install it

```bash
npm i --dev svelte-window-variables
```

## Use it

In your rollup config:

```js
import { attachToWindow } from 'svelte-window-test';

const test = process.env.AM_I_THE_TEST_ENV;

export default {
  input: __dirname + '/src/main.js',
  output: {
    ...outputOptions,
  },
  plugins: [
    svelte({
      preprocess: attachToWindow(test, 'boom'),
      ...otherSvelteConfig,
    }),
    ...otherPlugins,
  ],
};
```

In your component:

```svelte
<script test="name">
 function someFunction() {
   console.log('boo');
 }
</script>
```

When `svelte-window-variables` encounters a `test` attribute on the script it will parse the file and attach any top level functions to the window object. These methods will be available on an object `window.__test__`. The name you pass into the `test` attribute will be the property in which these methods are stored. In the above example `someFunction` can be accessed like so: `window.__test__.name.someFunction()`.

Only top level functions will be available, nested functions will not be attached to the window.

## `attachToWindow(shouldItRun, attributeName)`

`attachToWindow` only take two parameters:

- `shouldItRun` - boolean - should the preprocessor be enabled? Tell it. This is required.
- `attributeName` - string - if you want a custom attribute name because of some conflict, you can pass it here. Defaul: `'test'`.
