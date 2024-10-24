<script lang="ts">
	import { onMount } from "svelte"

	let graph: HTMLDivElement

	onMount(() => {
		const calculator = Desmos.GraphingCalculator(graph)
	
  
  })
</script>

<p class="text-5xl">hi</p>

<div class="h-[500px] w-[500px]" bind:this={graph}></div>
