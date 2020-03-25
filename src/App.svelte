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
				dbInit(data)
				return data
			})
	}
</script>

{#await loading}
	<div class="loading">
		<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
	</div>
{:then result}
	<NetworkCanvas nodes={result.n} edges={result.e} />
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}