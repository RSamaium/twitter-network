<script>
  import { getContext, afterUpdate } from "svelte";
  import * as THREE from "three/build/three.module.js";
  import { CSS2DObject } from "./vendor/css2drenderer";
  import Label from "./Label.svelte";

  const fragmentShader = `
    uniform vec3 color;
    uniform sampler2D pointTexture;

    varying vec3 vColor;

    void main() {

        gl_FragColor = vec4( vColor.r, vColor.g, vColor.b, 1.0 );

        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

        if ( gl_FragColor.a < ALPHATEST ) discard;

    }
`;
  const vertexShader = `
    attribute float size;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {

        vColor = customColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = size * ( 300.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition;

    }
`;

  export let nodes;
  export let scale;

  const { getScene } = getContext("three");
  const circle_sprite = new THREE.TextureLoader().load(
    "./sprites/circle-sprite.png"
  );

  let pointsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: {
        value: circle_sprite
      }
    },
    vertexShader,
    fragmentShader,
    alphaTest: 0.9,
    transparent: true,
    depthTest: true
  });

  const nodesLength = nodes.size;
  const positions = new Float32Array(nodesLength * 3);
  const colors = new Float32Array(nodesLength * 3);
  const sizes = new Float32Array(nodesLength);

  const vertex = new THREE.Vector3();
  const color = new THREE.Color();

  const labelContainer = new THREE.Object3D();

  // Just test
  const nodeBySize = {};

  let i = 0
  for (let [id, node] of nodes) {

    vertex.x = node.x;
    vertex.y = node.y;
    vertex.z = 0;
    vertex.toArray(positions, i * 3);

    color.setRGB(...node.getRGB());
    color.toArray(colors, i * 3);

    sizes[i] = node.size;

    const text = document.createElement("div");
    const labelComponent = new Label({
      target: text,
      props: {
        name: node.label
      }
    });

    const label = new CSS2DObject(text);
    label.position.copy(vertex);

   /* // TODO, Test
    if (nodeSize == 600) labelContainer.add(label);

    // Just test
    nodeBySize[nodeSize] = label;
    */
    i++
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const points = new THREE.Points(geometry, pointsMaterial);

  afterUpdate(() => {
    // TODO
  });

  getScene().add(points);
  getScene().add(labelContainer);
</script>
