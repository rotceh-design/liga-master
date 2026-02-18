import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// DATA Y GENERADOR DE EQUIPOS (FÚTBOL)
// ─────────────────────────────────────────────────────────────────────────────
const featuredMatch = {
  teamA: 'PATRIOTAS', initA: 'P',
  teamB: 'RIVALS',    initB: 'R',
  category: 'DORADO',
  scoreA: 2, scoreB: 1,
  period: '2do Tiempo', time: '68:45',
  statusText: 'EN JUEGO',
};

// Reutilizamos el generador de equipos de Standings para mantener coherencia
const COLORS = ['#000000', '#18181B', '#27272A', '#3F3F46', '#52525B'];
function makeTeams(names, cities) {
  return names.map((name, i) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    city: cities[i],
    color: COLORS[i % COLORS.length],
    initial: name[0],
  }));
}

const DORADO_TEAMS = makeTeams(
  ['Patriotas','Rivals','Halcones','Cóndores','Dragones','Titanes','Bravos','Guerreros','Reyes','Águilas'],
  ['Capital','Villa Norte','Puerto Sur','Los Andes','Río Grande','Montería','Barranquilla','Medellín','Bogotá','Cali']
);

const DIAMANTE_TEAMS = makeTeams(
  ['Meteoros','Cuervos','Nómadas','Espartanos','Ciclones','Rayos','Vortex','Cazadores','Destellos','Indomables'],
  ['Envigado','Itagüí','Bello','Sabaneta','Copacabana','La Ceja','Rionegro','Girardota','Barbosa','Guarne']
);

const SS_TEAMS = makeTeams(
  ['Leones','Tempestades','Veteranos','Clásicos','Leyendas','Forjados','Inmortales','Cruzados','Templarios','Paladines'],
  ['Norte','Sur','Centro','Oriente','Occidente','Soacha','Chía','Zipaquirá','Facatativá','Mosquera']
);

const categories = [
  {
    id: 'super-senior',
    name: 'Super Senior',
    slug: 'ss',
    num: '01',
    desc: 'Experiencia y legado en la cancha. El talento y la técnica no tienen edad.',
    teamsCount: 10, games: 42,
    teamList: SS_TEAMS
  },
  {
    id: 'dorado',
    name: 'Dorado',
    slug: 'dorado',
    num: '02',
    desc: 'La máxima competencia y exigencia física de la liga. La élite en acción.',
    teamsCount: 10, games: 56,
    teamList: DORADO_TEAMS
  },
  {
    id: 'diamante',
    name: 'Diamante',
    slug: 'diamante',
    num: '03',
    desc: 'Juventud, velocidad y las estrellas emergentes que definen el futuro.',
    teamsCount: 10, games: 38,
    teamList: DIAMANTE_TEAMS
  },
];

const quickStats = [
  { num: '3',   label: 'Categorías' },
  { num: '30',  label: 'Equipos' },
  { num: '136', label: 'Partidos' },
  { num: '26',  label: 'Jornadas' },
];

const tickerItems = [
  'PATRIOTAS 2 - 1 RIVALS · 2DO TIEMPO (68\')',
  'CÓNDORES VS HALCONES · SÁBADO 18:30',
  'TABLA DORADO: PATRIOTAS LÍDER INVICTO',
  'DIAMANTE: REYES DEL NORTE GANA LA JORNADA 13',
  'SUPER SENIOR: GRAN FINAL EL 22 DE MARZO',
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [tick, setTick] = useState(0);
  const [modalCategory, setModalCategory] = useState(null); // Estado para controlar el modal de equipos

  // Animación muy sutil para re-renderizados si es necesario
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans selection:bg-[#C8FF00] selection:text-black relative">
      
      {/* ── CSS EN LÍNEA PARA ANIMACIONES ESPECÍFICAS ── */}
      <style>{`
        @keyframes ticker-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-slow {
          display: flex;
          white-space: nowrap;
          animation: ticker-slow 80s linear infinite; 
        }
        .bg-grid-pattern {
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.03) 47px, rgba(255,255,255,0.03) 48px),
            repeating-linear-gradient(90deg, transparent, transparent 47px, rgba(255,255,255,0.03) 47px, rgba(255,255,255,0.03) 48px);
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          NEWS TICKER
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-black border-b border-zinc-800 overflow-hidden py-3 flex">
        <div className="animate-ticker-slow flex shrink-0">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {tickerItems.map((item, j) => (
                <React.Fragment key={j}>
                  <span className="text-[#C8FF00] px-6 font-black text-sm">▸</span>
                  <span className="font-bold text-xs tracking-[0.15em] text-white uppercase">{item}</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-black relative overflow-hidden px-6 py-16 md:py-24 border-b border-zinc-800 animate-fade-in">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Izquierda: Textos */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C8FF00] text-black px-4 py-1.5 mb-8 font-black text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              Temporada 2026
            </div>
            <h1 className="font-black text-6xl md:text-8xl lg:text-[100px] tracking-tighter uppercase text-white leading-[0.9] mb-8">
              La liga<br />
              que nos<br />
              <span className="text-[#C8FF00]">reúne.</span>
            </h1>
            <p className="font-medium text-sm md:text-base text-zinc-400 max-w-md mb-10 leading-relaxed tracking-wide">
              Resultados en vivo, alineaciones y estadísticas de la Liga Pro — para los que el fútbol es más que un simple juego de fin de semana.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/calendario" className="px-8 py-4 bg-[#C8FF00] text-black font-black text-sm uppercase tracking-widest hover:bg-lime-400 transition-colors">
                Ver Calendario →
              </Link>
              <Link to="/posiciones" className="px-8 py-4 border border-zinc-700 text-white font-black text-sm uppercase tracking-widest hover:border-white transition-colors">
                Posiciones
              </Link>
            </div>
          </div>

          {/* Derecha: Tarjeta en Vivo */}
          <div className="relative group">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-black text-[10px] tracking-widest uppercase text-red-500">Transmitiendo</span>
              <span className="ml-auto font-bold text-[10px] tracking-widest uppercase text-zinc-500">Categoría {featuredMatch.category}</span>
            </div>

            <Link to="/en-vivo" className="block bg-zinc-950 border border-zinc-800 hover:border-zinc-500 transition-all p-8 md:p-10 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

              <div className="flex justify-between items-center mb-8 pl-4">
                <span className="font-bold text-[10px] tracking-widest uppercase text-zinc-500">{featuredMatch.period}</span>
                <div className="font-mono font-black text-lg bg-black text-[#C8FF00] border border-zinc-800 px-3 py-1 tracking-widest">
                  {featuredMatch.time}
                </div>
              </div>

              <div className="flex items-center justify-between pl-4">
                {/* Local */}
                <div className="flex flex-col items-start w-1/3">
                  <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-xl mb-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    {featuredMatch.initA}
                  </div>
                  <div className="font-black text-sm md:text-base tracking-tighter uppercase text-white">{featuredMatch.teamA}</div>
                  <div className="font-bold text-[9px] tracking-widest uppercase text-zinc-500 mt-1">Local</div>
                </div>

                {/* Goles */}
                <div className="flex items-center justify-center gap-4 w-1/3">
                  <span className="font-black text-4xl md:text-6xl text-white tabular-nums tracking-tighter">{featuredMatch.scoreA}</span>
                  <span className="font-light text-3xl text-zinc-700">—</span>
                  <span className="font-black text-4xl md:text-6xl text-white tabular-nums tracking-tighter">{featuredMatch.scoreB}</span>
                </div>

                {/* Visita */}
                <div className="flex flex-col items-end w-1/3">
                  <div className="w-12 h-12 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center font-black text-xl mb-3 border border-zinc-700">
                    {featuredMatch.initB}
                  </div>
                  <div className="font-black text-sm md:text-base tracking-tighter uppercase text-zinc-400 text-right">{featuredMatch.teamB}</div>
                  <div className="font-bold text-[9px] tracking-widest uppercase text-zinc-600 mt-1">Visita</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center text-zinc-500 group-hover:text-white transition-colors">
                <span className="font-bold text-[10px] tracking-widest uppercase">Resultado Actual</span>
                <span className="font-black text-[10px] tracking-widest uppercase">Centro de Comando →</span>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          QUICK STATS ROW
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-800">
          {quickStats.map((s, i) => (
            <div key={i} className="p-8 md:p-12 text-center group hover:bg-zinc-900 transition-colors relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C8FF00] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="font-black text-4xl md:text-5xl tracking-tighter text-[#C8FF00] mb-2">{s.num}</div>
              <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CATEGORÍAS (Con Modal de Equipos)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
          <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-400 bg-zinc-200 inline-block px-3 py-1 border border-zinc-300">
            Liga Pro 2026
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-zinc-300 to-transparent hidden md:block" />
          <h2 className="font-black text-3xl tracking-tighter uppercase text-black">Categorías y Franquicias</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-300 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-zinc-900 border border-zinc-800 flex flex-col hover:border-zinc-500 transition-colors relative overflow-hidden group">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-zinc-700 group-hover:bg-[#C8FF00] transition-colors" />

              <div className="p-8 flex-1">
                <div className="font-bold text-[9px] tracking-widest uppercase bg-zinc-800 text-zinc-400 inline-block px-3 py-1 mb-6 group-hover:bg-[#C8FF00] group-hover:text-black transition-colors">
                  {cat.name}
                </div>
                
                <div className="font-black text-8xl text-zinc-800 absolute -bottom-6 -right-2 pointer-events-none opacity-50">
                  {cat.num}
                </div>

                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 text-white">{cat.name}</h3>
                <p className="font-medium text-sm text-zinc-400 leading-relaxed h-12 mb-6">
                  {cat.desc}
                </p>

                <div className="flex gap-10 pt-6 border-t border-zinc-800">
                  <div>
                    <div className="font-black text-2xl text-white mb-1">{cat.teamsCount}</div>
                    <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Equipos</div>
                  </div>
                  <div>
                    <div className="font-black text-2xl text-white mb-1">{cat.games}</div>
                    <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Partidos</div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción Doble */}
              <div className="flex border-t border-zinc-800 bg-zinc-950 mt-auto">
                <Link 
                  to={`/posiciones?categoria=${cat.slug}`} 
                  className="flex-1 py-4 text-center font-bold text-[10px] tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border-r border-zinc-800"
                >
                  Posiciones →
                </Link>
                <button 
                  onClick={() => setModalCategory(cat)}
                  className="flex-1 py-4 text-center font-bold text-[10px] tracking-widest uppercase text-zinc-400 hover:text-black hover:bg-[#C8FF00] transition-colors"
                >
                  Ver Franquicias →
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRÓXIMOS PARTIDOS
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-400 bg-zinc-200 inline-block px-3 py-1 border border-zinc-300">
            Cartelera Semanal
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-zinc-300 to-transparent hidden md:block" />
          <h2 className="font-black text-3xl tracking-tighter uppercase text-black">Próximos Partidos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-300 hidden md:block" />
          <Link to="/calendario" className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
            Calendario completo →
          </Link>
        </div>

        <div className="flex flex-col border border-zinc-200 bg-white">
          {[
            { day: 'Sáb 15 Mar', time: '14:00', teamA: 'Cóndores', teamB: 'Halcones', cat: 'Dorado', stadium: 'Estadio Olímpico' },
            { day: 'Sáb 15 Mar', time: '16:30', teamA: 'Reyes', teamB: 'Guerreros', cat: 'Diamante', stadium: 'Estadio Nacional' },
            { day: 'Dom 16 Mar', time: '11:00', teamA: 'Titanes', teamB: 'Bravos', cat: 'Super Senior', stadium: 'Estadio Central' },
          ].map((g, i) => (
            <Link to="/calendario" key={i} className="flex flex-col md:flex-row md:items-center p-6 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors group relative overflow-hidden">
              
              <div className="absolute left-0 top-0 w-1 h-full bg-black transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />

              <div className="w-40 mb-4 md:mb-0 shrink-0 pl-2">
                <div className="font-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{g.day}</div>
                <div className="font-black text-xl tracking-tighter text-black">{g.time}</div>
              </div>

              <div className="flex-1 font-black text-lg md:text-xl uppercase tracking-tighter mb-4 md:mb-0 text-black">
                {g.teamA} <span className="font-medium text-sm text-zinc-400 mx-2">vs</span> {g.teamB}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                <div className="font-bold text-[9px] uppercase tracking-widest border border-zinc-200 bg-zinc-100 text-zinc-500 px-3 py-1">
                  {g.cat}
                </div>
                <div className="font-medium text-xs text-zinc-500 w-32 text-right">
                  🏟 {g.stadium}
                </div>
                <div className="font-black text-xs text-zinc-300 group-hover:text-black transition-colors hidden md:block">
                  →
                </div>
              </div>

            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-black text-white py-20 px-6 border-t-4 border-[#C8FF00] relative overflow-hidden">
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 font-black text-[120px] md:text-[200px] text-zinc-900 tracking-tighter whitespace-nowrap pointer-events-none select-none">
          LIGA PRO
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <div className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
              ¿Listo para el pitazo inicial?
            </div>
            <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-2">
              Sigue la fecha.
            </h2>
            <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-[#C8FF00]">
              En tiempo real.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link to="/en-vivo" className="px-8 py-4 bg-[#C8FF00] text-black font-black text-xs uppercase tracking-widest hover:bg-lime-300 transition-colors text-center">
              Centro de Comando →
            </Link>
            <Link to="/posiciones" className="px-8 py-4 border border-zinc-700 text-white font-black text-xs uppercase tracking-widest hover:border-white transition-colors text-center">
              Tablas de Posiciones
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MODAL DE FRANQUICIAS / EQUIPOS
      ══════════════════════════════════════════════════════════════ */}
      {modalCategory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setModalCategory(null)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up border border-zinc-300">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 bg-black text-white flex justify-between items-start shrink-0 border-b-4 border-[#C8FF00]">
              <div>
                <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Directorio de Franquicias</div>
                <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none">Categoría {modalCategory.name}</h2>
              </div>
              <button onClick={() => setModalCategory(null)} className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-700 px-3 py-1.5 hover:text-white hover:border-zinc-500 transition-colors">
                ✕ Cerrar
              </button>
            </div>

            {/* Modal Body: Lista de Equipos */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-zinc-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modalCategory.teamList.map((team, idx) => (
                  <Link 
                    key={team.id} 
                    to={`/club/${team.id}`}
                    className="flex items-center gap-4 bg-white border border-zinc-200 p-4 hover:border-black hover:shadow-md transition-all group"
                  >
                    <div className="font-black text-xl text-zinc-300 w-6 text-right shrink-0">{idx + 1}</div>
                    
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-[#C8FF00] group-hover:text-black transition-colors">
                      {team.initial}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-black text-sm uppercase tracking-tighter group-hover:underline">{team.name}</div>
                      <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">{team.city}</div>
                    </div>

                    <div className="font-black text-xs text-zinc-300 group-hover:text-black transition-colors px-2">
                      →
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-zinc-200 shrink-0 text-center">
              <Link 
                to={`/posiciones?categoria=${modalCategory.slug}`} 
                className="font-bold text-[10px] tracking-widest uppercase text-zinc-500 hover:text-black transition-colors underline"
              >
                Ver Clasificación de {modalCategory.name}
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}