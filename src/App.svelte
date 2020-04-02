<script>
	import NetworkCanvas from './NetworkCanvas.svelte'
	import { dbInit } from './stores'
	import '../node_modules/bulma/css/bulma.css'

	let nodes, edges
	let loading = load()

	function load() {
		return fetch('./data.json')
			.then(res => res.json())
			.then(data => {
				const nodes = dbInit(data.n)
				return {
					nodes,
					edges: data.e
				}
			})
	}
</script>

{#await loading}
	<div class="loading">
		<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
	</div>
{:then result}
	<NetworkCanvas nodes={result.nodes} edges={result.edges} />
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}