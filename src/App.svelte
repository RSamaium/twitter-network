<script>
	import NetworkCanvas from './NetworkCanvas.svelte'
	import { dbInit } from './stores'
	
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
			.catch (err => {
				console.error(err)
			})
	}
</script>

{#await loading}
	<div class="loading">
		<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
		<p style="color: white">Patientez, le chargement des données peut être un peu long...</p>
	</div>
{:then result}
	<NetworkCanvas nodes={result.nodes} edges={result.edges} />
{:catch error}
	<p style="color: red">Error</p>
{/await}