import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES INTERNOS REDISEÑADOS (Para no depender de archivos externos viejos)
// ─────────────────────────────────────────────────────────────────────────────

function BrutalistPlayerList() {
  const defaultRoster = [
    { id: 1, name: 'Carlos Mendoza', number: '1', pos: 'POR', stats: '12 PJ' },
    { id: 2, name: 'Andrés Silva', number: '4', pos: 'DEF', stats: '2 G · 1 A' },
    { id: 3, name: 'Roberto Gómez', number: '5', pos: 'DEF', stats: '5 TA' },
    { id: 4, name: 'Felipe Vargas', number: '8', pos: 'MED', stats: '4 A' },
    { id: 5, name: 'Martín Rojas', number: '10', pos: 'MED', stats: '6 G · 5 A' },
    { id: 6, name: 'Diego Torres', number: '9', pos: 'DEL', stats: '12 G' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between border-b border-black pb-4 mb-6">
        <h3 className="font-black text-2xl uppercase tracking-tighter">Plantel Activo</h3>
        <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Temporada 2026</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultRoster.map((player) => (
          <div key={player.id} className="bg-white border border-zinc-200 hover:border-black transition-colors flex items-center p-4 group cursor-pointer">
            <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              {/* Silueta genérica brutalista */}
              <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            
            <div className="ml-4 flex-1">
              <h4 className="font-black text-base uppercase tracking-tighter group-hover:text-[#C8FF00] group-hover:bg-black transition-colors px-1 inline-block -ml-1">
                {player.name}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-bold text-[10px] tracking-widest uppercase text-zinc-500">{player.pos}</span>
                <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                <span className="font-bold text-[10px] tracking-widest uppercase text-zinc-500">{player.stats}</span>
              </div>
            </div>
            
            <div className="font-black text-3xl text-zinc-200 group-hover:text-black transition-colors shrink-0 w-12 text-right">
              {player.number}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrutalistTacticalBoard() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-black pb-4 mb-6">
        <h3 className="font-black text-2xl uppercase tracking-tighter">Esquema Táctico</h3>
        <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Formación: 4-3-3</span>
      </div>
      
      {/* Cancha Minimalista */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-zinc-900 border-4 border-black overflow-hidden group">
        
        {/* Líneas de la cancha */}
        <div className="absolute inset-0 border-[2px] border-zinc-700 m-4 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-zinc-700 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-[2px] border-zinc-700 rounded-full pointer-events-none" />
        
        {/* Áreas */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-48 border-[2px] border-zinc-700 pointer-events-none" />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-24 h-48 border-[2px] border-zinc-700 pointer-events-none" />

        {/* Jugadores (Posiciones relativas simplificadas) */}
        {[
          { num: '1', top: '50%', left: '12%', label: 'POR' },
          { num: '4', top: '20%', left: '30%', label: 'LD' },
          { num: '5', top: '40%', left: '25%', label: 'DFC' },
          { num: '2', top: '60%', left: '25%', label: 'DFC' },
          { num: '3', top: '80%', left: '30%', label: 'LI' },
          { num: '8', top: '35%', left: '50%', label: 'MC' },
          { num: '6', top: '50%', left: '45%', label: 'MCD' },
          { num: '10', top: '65%', left: '50%', label: 'MCO' },
          { num: '7', top: '25%', left: '75%', label: 'ED' },
          { num: '9', top: '50%', left: '80%', label: 'DC' },
          { num: '11', top: '75%', left: '75%', label: 'EI' },
        ].map((p, i) => (
          <div key={i} className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110 cursor-pointer" style={{ top: p.top, left: p.left }}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#C8FF00] border-2 border-black text-black font-black text-sm md:text-lg flex items-center justify-center shadow-lg">
              {p.num}
            </div>
            <span className="mt-1 font-bold text-[9px] tracking-widest text-zinc-400 bg-black px-1.5 py-0.5 uppercase">
              {p.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center font-bold text-[10px] tracking-widest uppercase text-zinc-400 mt-4">
        * Alineación sujeta a cambios de último minuto.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL: PERFIL DEL CLUB
// ─────────────────────────────────────────────────────────────────────────────

export default function ClubProfile() {
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('plantel');

  // Datos simulados (Se adaptarían según el ID recibido)
  const clubData = {
    name: id ? id.toUpperCase() : 'PATRIOTAS FC',
    initial: id ? id.charAt(0).toUpperCase() : 'P',
    founded: '1998',
    category: 'Dorado',
    stadium: 'Estadio Olímpico de la Ciudad',
    headCoach: 'Martín Ramírez',
    description: 'Franquicia histórica de la liga. Conocidos por su férrea defensa y un ataque letal por las bandas. Siempre contendientes al título.',
    stats: { wins: 15, draws: 3, losses: 2, championships: 4 },
    color: '#000000' // Negro por defecto
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-black animate-fade-in pb-20">
      
      {/* ══════ NAVEGACIÓN SUPERIOR ══════ */}
      <div className="bg-white border-b border-zinc-200 h-14 flex items-center px-6 sticky top-0 z-20">
        <Link to="/posiciones" className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:text-black transition-colors flex items-center gap-2">
          ← Volver a Posiciones
        </Link>
      </div>

      {/* ══════ HERO SECTION (Brutalista) ══════ */}
      <section className="bg-black relative overflow-hidden px-6 py-12 md:py-20 border-b-4 border-[#C8FF00]">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 47px, #fff 47px, #fff 48px), repeating-linear-gradient(90deg, transparent, transparent 47px, #fff 47px, #fff 48px)' }} />
        
        {/* Marca de agua gigante */}
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 font-black text-[120px] md:text-[200px] text-zinc-900 tracking-tighter whitespace-nowrap pointer-events-none select-none z-0">
          {clubData.name}
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 text-white">
          
          {/* Escudo / Inicial */}
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white text-black rounded-full flex items-center justify-center font-black text-7xl md:text-9xl shrink-0 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            {clubData.initial}
          </div>

          {/* Info Principal */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <span className="bg-[#C8FF00] text-black font-black text-[10px] tracking-widest uppercase px-3 py-1">
                Categoría {clubData.category}
              </span>
              <span className="border border-zinc-700 text-zinc-400 font-bold text-[10px] tracking-widest uppercase px-3 py-1">
                Fundado en {clubData.founded}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-4">
              {clubData.name}
            </h1>
            
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed mb-8">
              {clubData.description}
            </p>

            {/* Quick Stats del Club */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12 pt-6 border-t border-zinc-800">
              <div>
                <div className="font-black text-2xl md:text-3xl text-white">{clubData.stats.championships}</div>
                <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Títulos</div>
              </div>
              <div>
                <div className="font-black text-2xl md:text-3xl text-[#C8FF00]">{clubData.stats.wins}</div>
                <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Victorias</div>
              </div>
              <div>
                <div className="font-black text-2xl md:text-3xl text-white">{clubData.stadium}</div>
                <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Estadio Local</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ NAVEGACIÓN INTERNA (TABS) ══════ */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex overflow-x-auto border-b-2 border-zinc-200 no-scrollbar">
          {[
            { id: 'plantel', label: 'Roster Oficial' },
            { id: 'tactica', label: 'Pizarra Táctica' },
            { id: 'historial', label: 'Historial (Próximamente)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 font-black text-xs uppercase tracking-widest transition-colors whitespace-nowrap relative ${
                activeTab === tab.id ? 'text-black' : 'text-zinc-400 hover:text-black'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-[#C8FF00]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════ CONTENIDO DINÁMICO ══════ */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        {activeTab === 'plantel' && <BrutalistPlayerList />}
        {activeTab === 'tactica' && <BrutalistTacticalBoard />}
        {activeTab === 'historial' && (
          <div className="py-20 text-center border-2 border-dashed border-zinc-300">
            <span className="text-4xl block mb-4 opacity-50">🏆</span>
            <h3 className="font-black text-2xl uppercase tracking-tighter text-zinc-400">Próximamente</h3>
            <p className="font-bold text-[10px] tracking-widest uppercase text-zinc-500 mt-2">El historial de partidos se conectará pronto.</p>
          </div>
        )}
      </div>

    </div>
  );
}