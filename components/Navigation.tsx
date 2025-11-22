import React from 'react';
import { ViewState } from '../types';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: ViewState.HOME, label: 'ACCUEIL' },
    { id: ViewState.GALLERY, label: 'ŒUVRES' },
    { id: ViewState.ABOUT, label: 'À PROPOS' },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 text-white pointer-events-none transition-all duration-300 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[1px]">
        <div className="pointer-events-auto cursor-pointer mix-blend-difference" onClick={() => setView(ViewState.HOME)}>
          <h1 className="text-xl md:text-2xl font-bold tracking-widest serif hover:opacity-80 transition-opacity">L'ÉCHO</h1>
        </div>

        <ul className="hidden md:flex space-x-4 pointer-events-auto">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className="relative group px-8 py-3 overflow-visible rounded-sm transition-all duration-300"
              >
                {/* Background Box Effect - Subtle fade in */}
                <div className={`absolute inset-0 bg-white/0 transition-all duration-300 ease-out rounded-sm
                    ${currentView === item.id ? 'bg-white/5' : 'group-hover:bg-white/[0.03]'}
                `} />

                {/* Text Content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <span className={`text-xs font-medium uppercase transition-all duration-300 ease-out transform
                    ${currentView === item.id 
                      ? 'text-white tracking-[0.2em] scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                      : 'text-gray-400 tracking-[0.1em] group-hover:text-white group-hover:tracking-[0.15em] group-hover:scale-105'}
                  `}>
                    {item.label}
                  </span>
                  
                  {/* Underline/Glow Line */}
                  <span 
                    className={`absolute -bottom-1 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent transform transition-all duration-300 ease-out
                      ${currentView === item.id ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-60'}
                    `} 
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden pointer-events-auto text-white hover:text-purple-400 transition-colors z-50 relative p-2 active:scale-95 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/95 z-40 flex items-center justify-center transition-all duration-500 md:hidden backdrop-blur-xl ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col items-center space-y-6 w-full px-8">
          {navItems.map((item, index) => (
            <li key={item.id} className="w-full flex justify-center relative p-2">
              <button
                onClick={() => {
                  setView(item.id);
                  setIsOpen(false);
                }}
                className={`
                    py-6 px-8 w-full max-w-xs relative group
                    text-2xl font-light uppercase transition-all duration-500 ease-out transform
                    ${isOpen ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-md'}
                `}
                style={{ transitionDelay: `${isOpen ? index * 100 : 0}ms` }}
              >
                 {/* Hover Background for Mobile (Tap effect) */}
                 <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-colors duration-300" />

                 <span className={`block transition-all duration-300 ease-out transform group-hover:scale-105
                    ${currentView === item.id ? 'text-white tracking-[0.2em]' : 'text-gray-500 tracking-[0.05em] group-hover:text-white group-hover:tracking-[0.1em]'}
                 `}>
                    {item.label}
                 </span>
                 
                 {/* Mobile Bottom Line */}
                 <span className={`absolute bottom-4 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-300 ease-out
                    ${currentView === item.id ? 'w-1/2 opacity-100' : 'w-0 opacity-0 group-hover:w-2/3 group-hover:opacity-60'}
                 }`} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navigation;