import test from 'tape';
import { attachToWindow } from './index.js';
import { preprocess } from 'svelte/compiler';

test('Should create an onDestroy and store some variables in the window', async t => {
  const script = `<script test="myname">
  import { onDestroy } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  const processed = await preprocess(script, attachToWindow(true));
  const expected = `<script test="myname">
  import { onDestroy } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
if (window) {
    const __window_test__myname = {
      someFunc, someOtherFunc, f, f4, f2, f3
    };
    window.__test__ = {};
    window.__test__.myname = __window_test__myname;
  }
  onDestroy(() => {
    delete window.__test__.myname;
  });</script>`;

  t.equal(processed.code.trim(), expected);
  t.end();
});

test('Should also import onDestroy if one is not found', async t => {
  const script = `<script test="myname">
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  const processed = await preprocess(script, attachToWindow(true));
  const expected = `<script test="myname">
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
import { onDestroy } from 'svelte';
  if (window) {
    const __window_test__myname = {
      someFunc, someOtherFunc, f, f4, f2, f3
    };
    window.__test__ = {};
    window.__test__.myname = __window_test__myname;
  }
  onDestroy(() => {
    delete window.__test__.myname;
  });</script>`;

  t.equal(processed.code.trim(), expected);
  t.end();
});

test('should not care about about locally renamed imports', async t => {
  const script = `<script test="myname">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  const processed = await preprocess(script, attachToWindow(true));
  const expected = `<script test="myname">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
import { onDestroy } from 'svelte';
  if (window) {
    const __window_test__myname = {
      someFunc, someOtherFunc, f, f4, f2, f3
    };
    window.__test__ = {};
    window.__test__.myname = __window_test__myname;
  }
  onDestroy(() => {
    delete window.__test__.myname;
  });</script>`;

  t.equal(processed.code.trim(), expected);
  t.end();
});

test("should not run if false is passed as the 'shouldrun' parameter", async t => {
  const script = `<script test="myname">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  const processed = await preprocess(script, attachToWindow(false));
  const expected = `<script test="myname">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  t.equal(processed.code, expected);
  t.end();
});

test("should respect the 'testName' value on the attribute", async t => {
  const script = `<script test="scoobydoo">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  const processed = await preprocess(script, attachToWindow(true));
  const expected = `<script test="scoobydoo">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
import { onDestroy } from 'svelte';
  if (window) {
    const __window_test__scoobydoo = {
      someFunc, someOtherFunc, f, f4, f2, f3
    };
    window.__test__ = {};
    window.__test__.scoobydoo = __window_test__scoobydoo;
  }
  onDestroy(() => {
    delete window.__test__.scoobydoo;
  });</script>`;

  t.equal(processed.code.trim(), expected);
  t.end();
});

test('should allow a custom attribute name to define and name tests', async t => {
  const script = `<script didgeridoo="myname">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
</script>
  `;

  const processed = await preprocess(
    script,
    attachToWindow(true, 'didgeridoo')
  );
  const expected = `<script didgeridoo="myname">
  import { onDestroy as destroyed } from 'svelte';
  function someFunc() {}
	function someOtherFunc() {
		function nested() {}
	}
	const f = () => {}
  let f4 = () => {}
	const f2 = function() {}
  const f3 = function f3(){}
import { onDestroy } from 'svelte';
  if (window) {
    const __window_test__myname = {
      someFunc, someOtherFunc, f, f4, f2, f3
    };
    window.__test__ = {};
    window.__test__.myname = __window_test__myname;
  }
  onDestroy(() => {
    delete window.__test__.myname;
  });</script>`;

  t.equal(processed.code.trim(), expected);
  t.end();
});
