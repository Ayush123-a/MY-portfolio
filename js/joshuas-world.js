/**
 * AYUSH'S WORLD — Interactive 3D Low-Poly World
 * Faithfully re-creating the exact aesthetic, lighting, models, and interactions of joshuas-world.mp4
 * Features:
 * - Clear straight horizon dividing pale blue sky and ocean plane
 * - Circular low-poly island with rolling dome hill and electric purple/blue terrain
 * - 120+ white dandelion flower dots scattered across the grass
 * - Low-poly pine trees with stepped pyramid facets
 * - Iconic dioramas from the video:
 *     1. Festival Stage with white truss, pink backdrop, and cheering crowd
 *     2. Pink Food Truck with giant red hot dog on the roof
 *     3. Painter's tripod easel with canvas
 *     4. Cluster of low-poly coral rocks
 *     5. Mailbox with man waiting
 *     6. Red log cabin with blue glowing window and blue deer
 *     7. White retro caravan with glowing yellow festoon string lights
 *     8. Giant red coffee mug filled with dark coffee
 *     9. Animated cyclist in red shirt and helmet riding continuously along the circular road
 * - Authentic UI from the video:
 *     - Top-Left: "AYUSHs WORLD" in pure sans-serif typography
 *     - Top-Right: Clean 3-line hamburger menu
 *     - Top-Center: "DRAG TO EXPLORE" with hand icon, or floating project cards & text
 *     - Bottom-Right: Clean circular Day/Night toggle button (Moon in day, Lightbulb in night)
 *     - Night mode: Dramatic spotlight tracking the cyclist, dark sky/ocean, glowing string lights
 * - 100% Mobile & Laptop responsive (dynamic camera FOV/distance preventing clipping on phones)
 */

(function () {
  'use strict';

  // --- Configuration & POI Landmarks ---
  const POIS = [
    {
      id: 'projects',
      type: 'project',
      title: 'Treasure Hunt 3D',
      desc: 'An interactive browser-based state machine game with zero dependencies.',
      actionText: 'VIEW PROJECT →',
      modalId: 'projectModalTreasure',
      angle: 0, // Facing stage at front
      thumb: 'assets/images/work-1.png'
    },
    {
      id: 'apps',
      type: 'project',
      title: 'Dynamic Quiz Platform',
      desc: 'High-performance question generation engine with timed state evaluation.',
      actionText: 'VIEW PROJECT →',
      modalId: 'projectModalQuiz',
      angle: (Math.PI * 2) * (1 / 5), // ~72° (Food truck)
      thumb: 'assets/images/work-2.png'
    },
    {
      id: 'about',
      type: 'text',
      title: 'About Ayush',
      line1: 'Today, I am working as a Full-Stack Web Developer and',
      line2: 'BCA Scholar in Bangalore. Following are my recent projects.',
      actionText: 'MEET AYUSH →',
      modalId: 'aboutModal',
      angle: (Math.PI * 2) * (2 / 5), // ~144° (Cabin & Deer)
      thumb: 'assets/images/user.png'
    },
    {
      id: 'skills',
      type: 'text',
      title: 'Core Skills',
      line1: 'Technical Stack: JavaScript ES6+ (80%) · CSS3 (80%) · React (75%)',
      line2: 'Git Version Control (68%) · SQL (60%) · Data Structures (50%).',
      actionText: 'EXPLORE SKILLS →',
      modalId: 'skillsModal',
      angle: (Math.PI * 2) * (3 / 5), // ~216° (Coffee mug & Campfire)
      thumb: 'assets/images/cube-emblem-pink.png'
    },
    {
      id: 'contact',
      type: 'text',
      title: 'Connect',
      line1: 'Want to collaborate or hire?',
      line2: 'Connect on GitHub, LinkedIn, or send me an email.',
      actionText: 'GET IN TOUCH →',
      modalId: 'contactModal',
      angle: (Math.PI * 2) * (4 / 5), // ~288° (Caravan & Mailbox)
      thumb: 'assets/images/work-3.png'
    }
  ];

  // Palette from joshuas-world.mp4 (Exact RGB extracted from video keyframes)
  const PALETTE = {
    day: {
      skyHorizon: 0x8cb6f7,  // Soft pastel sky from josh_t70s.jpg
      ocean: 0x3d65dc,       // Deep vibrant blue ocean plane
      island: 0x4838dc,      // Vibrant electric violet/blue grass
      hill: 0x5646e2,
      road: 0x6255e6,        // Lavender-blue outer road track
      trees: 0x271d82,       // Deep indigo/purple stepped pine trees
      stageWall: 0xeb6b78,
      van: 0xed7777,         // Salmon pink food truck
      hotdog: 0xd33434,      // Giant red hot dog
      cabin: 0xd45d55,       // Coral/red wood cabin
      deer: 0x333796,        // Blue deer
      mug: 0xd93838,         // Red coffee mug
      ambient: 0x5065c8,
      ambientIntensity: 0.55,
      sun: 0xfff6ec,
      sunIntensity: 0.85
    },
    night: {
      skyHorizon: 0x060912,  // Midnight sky from frame_34s.jpg
      ocean: 0x090e1f,       // Dark ocean plane
      island: 0x14152f,
      hill: 0x1a1c3b,
      road: 0x222346,
      trees: 0x0c0d1e,
      stageWall: 0xba3c4a,
      van: 0xa84747,
      hotdog: 0x942222,
      cabin: 0x8a3934,
      deer: 0x28266e,
      mug: 0x8f2222,
      ambient: 0x181a38,
      ambientIntensity: 0.25,
      sun: 0x334466,
      sunIntensity: 0.15
    }
  };

  // State
  let scene, camera, renderer, container;
  let worldGroup, oceanMesh, cyclistGroup, wheels = [], legs = [];
  let dirLight, ambientLight, spotLightFollow;
  let fairyLights = [], dandelionMesh;
  let isNight = false;
  let currentPoiIndex = -1;
  let isDragging = false;
  let prevPointerX = 0;
  let currentRotation = 0;
  let velocity = 0;
  let idleTimer = 0;
  let soundEnabled = true;
  let audioCtx = null;
  const clock = new THREE.Clock();

  // Cached DOM elements and visibility tracking
  let joshFloatingCard = null;
  let joshTextOverlay = null;
  let joshDragHint = null;
  let isWorldVisible = true;

  // --- Sound Effects via Web Audio API ---
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq = 440) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.31);
    } catch (e) { }
  }

  // --- Initialize Three.js Scene ---
  function init() {
    container = document.getElementById('worldCanvasContainer');
    if (!container) return;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.day.skyHorizon);
    // No fog so horizon line between light sky and ocean plane is razor-sharp like in the video

    // 2. Camera with responsive FOV & distance
    camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.5, 400);
    updateCameraFraming();

    // 3. Renderer with antialias & soft shadows (Linear encoding for accurate low-poly palette)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.LinearEncoding;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    setupLighting();

    // 5. Ocean Ground Plane (creates the clean horizon line from the video)
    buildOceanPlane();

    // 6. World Group (contains the rotating island, road, trees, props)
    worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 7. Construct Island and all signature props
    buildIsland();
    buildRoad();
    buildDandelionDots();
    buildCyclist();
    buildFestivalStage();
    buildPinkFoodTruck();
    buildPaintersEasel();
    buildCoralRocks();
    buildMailboxAndMan();
    buildLogCabinAndDeer();
    buildCaravanWithFairyLights();
    buildGiantCoffeeMug();
    buildWhiteRobot();
    buildPineForest();

    // 8. Event Listeners & Interaction
    setupInteraction();

    // Cache UI elements for high performance
    joshFloatingCard = document.getElementById('joshFloatingCard');
    joshTextOverlay = document.getElementById('joshTextOverlay');
    joshDragHint = document.getElementById('joshDragHint');

    // Visibility observer on #worldHeroSection to conserve GPU and avoid off-screen DOM operations
    const heroSection = document.getElementById('worldHeroSection') || container;
    if (heroSection && 'IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isWorldVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      visibilityObserver.observe(heroSection);
    }

    // 9. Initial POI state
    setPoi(0, true);

    // URL parameter support for testing and direct navigation
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('entered')) {
      const intro = document.getElementById('joshIntroScreen');
      if (intro) intro.classList.add('intro-hidden');
    }
    if (urlParams.has('poi')) {
      const pIdx = parseInt(urlParams.get('poi'), 10);
      if (pIdx >= 0 && pIdx < POIS.length) {
        currentRotation = -POIS[pIdx].angle;
        setPoi(pIdx, true);
      }
    }
    if (urlParams.has('night')) {
      toggleDayNight();
    }
    if (urlParams.has('modal')) {
      openModal(urlParams.get('modal'));
    } else if (window.location.hash.includes('modal') || window.location.hash.includes('treasure')) {
      openModal('projectModalTreasure');
    }

    // 10. Start Animation Loop
    animate();
  }

  // --- Dynamic Camera Framing for Mobile & Laptop (Exact Joshua's World Framing) ---
  function updateCameraFraming() {
    if (!camera) return;
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;

    // Zoom and position so the circular island floats cleanly within the ocean plane with zero clipping
    if (aspect < 0.75) {
      // Mobile portrait (360x800, 390x844, 414x896, etc.)
      const dist = 32 / Math.max(0.42, aspect);
      camera.position.set(0, dist * 0.46, dist);
      camera.fov = 36;
    } else if (aspect < 1.1) {
      // Tablet portrait / square
      const dist = 36 / aspect;
      camera.position.set(0, dist * 0.48, dist);
      camera.fov = 35;
    } else {
      // Standard laptop & widescreen desktop (1366x768, 1440x900, 1920x1080)
      camera.position.set(0, 23, 44);
      camera.fov = 34;
    }
    camera.lookAt(0, 1.9, 0);
    camera.updateProjectionMatrix();
  }

  // --- Lighting Setup (Crisp Low-Poly High-Contrast Lighting) ---
  function setupLighting() {
    ambientLight = new THREE.AmbientLight(PALETTE.day.ambient, PALETTE.day.ambientIntensity);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(PALETTE.day.sun, PALETTE.day.sunIntensity);
    dirLight.position.set(-28, 42, 22);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -26;
    dirLight.shadow.camera.right = 26;
    dirLight.shadow.camera.top = 26;
    dirLight.shadow.camera.bottom = -26;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    // Follow Spotlight for Night Mode (illuminates cyclist in frame_34s.jpg!)
    spotLightFollow = new THREE.SpotLight(0xa5c2ff, 0.0, 42, Math.PI / 4.2, 0.42, 1.6);
    spotLightFollow.position.set(0, 16, 12);
    spotLightFollow.target.position.set(0, 1.76, 13);
    spotLightFollow.castShadow = true;
    scene.add(spotLightFollow);
    scene.add(spotLightFollow.target);
  }

  // --- The Ocean Plane & Horizon Line (Exact from josh_t2s.jpg / josh_t60s.jpg) ---
  function buildOceanPlane() {
    // Width 800, Depth 160. Spans in Z from -14 (horizon line behind hill) to +146 (front)
    const oceanGeo = new THREE.PlaneGeometry(800, 160);
    const oceanMat = new THREE.MeshBasicMaterial({
      color: PALETTE.day.ocean,
      side: THREE.DoubleSide,
      fog: false
    });
    oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.set(0, -0.2, 66);
    scene.add(oceanMesh);
  }

  // --- The Circular Island with Center Hill ---
  function buildIsland() {
    const radius = 16.5;
    const segments = 48;
    const topGeo = new THREE.CylinderGeometry(radius, radius * 0.98, 3.2, segments, 8);
    topGeo.computeVertexNormals();

    const pos = topGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);

      if (y > 1.0) {
        const dist = Math.sqrt(x * x + z * z);
        // Central dome hill (matching josh_t60s.jpg)
        let hill = Math.max(0, (1 - dist / 13.5)) * 4.2;
        // Natural low-poly facets
        hill += Math.sin(x * 0.35) * Math.cos(z * 0.35) * 0.35;
        // Keep outer road area smooth
        if (dist > 11.2 && dist < 14.8) {
          hill *= 0.12;
        }
        pos.setY(i, y + hill);
      }
    }
    topGeo.computeVertexNormals();

    const islandMat = new THREE.MeshLambertMaterial({
      color: PALETTE.day.island,
      flatShading: true
    });

    const islandMesh = new THREE.Mesh(topGeo, islandMat);
    islandMesh.position.y = 0;
    islandMesh.receiveShadow = true;
    islandMesh.castShadow = true;
    worldGroup.add(islandMesh);

    // Darker rock base
    const baseGeo = new THREE.CylinderGeometry(radius * 0.98, radius * 0.88, 3.0, 32);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x221a5e, flatShading: true });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -2.8;
    worldGroup.add(baseMesh);
  }

  // --- Outer Perimeter Road ---
  function buildRoad() {
    const roadInner = 11.8;
    const roadOuter = 14.2;
    const ringGeo = new THREE.RingGeometry(roadInner, roadOuter, 64);
    ringGeo.rotateX(-Math.PI / 2);

    const roadMat = new THREE.MeshLambertMaterial({
      color: PALETTE.day.road,
      side: THREE.DoubleSide,
      flatShading: true
    });

    const road = new THREE.Mesh(ringGeo, roadMat);
    road.position.y = 1.76;
    road.receiveShadow = true;
    worldGroup.add(road);
  }

  // --- White Dandelion Spherical Dots on Grass (Signature Joshua detail!) ---
  function buildDandelionDots() {
    const dotCount = 140;
    const dotGeo = new THREE.SphereGeometry(0.12, 5, 5);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    dandelionMesh = new THREE.InstancedMesh(dotGeo, dotMat, dotCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < dotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 3.5 + Math.random() * 11.5;
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;
      const dist = Math.sqrt(x * x + z * z);
      let y = 1.76;
      if (dist < 11.2) {
        y += Math.max(0, (1 - dist / 13.5)) * 4.0;
      }
      dummy.position.set(x, y + 0.08, z);
      dummy.scale.setScalar(0.7 + Math.random() * 0.6);
      dummy.updateMatrix();
      dandelionMesh.setMatrixAt(i, dummy.matrix);
    }
    dandelionMesh.instanceMatrix.needsUpdate = true;
    worldGroup.add(dandelionMesh);
  }

  // --- The Cyclist (Signature animated cyclist in red shirt and helmet) ---
  function buildCyclist() {
    cyclistGroup = new THREE.Group();

    const redBikeMat = new THREE.MeshLambertMaterial({ color: 0xe53935, flatShading: true });
    const tireMat = new THREE.MeshLambertMaterial({ color: 0x1a1a24, flatShading: true });
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xf5b596, flatShading: true });
    const shirtMat = new THREE.MeshLambertMaterial({ color: 0xe53935, flatShading: true });
    const pantsMat = new THREE.MeshLambertMaterial({ color: 0x1f2438, flatShading: true });

    // Wheels
    const makeWheel = () => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 6, 16), tireMat);
      g.add(tire);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8), rimMat);
      hub.rotateX(Math.PI / 2);
      g.add(hub);
      return g;
    };

    const fw = makeWheel();
    fw.position.set(0.65, 0.38, 0);
    cyclistGroup.add(fw);
    wheels.push(fw);

    const bw = makeWheel();
    bw.position.set(-0.65, 0.38, 0);
    cyclistGroup.add(bw);
    wheels.push(bw);

    // Frame tubes
    const tubeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 6);
    const f1 = new THREE.Mesh(tubeGeo, redBikeMat);
    f1.rotation.z = Math.PI / 2.8;
    f1.position.set(-0.15, 0.55, 0);
    cyclistGroup.add(f1);

    const f2 = new THREE.Mesh(tubeGeo, redBikeMat);
    f2.rotation.z = -Math.PI / 5;
    f2.position.set(-0.25, 0.65, 0);
    cyclistGroup.add(f2);

    const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.75, 6), redBikeMat);
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0.05, 0.85, 0);
    cyclistGroup.add(topBar);

    // Saddle
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.16), tireMat);
    saddle.position.set(-0.4, 0.95, 0);
    cyclistGroup.add(saddle);

    // Handlebar
    const fork = new THREE.Mesh(tubeGeo, redBikeMat);
    fork.rotation.z = -Math.PI / 8;
    fork.position.set(0.55, 0.72, 0);
    cyclistGroup.add(fork);

    const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.42), tireMat);
    hBar.position.set(0.48, 1.05, 0);
    cyclistGroup.add(hBar);

    // Rider Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.3), shirtMat);
    torso.position.set(-0.1, 1.25, 0);
    torso.rotation.z = -Math.PI / 5.5;
    cyclistGroup.add(torso);

    // Head & Helmet
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 8), skinMat);
    head.position.set(0.12, 1.58, 0);
    cyclistGroup.add(head);

    const helmet = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.28, 7), redBikeMat);
    helmet.position.set(0.12, 1.72, 0);
    helmet.rotation.z = -Math.PI / 6;
    cyclistGroup.add(helmet);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.09, 0.45, 0.09);
    const la = new THREE.Mesh(armGeo, shirtMat);
    la.position.set(0.18, 1.2, 0.18);
    la.rotation.z = -Math.PI / 3;
    cyclistGroup.add(la);

    const ra = new THREE.Mesh(armGeo, shirtMat);
    ra.position.set(0.18, 1.2, -0.18);
    ra.rotation.z = -Math.PI / 3;
    cyclistGroup.add(ra);

    // Animated Legs
    const legGeo = new THREE.BoxGeometry(0.11, 0.45, 0.11);
    const ll = new THREE.Mesh(legGeo, pantsMat);
    ll.position.set(-0.25, 0.75, 0.16);
    cyclistGroup.add(ll);
    legs.push(ll);

    const rl = new THREE.Mesh(legGeo, pantsMat);
    rl.position.set(-0.25, 0.75, -0.16);
    cyclistGroup.add(rl);
    legs.push(rl);

    cyclistGroup.scale.set(0.95, 0.95, 0.95);
    cyclistGroup.position.set(0, 1.76, 13.0);
    cyclistGroup.rotation.y = Math.PI / 2; // Facing right along front road
    cyclistGroup.rotation.z = -0.04;

    scene.add(cyclistGroup);
  }

  // --- Landmark 1: Festival Live Stage (Projects) (Exact from josh_t70s.jpg) ---
  function buildFestivalStage() {
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, 1.8, 9.2);
    stageGroup.rotation.y = Math.PI;

    // Deck (Black stage platform)
    const deckMat = new THREE.MeshLambertMaterial({ color: 0x181a28, flatShading: true });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.45, 4.2), deckMat);
    deck.position.y = 0.22;
    deck.receiveShadow = true;
    stageGroup.add(deck);

    // White Truss Frame (4 columns and top perimeter beams, solid white with flat shading)
    const trussMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const colGeo = new THREE.BoxGeometry(0.22, 3.8, 0.22);
    [-2.8, 2.8].forEach(x => {
      [1.8, -1.8].forEach(z => {
        const c = new THREE.Mesh(colGeo, trussMat);
        c.position.set(x, 2.1, z);
        stageGroup.add(c);
      });
    });

    // Truss Diagonal Cross-Bracing for signature concert truss look
    const braceMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.7, 4);
    [-2.8, 2.8].forEach(x => {
      const s1 = new THREE.Mesh(strutGeo, braceMat);
      s1.position.set(x, 2.1, 0);
      s1.rotation.x = Math.PI / 4.2;
      stageGroup.add(s1);
      const s2 = new THREE.Mesh(strutGeo, braceMat);
      s2.position.set(x, 2.1, 0);
      s2.rotation.x = -Math.PI / 4.2;
      stageGroup.add(s2);
    });

    // Top Perimeter Beams
    const beamFront = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.22, 0.22), trussMat);
    beamFront.position.set(0, 4.0, -1.8);
    stageGroup.add(beamFront);
    const beamBack = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.22, 0.22), trussMat);
    beamBack.position.set(0, 4.0, 1.8);
    stageGroup.add(beamBack);
    const beamSideL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 3.8), trussMat);
    beamSideL.position.set(-2.8, 4.0, 0);
    stageGroup.add(beamSideL);
    const beamSideR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 3.8), trussMat);
    beamSideR.position.set(2.8, 4.0, 0);
    stageGroup.add(beamSideR);

    // Spotlight cans on front truss beam (like josh_t70s.jpg!)
    const spotCanMat = new THREE.MeshLambertMaterial({ color: 0x181a28, flatShading: true });
    [-2.0, -0.7, 0.7, 2.0].forEach(sx => {
      const can = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 6), spotCanMat);
      can.position.set(sx, 3.84, -1.8);
      can.rotation.x = Math.PI / 5;
      stageGroup.add(can);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.1, 6), new THREE.MeshBasicMaterial({ color: 0xfff088 }));
      lens.position.set(sx, 3.76, -1.68);
      lens.rotation.x = Math.PI / 5;
      stageGroup.add(lens);
    });

    // Coral / Salmon Screen Wall (exact color from video, visible from front)
    const wallMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.stageWall, side: THREE.DoubleSide, flatShading: true });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 2.8), wallMat);
    wall.position.set(0, 2.3, 1.75);
    stageGroup.add(wall);

    // Speakers (stacks on both sides, 2-high matching video)
    const spMat = new THREE.MeshLambertMaterial({ color: 0x121422, flatShading: true });
    [-3.3, 3.3].forEach(x => {
      const sp1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.8), spMat);
      sp1.position.set(x, 0.65, 0.2);
      stageGroup.add(sp1);
      const sp2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.8), spMat);
      sp2.position.set(x, 1.6, 0.2);
      stageGroup.add(sp2);
    });

    // Cheering Crowd of 8 Miniature Figures standing in front of stage
    const crowdColors = [0xffffff, 0xff5533, 0xffbb22, 0x33bb66, 0xffffff, 0x2288ff, 0xff4488, 0xee5522];
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Group();
      const pMat = new THREE.MeshLambertMaterial({ color: crowdColors[i], flatShading: true });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.85, 6), pMat);
      body.position.y = 0.42;
      p.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 6), new THREE.MeshLambertMaterial({ color: 0xf5b596 }));
      head.position.y = 0.95;
      p.add(head);

      // Standing on grass in front of the stage (in local space: -z is towards road)
      p.position.set((i - 3.5) * 0.55, 0, -2.8 - (i % 2) * 0.5);
      p.rotation.y = (Math.random() - 0.5) * 0.4;
      stageGroup.add(p);
    }

    worldGroup.add(stageGroup);
  }

  // --- Landmark 2: Pink Food Truck with Giant Red Hot Dog (josh_t2s.jpg / josh_t60s.jpg) ---
  function buildPinkFoodTruck() {
    const truckGroup = new THREE.Group();
    const angle = (Math.PI * 2) * (1 / 5);
    truckGroup.position.set(Math.sin(angle) * 8.6, 1.9, Math.cos(angle) * 8.6);
    truckGroup.rotation.y = angle - Math.PI / 1.8;

    const truckMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.van, flatShading: true });
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x1f2438 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111322 });

    // Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 2.2), truckMat);
    chassis.position.y = 1.2;
    chassis.castShadow = true;
    truckGroup.add(chassis);

    // Front Windshield
    const ws = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 1.8), glassMat);
    ws.position.set(2.05, 1.45, 0);
    truckGroup.add(ws);

    // Side Service Window
    const sw = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.75, 0.08), glassMat);
    sw.position.set(0.1, 1.45, 1.12);
    truckGroup.add(sw);

    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 12);
    wGeo.rotateX(Math.PI / 2);
    [1.3, -1.3].forEach(x => {
      [1.1, -1.1].forEach(z => {
        const w = new THREE.Mesh(wGeo, wheelMat);
        w.position.set(x, 0.42, z);
        truckGroup.add(w);
      });
    });

    // GIANT RED HOT DOG ON THE ROOF (Joshua's exact signature!)
    const dogMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.hotdog, flatShading: true });
    // Hot dog body (capsule / rounded shape)
    const sausage = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.8, 12), dogMat);
    sausage.rotation.z = Math.PI / 2;
    sausage.position.set(0, 2.5, 0);
    sausage.castShadow = true;
    truckGroup.add(sausage);

    // Rounded ends
    const endL = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), dogMat);
    endL.position.set(-1.4, 2.5, 0);
    truckGroup.add(endL);
    const endR = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), dogMat);
    endR.position.set(1.4, 2.5, 0);
    truckGroup.add(endR);

    worldGroup.add(truckGroup);
  }

  // --- Landmark 3: Painter's Tripod Easel with Canvas (josh_t60s.jpg) ---
  function buildPaintersEasel() {
    const easelGroup = new THREE.Group();
    easelGroup.position.set(5.2, 1.8, 6.8);
    easelGroup.rotation.y = -Math.PI / 4;

    const woodMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 5);

    const legL = new THREE.Mesh(legGeo, woodMat);
    legL.rotation.z = 0.18;
    legL.position.set(-0.35, 1.1, 0);
    easelGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, woodMat);
    legR.rotation.z = -0.18;
    legR.position.set(0.35, 1.1, 0);
    easelGroup.add(legR);

    const legB = new THREE.Mesh(legGeo, woodMat);
    legB.rotation.x = -0.25;
    legB.position.set(0, 1.1, -0.4);
    easelGroup.add(legB);

    // Canvas
    const canvasMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const canvas = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.05), canvasMat);
    canvas.position.set(0, 1.45, 0.05);
    easelGroup.add(canvas);

    worldGroup.add(easelGroup);
  }

  // --- Landmark 4: Cluster of Low-Poly Coral Rocks (josh_t60s.jpg) ---
  function buildCoralRocks() {
    const rockGroup = new THREE.Group();
    rockGroup.position.set(7.5, 1.8, 4.2);

    const rockMat = new THREE.MeshLambertMaterial({ color: 0xf29b9b, flatShading: true });
    const rocks = [
      { x: 0, y: 0.8, z: 0, s: 1.4 },
      { x: -0.9, y: 0.5, z: 0.4, s: 0.9 },
      { x: 0.8, y: 0.4, z: -0.3, s: 0.8 },
      { x: -0.4, y: 0.3, z: -0.7, s: 0.7 },
      { x: 0.5, y: 0.25, z: 0.8, s: 0.6 }
    ];

    rocks.forEach(r => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r.s), rockMat);
      m.position.set(r.x, r.y, r.z);
      m.rotation.set(Math.random(), Math.random(), Math.random());
      m.castShadow = true;
      rockGroup.add(m);
    });

    worldGroup.add(rockGroup);
  }

  // --- Landmark 5: Mailbox and Man Standing (josh_t2s.jpg / josh_t60s.jpg) ---
  function buildMailboxAndMan() {
    const mbGroup = new THREE.Group();
    mbGroup.position.set(-5.6, 1.8, 7.8);

    // Mailbox
    const mbPostMat = new THREE.MeshLambertMaterial({ color: 0x3d3580 });
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), mbPostMat);
    post.position.set(-0.6, 0.6, 0);
    mbGroup.add(post);

    const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 0.5), mbPostMat);
    box.position.set(-0.6, 1.2, 0);
    mbGroup.add(box);

    const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.06), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    slot.position.set(-0.6, 1.2, 0.26);
    mbGroup.add(slot);

    // Man Standing by Mailbox (red shirt, dark pants, arms crossed)
    const man = new THREE.Group();
    man.position.set(0.4, 0, 0);

    const shirtMat = new THREE.MeshLambertMaterial({ color: 0xe53935, flatShading: true });
    const pantsMat = new THREE.MeshLambertMaterial({ color: 0x1f2438, flatShading: true });
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xf5b596 });

    // Legs
    const l1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9), pantsMat);
    l1.position.set(-0.12, 0.45, 0);
    man.add(l1);
    const l2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9), pantsMat);
    l2.position.set(0.12, 0.45, 0);
    man.add(l2);

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.65, 0.24), shirtMat);
    torso.position.set(0, 1.15, 0);
    man.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), skinMat);
    head.position.set(0, 1.62, 0);
    man.add(head);

    mbGroup.add(man);
    worldGroup.add(mbGroup);
  }

  // --- Landmark 6: Log Cabin and Blue Deer (josh_t8s.jpg / josh_t40s.jpg) ---
  function buildLogCabinAndDeer() {
    const cabinGroup = new THREE.Group();
    const angle = (Math.PI * 2) * (2 / 5);
    cabinGroup.position.set(Math.sin(angle) * 7.5, 2.2, Math.cos(angle) * 7.5);
    cabinGroup.rotation.y = angle + Math.PI / 1.3;

    // Red Log House
    const houseMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.cabin, flatShading: true });
    const house = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 2.8), houseMat);
    house.position.y = 1.1;
    house.castShadow = true;
    cabinGroup.add(house);

    // White Trim Roof
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x222436, flatShading: true });
    const roofGeo = new THREE.ConeGeometry(3.0, 1.6, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.9;
    roof.scale.set(1.15, 1.0, 1.0);
    cabinGroup.add(roof);

    // Glowing Blue Window (exact from video!)
    const winMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), winMat);
    win.position.set(0.4, 1.3, 1.42);
    cabinGroup.add(win);

    // Blue Deer beside Cabin (josh_t8s.jpg / josh_t40s.jpg)
    const deerGroup = new THREE.Group();
    deerGroup.position.set(2.4, 0, 0.6);
    deerGroup.rotation.y = -Math.PI / 3;

    const deerMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.deer, flatShading: true });
    // Deer Body
    const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 1.0), deerMat);
    dBody.position.y = 0.85;
    deerGroup.add(dBody);

    // Deer Neck & Head
    const dNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.6), deerMat);
    dNeck.position.set(0, 1.25, 0.45);
    dNeck.rotation.x = Math.PI / 6;
    deerGroup.add(dNeck);

    const dHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.35), deerMat);
    dHead.position.set(0, 1.5, 0.6);
    deerGroup.add(dHead);

    // Antlers (white)
    const antMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), antMat);
    antL.position.set(-0.12, 1.75, 0.55);
    antL.rotation.z = 0.4;
    deerGroup.add(antL);

    const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), antMat);
    antR.position.set(0.12, 1.75, 0.55);
    antR.rotation.z = -0.4;
    deerGroup.add(antR);

    // 4 Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.8);
    [-0.15, 0.15].forEach(x => {
      [-0.35, 0.35].forEach(z => {
        const l = new THREE.Mesh(legGeo, deerMat);
        l.position.set(x, 0.4, z);
        deerGroup.add(l);
      });
    });

    cabinGroup.add(deerGroup);
    worldGroup.add(cabinGroup);
  }

  // --- Landmark 7: White Retro Caravan with Festoon Fairy Lights (josh_t15s.jpg / josh_t70s.jpg) ---
  function buildCaravanWithFairyLights() {
    const caravanGroup = new THREE.Group();
    caravanGroup.position.set(-7.8, 1.9, 4.0);
    caravanGroup.rotation.y = Math.PI / 3;

    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x1f2438 });

    // Rounded Caravan Body
    const cBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.8, 2.0), whiteMat);
    cBody.position.y = 1.1;
    caravanGroup.add(cBody);

    // Front curved nose
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 1.8, 12), whiteMat);
    nose.position.set(1.5, 1.1, 0);
    caravanGroup.add(nose);

    // Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.3, 0.08), darkMat);
    door.position.set(0, 0.9, 1.02);
    caravanGroup.add(door);

    // Wheels
    const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 10), darkMat);
    w1.rotateX(Math.PI / 2);
    w1.position.set(0, 0.35, 1.05);
    caravanGroup.add(w1);
    const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 10), darkMat);
    w2.rotateX(Math.PI / 2);
    w2.position.set(0, 0.35, -1.05);
    caravanGroup.add(w2);

    // Festoon Fairy String Lights (Glowing yellow bulbs strung between poles!)
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x5a6070 });
    const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), poleMat);
    pole1.position.set(-1.6, 1.1, 2.2);
    caravanGroup.add(pole1);

    const pole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), poleMat);
    pole2.position.set(1.6, 1.1, 2.2);
    caravanGroup.add(pole2);

    // 6 Glowing Yellow Bulbs
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff475 });
    for (let b = 0; b < 6; b++) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), bulbMat);
      const bx = -1.4 + b * 0.56;
      const by = 2.1 - Math.sin((b / 5) * Math.PI) * 0.35; // Catary dip
      bulb.position.set(bx, by, 2.2);
      caravanGroup.add(bulb);
      fairyLights.push(bulb);
    }

    worldGroup.add(caravanGroup);
  }

  // --- Landmark 8: Giant Red Coffee Mug (josh_t15s.jpg) ---
  function buildGiantCoffeeMug() {
    const mugGroup = new THREE.Group();
    const angle = (Math.PI * 2) * (3 / 5);
    mugGroup.position.set(Math.sin(angle) * 7.5, 2.2, Math.cos(angle) * 7.5);

    const mugMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.mug, flatShading: true });
    const coffeeMat = new THREE.MeshLambertMaterial({ color: 0x1f120c });

    const mug = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.0, 1.8, 16), mugMat);
    mug.position.y = 0.9;
    mug.castShadow = true;
    mugGroup.add(mug);

    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.1, 16), coffeeMat);
    liquid.position.y = 1.7;
    mugGroup.add(liquid);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.15, 8, 16), mugMat);
    handle.position.set(1.5, 0.9, 0);
    mugGroup.add(handle);

    worldGroup.add(mugGroup);
  }

  // --- Landmark 9: Cute White Robot on Leash (josh_t15s.jpg) ---
  function buildWhiteRobot() {
    const botGroup = new THREE.Group();
    botGroup.position.set(-4.5, 2.0, -6.5);

    const botMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x111322 });

    // Sphere Body
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 12), botMat);
    sphere.position.y = 0.65;
    botGroup.add(sphere);

    // Antenna
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35), darkMat);
    ant.position.set(0, 1.25, 0);
    botGroup.add(ant);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color: 0x00d4ff }));
    tip.position.set(0, 1.45, 0);
    botGroup.add(tip);

    // 4 Tiny Legs
    const lGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35);
    [-0.2, 0.2].forEach(x => {
      [-0.2, 0.2].forEach(z => {
        const leg = new THREE.Mesh(lGeo, darkMat);
        leg.position.set(x, 0.18, z);
        botGroup.add(leg);
      });
    });

    worldGroup.add(botGroup);
  }

  // --- Low-Poly Pine Forest (Joshua's exact stepped pyramid trees) ---
  function buildPineForest() {
    const treeMat = new THREE.MeshLambertMaterial({ color: PALETTE.day.trees, flatShading: true });
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x241747, flatShading: true });

    const createTree = (scale = 1.0) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 0.8 * scale, 5), trunkMat);
      trunk.position.y = 0.4 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      // 3 Stepped Cones
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.15 * scale, 1.4 * scale, 5), treeMat);
      c1.position.y = 1.1 * scale;
      c1.castShadow = true;
      tree.add(c1);

      const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.85 * scale, 1.2 * scale, 5), treeMat);
      c2.position.y = 1.8 * scale;
      c2.castShadow = true;
      tree.add(c2);

      const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.6 * scale, 1.0 * scale, 5), treeMat);
      c3.position.y = 2.4 * scale;
      c3.castShadow = true;
      tree.add(c3);

      return tree;
    };

    // Tree locations across outer rims and central hill
    const treeCoords = [
      // Outer border trees
      { r: 15.2, a: 0.35, s: 0.9 },
      { r: 15.5, a: 0.55, s: 1.1 },
      { r: 15.1, a: 0.75, s: 0.8 },
      { r: 15.4, a: 1.15, s: 1.0 },
      { r: 15.6, a: 1.45, s: 1.2 },
      { r: 15.0, a: 1.75, s: 0.85 },
      { r: 15.5, a: 2.15, s: 1.05 },
      { r: 15.2, a: 2.55, s: 0.9 },
      { r: 15.6, a: 2.85, s: 1.15 },
      { r: 15.3, a: 3.25, s: 0.8 },
      { r: 15.5, a: 3.65, s: 1.1 },
      { r: 15.1, a: 4.05, s: 0.95 },
      { r: 15.6, a: 4.45, s: 1.25 },
      { r: 15.2, a: 4.85, s: 0.85 },
      { r: 15.5, a: 5.25, s: 1.05 },
      { r: 15.3, a: 5.65, s: 0.9 },
      { r: 15.6, a: 6.05, s: 1.1 },

      // Central hill clusters (matching josh_t60s.jpg)
      { r: 4.5, a: 0.8, s: 1.3 },
      { r: 3.8, a: 1.3, s: 1.1 },
      { r: 5.2, a: 1.9, s: 1.4 },
      { r: 4.2, a: 2.4, s: 1.0 },
      { r: 3.5, a: 3.1, s: 1.25 },
      { r: 5.0, a: 3.8, s: 1.4 },
      { r: 4.0, a: 4.3, s: 1.15 },
      { r: 3.2, a: 5.0, s: 1.3 },
      { r: 4.8, a: 5.8, s: 1.2 },
      { r: 2.5, a: 0.0, s: 1.5 },
      { r: 1.8, a: 2.1, s: 1.4 },
      { r: 2.0, a: 4.2, s: 1.35 }
    ];

    treeCoords.forEach(loc => {
      const tree = createTree(loc.s);
      const x = Math.sin(loc.a) * loc.r;
      const z = Math.cos(loc.a) * loc.r;
      const dist = Math.sqrt(x * x + z * z);
      let y = 1.76;
      if (dist < 11.2) {
        y += Math.max(0, (1 - dist / 13.5)) * 4.0;
      }
      tree.position.set(x, y, z);
      tree.rotation.y = Math.random() * Math.PI * 2;
      worldGroup.add(tree);
    });
  }

  // --- Interaction & Fluid Physics Damping ---
  function setupInteraction() {
    const el = renderer.domElement;

    // Pointer events (handles both mouse and touch seamlessly)
    el.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      velocity = 0;
      initAudio();
      hideDragHint();
      if (el.setPointerCapture) {
        try { el.setPointerCapture(e.pointerId); } catch (err) { }
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerX;
      prevPointerX = e.clientX;

      const sensitivity = 0.0075;
      velocity = deltaX * sensitivity;
      currentRotation += velocity;
      idleTimer = 0;
    });

    window.addEventListener('pointerup', (e) => {
      if (isDragging) {
        isDragging = false;
        if (el.releasePointerCapture) {
          try { el.releasePointerCapture(e.pointerId); } catch (err) { }
        }
      }
    });

    // Mouse wheel gentle zoom (requires Ctrl/Meta key or allows smooth vertical document scroll)
    el.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = e.deltaY * 0.02;
        const currentDist = camera.position.length();
        const newDist = THREE.MathUtils.clamp(currentDist + zoomDelta, 18, 55);
        const ratio = newDist / currentDist;
        camera.position.x *= ratio;
        camera.position.y *= ratio;
        camera.position.z *= ratio;
      }
    }, { passive: false });

    // Arrow keys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') rotateToNext();
      else if (e.key === 'ArrowRight') rotateToPrev();
      else if (e.key === 'Escape') closeModal();
    });

    // Window resize (Laptop & Mobile rotation)
    window.addEventListener('resize', onResize);

    // Welcome Intro Screen Explore Button (Exact from frame_0s.jpg)
    const exploreBtn = document.getElementById('joshExploreBtn');
    const introScreen = document.getElementById('joshIntroScreen');
    if (exploreBtn && introScreen) {
      exploreBtn.addEventListener('click', () => {
        initAudio();
        playChime(660);
        introScreen.classList.add('intro-hidden');
        // Initially show the drag hint matching frame_4s.jpg
        const hint = document.getElementById('joshDragHint');
        if (hint) hint.classList.remove('hidden');
        const card = document.getElementById('joshFloatingCard');
        if (card) card.classList.remove('active');
        const textOverlay = document.getElementById('joshTextOverlay');
        if (textOverlay) textOverlay.classList.remove('active');
      });
    }

    // Touch event fallbacks for 100% mobile device compatibility
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevPointerX = e.touches[0].clientX;
        velocity = 0;
        idleTimer = 0;
        initAudio();
        hideDragHint();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - prevPointerX;
      prevPointerX = touchX;
      const sensitivity = 0.009;
      velocity = deltaX * sensitivity;
      currentRotation += velocity;
      idleTimer = 0;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Day/Night Button
    const themeBtn = document.getElementById('joshThemeBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleDayNight);

    // Hamburger Menu Button
    const menuBtn = document.getElementById('joshMenuBtn');
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

    // Menu Close Button
    const menuCloseBtn = document.getElementById('joshMenuCloseBtn');
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

    // Menu Nav Items
    const menuLinks = document.querySelectorAll('.josh-menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const poiId = link.getAttribute('data-poi');
        if (poiId) {
          e.preventDefault();
          const idx = POIS.findIndex(p => p.id === poiId);
          if (idx !== -1) {
            rotateToPoiIndex(idx);
            closeMenu();
          }
        } else if (link.getAttribute('href')?.startsWith('#')) {
          closeMenu();
        }
      });
    });

    // Scroll Down Button to Full Portfolio
    const scrollDownBtn = document.getElementById('joshScrollDownBtn');
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('detailedPortfolioSection') || document.getElementById('navbar') || document.getElementById('hero');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Card Action Button
    const cardBtn = document.getElementById('joshCardActionBtn');
    if (cardBtn) {
      cardBtn.addEventListener('click', () => {
        openActivePoiModal();
      });
    }

    // Sky Text Action Button
    const textBtn = document.getElementById('joshTextActionBtn');
    if (textBtn) {
      textBtn.addEventListener('click', () => {
        openActivePoiModal();
      });
    }

    // Modal Close Buttons
    const modalCloses = document.querySelectorAll('.josh-modal-close-btn, .josh-modal-backdrop');
    modalCloses.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
  }

  function hideDragHint() {
    const hint = joshDragHint || document.getElementById('joshDragHint');
    if (hint && !hint.classList.contains('hidden')) {
      hint.classList.add('hidden');
    }
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    updateCameraFraming();
    renderer.setSize(w, h);
  }

  // --- POI Rotation & Card Updates ---
  function rotateToPoiIndex(index) {
    if (index < 0 || index >= POIS.length) return;
    const target = POIS[index].angle;
    const twoPi = Math.PI * 2;
    let diff = (target - (currentRotation % twoPi)) % twoPi;
    if (diff > Math.PI) diff -= twoPi;
    if (diff < -Math.PI) diff += twoPi;

    velocity = diff * 0.12;
    setPoi(index);
    playChime(520);
  }

  function rotateToNext() {
    const next = (currentPoiIndex + 1) % POIS.length;
    rotateToPoiIndex(next);
  }

  function rotateToPrev() {
    const prev = (currentPoiIndex - 1 + POIS.length) % POIS.length;
    rotateToPoiIndex(prev);
  }

  function setPoi(index, immediate = false) {
    if (index === currentPoiIndex && !immediate) return;
    currentPoiIndex = index;
    const poi = POIS[index];

    const card = joshFloatingCard || document.getElementById('joshFloatingCard');
    const textOverlay = joshTextOverlay || document.getElementById('joshTextOverlay');
    hideDragHint();
    if (!card || !textOverlay) return;

    if (poi.type === 'project') {
      // Show project card (Joshua's World Rubiks Festival card style!)
      textOverlay.classList.remove('active');
      card.classList.add('active');

      const thumb = document.getElementById('joshCardThumb');
      const title = document.getElementById('joshCardTitle');
      const desc = document.getElementById('joshCardDesc');
      const btn = document.getElementById('joshCardActionBtn');

      if (thumb) thumb.src = poi.thumb;
      if (title) title.textContent = poi.title;
      if (desc) desc.textContent = poi.desc;
      if (btn) btn.innerHTML = `<span>${poi.actionText}</span>`;
    } else {
      // Show floating text overlay in sky (Joshua's World About / Contact text style!)
      card.classList.remove('active');
      textOverlay.classList.add('active');

      const l1 = document.getElementById('joshTextLine1');
      const l2 = document.getElementById('joshTextLine2');
      const btn = document.getElementById('joshTextActionBtn');

      if (l1) l1.textContent = poi.line1;
      if (l2) l2.textContent = poi.line2;
      if (btn) btn.innerHTML = `<span>${poi.actionText}</span>`;
    }
  }

  function openActivePoiModal() {
    if (currentPoiIndex < 0 || currentPoiIndex >= POIS.length) return;
    const poi = POIS[currentPoiIndex];
    openModal(poi.modalId);
  }

  function openModal(id) {
    if (!id) return;
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      playChime(620);
    }
  }

  function closeModal() {
    const activeModal = document.querySelector('.josh-case-study-modal.active');
    if (activeModal) activeModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function toggleMenu() {
    const menu = document.getElementById('joshFullMenu');
    if (menu) menu.classList.toggle('active');
    playChime(480);
  }

  function closeMenu() {
    const menu = document.getElementById('joshFullMenu');
    if (menu) menu.classList.remove('active');
  }

  // --- Day / Night Toggle (josh_t40s.jpg exact style!) ---
  function toggleDayNight() {
    isNight = !isNight;
    const theme = isNight ? PALETTE.night : PALETTE.day;

    // Toggle button icon (Moon in day, Lightbulb in night, matching video!)
    const btn = document.getElementById('joshThemeBtn');
    if (btn) {
      btn.innerHTML = isNight
        ? '<i class="fa-solid fa-lightbulb"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      btn.setAttribute('aria-label', isNight ? 'Switch to Day Mode' : 'Switch to Night Mode');
    }

    // Sky & Fog & Ocean
    scene.background.setHex(theme.skyHorizon);
    if (scene.fog) scene.fog.color.setHex(theme.fog);
    oceanMesh.material.color.setHex(theme.ocean);

    // Lights
    ambientLight.color.setHex(theme.ambient);
    ambientLight.intensity = theme.ambientIntensity;
    dirLight.color.setHex(theme.sun);
    dirLight.intensity = theme.sunIntensity;

    // Follow Spotlight glows up in night mode!
    spotLightFollow.intensity = isNight ? 4.2 : 0.0;

    // Festoon string lights glow
    fairyLights.forEach(b => {
      b.material.color.setHex(isNight ? 0xfff475 : 0xffeaad);
    });

    if (isNight) {
      document.body.classList.add('night-theme');
      document.body.classList.remove('day-theme');
    } else {
      document.body.classList.add('day-theme');
      document.body.classList.remove('night-theme');
    }

    playChime(isNight ? 320 : 640);
  }

  // --- Main Animation Render Loop (60 FPS) ---
  function animate() {
    requestAnimationFrame(animate);

    // 1. Fluid drag inertia
    if (!isDragging) {
      currentRotation += velocity;
      velocity *= 0.92; // smooth physics damping

      // Idle auto-rotation
      idleTimer++;
      if (idleTimer > 200 && Math.abs(velocity) < 0.001) {
        currentRotation += 0.0024;
      }
    }

    worldGroup.rotation.y = currentRotation;

    // 2. Identify active POI facing front camera
    const twoPi = Math.PI * 2;
    const normalizedAngle = ((-currentRotation % twoPi) + twoPi) % twoPi;

    let closest = 0;
    let minDiff = 999;
    POIS.forEach((poi, i) => {
      let diff = Math.abs(normalizedAngle - poi.angle);
      if (diff > Math.PI) diff = twoPi - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });

    const isModalOpen = Boolean(document.querySelector('.josh-case-study-modal.active'));
    const isPaused = !isWorldVisible || isModalOpen;

    if (!isPaused) {
      if (minDiff < 0.45) {
        if (closest !== currentPoiIndex) {
          setPoi(closest);
        }
        hideDragHint();
      } else {
        // In between landmarks: hide cards and show drag hint
        const card = joshFloatingCard || document.getElementById('joshFloatingCard');
        const textOverlay = joshTextOverlay || document.getElementById('joshTextOverlay');
        const hint = joshDragHint || document.getElementById('joshDragHint');
        if (card) card.classList.remove('active');
        if (textOverlay) textOverlay.classList.remove('active');
        if (hint) hint.classList.remove('hidden');
        currentPoiIndex = -1;
      }
    }

    // 3. Animate Cyclist on the foreground road track (Signature Joshua's World cyclist!)
    const time = clock.getElapsedTime();
    if (cyclistGroup) {
      cyclistGroup.position.x = Math.sin(time * 1.5) * 0.22;
      cyclistGroup.position.y = 1.76 + Math.abs(Math.sin(time * 7)) * 0.03;
      cyclistGroup.position.z = 13.0;
      cyclistGroup.rotation.y = Math.PI / 2;

      // Wheels spin
      wheels.forEach(w => {
        if (w.children[0]) w.children[0].rotation.z += 0.22;
      });

      // Legs pedaling
      const pedalPhase = time * 9;
      if (legs.length >= 2) {
        legs[0].position.y = 0.75 + Math.sin(pedalPhase) * 0.12;
        legs[1].position.y = 0.75 - Math.sin(pedalPhase) * 0.12;
      }
    }

    // Spotlight tracks cyclist in night mode (matches frame_34s.jpg!)
    if (isNight && spotLightFollow) {
      spotLightFollow.position.set(0, 16, 12);
      spotLightFollow.target.position.set(cyclistGroup.position.x, 1.76, 13.0);
    }

    // Render Scene (skipped when section is off-screen or modal is open)
    if (!isPaused) {
      renderer.render(scene, camera);
    }
  }

  // Global exposure
  window.AyushWorld = {
    rotateToPoiIndex,
    toggleDayNight,
    openModal,
    closeModal,
    toggleMenu
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
