<script>
  import clsx from "clsx";
  import { get } from 'svelte/store';
  import { createEventDispatcher } from "svelte";
  import { db, nodes } from "./stores";
  import SearchInput from "./SearchInput.svelte";
  import LinkPanel from "./LinkPanel.svelte";
  import { nodeSelected, route, nodeToChange } from "./stores.js";

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
      const prop = get(nodeToChange)
      const firstTime = !obj.start;
        obj[prop] = node;
        if (firstTime) {
          nodeToChange.update(_ => "end");
        }
        if (obj.start && obj.end) {
          const ret = route.path(obj.start.id, obj.end.id);
          obj.path = ret.map(id => nodes.get(id));
          obj.path.pop()
          obj.path.shift()
        }
      return obj;
    });
    currentSearch = ''
    dispatch("search", {
      node
    });
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

<!--<div class="sidebar">
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Title</h1>

        <Field>
          <Input
            bind:value={name}
            on:input={search}
            on:focus={(dropdownShow = true)}
            on:blur={(dropdownShow = false)} />
          <p class="control">
            <Button type="is-primary" on:click={centerTo}>Chercher !</Button>
          </p>
          <div
            class="dropdown-menu"
            id="dropdown-menu"
            role="menu"
            style={dropdownStyle}>
            <div class="dropdown-content">
              {#each found as { l }, i}
                <a class="dropdown-item">{l}</a>
              {/each}
            </div>
          </div>
        </Field>

      </div>
    </div>
  </section>
</div>-->
