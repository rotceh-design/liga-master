import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS Y GENERACIÓN DE DATOS (FÚTBOL)
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = [
  '#000000', '#18181B', '#27272A', '#3F3F46', '#52525B', 
  '#000000', '#18181B', '#27272A', '#3F3F46', '#52525B'
];

const FORMS = ['W','W','L','W','E','W','L','W','W','L','E','W','L','L','W','W','E','W','L','W','W','L','W','W','E'];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeTeams(names, cities) {
  return names.map((name, i) => {
    const color = COLORS[i % COLORS.length];
    const pj = 24;
    const pg = rnd(0, 20);
    const pe = rnd(0, Math.min(4, pj-pg));
    const pp = pj - pg - pe;
    const pts = pg*3 + pe; // Sistema de puntuación de fútbol real (3 pts por victoria)
    const pf = rnd(pg*1.5, pg*2.5); // Goles a favor
    const pc = rnd(pp*1.5, pp*2.5 + 5); // Goles en contra
    const df = Math.floor(pf - pc);
    const form = FORMS.slice(i % 15, i % 15 + 5);
    
    return {
      id: `team-${i}`,
      name, city: cities[i],
      color,
      initial: name[0],
      pj, pg, pe, pp, pts, pf, pc, df,
      form,
      pct: Math.round((pg + pe*0.33)/pj*100),
      coach: ['Carlos Rivera','Miguel Torres','Andrés López','Roberto Soto','Fernando Díaz','Juan Pérez'][i%6],
      founded: rnd(1990, 2020),
      stadium: ['Estadio Municipal','Campo Norte','Complejo Sur','Cancha Central','Estadio Olímpico','Campo Deportivo'][i%6],
      roster: Array.from({length:11},(_,k)=>({
        number: [1,4,5,6,3,8,10,14,7,9,11][k],
        pos:    ['POR','DEF','DEF','DEF','DEF','MED','MED','MED','DEL','DEL','DEL'][k],
        name:   ['García','Martínez','López','Sánchez','Romero','Torres','Ramírez','Flores','Herrera','Vargas','Cruz'][k] + ' ' + String.fromCharCode(65+(i+k)%26) + '.',
      })),
    };
  });
}

// Generamos menos equipos para que la tabla sea legible sin scroll infinito
const DORADO_TEAMS = makeTeams(
  ['Patriotas','Rivals','Halcones','Cóndores','Dragones','Titanes','Bravos','Guerreros','Reyes','Águilas'],
  ['Capital','Villa Norte','Puerto Sur','Los Andes','Río Grande','Montería','Barranquilla','Medellín','Bogotá','Cali']
).sort((a,b) => b.pts - a.pts || b.df - a.df);

const DIAMANTE_TEAMS = makeTeams(
  ['Meteoros','Cuervos','Nómadas','Espartanos','Ciclones','Rayos','Vortex','Cazadores','Destellos','Indomables'],
  ['Envigado','Itagüí','Bello','Sabaneta','Copacabana','La Ceja','Rionegro','Girardota','Barbosa','Guarne']
).sort((a,b) => b.pts - a.pts || b.df - a.df);

const SS_TEAMS = makeTeams(
  ['Leones','Tempestades','Veteranos','Clásicos','Leyendas','Forjados','Inmortales','Cruzados','Templarios','Paladines'],
  ['Norte','Sur','Centro','Oriente','Occidente','Soacha','Chía','Zipaquirá','Facatativá','Mosquera']
).sort((a,b) => b.pts - a.pts || b.df - a.df);

const CATEGORIES = [
  { key: 'dorado',   label: 'Dorado',       teams: DORADO_TEAMS },
  { key: 'diamante', label: 'Diamante',     teams: DIAMANTE_TEAMS },
  { key: 'ss',       label: 'Super Senior', teams: SS_TEAMS },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: PANEL LATERAL DEL EQUIPO
// ─────────────────────────────────────────────────────────────────────────────
function TeamPanel({ team, rank, onClose }) {
  const [panelTab, setPanelTab] = useState('stats');

  const rankLabel = rank === 1 ? 'LÍDER ABSOLUTO' : rank <= 4 ? 'ZONA PLAYOFF' : rank >= 9 ? 'ZONA DESCENSO' : `POSICIÓN #${rank}`;
  const rankColor = rank === 1 ? 'text-[#C8FF00] border-[#C8FF00]' : rank <= 4 ? 'text-black border-black' : rank >= 9 ? 'text-red-600 border-red-600' : 'text-zinc-500 border-zinc-500';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-end animate-fade-in backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      
      <div className="w-full md:w-[500px] h-full bg-white flex flex-col animate-slide-in overflow-hidden shadow-2xl">
        
        {/* PANEL HEADER */}
        <div className="bg-black p-8 relative shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 font-bold text-[10px] tracking-widest uppercase text-zinc-500 border border-zinc-800 px-3 py-1.5 hover:text-white hover:border-zinc-500 transition-colors">
            ✕ Cerrar
          </button>

          <div className={`inline-flex items-center font-black text-[10px] tracking-widest uppercase px-3 py-1 mb-6 border ${rankColor} ${rank === 1 ? 'bg-[#C8FF00]/10' : 'bg-white/5'}`}>
            <span className="text-sm mr-2">#{rank}</span> {rankLabel}
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-white text-black font-black text-3xl flex items-center justify-center rounded-full shrink-0">
              {team.initial}
            </div>
            <div>
              <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tighter text-white leading-none mb-1">{team.name}</h2>
              <p className="font-bold text-xs tracking-widest text-zinc-400 uppercase">{team.city}</p>
              <p className="font-medium text-[10px] tracking-widest text-zinc-600 uppercase mt-2">Fundado en {team.founded} · {team.stadium}</p>
            </div>
          </div>
        </div>

        {/* PANEL TABS */}
        <div className="flex border-b border-zinc-200 shrink-0 bg-zinc-50">
          {[{k:'stats',l:'Estadísticas'}, {k:'matches',l:'Historial'}, {k:'roster',l:'Plantilla'}].map(t => (
            <button key={t.k} onClick={() => setPanelTab(t.k)} className={`flex-1 py-4 font-black text-[10px] tracking-widest uppercase transition-colors border-b-2 ${panelTab === t.k ? 'border-black text-black bg-white' : 'border-transparent text-zinc-400 hover:text-black'}`}>
              {t.l}
            </button>
          ))}
        </div>

        {/* PANEL BODY */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* TAB ESTADÍSTICAS */}
          {panelTab === 'stats' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-3 gap-1 bg-zinc-200 border border-zinc-200 mb-8">
                {[
                  { n: team.pts, l: 'Puntos' },
                  { n: team.pj,  l: 'Partidos' },
                  { n: team.pg,  l: 'Triunfos' },
                  { n: team.pe,  l: 'Empates' },
                  { n: team.pp,  l: 'Derrotas' },
                  { n: `${team.pct}%`, l: 'Efectividad' },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-4 text-center">
                    <div className="font-black text-2xl text-black mb-1 leading-none">{s.n}</div>
                    <div className="font-bold text-[9px] tracking-widest text-zinc-400 uppercase">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="font-black text-[10px] tracking-widest text-zinc-400 uppercase border-b border-black pb-2 mb-6">Ofensiva vs Defensiva</div>
              
              <div className="space-y-4 mb-8">
                {[
                  { l: 'Goles a Favor', val: team.pf, max: 60, color: 'bg-black' },
                  { l: 'Goles en Contra', val: team.pc, max: 60, color: 'bg-zinc-300' },
                  { l: 'Diferencia', val: Math.abs(team.df), max: 30, color: team.df >= 0 ? 'bg-green-600' : 'bg-red-600', label: `${team.df > 0 ? '+' : ''}${team.df}` }
                ].map(r => (
                  <div key={r.l}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-[10px] tracking-widest uppercase text-zinc-600">{r.l}</span>
                      <span className="font-black text-sm">{r.label || r.val}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 overflow-hidden">
                      <div className={`h-full ${r.color}`} style={{ width: `${Math.min(100, (r.val / r.max) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="font-black text-[10px] tracking-widest text-zinc-400 uppercase border-b border-black pb-2 mb-6">Staff Técnico</div>
              <div className="flex items-center gap-4 bg-zinc-50 p-4 border border-zinc-200">
                <div className="w-10 h-10 bg-black text-white font-black flex items-center justify-center rounded-full shrink-0">{team.coach[0]}</div>
                <div>
                  <div className="font-black text-sm uppercase tracking-wider">{team.coach}</div>
                  <div className="font-bold text-[9px] tracking-widest text-zinc-400 uppercase">Director Técnico</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB HISTORIAL */}
          {panelTab === 'matches' && (
            <div className="animate-fade-in">
              <div className="font-black text-[10px] tracking-widest text-zinc-400 uppercase border-b border-black pb-2 mb-4">Últimas 5 Jornadas</div>
              <div className="border border-zinc-200 bg-white mb-6">
                {team.form.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <div className="flex items-center gap-4">
                      <span className={`w-6 h-6 flex items-center justify-center font-black text-[10px] text-white ${f === 'W' ? 'bg-black' : f === 'L' ? 'bg-red-600' : 'bg-zinc-400'}`}>
                        {f}
                      </span>
                      <div>
                        <div className="font-black text-xs uppercase tracking-wider text-black">Rival {i + 1}</div>
                        <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-400">Jornada {24 - i}</div>
                      </div>
                    </div>
                    <div className="font-black text-sm">
                      {f === 'W' ? '2 - 0' : f === 'L' ? '0 - 1' : '1 - 1'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB PLANTILLA */}
          {panelTab === 'roster' && (
            <div className="animate-fade-in">
              <div className="font-black text-[10px] tracking-widest text-zinc-400 uppercase border-b border-black pb-2 mb-4">Plantel Titular Oficial</div>
              <div className="border border-zinc-200 bg-white">
                {team.roster.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <span className="font-black text-xs w-6 text-right text-zinc-400">{p.number}</span>
                    <span className="font-bold text-[9px] uppercase tracking-widest text-zinc-400 w-8">{p.pos}</span>
                    <span className="font-black text-xs uppercase tracking-wider">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STANDINGS
// ─────────────────────────────────────────────────────────────────────────────
export default function Standings() {
  const [activeCat, setActiveCat] = useState('dorado');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);

  const cat = CATEGORIES.find(c => c.key === activeCat);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-black animate-fade-in pb-20">

      {/* ══════ HEADER ══════ */}
      <header className="bg-black pt-12 md:pt-20 px-6 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 47px, #fff 47px, #fff 48px), repeating-linear-gradient(90deg, transparent, transparent 47px, #fff 47px, #fff 48px)' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-0.5 w-6 bg-[#C8FF00]" />
            <span className="font-bold text-[10px] tracking-widest uppercase text-[#C8FF00]">Temporada 2026</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800">
            <div>
              <h1 className="font-black text-5xl md:text-7xl tracking-tighter uppercase text-white leading-none mb-2">
                Clasificación<br/><span className="text-zinc-500">General</span>
              </h1>
              <p className="font-medium text-sm text-zinc-400 mt-4">Tabla oficial de posiciones · Jornada 24 de 26</p>
            </div>
            <div className="text-left md:text-right border-l-4 md:border-l-0 md:border-r-4 border-[#C8FF00] pl-4 md:pl-0 md:pr-4">
              <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Total Compitiendo</div>
              <div className="font-black text-4xl text-white leading-none">30 <span className="text-sm text-zinc-600 ml-1">Equipos</span></div>
            </div>
          </div>

          {/* PESTAÑAS DE CATEGORÍAS */}
          <div className="flex overflow-x-auto no-scrollbar">
            {CATEGORIES.map(c => (
              <button 
                key={c.key} 
                onClick={() => setActiveCat(c.key)}
                className={`flex items-center gap-3 py-5 px-8 font-black text-xs uppercase tracking-widest transition-colors whitespace-nowrap border-b-4 ${activeCat === c.key ? 'border-[#C8FF00] text-[#C8FF00]' : 'border-transparent text-zinc-500 hover:text-white'}`}
              >
                {c.label}
                <span className="font-bold text-[9px] tracking-widest text-zinc-600 bg-zinc-900 px-2 py-0.5">({c.teams.length})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══════ LEYENDA ══════ */}
      <div className="bg-white border-b border-zinc-200 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {[
              { color: 'bg-[#C8FF00]', label: 'Líder', text: 'text-black' },
              { color: 'bg-black', label: 'Zona Playoff (Top 4)', text: 'text-black' },
              { color: 'bg-red-600', label: 'Descenso (Últimos 2)', text: 'text-red-600' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color} ${l.color === 'bg-[#C8FF00]' ? 'border border-zinc-300' : ''}`} />
                <span className={`font-bold text-[9px] tracking-widest uppercase ${l.text}`}>{l.label}</span>
              </div>
            ))}
          </div>
          <div className="hidden md:block font-bold text-[9px] tracking-widest uppercase text-zinc-400">
            Haz clic en un equipo para ver el detalle →
          </div>
        </div>
      </div>

      {/* ══════ TABLA DE POSICIONES ══════ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white border border-zinc-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black text-white border-b-4 border-zinc-200">
                <th className="p-4 w-12 text-center font-black text-[10px] tracking-widest uppercase">#</th>
                <th className="p-4 font-black text-[10px] tracking-widest uppercase">Equipo</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase text-zinc-400" title="Partidos Jugados">PJ</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase" title="Victorias">G</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase" title="Empates">E</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase" title="Derrotas">P</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase text-zinc-400" title="Goles a Favor">GF</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase text-zinc-400" title="Goles en Contra">GC</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase text-zinc-400" title="Diferencia">DIF</th>
                <th className="p-4 text-center font-black text-[10px] tracking-widest uppercase">Forma</th>
                <th className="p-4 text-center font-black text-[11px] tracking-widest uppercase text-[#C8FF00]" title="Puntos">PTS</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cat.teams.map((team, i) => {
                const rank = i + 1;
                const isTop1 = rank === 1;
                const isPlayoff = rank <= 4 && rank > 1;
                const isDanger = rank >= cat.teams.length - 1;
                
                // Divisores de zona
                const renderDivider = (label, color) => (
                  <tr className="bg-zinc-100">
                    <td colSpan={11} className={`px-4 py-2 font-black text-[9px] tracking-widest uppercase text-zinc-500 border-l-4 ${color}`}>
                      ▸ {label}
                    </td>
                  </tr>
                );

                return (
                  <React.Fragment key={team.id}>
                    {rank === 2 && renderDivider('Zona Playoff', 'border-black')}
                    {rank === 5 && renderDivider('Zona Media', 'border-zinc-300')}
                    {rank === cat.teams.length - 1 && renderDivider('Zona de Descenso', 'border-red-600')}

                    <tr 
                      onClick={() => { setSelectedTeam(team); setSelectedRank(rank); }}
                      className={`cursor-pointer border-b border-zinc-100 transition-colors group relative ${isPlayoff ? 'hover:bg-zinc-50' : isDanger ? 'hover:bg-red-50' : 'hover:bg-zinc-50'}`}
                    >
                      {/* Borde Izquierdo Color de Zona */}
                      <td className="p-0 relative w-12 text-center align-middle">
                        <div className={`absolute left-0 top-0 w-1.5 h-full ${isTop1 ? 'bg-[#C8FF00]' : isPlayoff ? 'bg-black' : isDanger ? 'bg-red-600' : 'bg-transparent'}`} />
                        <span className={`font-black text-sm ${isTop1 ? 'text-[#C8FF00] bg-black px-2 py-1' : 'text-zinc-500'}`}>
                          {rank}
                        </span>
                      </td>

                      {/* Escudo y Nombre */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white ${isTop1 ? 'bg-black' : 'bg-zinc-800'}`}>
                            {team.initial}
                          </div>
                          <div>
                            <div className="font-black text-sm uppercase tracking-wider text-black group-hover:underline">{team.name}</div>
                            <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-400">{team.city}</div>
                          </div>
                        </div>
                      </td>

                      {/* Estadísticas */}
                      <td className="p-4 text-center align-middle font-medium text-xs text-zinc-400">{team.pj}</td>
                      <td className="p-4 text-center align-middle font-black text-xs text-black">{team.pg}</td>
                      <td className="p-4 text-center align-middle font-bold text-xs text-zinc-500">{team.pe}</td>
                      <td className="p-4 text-center align-middle font-medium text-xs text-zinc-500">{team.pp}</td>
                      <td className="p-4 text-center align-middle font-medium text-xs text-zinc-400">{team.pf}</td>
                      <td className="p-4 text-center align-middle font-medium text-xs text-zinc-400">{team.pc}</td>
                      <td className={`p-4 text-center align-middle font-black text-xs ${team.df > 0 ? 'text-black' : team.df < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                        {team.df > 0 ? '+' : ''}{team.df}
                      </td>

                      {/* Forma (Últimos 5) */}
                      <td className="p-4 text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          {team.form.map((f, fi) => (
                            <span key={fi} className={`w-2 h-2 rounded-full ${f === 'W' ? 'bg-black' : f === 'L' ? 'bg-red-500' : 'bg-zinc-300'}`} title={f} />
                          ))}
                        </div>
                      </td>

                      {/* Puntos Totales */}
                      <td className="p-4 text-center align-middle font-black text-lg text-black bg-zinc-50 border-l border-zinc-100">
                        {team.pts}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════ BOTTOM CTA ══════ */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-black text-white p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-r-4 border-[#C8FF00]">
          <div className="relative z-10 text-center md:text-left">
            <div className="font-bold text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
              ¿Tu equipo compite hoy?
            </div>
            <div className="font-black text-2xl uppercase tracking-tighter">
              Sigue los resultados <span className="text-[#C8FF00]">en vivo.</span>
            </div>
          </div>
          <Link to="/en-vivo" className="relative z-10 px-8 py-4 bg-[#C8FF00] text-black font-black text-xs uppercase tracking-widest hover:bg-lime-400 transition-colors whitespace-nowrap">
            Ir al Live Center →
          </Link>
        </div>
      </div>

      {/* ══════ MODAL DE DETALLE DE EQUIPO ══════ */}
      {selectedTeam && (
        <TeamPanel 
          team={selectedTeam} 
          rank={selectedRank} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}

    </div>
  );
}