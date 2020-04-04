<script>
  import { createEventDispatcher } from "svelte";
  import { nodeSelected, nodeToChange, pathFinding } from "./stores.js";
  import { get } from 'svelte/store';

  let nodesPath = pathFinding.nodesPath

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
</style>

{#if $nodeSelected.start}
  <div class="ui segment panel">
    <div class="ui threaded comments">
      <div class="comment">
        <a class="ui blue { $nodeToChange == 'start' ? '' : 'basic' } label" on:click={labelClick($nodeSelected.start.id, 'start')}>{$nodeSelected.start.label}</a>
        {#if $nodeSelected.end && $nodesPath.length > 0}
          <div class="comments">
            {#each $nodesPath as { label, id }}
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
