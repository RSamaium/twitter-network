<script>
  import clsx from "clsx";
  import { get } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import { db, nodes } from "./stores";
  import SearchInput from "./SearchInput.svelte";
  import LinkPanel from "./LinkPanel.svelte";
  import { nodeSelected, pathFinding, nodeToChange } from "./stores.js";

  const dispatch = createEventDispatcher();

  let name;
  let found = [];
  let dropdownShow = false;
  let err = null;
  let currentSearch = "";

  $: dropdownStyle = clsx(dropdownShow ? "display: block" : "display: none");

  function search(event) {
    if (event.keyCode != 13) return;
    if (currentSearch == "") return;
    found = db.search(currentSearch, 10).map(id => nodes.get(id));
    centerTo();
  }

  function centerTo() {
    const [node] = db.search(currentSearch, 1).map(id => nodes.get(id));
    if (!node) {
      err = "Impossible à trouver ce compte";
    }
    nodeSelected.update(obj => {
      const prop = get(nodeToChange);
      const firstTime = !obj.start;
      let path
      obj[prop] = node;
      if (firstTime) {
        nodeToChange.update(_ => "end");
      }
      if (obj.start && obj.end) {
        pathFinding.nodesPath.reset()
        pathFinding.find(obj.start.id, obj.end.id)
      }
      dispatch("search", {
        node,
        path
      });
      return obj;
    });
    currentSearch = "";
  }
</script>

<style>
  .dropdown-menu {
    width: 100%;
  }
</style>

<div class="searchBar">
  <SearchInput on:keypress={search} bind:value={currentSearch} />
  <LinkPanel on:change />
</div>
