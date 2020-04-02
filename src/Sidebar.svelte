<script>
  import clsx from "clsx";
  import { createEventDispatcher } from 'svelte';
  import { Field, Input, Button } from "svelma";
  import { db, nodes } from "./stores";

  const dispatch = createEventDispatcher();

  let name;
  let found = [];
  let dropdownShow = false;
  let err = null

  $: dropdownStyle = clsx(dropdownShow ? "display: block" : "display: none");

  function search(event) {
    const { value } = event.detail.target;
    if (value == "") return;
    found = db.search(value, 10).map(id => nodes.get(id));
  }

  function centerTo() {
    const [node] = db.search(name, 1).map(id => nodes.get(id));
    if (!node) {
      err = 'Impossible à trouver ce compte'
    }
    dispatch('search', {
			 node
		});
  }
</script>

<style>
  .sidebar {
    position: absolute;
    right: 0px;
    bottom: 0px;
    top: 0px;
    width: 400px;
    background-color: white;
  }

  .dropdown-menu {
    width: 100%;
  }
</style>

<div class="sidebar">
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
</div>
