<script>
  import clsx from "clsx";
  import { get } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import { db, nodes } from "./stores";
  import SearchInput from "./SearchInput.svelte";
  import LinkPanel from "./LinkPanel.svelte";
  import { nodeSelected, pathFinding, nodeToChange } from "./stores.js";
  import notyf from './notification'
  import GithubIcon from './GithubIcon.svelte'
  import Help from './Help.svelte'

  const dispatch = createEventDispatcher();

  let name;
  let dropdownShow = false;
  let err = null;
  let currentSearch = "";
  let firstSearch = true
  let secondSearch = true

  $: dropdownStyle = clsx(dropdownShow ? "display: block" : "display: none");

  function search(event) {
    if (event.keyCode != 13) return;
    if (currentSearch == "") return;
    centerTo();
  }

  function centerTo() {
    const [node] = db.search(currentSearch, 1).map(id => nodes.get(id));
    if (!node) {
      notyf.error('Impossible à trouver ce compte Twitter')
      return
    }
    nodeSelected.update(obj => {
      const prop = get(nodeToChange);
      const firstTime = !obj.start
      let path
      obj[prop] = node;
      if (firstTime) {
        nodeToChange.set("end");
      }
      if (firstSearch) {
        notyf.dismissAll()
        notyf.open({
          type: 'info',
          message: `Très bien ! Maintenant, faites à nouveau une recherche pour calculer le degré de séparation entre les deux comptes Twitter`
        });
        firstSearch = true
      }
      if (obj.start && obj.end) {
        if (secondSearch) {
          notyf.dismissAll()
          notyf.open({
            type: 'info',
            message: `Patientez, le calcul de degré de séparation est en cours`
          });
          secondSearch = false
        }
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

  .github-icon {
    position: absolute;
    bottom: 20px;
    right : 20px
  }

  .help {
    position: absolute;
    bottom: 20px;
    left : 20px
  }
</style>

<div class="searchBar">
  <SearchInput on:keypress={search} bind:value={currentSearch} />
  <LinkPanel on:change />
  <div class="github-icon">
    <GithubIcon width="30px" height="30px" href="https://github.com/RSamaium/twitter-network" />
  </div>
  <div class="help"> <Help /></div>
</div>
