import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Lista de enlaces de navegación
  const navLinks = [
    { name: 'INICIO', path: '/' },
    { name: 'CALENDARIO', path: '/calendario' },
    { name: 'EN VIVO', path: '/en-vivo' },
    { name: 'POSICIONES', path: '/posiciones' },
  ];

  return (
    // Contenedor principal del Navbar (Sticky para que siempre esté visible)
    <nav className="bg-black border-b-4 border-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* 1. LOGO DE LA LIGA */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-black text-2xl tracking-tighter uppercase flex items-center gap-2">
              LIGA <span className="text-red-500">PRO</span>
            </Link>
          </div>

          {/* 2. MENÚ DE ESCRITORIO (Oculto en celulares) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 font-black text-sm tracking-widest uppercase transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-white border-b-4 border-red-500' // Estilo activo
                      : 'text-zinc-500 hover:text-white hover:border-b-4 hover:border-white' // Estilo inactivo
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. BOTÓN HAMBURGUESA PARA MÓVIL (Oculto en escritorio) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-500 focus:outline-none p-2 transition-colors"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  // Ícono de "X" cuando está abierto
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Ícono de Hamburguesa cuando está cerrado
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MENÚ DESPLEGABLE MÓVIL */}
      {/* Se muestra solo si 'isOpen' es true */}
      {isOpen && (
        <div className="md:hidden bg-black border-t-2 border-zinc-800 absolute w-full left-0 shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
                className={`block px-3 py-5 font-black text-xl tracking-widest uppercase border-b border-zinc-900 transition-colors ${
                  location.pathname === link.path
                    ? 'text-red-500' // Estilo activo en móvil
                    : 'text-white hover:text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}