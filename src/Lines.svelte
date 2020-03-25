<script>
  import { getContext, afterUpdate } from "svelte";
  import * as THREE from "three/build/three.module.js";

  export let edges;
  export let nodes
  export let scale = 0.03

  const { getScene } = getContext("three");

  const geometry = new THREE.Geometry();

  for (let edge of edges) {
    const { s: source, t: target } = edge;
    const sourcePos = nodes[source].p;
    const targetPos = nodes[target].p;
    geometry.vertices.push(new THREE.Vector3(sourcePos[0], sourcePos[1], 0));
    geometry.vertices.push(new THREE.Vector3(targetPos[0], targetPos[1], 0));
  }

  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 0.002,
    opacity: 0.01,
    transparent: true
  });

  const lines = new THREE.LineSegments(geometry, material);

  afterUpdate(() => {
    lines.material.opacity = scale / 3;
    lines.geometry
  })

  getScene().add(lines);
</script>
