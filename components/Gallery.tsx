import React, { useRef, useEffect } from 'react';
import { ArtPiece } from '../types';
import { ArrowRight } from 'lucide-react';

const SAMPLE_ART: ArtPiece[] = [
  { id: '1', title: "L'Aube Cybernétique", description: "Huile sur toile & glitch art numérique. Une fusion entre la texture classique et l'erreur binaire.", category: "Mixte", imageUrl: "https://picsum.photos/600/800?random=1", year: 2023 },
  { id: '2', title: "Silence Blanc", description: "Sculpture 3D rendue dans le vide. L'absence de son matérialisée.", category: "3D", imageUrl: "https://picsum.photos/600/800?random=2", year: 2024 },
  { id: '3', title: "Fragments de Mémoire", description: "Collage génératif basé sur des données de rêves collectés.", category: "Algorithmique", imageUrl: "https://picsum.photos/600/800?random=3", year: 2022 },
  { id: '4', title: "Nebula V", description: "Photographie manipulée spectralement. La lumière invisible rendue visible.", category: "Photo", imageUrl: "https://picsum.photos/600/800?random=4", year: 2023 },
  { id: '5', title: "Echo", description: "Installation vidéo récursive. Le spectateur devient l'œuvre.", category: "Vidéo", imageUrl: "https://picsum.photos/600/800?random=5", year: 2024 },
  { id: '6', title: "Synesthésie Noire", description: "Représentation visuelle d'ondes sonores infra-basses.", category: "Sonore", imageUrl: "https://picsum.photos/600/800?random=6", year: 2024 },
];

const TiltCard: React.FC<{ art: ArtPiece; index: number }> = ({ art, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  
  // Utilisation de refs pour l'état interne de l'animation afin d'éviter les re-renders React
  const isHovered = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const animate = () => {
      // Si on ne survole pas, on applique l'effet "breathing" automatique
      if (!isHovered.current && cardRef.current && imageRef.current && shineRef.current) {
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / 1000;
        
        // Mouvement sinusoïdal optimisé
        const rotateX = Math.sin(elapsed * 0.5) * 2; 
        const rotateY = Math.cos(elapsed * 0.3) * 3;
        
        const imgX = Math.cos(elapsed * 0.3) * -4;
        const imgY = Math.sin(elapsed * 0.5) * -4;
        
        const shineOpacity = 0.3 + Math.sin(elapsed * 0.8) * 0.15;

        // Manipulation directe du DOM pour 60fps sans React Render Cycle
        cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        // Utilisation de translate3d pour forcer l'accélération GPU
        imageRef.current.style.transform = `scale(1.15) translate3d(${imgX}px, ${imgY}px, -20px)`;
        
        shineRef.current.style.background = `linear-gradient(135deg, rgba(255,255,255,${shineOpacity * 0.15}) 0%, rgba(255,255,255,0) 100%)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !imageRef.current || !shineRef.current) return;
    
    // Sur mobile, l'événement peut être moins fiable, mais la logique "default" prendra le relais si pas de hover
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculs physiques
    const rotateX = ((y - centerY) / centerY) * -8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    const imgX = ((x - centerX) / centerX) * -15;
    const imgY = ((y - centerY) / centerY) * -15;

    // Application directe
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    imageRef.current.style.transform = `scale(1.15) translate3d(${imgX}px, ${imgY}px, -20px)`;
    
    // Shine effect interactif
    shineRef.current.style.background = `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)`;
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
    if (cardRef.current && imageRef.current) {
        cardRef.current.style.transition = 'transform 0.1s ease-out';
        imageRef.current.style.transition = 'transform 0.1s ease-out';
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    if (cardRef.current && imageRef.current) {
        cardRef.current.style.transition = 'transform 1s ease-in-out';
        imageRef.current.style.transition = 'transform 1s ease-in-out';
    }
  };

  return (
    <div 
      className="relative w-full h-[55vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] perspective-1000 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      ref={containerRef}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="w-full h-full relative transform-style-3d group cursor-pointer will-change-transform"
        style={{ transition: 'transform 1s ease-in-out' }}
      >
        {/* Image Container */}
        <div 
          className="w-full h-full overflow-hidden rounded-sm bg-gray-900 shadow-2xl border border-white/5 transform-style-3d"
        >
          <img 
            ref={imageRef}
            src={art.imageUrl} 
            alt={art.title} 
            className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-filter duration-700 will-change-transform"
            style={{ transform: 'scale(1.15) translate3d(0,0,-20px)' }}
          />
          <div className="absolute inset-0 bg-black/30 md:group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
        </div>

        {/* Shine Effect */}
        <div 
            ref={shineRef}
            className="absolute inset-0 pointer-events-none rounded-sm z-10 mix-blend-overlay transition-opacity duration-500"
            style={{ transform: 'translateZ(1px)' }}
        />

        {/* Overlay Content */}
        <div 
          className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 pointer-events-none"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="overflow-hidden">
            {/* Sur mobile : pas de translate Y, contenu toujours visible (opacity 100) */}
            <div className="transform translate-y-0 md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md text-purple-300 text-[10px] tracking-[0.2em] uppercase mb-3 border border-white/10 rounded-full shadow-lg">
                    {art.category} <span className="mx-1">•</span> {art.year}
                </span>
                <h3 className="text-2xl md:text-3xl serif font-medium text-white mb-2 drop-shadow-lg">{art.title}</h3>
                
                <p className="text-gray-200 text-sm font-light leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-2 mb-4 drop-shadow-md bg-black/40 md:bg-transparent p-2 md:p-0 rounded md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
                    {art.description}
                </p>
                
                <div className="flex items-center text-white text-xs tracking-widest gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <span className="border-b border-white/40 pb-1">Découvrir l'œuvre</span> <ArrowRight size={14} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col pt-24 md:pt-32 pb-24 px-5 md:px-12 animate-fade-in">
      {/* Gallery Header */}
      <div className="mb-12 md:mb-16 max-w-7xl mx-auto w-full border-b border-white/10 pb-6 md:pb-8">
        <h2 className="text-5xl md:text-8xl serif italic text-white mb-4">Œuvres</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
           <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 md:w-12 bg-purple-500"></div>
              <p className="text-gray-400 text-xs tracking-[0.3em] uppercase">Collection 2021 — 2024</p>
           </div>
           <p className="text-gray-500 text-sm font-light italic max-w-md text-right hidden md:block">
             Défilez vers le bas pour explorer l'archive visuelle complète.
           </p>
        </div>
      </div>

      {/* Vertical Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 max-w-7xl mx-auto w-full">
        {SAMPLE_ART.map((art, index) => (
          <TiltCard key={art.id} art={art} index={index} />
        ))}
      </div>
      
      {/* Footer note */}
      <div className="text-center mt-16 md:mt-24 text-gray-600 text-xs tracking-widest uppercase">
         Fin de la collection
      </div>
    </div>
  );
};

export default Gallery;