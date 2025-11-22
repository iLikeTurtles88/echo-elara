
import React, { useRef, useEffect, useState } from 'react';
import { ArtPiece } from '../types';
import { ArrowRight, X, Maximize2 } from 'lucide-react';

const SAMPLE_ART: ArtPiece[] = [
  { id: '1', title: "L'Aube Cybernétique", description: "Huile sur toile & glitch art numérique. Une fusion entre la texture classique et l'erreur binaire.", category: "Mixte", imageUrl: "https://picsum.photos/600/800?random=1", year: 2023 },
  { id: '2', title: "Silence Blanc", description: "Sculpture 3D rendue dans le vide. L'absence de son matérialisée.", category: "3D", imageUrl: "https://picsum.photos/600/800?random=2", year: 2024 },
  { id: '3', title: "Fragments de Mémoire", description: "Collage génératif basé sur des données de rêves collectés.", category: "Algorithmique", imageUrl: "https://picsum.photos/600/800?random=3", year: 2022 },
  { id: '4', title: "Nebula V", description: "Photographie manipulée spectralement. La lumière invisible rendue visible.", category: "Photo", imageUrl: "https://picsum.photos/600/800?random=4", year: 2023 },
  { id: '5', title: "Echo", description: "Installation vidéo récursive. Le spectateur devient l'œuvre.", category: "Vidéo", imageUrl: "https://picsum.photos/600/800?random=5", year: 2024 },
  { id: '6', title: "Synesthésie Noire", description: "Représentation visuelle d'ondes sonores infra-basses.", category: "Sonore", imageUrl: "https://picsum.photos/600/800?random=6", year: 2024 },
];

const TiltCard: React.FC<{ art: ArtPiece; index: number; onClick: (art: ArtPiece) => void }> = ({ art, index, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  
  const isHovered = useRef(false);
  const orientationRef = useRef({ beta: 0, gamma: 0 });
  const hasOrientation = useRef(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const animate = () => {
      if (isTouchDevice && hasOrientation.current && cardRef.current && imageRef.current && shineRef.current) {
        const { beta, gamma } = orientationRef.current;
        const tiltX = (beta - 45); 
        const tiltY = gamma;       

        const clampedX = Math.max(-20, Math.min(20, tiltX));
        const clampedY = Math.max(-20, Math.min(20, tiltY));
        
        const rotateX = -clampedX * 0.5; 
        const rotateY = clampedY * 0.5;
        
        const imgX = -clampedY * 0.8;
        const imgY = -clampedX * 0.8;
        
        const shineOpacity = 0.1 + (Math.abs(rotateX) + Math.abs(rotateY)) / 40;

        cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        imageRef.current.style.transform = `scale(1.15) translate3d(${imgX}px, ${imgY}px, -20px)`;
        shineRef.current.style.background = `linear-gradient(${135 + rotateY * 2}deg, rgba(255,255,255,${shineOpacity}) 0%, rgba(255,255,255,0) 100%)`;

      } else if (!isHovered.current && cardRef.current && imageRef.current && shineRef.current) {
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / 1000;
        
        const rotateX = Math.sin(elapsed * 0.5) * 2; 
        const rotateY = Math.cos(elapsed * 0.3) * 3;
        
        const imgX = Math.cos(elapsed * 0.3) * -4;
        const imgY = Math.sin(elapsed * 0.5) * -4;
        
        const shineOpacity = 0.3 + Math.sin(elapsed * 0.8) * 0.15;

        cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        imageRef.current.style.transform = `scale(1.15) translate3d(${imgX}px, ${imgY}px, -20px)`;
        
        shineRef.current.style.background = `linear-gradient(135deg, rgba(255,255,255,${shineOpacity * 0.15}) 0%, rgba(255,255,255,0) 100%)`;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.beta !== null && e.gamma !== null) {
            orientationRef.current = { beta: e.beta, gamma: e.gamma };
            hasOrientation.current = true;
        }
    };

    animate();
    
    if (isTouchDevice) {
        window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (isTouchDevice) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !imageRef.current || !shineRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    const imgX = ((x - centerX) / centerX) * -15;
    const imgY = ((y - centerY) / centerY) * -15;

    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    imageRef.current.style.transform = `scale(1.15) translate3d(${imgX}px, ${imgY}px, -20px)`;
    
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
      onClick={() => onClick(art)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="w-full h-full relative transform-style-3d group cursor-pointer will-change-transform"
        style={{ transition: 'transform 1s ease-in-out' }}
      >
        <div className="w-full h-full overflow-hidden rounded-sm bg-gray-900 shadow-2xl border border-white/5 transform-style-3d">
          <img 
            ref={imageRef}
            src={art.imageUrl} 
            alt={art.title} 
            className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-filter duration-700 will-change-transform"
            style={{ transform: 'scale(1.15) translate3d(0,0,-20px)' }}
          />
          <div className="absolute inset-0 bg-black/30 md:group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
          
          {/* Icone d'agrandissement discrète sur mobile */}
          <div className="absolute top-4 right-4 text-white opacity-50 md:hidden z-30">
             <Maximize2 size={20} />
          </div>
        </div>

        <div 
            ref={shineRef}
            className="absolute inset-0 pointer-events-none rounded-sm z-10 mix-blend-overlay transition-opacity duration-500"
            style={{ transform: 'translateZ(1px)' }}
        />

        <div 
          className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 pointer-events-none"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="overflow-hidden">
            <div className="transform translate-y-0 md:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur-md text-purple-300 text-[10px] tracking-[0.2em] uppercase mb-3 border border-white/10 rounded-full shadow-lg">
                    {art.category} <span className="mx-1">•</span> {art.year}
                </span>
                <h3 className="text-2xl md:text-3xl serif font-medium text-white mb-2 drop-shadow-lg">{art.title}</h3>
                
                <p className="text-gray-200 text-sm font-light leading-relaxed opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-2 mb-4 drop-shadow-md bg-black/40 md:bg-transparent p-2 md:p-0 rounded md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
                    {art.description}
                </p>
                
                <div className="flex items-center text-white text-xs tracking-widest gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <span className="border-b border-white/40 pb-1">Explorer</span> <ArrowRight size={14} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Lightbox: React.FC<{ art: ArtPiece | null; onClose: () => void }> = ({ art, onClose }) => {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        if (art) {
            setVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setVisible(false);
            document.body.style.overflow = 'auto';
        }
    }, [art]);

    if (!art) return null;

    return (
        <div 
            // z-40 pour passer SOUS le header (qui est z-50)
            // pt-24/pt-32 pour dégager visuellement l'espace du header
            className={`fixed inset-0 z-[40] flex items-center justify-center px-4 pb-4 pt-24 md:px-12 md:pb-12 md:pt-32 transition-all duration-500 ${visible ? 'opacity-100 backdrop-blur-xl bg-black/90' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div 
                // max-w-5xl (réduit) et max-h-[80vh] (pour éviter le scroll global)
                className={`relative w-full max-w-5xl h-full max-h-[80vh] flex flex-col md:flex-row bg-[#0a0a0a] rounded-sm overflow-hidden shadow-2xl transition-all duration-700 transform border border-white/10 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Ajout data-cursor-text="Fermer" */}
                <button 
                    onClick={onClose}
                    data-cursor-text="Fermer"
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300"
                >
                    <X size={24} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-3/5 h-1/2 md:h-full relative overflow-hidden bg-black">
                     <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        className="w-full h-full object-cover object-center"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:hidden" />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/5 h-1/2 md:h-full p-6 md:p-10 flex flex-col justify-center border-l border-white/5 relative overflow-y-auto custom-scrollbar">
                    {/* Background noise texture effect */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                    <div className="relative z-10">
                        <span className="text-purple-400 text-xs tracking-[0.3em] uppercase block mb-3">
                            No. {art.id.padStart(2, '0')} — {art.year}
                        </span>
                        
                        <h2 className="text-2xl md:text-4xl serif text-white mb-4 leading-tight">
                            {art.title}
                        </h2>
                        
                        <div className="h-[1px] w-12 bg-white/20 mb-4"></div>
                        
                        <p className="text-gray-300 font-light leading-relaxed text-sm mb-6">
                            {art.description}
                        </p>
                        
                        <div className="flex flex-col gap-3 mt-auto">
                            <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest border-t border-white/10 pt-3">
                                <span>Catégorie</span>
                                <span className="text-white">{art.category}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest border-t border-white/10 pt-3">
                                <span>Dimensions</span>
                                <span className="text-white">Variable</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full py-3 border border-white/10 hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group">
                            Acquérir
                            <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Gallery: React.FC = () => {
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);

  return (
    <>
        <div className="w-full min-h-screen flex flex-col pt-24 md:pt-32 pb-24 px-5 md:px-12 animate-fade-in">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 max-w-7xl mx-auto w-full">
            {SAMPLE_ART.map((art, index) => (
            <TiltCard 
                key={art.id} 
                art={art} 
                index={index} 
                onClick={setSelectedArt}
            />
            ))}
        </div>
        
        <div className="text-center mt-16 md:mt-24 text-gray-600 text-xs tracking-widest uppercase">
            Fin de la collection
        </div>
        </div>

        {/* Lightbox Overlay */}
        <Lightbox art={selectedArt} onClose={() => setSelectedArt(null)} />
    </>
  );
};

export default Gallery;
