
import React, { useMemo } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  alwaysActive?: boolean;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", as: Tag = 'span', alwaysActive = false }) => {
  // Génération unique des paramètres d'animation au montage pour garantir la diversité
  const { uniqueId, styleTag, duration } = useMemo(() => {
    const id = Math.random().toString(36).substr(2, 9);
    const animDuration = 4 + Math.random() * 5; // Durée aléatoire entre 4s et 9s pour éviter la synchro

    const kf = (p: number, clip: string, x: number, y: number, op: number) => 
      `${p.toFixed(2)}% { clip-path: ${clip}; transform: translate(${x}px, ${y}px); opacity: ${op}; }`;

    const hidden = 'inset(50% 0 50% 0)';
    
    // Tableaux pour stocker les étapes d'animation
    const frames1: string[] = [];
    const frames2: string[] = [];

    // État initial et final (invisible)
    [0, 100].forEach(p => {
      frames1.push(kf(p, hidden, 0, 0, 0));
      frames2.push(kf(p, hidden, 0, 0, 0));
    });

    // --- 1. L'ÉVÉNEMENT "TEARING" (Coupure franche horizontale) ---
    // On choisit un moment aléatoire pour le gros glitch (entre 20% et 80% de la boucle)
    const tearTime = 20 + Math.random() * 60; 
    const tearDur = 2 + Math.random() * 2; // Durée assez courte (2-4% du temps)
    const shift = 10 + Math.random() * 20; // Décalage horizontal variable (10px à 30px)

    // Juste avant : calme
    frames1.push(kf(tearTime - 0.1, hidden, 0, 0, 0));
    frames2.push(kf(tearTime - 0.1, hidden, 0, 0, 0));

    // Pendant : Split !
    // Couche 1 : Haut part à gauche
    frames1.push(kf(tearTime, 'inset(0 0 50% 0)', -shift, 0, 1));
    // Couche 2 : Bas part à droite
    frames2.push(kf(tearTime, 'inset(50% 0 0 0)', shift, 0, 1));

    // Juste après : retour au calme
    frames1.push(kf(tearTime + tearDur, hidden, 0, 0, 0));
    frames2.push(kf(tearTime + tearDur, hidden, 0, 0, 0));


    // --- 2. BRUIT ALÉATOIRE (Micro-glitchs) ---
    // On ajoute 4 à 8 petits glitchs dispersés
    const noiseCount = 4 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < noiseCount; i++) {
      const t = Math.random() * 90 + 5;
      // On évite de superposer avec le Tearing
      if (Math.abs(t - tearTime) < 5) continue;

      const dur = 0.5 + Math.random(); // Très rapide
      
      // Paramètres aléatoires pour couche 1
      const insetT1 = Math.floor(Math.random() * 90);
      const insetB1 = Math.floor(Math.random() * (95 - insetT1));
      const x1 = (Math.random() - 0.5) * 10;
      const y1 = (Math.random() - 0.5) * 8;

      frames1.push(kf(t, `inset(${insetT1}% 0 ${insetB1}% 0)`, x1, y1, 1));
      frames1.push(kf(t + dur, hidden, 0, 0, 0));

      // Paramètres aléatoires pour couche 2
      const insetT2 = Math.floor(Math.random() * 90);
      const insetB2 = Math.floor(Math.random() * (95 - insetT2));
      const x2 = (Math.random() - 0.5) * 10;
      const y2 = (Math.random() - 0.5) * 8;

      frames2.push(kf(t, `inset(${insetT2}% 0 ${insetB2}% 0)`, x2, y2, 1));
      frames2.push(kf(t + dur, hidden, 0, 0, 0));
    }

    // Construction du bloc CSS
    const css = `
      @keyframes glitch-anim-1-${id} {
        ${frames1.join('\n')}
      }
      @keyframes glitch-anim-2-${id} {
        ${frames2.join('\n')}
      }
    `;

    return { uniqueId: id, styleTag: css, duration: animDuration };
  }, []);

  return (
    <div className={`relative inline-block group ${alwaysActive ? 'always-active' : ''}`}>
      <style>{styleTag}</style>
      <style>{`
        /* Classes génériques pour les couleurs et position */
        .glitch-layer-${uniqueId} {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          opacity: 0; /* Caché par défaut, contrôlé par keyframes */
        }
        
        .group:hover .glitch-1-${uniqueId},
        .always-active .glitch-1-${uniqueId} {
          animation: glitch-anim-1-${uniqueId} ${duration}s infinite linear alternate-reverse;
          text-shadow: -2px 0 #00ffff;
        }
        
        .group:hover .glitch-2-${uniqueId},
        .always-active .glitch-2-${uniqueId} {
          animation: glitch-anim-2-${uniqueId} ${duration}s infinite linear alternate-reverse;
          text-shadow: 2px 0 #ff00ff;
        }
      `}</style>
      
      {/* Main Text */}
      <Tag className={`relative z-10 ${className}`}>{text}</Tag>
      
      {/* Glitch Layers */}
      <Tag className={`glitch-layer-${uniqueId} glitch-1-${uniqueId} pointer-events-none mix-blend-screen ${className}`} aria-hidden="true">
        {text}
      </Tag>
      <Tag className={`glitch-layer-${uniqueId} glitch-2-${uniqueId} pointer-events-none mix-blend-screen ${className}`} aria-hidden="true">
        {text}
      </Tag>
    </div>
  );
};

export default GlitchText;
