import { useEffect, useRef, useState } from 'react';
import { Button } from '@fluentui/react-components';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface InteractiveCampus3DProps {
  selectedId: string;
  onSelect: (id: string) => void;
  screenMessage: string;
  motionDetected: boolean;
  isDim: boolean;
  windmillOn: boolean;
  servoAngle: number;
  temperature: number;
  humidity: number;
  buzzerOn: boolean;
}

interface BuildingSpec {
  id: string;
  name: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  floors: number;
}

const buildingSpecs: BuildingSpec[] = [
  { id: 'wellbeing-centre', name: 'WELLBEING CENTRE', x: -3.25, z: -2.05, width: 2.75, depth: 2.05, height: 1.7, color: '#d8d3c8', floors: 2 },
  { id: 'smart-classrooms', name: 'SMART CLASSROOMS', x: 2.1, z: -2.05, width: 3.15, depth: 2.15, height: 2.35, color: '#d2dcda', floors: 3 },
  { id: 'healthy-lifestyle', name: 'HEALTHY LIFESTYLE', x: 2.05, z: 2.0, width: 2.85, depth: 2.0, height: 1.75, color: '#dfcfad', floors: 2 },
  { id: 'relaxation-garden', name: 'RELAXATION GARDEN', x: -3.3, z: 2.2, width: 2.6, depth: 2.05, height: 0.6, color: '#a9bd97', floors: 1 },
];

export function InteractiveCampus3D(props: InteractiveCampus3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [renderError, setRenderError] = useState('');
  const [isReady, setIsReady] = useState(false);
  propsRef.current = props;
  const { selectedId, screenMessage, motionDetected, isDim, temperature, humidity, buzzerOn } = props;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (typeof window.WebGL2RenderingContext === 'undefined') {
      setRenderError('This browser does not support WebGL 2, which is needed to display the interactive 3D model.');
      setIsReady(false);
      return undefined;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (error) {
      console.error('Unable to initialize the 3D campus renderer.', error);
      setRenderError('3D graphics are unavailable in this browser. Try enabling hardware acceleration or using a browser with WebGL support.');
      setIsReady(false);
      return undefined;
    }

    setRenderError('');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D school campus. Drag to rotate and use the mouse wheel or a pinch gesture to zoom.');
    container.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#dce7ed');
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(10.5, 10.5, 13);
    camera.lookAt(0.35, 0.85, 0.1);
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    cameraRef.current = camera;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0.35, 0.85, 0.1);
    controls.minDistance = 9;
    controls.maxDistance = 26;
    controls.maxPolarAngle = Math.PI / 2.05;
    setIsReady(true);

    scene.add(new THREE.HemisphereLight('#f7fff9', '#637568', 2.1));
    const sun = new THREE.DirectionalLight('#fff2d6', 3.1);
    sun.position.set(-7, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -9;
    sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.bias = -0.00015;
    sun.shadow.radius = 4;
    scene.add(sun);

    function addBox(
      parent: THREE.Object3D,
      width: number,
      height: number,
      depth: number,
      color: THREE.ColorRepresentation,
      x: number,
      y: number,
      z: number,
      options: { roughness?: number; metalness?: number; emissive?: THREE.ColorRepresentation; emissiveIntensity?: number } = {},
    ): THREE.Mesh {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({
          color,
          roughness: options.roughness ?? 0.78,
          metalness: options.metalness ?? 0,
          emissive: options.emissive ?? '#000000',
          emissiveIntensity: options.emissiveIntensity ?? 0,
        }),
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addCylinder(
      parent: THREE.Object3D,
      radiusTop: number,
      radiusBottom: number,
      height: number,
      color: THREE.ColorRepresentation,
      x: number,
      y: number,
      z: number,
    ): THREE.Mesh {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 12),
        new THREE.MeshStandardMaterial({ color, roughness: 0.76 }),
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }

    const groundLevel = 0.22;
    addBox(scene, 12, 0.36, 10, '#637a6d', 0, 0, 0);
    addBox(scene, 11.9, 0.08, 9.9, '#b9d1a9', 0, 0.2, 0);

    addBox(scene, 11.9, 0.025, 0.84, '#aaa995', 0, groundLevel, 0);
    addBox(scene, 0.86, 0.03, 9.8, '#b7b39f', 0, groundLevel + 0.005, 0);
    addBox(scene, 11.9, 0.018, 0.05, '#f4edcf', 0, groundLevel + 0.022, 0);
    addBox(scene, 0.05, 0.018, 9.8, '#f4edcf', 0, groundLevel + 0.025, 0);

    const zoneGroups: THREE.Group[] = [];
    function addFacadeWindow(
      parent: THREE.Group,
      face: 'front' | 'right',
      horizontal: number,
      centerY: number,
      facePosition: number,
      width: number,
      height: number,
    ): void {
      const frameColor = '#eee9df';
      const frameDepth = 0.065;
      if (face === 'front') {
        addBox(parent, width, height, 0.055, '#344a4b', horizontal, centerY, facePosition + 0.025);
        addBox(parent, width - 0.12, height - 0.12, 0.022, '#6398a3', horizontal, centerY, facePosition + 0.065, { metalness: 0.18, roughness: 0.22 });
        addBox(parent, 0.045, height - 0.1, frameDepth, frameColor, horizontal, centerY, facePosition + 0.085);
        addBox(parent, width - 0.1, 0.045, frameDepth, frameColor, horizontal, centerY, facePosition + 0.085);
        addBox(parent, width + 0.12, 0.06, 0.14, '#e8e2d7', horizontal, centerY - height / 2 - 0.055, facePosition + 0.06);
        return;
      }

      addBox(parent, 0.055, height, width, '#344a4b', facePosition + 0.025, centerY, horizontal);
      addBox(parent, 0.022, height - 0.12, width - 0.12, '#6398a3', facePosition + 0.065, centerY, horizontal, { metalness: 0.18, roughness: 0.22 });
      addBox(parent, frameDepth, height - 0.1, 0.045, frameColor, facePosition + 0.085, centerY, horizontal);
      addBox(parent, frameDepth, 0.045, width - 0.1, frameColor, facePosition + 0.085, centerY, horizontal);
      addBox(parent, 0.14, 0.06, width + 0.12, '#e8e2d7', facePosition + 0.06, centerY - height / 2 - 0.055, horizontal);
    }

    for (const spec of buildingSpecs) {
      const group = new THREE.Group();
      group.userData.zoneId = spec.id;
      group.name = spec.name;
      const isGarden = spec.id === 'relaxation-garden';
      const centerY = groundLevel + spec.height / 2;
      const visualHeight = isGarden ? 1.7 : spec.height;
      const frontFace = spec.depth / 2;
      const rightFace = spec.width / 2;

      if (isGarden) {
        addBox(group, spec.width, 0.12, spec.depth, '#899a7f', 0, groundLevel + 0.06, 0);
        for (const [postX, postZ] of [
          [-spec.width / 2 + 0.12, -spec.depth / 2 + 0.12],
          [spec.width / 2 - 0.12, -spec.depth / 2 + 0.12],
          [-spec.width / 2 + 0.12, spec.depth / 2 - 0.12],
          [spec.width / 2 - 0.12, spec.depth / 2 - 0.12],
        ] as const) {
          addBox(group, 0.13, 1.42, 0.13, '#755d43', postX, groundLevel + 0.78, postZ);
        }
        addBox(group, spec.width + 0.2, 0.12, spec.depth + 0.2, '#546b4f', 0, groundLevel + 1.52, 0);
        addBox(group, spec.width + 0.28, 0.09, spec.depth + 0.28, '#d4c7a8', 0, groundLevel + 1.63, 0);
        addBox(group, 1.2, 0.1, 0.35, '#765d43', -0.55, groundLevel + 0.42, 0.28);
        addBox(group, 1.2, 0.34, 0.08, '#806548', -0.55, groundLevel + 0.61, 0.43);
      } else {
        const wall = addBox(group, spec.width, spec.height, spec.depth, spec.color, 0, centerY, 0);
        wall.material = new THREE.MeshStandardMaterial({
          color: spec.color,
          roughness: 0.9,
          emissive: spec.id === selectedId ? '#254e3e' : '#000000',
          emissiveIntensity: spec.id === selectedId ? 0.08 : 0,
        });

        const floorHeight = spec.height / spec.floors;
        const frontZ = frontFace + 0.025;
        const sideX = rightFace + 0.025;
        for (let floor = 0; floor < spec.floors; floor += 1) {
          const rowY = groundLevel + floorHeight * (floor + 0.54);
          const windowHeight = Math.min(0.5, floorHeight * 0.64);
          const windowWidth = spec.id === 'smart-classrooms' ? 0.53 : 0.48;
          const frontPositions = floor === 0
            ? [-spec.width * 0.31, spec.width * 0.31]
            : spec.floors === 3
              ? [-spec.width * 0.36, -spec.width * 0.12, spec.width * 0.12, spec.width * 0.36]
              : [-spec.width * 0.29, 0, spec.width * 0.29];
          for (const x of frontPositions) {
            addFacadeWindow(group, 'front', x, rowY, frontZ, windowWidth, windowHeight);
          }
          for (const z of [-spec.depth * 0.27, spec.depth * 0.27]) {
            addFacadeWindow(group, 'right', z, rowY, sideX, windowWidth, windowHeight);
          }

          if (floor > 0) {
            const bandY = groundLevel + floorHeight * floor;
            addBox(group, spec.width + 0.06, 0.065, 0.075, '#f0ebe1', 0, bandY, frontFace + 0.04);
            addBox(group, 0.075, 0.065, spec.depth + 0.06, '#f0ebe1', rightFace + 0.04, bandY, 0);
          }
        }

        for (const x of [-spec.width / 2 + 0.07, spec.width / 2 - 0.07]) {
          addBox(group, 0.12, spec.height, 0.1, '#e9e4da', x, centerY, frontFace + 0.04);
        }

        addBox(group, 0.82, 0.88, 0.09, '#e8e2d7', 0, groundLevel + 0.44, frontFace + 0.045);
        addBox(group, 0.62, 0.75, 0.055, '#52635d', 0, groundLevel + 0.375, frontFace + 0.105);
        addBox(group, 0.29, 0.25, 0.025, '#6d9fac', 0, groundLevel + 0.55, frontFace + 0.14, { metalness: 0.2, roughness: 0.24 });
        addBox(group, 0.035, 0.06, 0.035, '#c6a45e', 0.22, groundLevel + 0.34, frontFace + 0.15, { metalness: 0.6, roughness: 0.25 });
        addBox(group, 1.08, 0.1, 0.5, '#495d58', 0, groundLevel + 0.99, frontFace + 0.22, { roughness: 0.42 });
        for (const x of [-0.46, 0.46]) {
          addBox(group, 0.075, 0.42, 0.075, '#ddd8cb', x, groundLevel + 0.75, frontFace + 0.35);
        }
        addBox(group, 1.12, 0.08, 0.27, '#b7b2a7', 0, groundLevel + 0.04, frontFace + 0.15);
        addBox(group, 0.96, 0.06, 0.22, '#c8c3b9', 0, groundLevel + 0.11, frontFace + 0.37);

        const roofY = groundLevel + spec.height;
        addBox(group, spec.width + 0.22, 0.16, spec.depth + 0.22, '#c9c8c0', 0, roofY + 0.08, 0);
        const parapetY = roofY + 0.24;
        addBox(group, spec.width + 0.22, 0.18, 0.09, '#dedbd2', 0, parapetY, frontFace + 0.045);
        addBox(group, spec.width + 0.22, 0.18, 0.09, '#dedbd2', 0, parapetY, -frontFace - 0.045);
        addBox(group, 0.09, 0.18, spec.depth + 0.22, '#dedbd2', rightFace + 0.045, parapetY, 0);
        addBox(group, 0.09, 0.18, spec.depth + 0.22, '#dedbd2', -rightFace - 0.045, parapetY, 0);
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512;
        signCanvas.height = 96;
        const signContext = signCanvas.getContext('2d');
        if (signContext) {
          signContext.fillStyle = '#29463f';
          signContext.fillRect(0, 0, signCanvas.width, signCanvas.height);
          signContext.fillStyle = '#f0eadc';
          signContext.font = 'bold 27px sans-serif';
          signContext.textAlign = 'center';
          signContext.textBaseline = 'middle';
          signContext.fillText(spec.name, signCanvas.width / 2, signCanvas.height / 2, signCanvas.width - 28);
        }
        const signTexture = new THREE.CanvasTexture(signCanvas);
        signTexture.colorSpace = THREE.SRGBColorSpace;
        addBox(group, spec.width * 0.78, 0.24, 0.045, '#344e46', 0, parapetY, frontFace + 0.11, { roughness: 0.42 });
        const buildingSign = new THREE.Mesh(
          new THREE.PlaneGeometry(spec.width * 0.74, 0.19),
          new THREE.MeshBasicMaterial({ map: signTexture, toneMapped: false }),
        );
        buildingSign.position.set(0, parapetY, frontFace + 0.137);
        group.add(buildingSign);

        const rooftopUnit = addBox(group, 0.55, 0.28, 0.46, '#9da6a3', -0.65, roofY + 0.31, -0.2, { metalness: 0.12, roughness: 0.58 });
        rooftopUnit.name = 'Rooftop ventilation unit';
        for (let vent = 0; vent < 3; vent += 1) {
          addBox(group, 0.34, 0.025, 0.018, '#586866', -0.65, roofY + 0.27 + vent * 0.07, 0.04);
        }

        if (spec.id === 'smart-classrooms') {
          for (const x of [-0.25, 0.48]) {
            addBox(group, 0.58, 0.045, 0.4, '#345565', x, roofY + 0.2, 0.34, { metalness: 0.32, roughness: 0.28 });
            addBox(group, 0.62, 0.025, 0.035, '#c5c6bf', x, roofY + 0.22, 0.56);
          }
        }
      }

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(spec.width + 0.04, visualHeight + 0.04, spec.depth + 0.04)),
        new THREE.LineBasicMaterial({ color: spec.id === selectedId ? '#f0ae39' : '#597267', transparent: true, opacity: spec.id === selectedId ? 1 : 0.45 }),
      );
      outline.userData.zoneOutline = true;
      outline.position.set(0, groundLevel + visualHeight / 2, 0);
      group.add(outline);
      group.position.set(spec.x, 0, spec.z);
      scene.add(group);
      zoneGroups.push(group);
    }

    const controlStation = new THREE.Group();
    controlStation.name = 'Side-mounted Arduino and LCD station';
    addBox(controlStation, 1.8, 0.12, 1.18, '#4c6257', 0, groundLevel + 0.09, 0, { roughness: 0.46 });
    addBox(controlStation, 0.65, 0.14, 0.52, '#176442', -0.42, groundLevel + 0.21, -0.05, { roughness: 0.48 });
    addBox(controlStation, 0.22, 0.1, 0.18, '#202d2a', -0.42, groundLevel + 0.32, -0.05, { metalness: 0.12 });
    addBox(controlStation, 0.13, 0.08, 0.2, '#c6d0cc', -0.83, groundLevel + 0.25, -0.05, { metalness: 0.5 });
    for (let pin = 0; pin < 5; pin += 1) {
      addBox(controlStation, 0.045, 0.045, 0.22, '#d6bc71', -0.67 + pin * 0.12, groundLevel + 0.22, 0.33, { metalness: 0.65, roughness: 0.3 });
    }
    const servo = new THREE.Group();
    servo.position.set(-0.54, groundLevel + 0.36, -0.34);
    addBox(servo, 0.62, 0.075, 0.1, '#e3ad48', 0.31, 0, 0);
    servo.name = 'servoArm';
    controlStation.add(servo);

    const lcdCanvas = document.createElement('canvas');
    lcdCanvas.width = 960;
    lcdCanvas.height = 540;
    const context = lcdCanvas.getContext('2d');
    function drawLcd(message: string, motion: boolean, dim: boolean, temperatureValue: number, humidityValue: number): void {
      if (!context) return;
      context.fillStyle = '#071a1d';
      context.fillRect(0, 0, lcdCanvas.width, lcdCanvas.height);
      context.strokeStyle = '#557d72';
      context.lineWidth = 8;
      context.strokeRect(12, 12, lcdCanvas.width - 24, lcdCanvas.height - 24);
      context.fillStyle = '#123b38';
      context.fillRect(28, 28, lcdCanvas.width - 56, 106);
      context.fillStyle = '#a8f0cb';
      context.font = 'bold 39px sans-serif';
      context.fillText('AI WELLBEING', 58, 76);
      context.fillStyle = '#b7cfc2';
      context.font = '19px sans-serif';
      context.fillText('SMART CAMPUS ASSISTANT', 60, 109);
      context.fillStyle = '#71d7a8';
      context.beginPath();
      context.arc(874, 80, 14, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = '#eff7ef';
      context.font = 'bold 34px sans-serif';
      const words = message.split(/\s+/);
      const lines: string[] = [];
      let line = '';
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width > 820 && line) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line) lines.push(line);
      lines.slice(0, 3).forEach((text, index) => context?.fillText(text, 60, 220 + index * 54));

      context.fillStyle = '#123b38';
      context.fillRect(28, 426, lcdCanvas.width - 56, 84);
      context.strokeStyle = '#365e55';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(348, 440);
      context.lineTo(348, 496);
      context.moveTo(650, 440);
      context.lineTo(650, 496);
      context.stroke();
      context.fillStyle = motion ? '#f5c46e' : '#a9dbc0';
      context.font = 'bold 21px sans-serif';
      context.fillText(`PIR  ${motion ? 'MOTION' : 'CLEAR'}`, 54, 476);
      context.fillStyle = dim ? '#f5c46e' : '#a9dbc0';
      context.fillText(`LIGHT  ${dim ? 'DIM' : 'BRIGHT'}`, 382, 476);
      context.fillStyle = '#a8f0cb';
      context.fillText(`${temperatureValue}°C  ·  ${humidityValue}% RH`, 680, 476);
    }
    drawLcd(screenMessage, motionDetected, isDim, temperature, humidity);
    const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
    lcdTexture.colorSpace = THREE.SRGBColorSpace;
    addBox(controlStation, 0.1, 1.18, 0.1, '#64746d', -1.03, groundLevel + 0.69, 0.34);
    addBox(controlStation, 0.1, 1.18, 0.1, '#64746d', 1.03, groundLevel + 0.69, 0.34);
    const lcdPanel = new THREE.Group();
    lcdPanel.position.set(0, groundLevel + 1.3, 0.58);
    lcdPanel.rotation.y = Math.PI / 14;
    controlStation.add(lcdPanel);
    const lcdFrame = addBox(lcdPanel, 2.35, 1.55, 0.16, '#263a35', 0, 0, 0, { roughness: 0.3, metalness: 0.18 });
    const lcdScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.17, 1.36),
      new THREE.MeshBasicMaterial({ map: lcdTexture, toneMapped: false }),
    );
    lcdScreen.position.set(0, 0, 0.088);
    lcdPanel.add(lcdScreen);
    lcdFrame.name = 'LCD screen frame';
    controlStation.position.set(4.85, 0, 3.2);
    scene.add(controlStation);

    const indicatorColor = buzzerOn ? '#ef5748' : '#72dfaa';
    const indicator = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12),
      new THREE.MeshStandardMaterial({ color: indicatorColor, emissive: indicatorColor, emissiveIntensity: buzzerOn ? 1.4 : 0.5 }),
    );
    indicator.position.set(-0.57, groundLevel + 0.28, -0.36);
    controlStation.add(indicator);

    const motionSensor = addBox(scene, 0.38, 0.25, 0.27, motionDetected ? '#f1b643' : '#d9e1d9', 2.45, 1.78, -0.88);
    motionSensor.name = 'PIR motion sensor';
    const lightSensor = addBox(scene, 0.3, 0.18, 0.26, isDim ? '#f4c754' : '#8ca7a0', -2.6, 1.15, -1.02);
    lightSensor.name = 'LDR light sensor';
    addBox(scene, 0.35, 0.42, 0.28, '#729fa4', 2.0, 1.0, -0.86).name = `Temperature and humidity sensor: ${temperature} C, ${humidity} percent`;

    const lampBulbs: THREE.Mesh[] = [];
    for (const [x, z] of [[-4.9, 0.85], [4.9, 0.85], [-4.8, -0.85], [4.8, -0.85]] as const) {
      addCylinder(scene, 0.035, 0.05, 1.25, '#586f62', x, groundLevel + 0.625, z);
      const bulbMaterial = new THREE.MeshStandardMaterial({
        color: '#ffe9a2',
        emissive: '#ffcb54',
        emissiveIntensity: isDim || motionDetected ? 1.7 : 0.08,
      });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 12), bulbMaterial);
      bulb.position.set(x, groundLevel + 1.3, z);
      scene.add(bulb);
      lampBulbs.push(bulb);
    }

    const buzzer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.11, 24),
      new THREE.MeshStandardMaterial({ color: buzzerOn ? '#f4b942' : '#26312d', emissive: buzzerOn ? '#f45f43' : '#000000', emissiveIntensity: buzzerOn ? 1.3 : 0 }),
    );
    buzzer.position.set(0.55, groundLevel + 0.3, -0.3);
    controlStation.add(buzzer);
    buzzer.name = '5V demonstration buzzer';

    addCylinder(scene, 0.055, 0.09, 1.85, '#826b4b', -4.25, groundLevel + 0.925, 3.55);
    const rotor = new THREE.Group();
    rotor.position.set(-4.25, groundLevel + 1.85, 3.55);
    for (let blade = 0; blade < 3; blade += 1) {
      const propeller = new THREE.Group();
      propeller.rotation.z = (blade * Math.PI * 2) / 3;
      addBox(propeller, 0.13, 0.76, 0.09, '#f4b942', 0, 0.4, 0);
      rotor.add(propeller);
    }
    const hub = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({ color: '#50746a', metalness: 0.15 }),
    );
    rotor.add(hub);
    scene.add(rotor);
    rotor.name = 'Servo-powered garden windmill';

    addBox(scene, 0.9, 0.12, 0.3, '#765d43', -2.9, groundLevel + 0.36, 3.05);
    addBox(scene, 0.1, 0.34, 0.1, '#6d573f', -3.22, groundLevel + 0.17, 3.05);
    addBox(scene, 0.1, 0.34, 0.1, '#6d573f', -2.58, groundLevel + 0.17, 3.05);

    for (const [x, z] of [[-5.3, 3.7], [-2.0, 4.0], [-0.9, 4.0], [-5.2, -3.8], [5.15, -3.8]] as const) {
      addCylinder(scene, 0.1, 0.14, 0.65, '#886344', x, groundLevel + 0.325, z);
      const canopy = new THREE.Group();
      const foliage = [
        { x: 0, y: 0.32, z: 0, radius: 0.37, color: '#78936a' },
        { x: -0.22, y: 0.23, z: 0.06, radius: 0.29, color: '#6f8962' },
        { x: 0.2, y: 0.28, z: -0.04, radius: 0.31, color: '#829a70' },
        { x: 0.02, y: 0.5, z: -0.08, radius: 0.28, color: '#718b63' },
      ];
      for (const leaf of foliage) {
        const lobe = new THREE.Mesh(
          new THREE.SphereGeometry(leaf.radius, 10, 8),
          new THREE.MeshStandardMaterial({ color: leaf.color, roughness: 0.92 }),
        );
        lobe.position.set(leaf.x, leaf.y, leaf.z);
        lobe.castShadow = true;
        lobe.receiveShadow = true;
        canopy.add(lobe);
      }
      canopy.position.set(x, groundLevel + 0.65, z);
      scene.add(canopy);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart: { x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      pointerStart = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) {
        pointerStart = null;
        return;
      }
      pointerStart = null;
      const bounds = renderer.domElement.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(zoneGroups, true)[0]?.object;
      let selectedObject: THREE.Object3D | null = hit ?? null;
      while (selectedObject && typeof selectedObject.userData.zoneId !== 'string') {
        selectedObject = selectedObject.parent;
      }
      if (selectedObject) propsRef.current.onSelect(selectedObject.userData.zoneId as string);
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(container);

    let servoElapsed = 0;
    let lastLcdState = `${screenMessage}|${motionDetected}|${isDim}|${props.temperature}|${props.humidity}`;
    let previousFrameTime = performance.now();
    renderer.setAnimationLoop(() => {
      const currentFrameTime = performance.now();
      const delta = Math.min((currentFrameTime - previousFrameTime) / 1000, 0.05);
      previousFrameTime = currentFrameTime;
      const current = propsRef.current;
      if (current.windmillOn) rotor.rotation.z += delta * 1.4;
      servoElapsed += delta;
      const servo = controlStation.getObjectByName('servoArm');
      if (servo) servo.rotation.y = THREE.MathUtils.degToRad(current.servoAngle + Math.sin(servoElapsed * 2.4) * 5);
      for (const bulb of lampBulbs) {
        bulb.visible = current.isDim || current.motionDetected;
      }
      (motionSensor.material as THREE.MeshStandardMaterial).color.set(current.motionDetected ? '#f1b643' : '#d9e1d9');
      (lightSensor.material as THREE.MeshStandardMaterial).color.set(current.isDim ? '#f4c754' : '#8ca7a0');
      (indicator.material as THREE.MeshStandardMaterial).color.set(current.buzzerOn ? '#ef5748' : '#72dfaa');
      (indicator.material as THREE.MeshStandardMaterial).emissive.set(current.buzzerOn ? '#ef5748' : '#72dfaa');
      (indicator.material as THREE.MeshStandardMaterial).emissiveIntensity = current.buzzerOn ? 1.4 : 0.5;
      (buzzer.material as THREE.MeshStandardMaterial).color.set(current.buzzerOn ? '#f4b942' : '#26312d');
      (buzzer.material as THREE.MeshStandardMaterial).emissive.set(current.buzzerOn ? '#f45f43' : '#000000');
      (buzzer.material as THREE.MeshStandardMaterial).emissiveIntensity = current.buzzerOn ? 1.3 : 0;

      for (const group of zoneGroups) {
        for (const child of group.children) {
          if (child.userData.zoneOutline) {
            const outlineMaterial = (child as THREE.LineSegments).material as THREE.LineBasicMaterial;
            const selected = group.userData.zoneId === current.selectedId;
            outlineMaterial.color.set(selected ? '#f0ae39' : '#597267');
            outlineMaterial.opacity = selected ? 1 : 0.55;
          }
        }
      }

      const lcdState = `${current.screenMessage}|${current.motionDetected}|${current.isDim}|${current.temperature}|${current.humidity}`;
      if (context && lcdState !== lastLcdState) {
        drawLcd(current.screenMessage, current.motionDetected, current.isDim, current.temperature, current.humidity);
        lcdTexture.needsUpdate = true;
        lastLcdState = lcdState;
      }
      controls.update();
      renderer.render(scene, camera);
    });

    const initialWidth = container.clientWidth;
    const initialHeight = container.clientHeight;
    if (initialWidth > 0 && initialHeight > 0) {
      camera.aspect = initialWidth / initialHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(initialWidth, initialHeight, false);
    }

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of materials) {
            if ('map' in material && material.map) material.map.dispose();
            material.dispose();
          }
        }
      });
      renderer.dispose();
      container.replaceChildren();
    };
  }, []);

  function rotateModel(direction: 'left' | 'right' | 'up' | 'down'): void {
    const controls = controlsRef.current;
    if (!controls) return;
    const angle = Math.PI / 12;
    if (direction === 'left') controls.rotateLeft(angle);
    if (direction === 'right') controls.rotateLeft(-angle);
    if (direction === 'up') controls.rotateUp(angle);
    if (direction === 'down') controls.rotateUp(-angle);
    controls.update();
  }

  function zoomModel(direction: 'in' | 'out'): void {
    const controls = controlsRef.current;
    if (!controls) return;
    if (direction === 'in') controls.dollyIn(1.2);
    if (direction === 'out') controls.dollyOut(1.2);
    controls.update();
  }

  function resetModelView(): void {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(10.5, 10.5, 13);
    controls.target.copy(new THREE.Vector3(0.35, 0.85, 0.1));
    controls.update();
  }

  return (
    <div className="campus-model__webgl">
      <div className="campus-model__webgl-canvas" ref={containerRef} />
      {renderError && <p className="campus-model__render-error" role="alert">{renderError}</p>}
      <p className="campus-model__hint">Drag to orbit or use the camera controls below. Scroll or pinch to zoom.</p>
      <div className="campus-model__camera-controls" role="group" aria-label="Accessible 3D camera controls">
        <Button appearance="outline" disabled={!isReady} onClick={() => rotateModel('left')}>Rotate left</Button>
        <Button appearance="outline" disabled={!isReady} onClick={() => rotateModel('right')}>Rotate right</Button>
        <Button appearance="outline" disabled={!isReady} onClick={() => rotateModel('up')}>Tilt up</Button>
        <Button appearance="outline" disabled={!isReady} onClick={() => rotateModel('down')}>Tilt down</Button>
        <Button appearance="outline" disabled={!isReady} onClick={() => zoomModel('in')}>Zoom in</Button>
        <Button appearance="outline" disabled={!isReady} onClick={() => zoomModel('out')}>Zoom out</Button>
        <Button appearance="outline" disabled={!isReady} onClick={resetModelView}>Reset view</Button>
      </div>
    </div>
  );
}
