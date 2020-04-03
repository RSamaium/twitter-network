<script>
  import { onMount, setContext } from "svelte";
  import sigma from "sigma";
  import Sidebar from "./Sidebar.svelte";

  export let nodes;
  export let edges;

  let element;

  const s = new sigma();

  onMount(() => {
    s.addRenderer({
      container: element
    });
    s.settings({
      defaultEdgeColor: "rgba(0, 0, 0, 0.2)",
      defaultLabelColor: "#fff",
      labelThreshold: 10,
      zoomMin: 0.01,
      zoomMax: 0.8,
      batchEdgesDrawing: true,
      hideEdgesOnMove: true,
      webglEdgesBatchSize: 5000,
      maxNodeSize: 18,
      minNodeSize: 0.1,
      minEdgeSize: 0.01,
      maxEdgeSize: 0.01
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
      nodes.get(edge.s).addLink(edge.t)
      s.graph.addEdge({
        id: edge.i,
        source: edge.s,
        target: edge.t,
        color: "rgba(255, 255, 255, 0.02)",
        size: 0.02
      });
    }

    s.refresh();
  });

  function moveTo({ detail }) {
    const { node } = detail;
    const n = s.graph.nodes(node.id)
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
     })
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
<Sidebar {nodes} on:search={moveTo}  on:change={clickLabel}/>
