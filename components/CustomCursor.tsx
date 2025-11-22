import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('Ouvrir');
  
  // Position brute de la souris
  const mousePos = useRef({ x: 0, y: 0 });
  // Position lissée du curseur
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Détection des éléments interactifs pour changer l'état du curseur
    const onMouseEnterInteractive = (e: Event) => {
      setIsHovering(true);
      const target = e.currentTarget as HTMLElement;
      const customText = target.getAttribute('data-cursor-text');
      setCursorText(customText || 'Ouvrir');
    };

    const onMouseLeaveInteractive = () => {
      setIsHovering(false);
      // On ne reset pas le texte immédiatement pour éviter le flash pendant le fade-out
    };

    // Attacher les écouteurs aux éléments interactifs
    const attachListeners = () => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cursor-pointer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnterInteractive);
            el.addEventListener('mouseleave', onMouseLeaveInteractive);
        });
        return interactiveElements;
    };

    window.addEventListener('mousemove', onMouseMove);
    let interactiveEls = attachListeners();

    // MutationObserver pour attacher les écouteurs aux nouveaux éléments (ex: navigation dynamique)
    const observer = new MutationObserver(() => {
        interactiveEls.forEach(el => {
            el.removeEventListener('mouseenter', onMouseEnterInteractive);
            el.removeEventListener('mouseleave', onMouseLeaveInteractive);
        });
        interactiveEls = attachListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    // Animation Loop pour le lissage (Lerp)
    let rafId: number;
    const animate = () => {
      // Facteur de lissage (0.15 = assez rapide, 0.05 = très lent/flottant)
      const lerpFactor = 0.15;
      
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  // Ne pas rendre sur mobile/tablette tactile (approximatif)
  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
      return null;
  }

  return (
    <>
      <style>{`
        body {
            cursor: none; /* Cacher le curseur par défaut */
        }
        a, button, input, textarea {
            cursor: none; /* Cacher sur les éléments interactifs aussi */
        }
      `}</style>
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference transition-all duration-300 ease-out flex items-center justify-center rounded-full bg-white`}
        style={{ 
            width: isHovering ? '64px' : '12px',
            height: isHovering ? '64px' : '12px',
            opacity: isHovering ? 0.8 : 1,
        }}
      >
         {/* Texte dynamique à l'intérieur du curseur */}
         <span className={`text-black text-[8px] font-bold tracking-widest uppercase transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            {cursorText}
         </span>
      </div>
    </>
  );
};

export default CustomCursor;