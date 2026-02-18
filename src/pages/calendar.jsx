import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// DATA (FÚTBOL)
// ─────────────────────────────────────────────────────────────────────────────
const MATCHES = [
  { id:1,  category:'Dorado',       week:'Semana 1',  teamA:'Patriotas',  initA:'P', teamB:'Rivals',     initB:'R', date:'Sábado, 21 Feb',  time:'10:00 AM', location:'Estadio Olímpico',   status:'FINALIZADO', scoreA:2, scoreB:1 },
  { id:2,  category:'Diamante',     week:'Semana 1',  teamA:'Cuervos',    initA:'C', teamB:'Titanes',    initB:'T', date:'Sábado, 21 Feb',  time:'14:30 PM', location:'Campo Sur',          status:'EN JUEGO',   scoreA:1, scoreB:1 },
  { id:3,  category:'Super Senior', week:'Semana 1',  teamA:'Leones',     initA:'L', teamB:'Espartanos', initB:'E', date:'Domingo, 22 Feb', time:'09:00 AM', location:'Complejo Norte',      status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:4,  category:'Dorado',       week:'Semana 1',  teamA:'Halcones',   initA:'H', teamB:'Cóndores',   initB:'C', date:'Domingo, 22 Feb', time:'11:00 AM', location:'Estadio Olímpico',   status:'FINALIZADO', scoreA:0, scoreB:3 },
  { id:5,  category:'Dorado',       week:'Semana 2',  teamA:'Patriotas',  initA:'P', teamB:'Cuervos',    initB:'C', date:'Sábado, 28 Feb',  time:'11:00 AM', location:'Estadio Olímpico',   status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:6,  category:'Diamante',     week:'Semana 2',  teamA:'Bravos',     initA:'B', teamB:'Águilas',    initB:'Á', date:'Sábado, 28 Feb',  time:'13:30 PM', location:'Campo Sur',          status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:7,  category:'Super Senior', week:'Semana 2',  teamA:'Leones',     initA:'L', teamB:'Guerreros',  initB:'G', date:'Domingo, 1 Mar',  time:'10:00 AM', location:'Complejo Norte',      status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:8,  category:'Dorado',       week:'Semana 3',  teamA:'Rivals',     initA:'R', teamB:'Cóndores',   initB:'C', date:'Sábado, 7 Mar',   time:'10:00 AM', location:'Estadio Olímpico',   status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:9,  category:'Diamante',     week:'Semana 3',  teamA:'Titanes',    initA:'T', teamB:'Reyes',      initB:'R', date:'Sábado, 7 Mar',   time:'12:00 PM', location:'Campo Sur',          status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:10, category:'Super Senior', week:'Playoffs',  teamA:'Leones',     initA:'L', teamB:'Espartanos', initB:'E', date:'Sábado, 22 Mar',  time:'11:00 AM', location:'Estadio Nacional',    status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:11, category:'Dorado',       week:'Playoffs',  teamA:'Patriotas',  initA:'P', teamB:'Halcones',   initB:'H', date:'Sábado, 22 Mar',  time:'14:00 PM', location:'Estadio Nacional',    status:'PROGRAMADO', scoreA:null, scoreB:null },
  { id:12, category:'Diamante',     week:'Playoffs',  teamA:'Cuervos',    initA:'C', teamB:'Titanes',    initB:'T', date:'Domingo, 23 Mar', time:'11:00 AM', location:'Estadio Nacional',    status:'PROGRAMADO', scoreA:null, scoreB:null },
];

const WEEKS      = ['Semana 1', 'Semana 2', 'Semana 3', 'Playoffs'];
const CATEGORIES = ['Todas', 'Super Senior', 'Dorado', 'Diamante'];

export default function Calendar() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeWeek, setActiveWeek] = useState('Semana 1');

  const filtered = MATCHES.filter(m => {
    const byWeek = m.week === activeWeek;
    const byCat  = activeCategory === 'Todas' || m.category === activeCategory;
    return byWeek && byCat;
  });

  const liveCount     = filtered.filter(m => m.status === 'EN JUEGO').length;
  const doneCount     = filtered.filter(m => m.status === 'FINALIZADO').length;
  const upcomingCount = filtered.filter(m => m.status === 'PROGRAMADO').length;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-black animate-fade-in pb-16">
      
      {/* ══════════════════════════════════
          HEADER SECTION
      ══════════════════════════════════ */}
      <header className="bg-black pt-12 md:pt-20 px-6 relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 47px, #fff 47px, #fff 48px), repeating-linear-gradient(90deg, transparent, transparent 47px, #fff 47px, #fff 48px)' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-0.5 w-6 bg-[#C8FF00]" />
            <span className="font-bold text-[10px] tracking-widest uppercase text-[#C8FF00]">Temporada 2026</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8">
            <div>
              <h1 className="font-black text-5xl md:text-7xl tracking-tighter uppercase text-white leading-none mb-2">
                Calendario<br/><span className="text-zinc-500">De Partidos</span>
              </h1>
              <p className="font-medium text-sm text-zinc-400 mt-4">Todos los encuentros de la jornada oficial.</p>
            </div>

            {/* Quick Jump Semanas */}
            <div className="flex flex-col md:items-end gap-2">
              <span className="font-bold text-[10px] tracking-widest uppercase text-zinc-600">Seleccionar Semana</span>
              <div className="flex flex-wrap gap-2">
                {WEEKS.map(w => (
                  <button 
                    key={w} 
                    onClick={() => setActiveWeek(w)}
                    className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-all border ${
                      activeWeek === w 
                        ? 'bg-[#C8FF00] text-black border-[#C8FF00]' 
                        : 'bg-transparent text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    {w === 'Playoffs' ? '🏆 Playoffs' : w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════
          FILTROS DE CATEGORÍA
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 font-bold text-[10px] uppercase tracking-widest transition-all border ${
                activeCategory === cat 
                  ? 'bg-black text-white border-black' 
                  : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-black hover:text-black'
              }`}
            >
              {cat === 'Todas' ? '▸ Todas las Categorías' : cat}
            </button>
          ))}
          
          {activeCategory !== 'Todas' && (
            <button
              onClick={() => setActiveCategory('Todas')}
              className="ml-auto font-bold text-xs uppercase tracking-wider text-red-500 hover:text-red-700"
            >
              Limpiar ×
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          RESUMEN NUMÉRICO (STATS ROW)
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-zinc-200 border border-zinc-200">
          {[
            { num: filtered.length, lbl:'Partidos', color: 'text-black' },
            { num: liveCount,       lbl:'En Juego', color: liveCount > 0 ? 'text-red-600' : 'text-zinc-400', pulse: liveCount > 0 },
            { num: doneCount,       lbl:'Finalizados', color: 'text-zinc-600' },
            { num: upcomingCount,   lbl:'Programados', color: 'text-zinc-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 text-center">
              <div className={`font-black text-4xl mb-1 ${s.color} flex items-center justify-center gap-2`}>
                {s.pulse && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
                {s.num}
              </div>
              <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-400">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          MATCH GRID
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 align-start">
            {filtered.map((m, i) => {
              const isLive   = m.status === 'EN JUEGO';
              const isDone   = m.status === 'FINALIZADO';
              const isUpcoming = m.status === 'PROGRAMADO';
              const aWins    = m.scoreA > m.scoreB;
              const bWins    = m.scoreB > m.scoreA;

              return (
                <div key={m.id} className="bg-white border-2 border-zinc-200 hover:border-black transition-colors relative overflow-hidden group animate-slide-up" style={{ animationDelay: `${i*0.05}s` }}>
                  
                  {/* Borde Lateral Indicador */}
                  <div className={`absolute left-0 top-0 w-1.5 h-full ${isLive ? 'bg-red-600' : isDone ? 'bg-black' : 'bg-zinc-300'}`} />

                  {/* Header Tarjeta */}
                  <div className="flex justify-between items-start p-4 border-b border-zinc-100 bg-zinc-50 pl-6">
                    <div>
                      <div className="font-black text-sm uppercase tracking-wider mb-1">{m.date}</div>
                      <div className="font-bold text-[10px] tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                        <span>{m.time}</span>
                        <span>·</span>
                        <span>{m.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-[9px] tracking-widest uppercase bg-zinc-200 text-zinc-600 px-2 py-0.5 border border-zinc-300">
                        {m.category}
                      </span>
                      <span className={`font-black text-[9px] tracking-widest uppercase px-2 py-0.5 border flex items-center gap-1.5 ${
                        isLive ? 'bg-red-50 text-red-600 border-red-200' : 
                        isDone ? 'bg-zinc-100 text-black border-zinc-300' : 
                        'bg-white text-zinc-400 border-zinc-200'
                      }`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
                        {m.status}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo Tarjeta (Marcador) */}
                  <div className="p-6 pl-8 flex items-center justify-between">
                    {/* Local */}
                    <div className="flex flex-col items-start w-1/3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white mb-2 ${aWins || isLive ? 'bg-black' : 'bg-zinc-400'}`}>
                        {m.initA}
                      </div>
                      <div className={`font-black text-sm md:text-base tracking-tighter uppercase ${aWins || isLive ? 'text-black' : 'text-zinc-500'}`}>{m.teamA}</div>
                      <div className="font-bold text-[9px] tracking-widest uppercase text-zinc-400 mt-0.5">Local</div>
                    </div>

                    {/* Score Central */}
                    <div className="flex flex-col items-center justify-center w-1/3 px-2">
                      {isUpcoming ? (
                        <span className="font-black text-2xl text-zinc-300">VS</span>
                      ) : (
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-4xl tabular-nums ${aWins || isLive ? 'text-black' : 'text-zinc-400'}`}>{m.scoreA}</span>
                          <span className="font-light text-2xl text-zinc-300">—</span>
                          <span className={`font-black text-4xl tabular-nums ${bWins || isLive ? 'text-black' : 'text-zinc-400'}`}>{m.scoreB}</span>
                        </div>
                      )}
                    </div>

                    {/* Visita */}
                    <div className="flex flex-col items-end w-1/3 text-right">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white mb-2 ${bWins || isLive ? 'bg-black' : 'bg-zinc-400'}`}>
                        {m.initB}
                      </div>
                      <div className={`font-black text-sm md:text-base tracking-tighter uppercase ${bWins || isLive ? 'text-black' : 'text-zinc-500'}`}>{m.teamB}</div>
                      <div className="font-bold text-[9px] tracking-widest uppercase text-zinc-400 mt-0.5">Visita</div>
                    </div>
                  </div>

                  {/* Footer Acción */}
                  <div className="border-t border-zinc-100 p-3 bg-white pl-6 flex justify-end">
                    {isLive ? (
                      <Link to="/en-vivo" className="font-black text-[10px] tracking-widest uppercase bg-black text-white px-4 py-2 hover:bg-zinc-800 transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Ir al Live Center →
                      </Link>
                    ) : isDone ? (
                      <button className="font-black text-[10px] tracking-widest uppercase text-zinc-500 hover:text-black transition-colors px-4 py-2">
                        Ver Resumen
                      </button>
                    ) : (
                      <span className="font-bold text-[10px] tracking-widest uppercase text-zinc-300 px-4 py-2">
                        Esperando Pitazo Inicial
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border-2 border-dashed border-zinc-200 py-24 px-6 text-center animate-fade-in">
            <div className="text-4xl mb-4 opacity-20">⚽</div>
            <h3 className="font-black text-2xl uppercase tracking-tighter text-zinc-300 mb-2">Sin Partidos Programados</h3>
            <p className="font-medium text-sm text-zinc-500 mb-6">No encontramos encuentros para los filtros seleccionados.</p>
            <button 
              onClick={() => { setActiveCategory('Todas'); setActiveWeek('Semana 1'); }}
              className="px-6 py-3 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-black text-white p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-[#C8FF00]">
          <div className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-black text-[100px] text-zinc-900 tracking-tighter pointer-events-none select-none whitespace-nowrap z-0">
            LIGA PRO
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
              ¿No quieres perderte ningún detalle?
            </div>
            <div className="font-black text-2xl md:text-3xl uppercase tracking-tighter">
              Sigue el partido <span className="text-[#C8FF00]">en tiempo real.</span>
            </div>
          </div>

          <Link to="/en-vivo" className="relative z-10 px-8 py-4 bg-[#C8FF00] text-black font-black text-xs uppercase tracking-widest hover:bg-lime-400 transition-colors whitespace-nowrap">
            Ir al Centro de Mando →
          </Link>
        </div>
      </div>

    </div>
  );
}