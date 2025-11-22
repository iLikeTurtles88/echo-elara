
import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", as: Tag = 'span' }) => {
  return (
    <div className="relative inline-block group">
      <style>{`
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
          60% { clip-path: inset(10% 0 80% 0); transform: translate(-1px, -2px); }
          80% { clip-path: inset(40% 0 10% 0); transform: translate(1px, 2px); }
          100% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 1px); }
        }
        .glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .group:hover .glitch-1 {
          animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
          text-shadow: -2px 0 #ff00c1;
          opacity: 0.8;
          clip-path: inset(50% 0 30% 0);
        }
        .group:hover .glitch-2 {
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
          text-shadow: 2px 0 #00fff9;
          opacity: 0.8;
          clip-path: inset(10% 0 60% 0);
        }
      `}</style>
      
      {/* Main Text */}
      <Tag className={`relative z-10 ${className}`}>{text}</Tag>
      
      {/* Glitch Layers (Visible on Hover) */}
      <Tag className={`glitch-layer glitch-1 opacity-0 pointer-events-none text-transparent mix-blend-screen ${className}`} aria-hidden="true">
        {text}
      </Tag>
      <Tag className={`glitch-layer glitch-2 opacity-0 pointer-events-none text-transparent mix-blend-screen ${className}`} aria-hidden="true">
        {text}
      </Tag>
    </div>
  );
};

export default GlitchText;
