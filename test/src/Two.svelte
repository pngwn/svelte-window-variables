<script boom="nametwo">
  import { createEventDispatcher } from 'svelte';
  export let name;

  function someFunction() {
    console.log('boom');
  }

  const dispatch = createEventDispatcher();
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {name}!</h1>
<button on:click={() => dispatch('event')}>Click me</button>
