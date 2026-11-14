import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GREEN = 0x76f500;
const LIME = 0xb6ff63;

function addLine(scene, start, end, opacity = 0.34) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
  return line;
}

function createNetwork(group, nodeCount = 10) {
  const center = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 2),
    new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.78 }),
  );
  group.add(center);
  const inner = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.38, 1),
    new THREE.MeshBasicMaterial({ color: LIME, wireframe: true, transparent: true, opacity: 0.48 }),
  );
  group.add(inner);

  const nodes = [];
  for (let i = 0; i < nodeCount; i += 1) {
    const y = 1 - (i / Math.max(1, nodeCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = Math.PI * (3 - Math.sqrt(5)) * i;
    const position = new THREE.Vector3(Math.cos(angle) * radius * 2.35, y * 2.35, Math.sin(angle) * radius * 2.35);
    const node = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.13, 1),
      new THREE.MeshBasicMaterial({ color: i === 0 ? LIME : GREEN, transparent: true, opacity: 0.9 }),
    );
    node.position.copy(position);
    node.userData.domainIndex = i;
    group.add(node);
    nodes.push(node);
    addLine(group, new THREE.Vector3(0, 0, 0), position, 0.32);
    if (i > 0 && i % 2 === 0) addLine(group, nodes[i - 1].position, position, 0.16);
  }

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.008, 4, 140),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.42 }),
  );
  orbit.rotation.x = 0.74;
  group.add(orbit);
  return nodes;
}

function createBlockchain(group) {
  const blocks = [];
  for (let i = 0; i < 5; i += 1) {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.78, 0.78),
      new THREE.MeshBasicMaterial({ color: i === 2 ? LIME : GREEN, wireframe: true, transparent: true, opacity: 0.84 }),
    );
    block.position.set((i - 2) * 1.18, Math.sin(i * 1.4) * 0.32, Math.cos(i * 0.8) * 0.28);
    block.rotation.set(0.24 * i, 0.14 * i, 0.11 * i);
    group.add(block);
    blocks.push(block);
    if (i) addLine(group, blocks[i - 1].position, block.position, 0.55);
  }
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.3, 0.009, 4, 120),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.35 }),
  );
  ring.rotation.y = 0.62;
  ring.rotation.x = 0.35;
  group.add(ring);
}

function createFinance(group) {
  const center = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.67, 1),
    new THREE.MeshBasicMaterial({ color: LIME, wireframe: true, transparent: true, opacity: 0.72 }),
  );
  group.add(center);
  const count = 9;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const position = new THREE.Vector3(Math.cos(angle) * 2.25, Math.sin(angle * 2) * 0.38, Math.sin(angle) * 2.25);
    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.075, 24),
      new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.78 }),
    );
    coin.position.copy(position);
    coin.rotation.x = Math.PI / 2;
    group.add(coin);
    addLine(group, center.position, position, 0.34);
  }
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.72, 0.012, 4, 120),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.4 }),
  );
  ring.rotation.x = 0.9;
  group.add(ring);
}

function createInfrastructure(group) {
  for (let rack = 0; rack < 4; rack += 1) {
    const x = (rack - 1.5) * 1.35;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 2.15, 0.66),
      new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.76 }),
    );
    frame.position.set(x, -0.05 + (rack % 2) * 0.18, 0);
    group.add(frame);
    for (let shelf = 0; shelf < 4; shelf += 1) {
      const unit = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.28, 0.44),
        new THREE.MeshBasicMaterial({ color: shelf === (rack % 4) ? LIME : GREEN, wireframe: true, transparent: true, opacity: 0.82 }),
      );
      unit.position.set(x, -0.76 + shelf * 0.48, 0.02);
      group.add(unit);
      if (rack < 3) addLine(group, unit.position, new THREE.Vector3(x + 1.35, unit.position.y + 0.14, 0.05), 0.12);
    }
  }
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(3.6, 0.009, 4, 120),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.3 }),
  );
  orbit.rotation.y = 0.72;
  group.add(orbit);
}

function createNeural(group) {
  const nodes = [];
  for (let i = 0; i < 48; i += 1) {
    const y = 1 - (i / 47) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = Math.PI * (3 - Math.sqrt(5)) * i;
    const position = new THREE.Vector3(Math.cos(angle) * radius * 2.25, y * 2.25, Math.sin(angle) * radius * 2.25);
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(i % 7 === 0 ? 0.07 : 0.034, 8, 8),
      new THREE.MeshBasicMaterial({ color: i % 7 === 0 ? LIME : GREEN, transparent: true, opacity: 0.78 }),
    );
    node.position.copy(position);
    group.add(node);
    nodes.push(node);
  }
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (nodes[i].position.distanceTo(nodes[j].position) < 0.95) {
        addLine(group, nodes[i].position, nodes[j].position, 0.2);
      }
    }
  }
  group.add(new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.82, 2),
    new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.56 }),
  ));
}

export default function TechEcosystemScene({ variant = 'network', selectedIndex = 0, onSelect, label = 'Interactive 3D technology visualization' }) {
  const mountRef = useRef(null);
  const selectedRef = useRef(selectedIndex);
  const selectRef = useRef(onSelect);

  useEffect(() => {
    selectedRef.current = selectedIndex;
    if (mountRef.current) mountRef.current.dispatchEvent(new Event('sceneselect'));
  }, [selectedIndex]);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, variant === 'network' || variant === 'neural' ? 8.5 : 9.2);
      const group = new THREE.Group();
      scene.add(group);
      let selectableNodes = [];
      if (variant === 'blockchain') createBlockchain(group);
      else if (variant === 'finance') createFinance(group);
      else if (variant === 'infrastructure') createInfrastructure(group);
      else if (variant === 'neural') createNeural(group);
      else selectableNodes = createNetwork(group);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      mount.appendChild(renderer.domElement);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let reduceMotion = reduceMotionQuery.matches;
      let frame = 0;
      let active = false;
      let elapsed = 0;
      let lastTime = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 560 ? 1 : 1.6));
        renderer.setSize(width, height, false);
        if (!active || reduceMotion) render();
      };
      const render = (time = 0) => {
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.04) : 0;
        lastTime = time;
        if (!reduceMotion) elapsed += delta;
        currentX += (targetX - currentX) * 0.035;
        currentY += (targetY - currentY) * 0.035;
        group.rotation.y = elapsed * (variant === 'network' ? 0.07 : 0.11) + currentY;
        group.rotation.x = Math.sin(elapsed * 0.34) * 0.08 + currentX;
        selectableNodes.forEach((node, index) => {
          const selected = index === selectedRef.current;
          node.scale.setScalar(selected ? 1.42 : 1);
          node.material.color.setHex(selected ? LIME : GREEN);
        });
        renderer.render(scene, camera);
        if (active && !reduceMotion) frame = requestAnimationFrame(render);
      };
      const start = () => {
        if (active) return;
        active = true;
        if (reduceMotion) render();
        else frame = requestAnimationFrame(render);
      };
      const stop = () => {
        active = false;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      };
      const visibility = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop(), { threshold: 0.04 });
      visibility.observe(mount);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const onPointerMove = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        targetY = (x - 0.5) * 0.46;
        targetX = (y - 0.5) * 0.3;
        if (!active || reduceMotion) render();
      };
      const onPointerLeave = () => { targetX = 0; targetY = 0; if (reduceMotion) render(); };
      const onSceneSelect = () => { if (!active || reduceMotion) render(); };
      const onMotionChange = (event) => {
        reduceMotion = event.matches;
        if (reduceMotion) { if (frame) cancelAnimationFrame(frame); frame = 0; if (active) render(); }
        else if (active) frame = requestAnimationFrame(render);
      };
      const onClick = (event) => {
        if (!selectRef.current || selectableNodes.length === 0) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(selectableNodes, false)[0];
        if (hit) selectRef.current(hit.object.userData.domainIndex);
      };
      renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });
      renderer.domElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
      renderer.domElement.addEventListener('click', onClick);
      mount.addEventListener('sceneselect', onSceneSelect);
      reduceMotionQuery.addEventListener?.('change', onMotionChange);

      return () => {
        stop();
        visibility.disconnect();
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
        renderer.domElement.removeEventListener('click', onClick);
        mount.removeEventListener('sceneselect', onSceneSelect);
        reduceMotionQuery.removeEventListener?.('change', onMotionChange);
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    } catch (error) {
      console.warn('3D technology scene is unavailable in this browser.', error);
      mount.dataset.sceneUnavailable = 'true';
      if (renderer) renderer.dispose();
      return undefined;
    }
  }, [variant]);

  return <div ref={mountRef} className={`tech-3d-scene tech-scene-${variant}`} role="img" aria-label={label} />;
}
