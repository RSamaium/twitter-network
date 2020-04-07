<script>
  import { onMount, setContext } from "svelte";
  import sigma from "sigma";
  import Sidebar from "./Sidebar.svelte";
  import { pathFinding } from "./stores.js";
  import notyf from "./notification";

  export let nodes;
  export let edges;

  let s = new sigma();
  let element;

  let memoryLines = [];
  let memoryNodes = [];
  let firstSearch = true;

  onMount(() => {
    s.settings({
      defaultEdgeColor: "rgba(0, 0, 0, 0.2)",
      defaultLabelColor: "#fff",
      labelThreshold: 7,
      zoomMin: 0.01,
      zoomMax: 0.8,
      batchEdgesDrawing: true,
      hideEdgesOnMove: true,
      webglEdgesBatchSize: 5000,
      maxNodeSize: 18,
      minNodeSize: 0.1,
      minEdgeSize: 0,
      maxEdgeSize: 0
    });

    s.addRenderer({
      container: element
    });

    for (let [id, node] of nodes) {
      s.graph.addNode({
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color
      });
    }

    for (let edge of edges) {
      nodes.get(edge.s).addLink(edge.t);
      s.graph.addEdge({
        id: edge.i,
        source: edge.s,
        target: edge.t,
        color: "rgba(255, 255, 255, 0.02)",
        size: 0.01
      });
    }

    s.refresh();

    notyf.open({
      type: "info",
      message: `Bienvenue sur l'interface interactive du réseau Twitter expliqué sur la 
      <a href="https://www.youtube.com/watch?v=UX7YQ6m2r_o" target="_blank">vidéo Youtube de la chaîne Fouloscopie</a>. Le but est de 
      trouver le degré de séparation entre deux comptes Twitter. Pour commencer, recherchez un compte et tapez sur la touche Entrée.`
    });
  });

  pathFinding.nodesPath.subscribe(path => {
    memoryNodes.forEach(id => s.graph.dropNode(id));
    memoryLines.forEach(id => s.graph.dropEdge(id));
    memoryNodes = [];
    memoryLines = [];
    for (let i = 0; i < path.length; i++) {
      const id = Math.random() + "";
      const node = path[i];
      memoryNodes.push(id + "-node");
      s.graph.addNode({
        id: id + "-node",
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: "#ff000"
      });
      if (i == path.length - 1) continue;
      memoryLines.push(id);
      s.graph.addEdge({
        id,
        source: node.id,
        target: path[i + 1].id,
        color: "#ff000",
        size: 1
      });
    }
    if (firstSearch && path.length >= 2) {
      const nbAccount = path.length - 2;
      const firstAccount = path[0].label;
      const endAccount = path[path.length - 1].label;
      notyf.dismissAll();
      notyf.open({
        type: "info",
        message: `Super ! Sur le panneau en haut à droite de votre écran, vous avez ${nbAccount} compte${
          nbAccount > 1 ? "s" : ""
        } séparant ${firstAccount} et ${endAccount}.
        Vous pouvez aussi visualiser le chemin sur le graphe. Pour refaire une simulation, cliquez sur un nom en bleu sur le panneau de degré de séparation et entrez à nouveau un nom dans la barre de recherche.`
      });
      firstSearch = false;
    }
    s.refresh();
  });

  function moveTo({ detail }) {
    const { node, path } = detail;
    const n = s.graph.nodes(node.id);
    sigma.misc.animation.camera(
      s.camera,
      {
        x: n[s.camera.readPrefix + "x"],
        y: n[s.camera.readPrefix + "y"],
        ratio: 0.1
      },
      { duration: 1000 }
    );
  }

  function clickLabel(ev) {
    moveTo({
      detail: {
        node: {
          id: ev.detail
        }
      }
    });
  }
</script>

<style>
  div {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={element} />
<Sidebar {nodes} on:search={moveTo} on:change={clickLabel} />
