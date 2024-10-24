<script lang="ts">
	import { onMount } from "svelte"
	import { flip } from "svelte/animate"

	const graphs: (Extract<Desmos.ExpressionState, { type?: "expression" }> & { solved: boolean })[] =
		[
			{ type: "expression", id: "graph1", latex: "y=|x|", solved: false },
			{ type: "expression", id: "graph2", latex: "y=x^2", solved: false }
		]

	let draggedGraph: HTMLDivElement | null
	let draggedGraphCopy: HTMLDivElement | null

	let consideredAnswer: HTMLDivElement | null

	onMount(() => {
		document.addEventListener("mousemove", (event) => {
			if (!draggedGraphCopy) return

			draggedGraphCopy.style.top = `${event.clientY}px`
			draggedGraphCopy.style.left = `${event.clientX}px`
		})

		document.addEventListener("mouseup", () => {
			if (draggedGraphCopy) {
				draggedGraphCopy.remove()
				draggedGraphCopy = null
			}
		})
		// const calculator = Desmos.GraphingCalculator(graph, { expressions: false })
		// calculator.setExpression({ id: "graph1", latex: "y=x^2" })
	})
</script>

<div class="flex flex-row w-full p-2">
	<section class="grid w-1/2 gap-4 grid-cols-3">
		{#each graphs as graph}<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="rounded-lg px-4 py-2 border border-neutral-200 max-h-80 h-32 transition duration-200"
				onmouseenter={(event) => {
					if (draggedGraphCopy) event.currentTarget.classList.add("bg-neutral-400/30")
				}}
				onmouseleave={(event) => {
					if (draggedGraphCopy) event.currentTarget.classList.remove("bg-neutral-400/30")
				}}
			>
				<p class="text-xl font-anonymous-pro font-bold">{graph.latex}</p>
			</div>
		{/each}
	</section>

	<section class="grid w-1/2 gap-4 grid-cols-3">
		{#each graphs as graph, i (graph.id)}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				role="listitem"
				class="p-2 w-min"
				onmousedown={(event) => {
					const graphItem = event.currentTarget as HTMLDivElement
					const cloned = graphItem.cloneNode(true) as HTMLDivElement

					const rect = graphItem.getBoundingClientRect()

					cloned.classList.add("fixed", "z-50", "select-none", "pointer-events-none")
					document.body.append(cloned)

					cloned.style.transform = `translate(-50%, -${Math.abs(rect.height - 20)}px)`
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
