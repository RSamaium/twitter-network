<script>
  import { onMount, setContext } from "svelte";
  import * as d3 from "d3";
  import * as THREE from "three/build/three.module.js";
  import { CSS2DRenderer } from "./vendor/css2drenderer";
  import Node from "./Node.svelte";
  import Lines from "./Lines.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { currentNode } from './stores.js';

  export let nodes;
  export let edges;

  let element;
  let view;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const vizWidth = width;
  const fov = 170;
  const near = 50;
  const far = 1100;

  let scale;

  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  setContext("three", {
    getScene: () => scene
    // getSceneLabels: () => labelRenderer
  });

  onMount(() => {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 10;

    let labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";

    element.appendChild(labelRenderer.domElement);

    view = d3.select(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }

    const zoom = d3
      .zoom()
      .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
      .on("zoom", () => {
        let d3Transform = d3.event.transform;
        zoomHandler(d3Transform);
        window.addEventListener( 'change', animate );
      });

    view.on("click", () => {
      const [mouseX, mouseY] = d3.mouse(view.node());
      checkIntersects([mouseX, mouseY]);
    });

    function mouseToThree(mouseX, mouseY) {
      return new THREE.Vector3(
        (mouseX / vizWidth) * 2 - 1,
        -(mouseY / height) * 2 + 1,
        1
      );
    }

    function checkIntersects(mouse_position) {
      const points = scene.children[1]
      let mouse_vector = mouseToThree(...mouse_position);
      raycaster.setFromCamera(mouse_vector, camera);
      let intersects = raycaster.intersectObject(points);
      if (intersects[0]) {
        let intersect = intersects[0];
        let index = intersect.index;
        const node  = nodes[index];
        currentNode.set(node)
      } else {
        
      }
    }

    function setUpZoom() {
      view.call(zoom);
      const initialScale = getScaleFromZ(far);
      const initialTransform = d3.zoomIdentity
        .translate(vizWidth / 2, height / 2)
        .scale(initialScale);
      zoom.transform(view, initialTransform);
      camera.position.set(0, 0, far);
    }

    function zoomHandler(d3Transform) {
      scale = d3Transform.k;
      let x = -(d3Transform.x - vizWidth / 2) / scale;
      let y = (d3Transform.y - height / 2) / scale;
      let z = getZFromScale(scale);
      camera.position.set(x, y, z);
    }

    function getScaleFromZ(cameraZposition) {
      const halfFov = fov / 2;
      const halfFovRadians = toRadians(halfFov);
      const halfFovHeight = Math.tan(halfFovRadians) * cameraZposition;
      const fovHeight = halfFovHeight * 2;
      const scale = height / fovHeight;
      return scale;
    }

    function getZFromScale(scale) {
      const halfFov = fov / 2;
      const halfFovRadians = toRadians(halfFov);
      const scaleHeight = height / scale;
      const cameraZposition = scaleHeight / (2 * Math.tan(halfFovRadians));
      return cameraZposition;
    }

    function toRadians(angle) {
      return angle * (Math.PI / 180);
    }


    setUpZoom();
    animate();
  });

  function moveTo({ detail }) {
    const { node } = detail
    //camera.position.set(node.p[0], node.p[1], 0);
  }
</script>

<div bind:this={element}>
  <Lines {nodes} {edges} {scale} />
  <Node {nodes} {scale} />
  <Sidebar {nodes} on:search={moveTo} />
</div>
