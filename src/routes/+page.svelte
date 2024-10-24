<script lang="ts">
	import { onMount } from "svelte"
	import { flip } from "svelte/animate"

	const graphs: Extract<Desmos.ExpressionState, { type?: "expression" }>[] = [
		{ type: "expression", id: "graph1", latex: "y=|x|" },
		{ type: "expression", id: "graph2", latex: "y=x^2" }
	]

	let draggedGraph: HTMLDivElement
	let draggedGraphCopy: HTMLDivElement

	onMount(() => {
		document.addEventListener("mousemove", (event) => {
			if (!draggedGraphCopy) return

			draggedGraphCopy.style.top = `${event.clientY}px`
			draggedGraphCopy.style.left = `${event.clientX}px`
		})

		document.addEventListener("mouseup", () => {
			if (draggedGraphCopy) draggedGraphCopy.remove()
		})

		// const calculator = Desmos.GraphingCalculator(graph, { expressions: false })
		// calculator.setExpression({ id: "graph1", latex: "y=x^2" })
	})
</script>

<p class="text-5xl">hi</p>

<div class="flex flex-row w-full">
	<section class="w-1/2"></section>

	<section class="grid w-1/2 gap-4">
		{#each graphs as graph, i (graph.id)}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				role="listitem"
				class="p-2 w-min"
				onmousedown={(event) => {
					console.log(event.currentTarget)
					const graphItem = event.currentTarget as HTMLDivElement
					const cloned = graphItem.cloneNode(true) as HTMLDivElement

					cloned.classList.add("fixed", "z-50", "transform", "-translate-x-1/2", "-translate-y-1/2")
					document.body.append(cloned)

					cloned.style.top = `${event.clientY}px`
					cloned.style.left = `${event.clientX}px`

					draggedGraphCopy = cloned
				}}
				onmouseup={(event) => {}}
			>
				<div class="h-64 w-64"></div>
				<div
					class="flex flex-row place-content-center cursor-pointer hover:bg-black/10 mt-1 rounded-lg p-1 transition duration-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.6"
						stroke="currentColor"
						class="size-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
					</svg>
				</div>
			</div>
		{/each}
	</section>
</div>
