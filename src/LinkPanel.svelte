<script>
  import { createEventDispatcher } from "svelte";
  import { nodeSelected, nodeToChange, pathFinding } from "./stores.js";
  import { get } from 'svelte/store';

  let nodesPath = []
  let directLink = false

  pathFinding.nodesPath.subscribe(path => {
      directLink = false
      if (path.length == 2) {
        directLink = true
      }
      nodesPath = path
      nodesPath.pop()
      nodesPath.shift()
  })

  const dispatch = createEventDispatcher();

  function labelClick(id, change) {
    dispatch("change", id);
    const hasEnd = get(nodeSelected).end
    if (change && hasEnd) {
      nodeToChange.update(_ => change)
    }
  }
</script>

<style>
  .panel {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .directLink {
    margin: 10px;
    font-weight: bold;
  }
</style>

{#if $nodeSelected.start}
  <div class="ui segment panel">
    <h1 class="ui header">Degré de séparation</h1>
    {#if $nodeSelected.end && nodesPath.length == 0 && !directLink}
      <div class="ui active inverted dimmer">
        <div class="ui text loader">Recherche du degré de séparation</div>
      </div>
    {/if}
    <div class="ui threaded comments">
      <div class="comment">
        <a class="ui blue { $nodeToChange == 'start' ? '' : 'basic' } label" on:click={labelClick($nodeSelected.start.id, 'start')}>{$nodeSelected.start.label}</a>
        {#if directLink}
          <p class="directLink">est directement à lié</p>
        {:else if $nodeSelected.end && nodesPath.length > 0}
          <div class="comments">
            {#each nodesPath as { label, id }}
              <div class="comment">
                <a class="ui basic label" on:click={labelClick(id)}>{label}</a>
              </div>
            {/each}
          </div>
        {/if}
      </div>
      {#if $nodeSelected.end}
        <div class="comment">
          <a class="ui blue { $nodeToChange == 'end' ? '' : 'basic' } label" on:click={labelClick($nodeSelected.end.id, 'end')}>{$nodeSelected.end.label}</a>
        </div>
      {/if}
    </div>
  </div>
{/if}
