<script lang="ts">
	import { onMount } from "svelte"
	import toast from "svelte-french-toast"
	import { flip } from "svelte/animate"

	let graphs: (Extract<Desmos.ExpressionState, { type?: "expression" }> & {
		solved: boolean
		rendered: boolean
		dataUri?: string
	})[][] = $state([
		[{ type: "expression", id: "graph1", latex: String.raw`y=x`, solved: false, rendered: false }]
	])

	let draggedGraph: HTMLDivElement | null
	let draggedGraphCopy: HTMLDivElement | null

	let actualAnswer: string | null
	let consideredAnswer: string | null

	let calcElement: HTMLDivElement
	let calc: Desmos.Calculator

	const check = ({
		consideredAnswer,
		actualAnswer
	}: {
		consideredAnswer: string
		actualAnswer: string
	}) => {
		if (consideredAnswer.trim() != actualAnswer.trim()) return toast.error("아님ㄴ")

		toast.success(`맞음ㅁ (${actualAnswer})`)

		const i = graphs.findIndex(({ latex }) => latex == actualAnswer)
		const original = graphs.at(i)

		graphs[i] = { ...original!, solved: true }
	}

	const addGraph = () => {
		const graphs = calc.getExpressions()

	}

	onMount(() => {
		calc = Desmos.GraphingCalculator(calcElement)

		document.addEventListener("mousemove", (event) => {
			if (!draggedGraphCopy) return

			draggedGraphCopy.style.top = `${event.clientY}px`
			draggedGraphCopy.style.left = `${event.clientX}px`
		})

		document.addEventListener("mouseup", () => {
			if (!draggedGraphCopy) return
			if (consideredAnswer && actualAnswer) check({ consideredAnswer, actualAnswer })

			draggedGraphCopy.remove()
			draggedGraphCopy = null
		})
	})

	$effect(() => {
		graphs.forEach((graph, i) => {
			const graphElement = document.querySelector(`[data-latex='${graph.id}_${graph.latex}']`)

			if (!graphElement) return
			if (graph.rendered) return

			const calculator = Desmos.GraphingCalculator(graphElement as HTMLDivElement, {
				expressions: false
			})

			calculator.setExpression(graph)

			graphs[i] = { ...graphs[i], rendered: true }

			calculator.asyncScreenshot({ format: "png" }, (dataUri) => {
				graphs[i].dataUri = dataUri
			})
		})
	})

	// TODO: add shuffling
</script>

<div class="fixed inset-0 bg-black/40 px-32 py-24 z-20">
	<div class="bg-white rounded-lg p-3 relative">
		<p class="text-2xl font-semibold">Add a graph</p>
		<p class="text-base mt-0.5">Only the last graph will be shown.</p>
		<div bind:this={calcElement} id="calc" class="mt-3 w-full h-[70vh]"></div>

		<button
			onclick={addGraph}
			class="absolute right-4 bottom-4 bg-black p-4 rounded-full"
			aria-label="Check"
			type="button"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="white"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
			</svg>
		</button>
	</div>
</div>

<div class="flex flex-row w-full p-2">
	<section class="grid w-1/2 gap-4 grid-cols-3">
		{#each graphs as graph}<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="select-none rounded-lg px-4 py-2 border border-neutral-200 transition duration-200"
				onmouseenter={(event) => {
					event.currentTarget.classList.add("bg-neutral-400/30")
					consideredAnswer = graph.latex ?? null
				}}
				onmouseleave={(event) => {
					event.currentTarget.classList.remove("bg-neutral-400/30")
					consideredAnswer = null
				}}
			>
				<p class="text-xl font-anonymous-pro font-bold">{graph.latex}</p>
				{#if graph.solved}
					<!-- if it's svg, {@html graph.dataUri} -->
					<img src={graph.dataUri} class="z-0 rounded-lg mt-2" alt="graph for this" />
				{/if}
			</div>
		{/each}
	</section>

	<section class="grid w-1/2 gap-4 grid-cols-3">
		{#each graphs.filter(({ solved }) => !solved) as graph, i (graph.id)}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				role="listitem"
				class="p-2 w-min bg-neutral-50 rounded-lg"
				onmousedown={(event) => {
					const graphItem = event.currentTarget as HTMLDivElement
					const cloned = graphItem.cloneNode(true) as HTMLDivElement

					const rect = graphItem.getBoundingClientRect()

					cloned.classList.add("fixed", "z-50", "select-none", "pointer-events-none")

					const innerGraph = cloned.querySelector(".shown-graph")
					if (innerGraph) innerGraph.innerHTML = `<img src="${graph.dataUri}" />`

					document.body.append(cloned)

					cloned.style.transform = `translate(-50%, -${Math.abs(rect.height - 20)}px)`
					cloned.style.top = `${event.clientY}px`
					cloned.style.left = `${event.clientX}px`

					draggedGraphCopy = cloned
					actualAnswer = graph.latex ?? null
				}}
			>
				<div class="h-64 w-64 shown-graph" data-latex={`${graph.id}_${graph.latex}`}></div>
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
