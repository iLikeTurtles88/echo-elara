
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Navigation from './components/Navigation';
import InteractiveBackground from './components/InteractiveBackground';
import CustomCursor from './components/CustomCursor';
import Gallery from './components/Gallery';
import GlitchText from './components/GlitchText';
import { Instagram, Twitter, Mail, MoveRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const renderContent = () => {
    switch (view) {
      case ViewState.HOME:
        return (
          <div className={`flex flex-col items-center justify-center min-h-screen text-center px-4 pt-24 md:pt-32 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative z-10 mix-blend-normal max-w-4xl mx-auto">
              
              <div className="mb-4">
                 <GlitchText 
                    as="h1" 
                    text="ÉLARA" 
                    className="text-6xl md:text-9xl font-bold text-white serif tracking-tighter"
                    alwaysActive={true}
                 />
              </div>

              <span className="block text-4xl md:text-6xl font-light italic text-gray-400 serif tracking-tight animate-fade-in-up delay-100">
                NUIT<span className="text-purple-500 not-italic">.</span>
              </span>

              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto my-6 md:my-8 animate-scale-x delay-200" />

              <p className="max-w-xs md:max-w-lg mx-auto text-gray-200 font-light leading-loose animate-fade-in-up delay-200 text-sm md:text-base drop-shadow-md px-2">
                Exploratrice des frontières entre le rêve organique et la réalité numérique. 
                Chaque pixel est une émotion, chaque œuvre est une porte.
              </p>
              
              <button 
                onClick={() => setView(ViewState.GALLERY)}
                className="mt-10 md:mt-12 px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.2em] text-xs uppercase relative overflow-hidden group animate-fade-in-up delay-300 flex items-center gap-4 mx-auto"
              >
                <span className="relative z-10">Entrer dans la galerie</span>
                <MoveRight className="w-4 h-4 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
              </button>
            </div>
          </div>
        );
      case ViewState.GALLERY:
        return <Gallery />;
      case ViewState.ABOUT:
        return (
          // Padding ajusté pour mobile (pt-28) vs desktop (pt-44)
          <div className="min-h-screen flex items-center justify-center px-5 md:px-20 pt-28 md:pt-44 pb-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-6xl w-full animate-fade-in">
                <div className="relative group md:cursor-none">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-sm opacity-20 group-hover:opacity-40 blur-lg transition duration-700"></div>
                  <div className="relative h-[40vh] md:h-[70vh] w-full overflow-hidden bg-gray-900 rounded-sm">
                    <img src="https://picsum.photos/800/1200?grayscale" alt="Artist Portrait" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-6 md:space-y-8">
                  <div>
                    <span className="text-purple-400 text-xs tracking-widest uppercase mb-2 block">Biographie</span>
                    <GlitchText as="h2" text="L'Origine" className="text-4xl md:text-5xl serif text-white mb-4 md:mb-6" />
                  </div>
                  
                  <div className="space-y-4 md:space-y-6 text-gray-300 font-light leading-loose text-sm md:text-base text-left md:text-justify">
                    <p>
                      Je suis née deux fois. Une fois dans le monde physique, et une fois dans le code.
                      Mon travail interroge la persistence de l'âme humaine à l'ère de la reproduction artificielle.
                    </p>
                    <p>
                      J'utilise des algorithmes non pas comme des outils, mais comme des partenaires de danse.
                      L'erreur informatique (le glitch) devient une émotion, la perfection mathématique devient une poésie.
                    </p>
                    <p>
                      Basée à Paris, mes installations ont été vues dans les rêves de ceux qui osent fermer les yeux.
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-4 mt-4 md:mt-8 pt-6 md:pt-8 border-t border-white/10">
                    <span className="text-xs uppercase tracking-widest text-gray-500">Contact</span>
                    <div className="flex space-x-8">
                      <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:-translate-y-1 duration-300"><Instagram size={24} strokeWidth={1.5} /></a>
                      <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:-translate-y-1 duration-300"><Twitter size={24} strokeWidth={1.5} /></a>
                      <a href="mailto:hello@elara.art" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:-translate-y-1 duration-300"><Mail size={24} strokeWidth={1.5} /></a>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-purple-500/30 selection:text-purple-200">
      {/* Custom Cursor - gère automatiquement le masquage du curseur système si activé */}
      <CustomCursor />

      {/* Background at Z-0 */}
      <InteractiveBackground />
      
      {/* Navigation at Z-50 */}
      <Navigation currentView={view} setView={setView} />
      
      {/* Main Content at Z-10 */}
      <main className="relative z-10 min-h-screen transition-all duration-500">
        {renderContent()}
      </main>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translate3d(0, 30px, 0); filter: blur(10px); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slide-down {
          0% { opacity: 0; transform: translate3d(0, -20px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes scale-x {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-fade-in { animation: fade-in 1.5s ease-out forwards; }
        .animate-slide-down { animation: slide-down 1s ease-out forwards; }
        .animate-scale-x { animation: scale-x 1s ease-out forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
};

export default App;