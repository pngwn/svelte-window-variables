import { parseScript } from 'meriyah';

export function attachToWindow(shouldItRun, attributeName = 'test') {
  return {
    script({ content, attributes }) {
      if (!shouldItRun || !attributes[attributeName]) return;

      const testName = attributes[attributeName];
      const ast = parseScript(content, { module: true });

      // Check for svelte `onMount` imports (I don't care about locally renamed imports)

      const onDestroy = ast.body.find(
        ({ type, source, specifiers }) =>
          type === 'ImportDeclaration' &&
          source.value === 'svelte' &&
          specifiers.some(({ local }) => local.name === 'onDestroy')
      );

      // Get the names of these types:
      // FunctionDeclaration
      // VariableDeclaration containing FunctionExpression
      // VariableDeclaration containing ArrowFunctionExpression

      const identifiers = ast.body
        .filter(
          ({ type, declarations }) =>
            type === 'FunctionDeclaration' ||
            (type === 'VariableDeclaration' &&
              (declarations[0].init.type === 'FunctionExpression' ||
                declarations[0].init.type === 'ArrowFunctionExpression'))
        )
        .map(({ id, declarations }) =>
          id ? id.name : declarations[0].id.name
        );

      if (!identifiers.length) return;

      // Build the script
      const windowMountScript = `
  ${onDestroy ? '' : `import { onDestroy } from 'svelte';`}
  if (window) {
    const __window_test__${testName} = {
      ${identifiers.join(', ')}
    };
    window.__test__ = {};
    window.__test__.${testName} = __window_test__${testName};
  }
  onDestroy(() => {
    delete window.__test__.${testName};
  });
`;

      // and smoosh it in the page
      return { code: `${content}${windowMountScript.trim()}` };
    },
  };
}
