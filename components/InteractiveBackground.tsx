import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const InteractiveBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: false, 
      antialias: true, 
      powerPreference: "high-performance" 
    });

    const container = mountRef.current;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    
    container.appendChild(renderer.domElement);

    // --- 1. BACKGROUND SHADER PLANE ---
    const bgGeometry = new THREE.PlaneGeometry(40, 40); 
    const bgVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const bgFragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / uResolution.y;
        vec2 stCorrected = st;
        stCorrected.x *= aspect;
        stCorrected.x *= 0.65; 

        float dist = distance(st, uMouse);
        float mouseForce = smoothstep(0.5, 0.0, dist) * 0.35; 
        float t = uTime * 0.08; 
        
        vec2 q = vec2(0.);
        q.x = snoise(stCorrected + vec2(0.0, t));
        q.y = snoise(stCorrected + vec2(1.0, t));

        vec2 r = vec2(0.);
        r.x = snoise(stCorrected + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t + (uMouse.x - 0.5) * 0.5 + mouseForce);
        r.y = snoise(stCorrected + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t + (uMouse.y - 0.5) * 0.5 + mouseForce);

        float f = snoise(stCorrected + r);

        vec3 colorBase = vec3(0.01, 0.01, 0.04); 
        vec3 color1 = vec3(0.3, 0.05, 0.45); 
        vec3 color2 = vec3(0.05, 0.35, 0.55); 

        vec3 finalColor = colorBase;
        finalColor = mix(finalColor, color1, length(q) * 0.5 + mouseForce * 0.15);
        finalColor = mix(finalColor, color2, length(r) * 0.4);
        finalColor += vec3(f * 0.05);

        float vignette = 1.0 - smoothstep(0.5, 2.2, length(st - 0.5) * 1.2);
        finalColor *= vignette;
        
        float sideFade = smoothstep(0.0, 0.15, st.x) * smoothstep(1.0, 0.85, st.x);
        finalColor *= sideFade;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      depthWrite: false, 
    });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -2; 
    scene.add(bgMesh);


    // --- 2. PARTICLE SYSTEM (Poussière Numérique) ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 120;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    // Détection sommaire mobile pour la dispersion des particules
    const isMobile = window.innerWidth < 768;
    const xSpread = isMobile ? 12 : 30; // Dispersion réduite sur mobile pour que les particules soient visibles

    for(let i = 0; i < particlesCount * 3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * xSpread; 
        posArray[i+1] = (Math.random() - 0.5) * 10; 
        posArray[i+2] = (Math.random() - 0.5) * 5; 
        
        scaleArray[i/3] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    const getTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if(ctx) {
            const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 32, 32);
        }
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04, 
        map: getTexture(),
        transparent: true,
        opacity: 0.3, 
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xccddff 
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);


    // --- ANIMATION LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      bgMaterial.uniforms.uTime.value = elapsedTime;
      bgMaterial.uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      particlesMesh.rotation.y = elapsedTime * 0.02; 
      particlesMesh.rotation.x = currentMouseY * 0.1; 

      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for(let i = 0; i < particlesCount; i++) {
          const i3 = i * 3;
          positions[i3 + 1] += 0.002; 

          if(positions[i3 + 1] > 5) {
              positions[i3 + 1] = -5;
          }

          const mouseWorldX = (currentMouseX - 0.5) * 10;
          const mouseWorldY = (currentMouseY - 0.5) * 6;
          
          const dist = Math.sqrt(
              Math.pow(mouseWorldX - positions[i3], 2) + 
              Math.pow(mouseWorldY - positions[i3+1], 2)
          );

          if (dist < 2) {
              const force = (2 - dist) * 0.01;
              positions[i3] += (positions[i3] - mouseWorldX) * force;
              positions[i3+1] += (positions[i3+1] - mouseWorldY) * force;
          }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      
      const currentDpr = renderer.getPixelRatio();
      bgMaterial.uniforms.uResolution.value.set(w * currentDpr, h * currentDpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - (e.clientY / window.innerHeight);
    };

    // Gestion de l'orientation mobile (Gyroscope)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // Gamma (gauche/droite) : généralement entre -90 et 90
      // Beta (avant/arrière) : généralement entre -180 et 180
      
      const gamma = e.gamma || 0; // Inclinaison gauche/droite
      const beta = e.beta || 0;   // Inclinaison avant/arrière

      // Normalisation pour correspondre à 0.0 -> 1.0 comme la souris
      // On assume une tenue de téléphone "confortable" :
      // Gamma : 0 (centré). Plage +/- 45 deg
      // Beta : 45 (tenu face à soi). Plage +/- 45 deg

      const normalizedX = 0.5 + (gamma / 90); 
      // Pour Y, on centre autour de 45 degrés (position de lecture standard)
      const normalizedY = 0.5 - ((beta - 45) / 90);

      // Clamp values
      targetMouseX = Math.max(0, Math.min(1, normalizedX));
      targetMouseY = Math.max(0, Math.min(1, normalizedY));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ background: '#050510' }} 
    />
  );
};

export default InteractiveBackground;