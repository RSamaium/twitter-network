<script>
  import { onMount, setContext } from "svelte";
  import sigma from "sigma";
  import Sidebar from "./Sidebar.svelte";
  import { pathFinding } from "./stores.js";

  export let nodes;
  export let edges;

  let element;

  const s = new sigma();
  let memoryLines = [];
  let memoryNodes = [];

  onMount(() => {
    s.addRenderer({
      container: element
    });
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
  });

  pathFinding.nodesPath.subscribe(path => {
    memoryNodes.forEach(id => s.graph.dropNode(id));
    memoryLines.forEach(id => s.graph.dropEdge(id));
    memoryNodes = []
    memoryLines = []
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
