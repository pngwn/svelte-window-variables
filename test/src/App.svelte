<script boom="myspecialname">
  import Two from './Two.svelte';
  import { createEventDispatcher } from 'svelte';
  export let name;

  $: console.log(name);
  $: {
    if (true) {
      console.log(condition);
    }
  }

  let condition;

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
<button on:click={() => (condition = !condition)}>Click me</button>
{#if condition}
  <Two name="bill" />
{/if}
