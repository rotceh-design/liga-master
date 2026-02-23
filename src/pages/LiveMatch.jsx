import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BASE DE DATOS MOCK
// ─────────────────────────────────────────────────────────────────────────────
const MATCHES_DB = [
  {
    id: 1, jornada: "Jornada 14", hora: "16:00", estadio: "Estadio Olímpico",
    home: {
      name: "PATRIOTAS", full: "PATRIOTAS FC", abbr: "PAT", colorHex: "#DC2626", // Rojo
      players: [
        {id:1,number:1,name:"González",pos:"POR"},{id:2,number:4,name:"Ramírez",pos:"DEF"},
        {id:3,number:5,name:"Torres",pos:"DEF"},{id:4,number:6,name:"Mendoza",pos:"DEF"},
        {id:5,number:3,name:"Herrera",pos:"DEF"},{id:6,number:8,name:"López",pos:"MED"},
        {id:7,number:10,name:"Vargas",pos:"MED"},{id:8,number:14,name:"Ortiz",pos:"MED"},
        {id:9,number:7,name:"Castillo",pos:"DEL"},{id:10,number:9,name:"Flores",pos:"DEL"},
        {id:11,number:11,name:"Reyes",pos:"DEL"},
      ],
      bench: [
        {id:12,number:12,name:"Medina",pos:"POR"},{id:13,number:15,name:"Jiménez",pos:"DEF"},
        {id:14,number:16,name:"Ruiz",pos:"MED"},{id:15,number:17,name:"Morales",pos:"DEL"},
      ],
    },
    away: {
      name: "RIVALS", full: "RIVALS FC", abbr: "RIV", colorHex: "#2563EB", // Azul
      players: [
        {id:20,number:1,name:"Pérez",pos:"POR"},{id:21,number:4,name:"Silva",pos:"DEF"},
        {id:22,number:5,name:"Rojas",pos:"DEF"},{id:23,number:6,name:"Navarro",pos:"DEF"},
        {id:24,number:3,name:"Campos",pos:"DEF"},{id:25,number:8,name:"Ríos",pos:"MED"},
        {id:26,number:10,name:"Vega",pos:"MED"},{id:27,number:14,name:"Soto",pos:"MED"},
        {id:28,number:7,name:"Alves",pos:"DEL"},{id:29,number:9,name:"Cruz",pos:"DEL"},
        {id:30,number:11,name:"Leal",pos:"DEL"},
      ],
      bench: [
        {id:31,number:12,name:"Pinto",pos:"POR"},{id:32,number:15,name:"Blanco",pos:"DEF"},
        {id:33,number:16,name:"Santos",pos:"MED"},{id:34,number:17,name:"Fuentes",pos:"DEL"},
      ],
    },
  },
];

const EV_TYPES = [
  {id:"goal",     emoji:"⚽", label:"Gol",        stat:"goals",     accent:"#22c55e"},
  {id:"shot_on",  emoji:"🎯", label:"Tiro Arco",  stat:"shots_on",  accent:"#ffffff"},
  {id:"shot_off", emoji:"💨", label:"Tiro Afuera", stat:"shots_off", accent:"#71717a"},
  {id:"yellow",   emoji:"🟨", label:"Amarilla",    stat:"yellow",    accent:"#eab308"},
  {id:"red",      emoji:"🟥", label:"Roja",        stat:"red",       accent:"#ef4444"},
  {id:"sub",      emoji:"🔄", label:"Sustitución", stat:"subs",      accent:"#3b82f6"},
  {id:"corner",   emoji:"🚩", label:"Córner",      stat:"corners",   accent:"#f97316"},
  {id:"foul",     emoji:"🤜", label:"Falta",       stat:"fouls",     accent:"#fb923c"},
  {id:"offside",  emoji:"🚫", label:"Offside",     stat:"offsides",  accent:"#a1a1aa"},
  {id:"penalty",  emoji:"⚠️", label:"Penal",       stat:"penalties", accent:"#f43f5e"},
];

const STAT_ROWS = [
  {key:"goals",    label:"Goles"},
  {key:"shots_on", label:"Tiros al Arco"},
  {key:"shots_off",label:"Tiros Afuera"},
  {key:"corners",  label:"Córners"},
  {key:"fouls",    label:"Faltas"},
  {key:"yellow",   label:"Amarillas"},
  {key:"red",      label:"Rojas"},
  {key:"offsides", label:"Offsides"},
  {key:"penalties",label:"Penales"},
  {key:"subs",     label:"Sust."},
];

const TABS = ["EVENTOS", "PLANTILLAS", "ESTADÍSTICAS", "TARJETAS"];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmtTime = s =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function calcStats(events) {
  const zero = () => Object.fromEntries(STAT_ROWS.map(r => [r.key, 0]));
  const h = zero(), a = zero();
  for (const ev of events) {
    const def = EV_TYPES.find(t => t.id === ev.type);
    if (!def?.stat) continue;
    if (ev.team === "home") h[def.stat]++; else a[def.stat]++;
  }
  return { home: h, away: a };
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECTOR DE PARTIDO
// ─────────────────────────────────────────────────────────────────────────────
function MatchSelector({ onEnter, isAdmin, onToggleAdmin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 md:px-10 h-14 bg-black">
        <span className="font-black text-white text-xl tracking-tighter uppercase">LIGA PRO</span>
        <button
          onClick={onToggleAdmin}
          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            isAdmin ? "border-red-500 bg-red-500 text-white" : "border-white text-white hover:bg-white hover:text-black"
          }`}
        >
          {isAdmin ? "✦ COMISIONADO" : "PÚBLICO"}
        </button>
      </div>

      <div className="bg-black px-6 md:px-10 pt-10 pb-8 border-b-4 border-white">
        <p className="text-[#ccff00] font-black text-xs tracking-[0.3em] uppercase mb-2">● TEMPORADA ACTIVA</p>
        <h1 className="font-black text-white text-5xl md:text-8xl tracking-tighter uppercase leading-none">
          JORNADA<br />14
        </h1>
        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mt-4">Selecciona el encuentro</p>
      </div>

      <div className="flex-1 bg-zinc-100 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {MATCHES_DB.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className={`cursor-pointer bg-white border-2 transition-all duration-150 select-none ${
              selected?.id === m.id ? "border-black shadow-2xl -translate-y-0.5" : "border-transparent hover:border-black"
            }`}
          >
            <div className={`flex justify-between items-center px-5 py-3 ${selected?.id === m.id ? "bg-black" : "bg-zinc-100"}`}>
              <span className={`font-black text-[10px] tracking-widest uppercase ${selected?.id === m.id ? "text-white" : "text-zinc-500"}`}>{m.jornada}</span>
              <span className={`font-black text-sm ${selected?.id === m.id ? "text-[#ccff00]" : "text-zinc-400"}`}>{m.hora}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-xl mb-2">{m.home.abbr[0]}</div>
                  <span className="font-black text-sm uppercase tracking-tight text-center">{m.home.name}</span>
                </div>
                <span className="font-black text-2xl text-zinc-200 px-4">VS</span>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-zinc-200 text-zinc-800 rounded-full flex items-center justify-center font-black text-xl mb-2">{m.away.abbr[0]}</div>
                  <span className="font-black text-sm uppercase tracking-tight text-center text-zinc-500">{m.away.name}</span>
                </div>
              </div>
              <div className="text-center bg-zinc-50 py-2 px-3 font-bold text-[10px] tracking-widest text-zinc-400 uppercase">🏟 {m.estadio}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t-2 border-black px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-black text-sm uppercase tracking-widest text-center sm:text-left">
          {selected
            ? <span className="text-black"><span className="text-[#ccff00] mr-2">✦</span>{selected.home.name} VS {selected.away.name}</span>
            : <span className="text-zinc-300">SELECCIONA UN PARTIDO</span>
          }
        </p>
        <button
          disabled={!selected}
          onClick={() => selected && onEnter(selected)}
          className="w-full sm:w-auto bg-black text-white font-black text-sm uppercase tracking-widest px-10 py-4 hover:bg-[#ccff00] hover:text-black transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ENTRAR AL LIVE CENTER →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VISTA PÚBLICA — Pre-partido: Animación de Pelota 16-bit
// ─────────────────────────────────────────────────────────────────────────────
function PreMatchWaiting({ match }) {
  return (
    <>
      <style>{`
        @keyframes roll {
          0%   { transform: translateX(-80px) rotate(0deg); }
          50%  { transform: translateX(80px) rotate(360deg); }
          100% { transform: translateX(-80px) rotate(0deg); }
        }
        @keyframes fieldPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.4;  }
        }
        .pixel-ball {
          animation: roll 3.5s linear infinite;
        }
        .field-line {
          animation: fieldPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center bg-black px-6 py-10 min-h-screen">
        <div className="relative w-full max-w-sm mb-8">
          <div className="field-line border-2 border-white/20 rounded-lg h-24 w-full flex items-center justify-center relative overflow-hidden bg-zinc-950">
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
            <div className="w-12 h-12 rounded-full border border-white/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pixel-ball">
                <svg viewBox="0 0 16 16" className="w-8 h-8 text-[#ccff00] fill-current" style={{shapeRendering: 'crispEdges'}}>
                  <path d="M5 1h6v2H5V1zm6 2h2v2h-2V3zM3 5h2V3H3v2zm10 0h2v6h-2V5zM1 11h2V5H1v6zm2 2h2v-2H3v2zm10 0h-2v-2h2v2zM5 15h6v-2H5v2zM6 6h4v4H6V6z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 inset-x-4 h-1 bg-[#ccff00]/10 rounded-full blur-sm" />
        </div>

        <p className="font-black text-[10px] tracking-[0.4em] text-[#ccff00] uppercase mb-3">
          ● PARTIDO EN BREVE
        </p>
        <h2 className="font-black text-white text-3xl md:text-5xl tracking-tighter uppercase text-center leading-tight mb-2">
          {match.home.name}<br />
          <span className="text-zinc-600 text-xl">VS</span><br />
          {match.away.name}
        </h2>
        <p className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase mt-4">
          {match.jornada} · {match.estadio} · {match.hora}
        </p>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VISTA PÚBLICA — En vivo: timeline de 3 columnas
// ─────────────────────────────────────────────────────────────────────────────
function LiveTimeline({ match, events }) {
  const timelineEndRef = useRef(null);

  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <>
      <style>{`
        @keyframes eventSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .event-row { animation: eventSlide 0.3s ease-out; }
      `}</style>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-black pt-2 min-h-screen">
        <div className="flex items-center border-b border-zinc-800 shrink-0 mb-2">
          <div className="flex-1 px-4 py-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-black text-[10px] shrink-0">
              {match.home.abbr[0]}
            </div>
            <span className="font-black text-[10px] text-zinc-400 uppercase tracking-widest truncate">{match.home.name}</span>
          </div>
          <div className="w-20 md:w-24 flex justify-center">
            <span className="font-black text-[8px] text-zinc-700 uppercase tracking-widest">MIN</span>
          </div>
          <div className="flex-1 px-4 py-3 flex items-center justify-end gap-2">
            <span className="font-black text-[10px] text-zinc-400 uppercase tracking-widest truncate">{match.away.name}</span>
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-300 flex items-center justify-center font-black text-[10px] shrink-0">
              {match.away.abbr[0]}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-8">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-black text-[10px] tracking-[0.3em] text-zinc-800 uppercase mt-20">
                — ESPERANDO EVENTOS —
              </p>
            </div>
          ) : (
            <div className="py-2">
              {[...events].sort((a, b) => a.min - b.min || a.ts - b.ts).map(ev => {
                const def  = EV_TYPES.find(t => t.id === ev.type) || EV_TYPES[0];
                const home = ev.team === "home";

                return (
                  <div key={ev.id} className="event-row flex items-center border-b border-zinc-900 hover:bg-zinc-900/60 transition-colors">
                    <div className="flex-1 px-3 md:px-5 py-3 flex items-center justify-end gap-2">
                      {home ? (
                        <>
                          <div className="text-right">
                            <div style={{ color: def.accent }} className="font-black text-[9px] uppercase tracking-widest">
                              {def.label}
                            </div>
                            <div className="font-black text-white text-xs md:text-sm uppercase leading-tight">
                              {ev.player}
                            </div>
                            {ev.note && (
                              <div className="font-bold text-[8px] text-zinc-600 leading-tight mt-0.5">{ev.note}</div>
                            )}
                          </div>
                          <span className="text-lg md:text-xl shrink-0">{def.emoji}</span>
                        </>
                      ) : (
                        <span className="text-zinc-900 text-[8px]">—</span>
                      )}
                    </div>

                    <div className="w-20 md:w-24 flex flex-col items-center py-3 shrink-0">
                      <span className="font-black text-white text-sm md:text-base tabular-nums leading-none">
                        {ev.min}'
                      </span>
                      <div className="w-px h-3 bg-zinc-700 mt-1" />
                    </div>

                    <div className="flex-1 px-3 md:px-5 py-3 flex items-center gap-2">
                      {!home ? (
                        <>
                          <span className="text-lg md:text-xl shrink-0">{def.emoji}</span>
                          <div>
                            <div style={{ color: def.accent }} className="font-black text-[9px] uppercase tracking-widest">
                              {def.label}
                            </div>
                            <div className="font-black text-white text-xs md:text-sm uppercase leading-tight">
                              {ev.player}
                            </div>
                            {ev.note && (
                              <div className="font-bold text-[8px] text-zinc-600 leading-tight mt-0.5">{ev.note}</div>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-zinc-900 text-[8px]">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={timelineEndRef} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRO EN VIVO (ADMIN)
// ─────────────────────────────────────────────────────────────────────────────
function LiveCenter({ match, isAdmin, onToggleAdmin, onBack }) {
  const [isLive, setIsLive]      = useState(false);
  const [seconds, setSeconds]    = useState(0);
  const [addedTime, setAddedTime]= useState({ 1: 0, 2: 0 }); 
  const [running, setRunning]    = useState(false);
  const [half, setHalf]          = useState(1);
  const [events, setEvents]      = useState([]);
  const [tab, setTab]            = useState("EVENTOS");
  
  const [showEndModal, setShowEndModal] = useState(false);
  const [matchNotes, setMatchNotes]     = useState("");
  const [showReport, setShowReport]     = useState(false);
  
  // Estado para el modal de detalle de jugador
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [evType,   setEvType]   = useState("goal");
  const [evTeam,   setEvTeam]   = useState("home");
  const [evPlayer, setEvPlayer] = useState("");
  const [evMin,    setEvMin]    = useState("");
  const [subOut,   setSubOut]   = useState("");
  const [subIn,    setSubIn]    = useState("");

  const timerRef   = useRef(null);
  const feedEndRef = useRef(null);

  const stats     = calcStats(events);
  const homeScore = stats.home.goals;
  const awayScore = stats.away.goals;
  const goals     = events.filter(e => e.type === "goal");
  const curSide   = match[evTeam];

  useEffect(() => {
    if (running) timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => { feedEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [events]);
  useEffect(() => { setEvPlayer(""); setSubOut(""); setSubIn(""); }, [evTeam, evType]);

  const addEvent = () => {
    const min = evMin !== "" ? Number(evMin) : Math.floor(seconds / 60);
    let player, note;
    if (evType === "sub") {
      player = subIn.trim() || "—";
      note   = `Sale: ${subOut || "—"}`;
    } else {
      player = evPlayer.trim() || "—";
      note   = "";
    }
    const newEv = { id: Date.now(), type: evType, team: evTeam, player, min, note, ts: seconds };
    setEvents(prev => [...prev, newEv].sort((a, b) => a.min - b.min || a.ts - b.ts));
    setEvPlayer(""); setEvMin(""); setSubOut(""); setSubIn("");
  };

  const removeEvent = (id) => {
    if(window.confirm("¿Seguro que deseas eliminar este evento?")) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  // --- LÓGICA PROFESIONAL DE TIEMPOS ---
  const changeHalf = (newHalf) => {
    if (!isAdmin) return;
    
    if (newHalf === 2 && half === 1) {
      if (window.confirm("¿Finalizar 1er Tiempo y preparar el 2do?\n\nEl reloj saltará automáticamente a los 45:00 y se pausará a la espera del pitazo de inicio.")) {
        setHalf(2);
        setSeconds(45 * 60); 
        setRunning(false);   
      }
    } else if (newHalf === 1 && half === 2) {
      if (window.confirm("¿Estás seguro de volver al 1er Tiempo?")) {
        setHalf(1);
      }
    }
  };

  const handleInitiateEndMatch = () => {
    setShowEndModal(true);
  };

  const confirmEndMatch = () => {
    setRunning(false);
    setIsLive(false);
    setShowEndModal(false);
    setShowReport(true);
  };

  // Helper de eventos de jugador
  const getPlayerStatsInfo = (playerName, side) => {
    const pEvents = events.filter(e => e.team === side && e.player === playerName);
    const goals = pEvents.filter(e => e.type === 'goal').length;
    const yellows = pEvents.filter(e => e.type === 'yellow').length;
    const reds = pEvents.filter(e => e.type === 'red').length;
    
    // Verificamos sustituciones (Si sale o si entra)
    const isSubbedOut = events.some(e => e.type === 'sub' && e.team === side && e.note.includes(playerName));
    const isSubbedIn = events.some(e => e.type === 'sub' && e.team === side && e.player === playerName);
    
    return { pEvents, goals, yellows, reds, isSubbedOut, isSubbedIn };
  };

  // Renderizador de Lista de Jugadores para la pestaña PLANTILLAS
  const renderPlayerList = (side, playersArray, isBench = false) => {
    return (
      <div className="space-y-1">
        {playersArray.map(p => {
          const formattedName = `#${p.number} ${p.name}`;
          const statInfo = getPlayerStatsInfo(formattedName, side);
          
          return (
            <div 
              key={p.id} 
              onClick={() => setSelectedPlayer({ ...p, formattedName, side, statInfo })}
              className={`flex items-center gap-3 px-4 py-3 border border-zinc-200 transition-colors rounded-sm cursor-pointer hover:border-black shadow-sm ${
                statInfo.isSubbedOut ? 'bg-zinc-100 opacity-60' : 'bg-white'
              }`}
            >
              <div className="flex flex-col items-center justify-center w-8">
                <span className="font-black text-zinc-400 text-sm leading-none">{p.number}</span>
                <span className="font-bold text-[8px] text-zinc-400 uppercase tracking-widest">{p.pos}</span>
              </div>
              
              <div className="flex-1 flex items-center gap-2">
                <span className={`font-black text-sm uppercase tracking-tight ${statInfo.isSubbedOut ? 'line-through text-zinc-500' : 'text-zinc-800'}`}>
                  {p.name}
                </span>
                
                {/* Iconos de Estado Rapido */}
                <div className="flex gap-1">
                  {statInfo.isSubbedIn && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold border border-green-200" title="Entró de cambio">↑ IN</span>}
                  {statInfo.isSubbedOut && <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded font-bold border border-red-200" title="Salió de cambio">↓ OUT</span>}
                  {Array.from({length: statInfo.goals}).map((_, i) => <span key={`g-${i}`} className="text-xs">⚽</span>)}
                  {statInfo.yellows > 0 && <span className="text-xs">🟨</span>}
                  {statInfo.reds > 0 && <span className="text-xs">🟥</span>}
                </div>
              </div>
              
              <span className="text-zinc-300 text-xs">ℹ️</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper para escapar caracteres de XML y proteger contra fallos en Excel
  const escapeXml = (unsafe) => {
    return (unsafe || "").toString().replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;'; case '>': return '&gt;';
        case '&': return '&amp;'; case '\'': return '&apos;';
        case '"': return '&quot;'; default: return c;
      }
    }).replace(/\n/g, '&#10;');
  };

  // Helper Avanzado de Excel: Crea una fila a prueba de errores
  const createExcelRow = (cellsArray, defaultHeight = 20) => {
    let row = `<Row ss:Height="${defaultHeight}">`;
    cellsArray.forEach(cell => {
      if (cell === undefined || cell === null) {
        row += `<Cell><Data ss:Type="String"></Data></Cell>`;
        return;
      }
      
      let val = typeof cell === 'object' ? cell.v : cell;
      if (val === undefined || val === null) val = "";
      
      let style = typeof cell === 'object' && cell.s ? ` ss:StyleID="${cell.s}"` : '';
      let span = typeof cell === 'object' && cell.span ? ` ss:MergeAcross="${cell.span}"` : '';
      let type = typeof val === 'number' ? 'Number' : 'String';
      
      row += `<Cell${style}${span}><Data ss:Type="${type}">${escapeXml(val)}</Data></Cell>`;
    });
    row += `</Row>`;
    return row;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 🌟 MOTOR DE GENERACIÓN DE EXCEL "ENTERPRISE" (DISEÑO EXTREMO MULTIHOJA)
  // ─────────────────────────────────────────────────────────────────────────────
  const downloadEnterpriseExcel = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" 
 xmlns:o="urn:schemas-microsoft-com:office:office" 
 xmlns:x="urn:schemas-microsoft-com:office:excel" 
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    
    <Style ss:ID="MainTitle">
      <Font ss:FontName="Calibri" ss:Size="24" ss:Bold="1" ss:Color="#CCFF00"/>
      <Interior ss:Color="#000000" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>

    <Style ss:ID="SubtitleDark">
      <Font ss:FontName="Calibri" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#1F2937" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>

    <Style ss:ID="SectionTitle">
      <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#27272A" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#CCFF00"/>
      </Borders>
    </Style>

    <Style ss:ID="LogoHome">
      <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="${match.home.colorHex || '#111827'}" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
    </Style>

    <Style ss:ID="LogoAway">
      <Font ss:FontName="Calibri" ss:Size="14" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="${match.away.colorHex || '#111827'}" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
    </Style>

    <Style ss:ID="ScoreBox">
      <Font ss:FontName="Calibri" ss:Size="48" ss:Bold="1" ss:Color="#000000"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
      </Borders>
    </Style>

    <Style ss:ID="MatchInfo">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#4B5563"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#E5E7EB"/>
      </Borders>
    </Style>

    <Style ss:ID="TableHeader">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#111827"/>
      <Interior ss:Color="#E5E7EB" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#000000"/>
      </Borders>
    </Style>

    <Style ss:ID="DataCenter">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/></Borders>
    </Style>
    <Style ss:ID="DataLeft">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/></Borders>
    </Style>
    
    <Style ss:ID="DataCenterAlt">
      <Interior ss:Color="#F9FAFB" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/></Borders>
    </Style>
    <Style ss:ID="DataLeftAlt">
      <Interior ss:Color="#F9FAFB" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D1D5DB"/></Borders>
    </Style>

    <Style ss:ID="RowGoal">
      <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#166534"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/></Borders>
    </Style>
    <Style ss:ID="RowGoalCenter">
      <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#166534"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/></Borders>
    </Style>

    <Style ss:ID="RowYellow">
      <Interior ss:Color="#FEF9C3" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#854D0E"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/></Borders>
    </Style>
    <Style ss:ID="RowYellowCenter">
      <Interior ss:Color="#FEF9C3" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#854D0E"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/></Borders>
    </Style>

    <Style ss:ID="RowRed">
      <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#991B1B"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/></Borders>
    </Style>
    <Style ss:ID="RowRedCenter">
      <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Bold="1" ss:Color="#991B1B"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/></Borders>
    </Style>

    <Style ss:ID="RowSub">
      <Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Color="#1E40AF"/>
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFDBFE"/></Borders>
    </Style>
    <Style ss:ID="RowSubCenter">
      <Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/>
      <Font ss:FontName="Calibri" ss:Color="#1E40AF"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFDBFE"/></Borders>
    </Style>

    <!-- Caja de Observaciones y Firmas -->
    <Style ss:ID="NotesBox">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#000000"/>
      <Interior ss:Color="#FEFCE8" ss:Pattern="Solid"/>
      <Alignment ss:Vertical="Top" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#FACC15"/>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#FACC15"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#FACC15"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#FACC15"/>
      </Borders>
    </Style>

    <Style ss:ID="SignatureLine">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
    </Style>
  </Styles>
`;

    // ──────────────────────────────────────────
    // HOJA 1: ACTA OFICIAL (DISEÑO ROBUSTO)
    // ──────────────────────────────────────────
    xml += `<Worksheet ss:Name="1. Acta Oficial">
      <Table>
        <!-- Tamaños sumando 600 pts para A4 Perfect Fit -->
        <Column ss:Index="1" ss:Width="60"/>
        <Column ss:Index="2" ss:Width="160"/>
        <Column ss:Index="3" ss:Width="180"/>
        <Column ss:Index="4" ss:Width="200"/>
        
        <!-- HEADER PRINCIPAL -->
        ${createExcelRow([{v: "ACTA OFICIAL DE ENCUENTRO", s: "MainTitle", span: 3}], 50)}
        ${createExcelRow([{v: `LIGA MASTER • ${match.jornada} • ${match.estadio} • ${new Date().toLocaleDateString()}`, s: "SubtitleDark", span: 3}], 25)}
        ${createExcelRow([""], 15)}
        
        <!-- BLOQUE DE RESULTADO (Caja grande, sin emojis) -->
        ${createExcelRow([{v: `[ ${match.home.abbr}.png ]`, s: "LogoHome", span: 1}, {v: `[ ${match.away.abbr}.png ]`, s: "LogoAway", span: 1}], 50)}
        ${createExcelRow([{v: match.home.name, s: "SubtitleDark", span: 1}, {v: match.away.name, s: "SubtitleDark", span: 1}], 25)}
        ${createExcelRow([{v: homeScore, s: "ScoreBox", span: 1}, {v: awayScore, s: "ScoreBox", span: 1}], 80)}
        
        <!-- TIEMPOS -->
        ${createExcelRow([{v: `Adición 1ER T: +${addedTime[1]}'`, s: "MatchInfo", span: 1}, {v: `Adición 2DO T: +${addedTime[2]}'`, s: "MatchInfo", span: 1}], 25)}
        ${createExcelRow([""], 20)}

        <!-- OBSERVACIONES -->
        ${createExcelRow([{v: "OBSERVACIONES DEL COMISIONADO Y ÁRBITRO", s: "SectionTitle", span: 3}], 35)}
        ${createExcelRow([{v: matchNotes || "Sin incidencias u observaciones registradas durante el encuentro.", s: "NotesBox", span: 3}], 80)}
        ${createExcelRow([""], 20)}

        <!-- FIRMAS -->
        ${createExcelRow([{v: ""}, {v: "Firma Árbitro / Comisionado", s: "SignatureLine"}, {v: "Firma Capitán Local", s: "SignatureLine"}, {v: ""}], 40)}
        ${createExcelRow([""], 20)}

        <!-- BITÁCORA -->
        ${createExcelRow([{v: "BITÁCORA CRONOLÓGICA DE EVENTOS", s: "SectionTitle", span: 3}], 35)}
        ${createExcelRow([{v:"MINUTO", s:"TableHeader"}, {v:"EQUIPO", s:"TableHeader"}, {v:"JUGADOR", s:"TableHeader"}, {v:"DETALLE EVENTO", s:"TableHeader"}], 30)}
    `;
    
    if (events.length === 0) {
       xml += createExcelRow([{v: "No se registraron eventos en este partido.", s: "DataCenter", span: 3}], 30);
    } else {
      [...events].sort((a, b) => a.min - b.min).forEach((e, idx) => {
          const teamName = e.team === 'home' ? match.home.name : match.away.name;
          // Obtenemos el texto puro del label sin el emoji para evitar errores en Excel
          const typeLabel = EV_TYPES.find(t => t.id === e.type)?.label || e.type;
          const eventDetail = `${typeLabel} ${e.note ? `(${e.note})` : ''}`;
          
          let cCenter = idx % 2 === 0 ? "DataCenter" : "DataCenterAlt";
          let cLeft   = idx % 2 === 0 ? "DataLeft"   : "DataLeftAlt";

          if (e.type === "goal") { cCenter = "RowGoalCenter"; cLeft = "RowGoal"; }
          else if (e.type === "yellow") { cCenter = "RowYellowCenter"; cLeft = "RowYellow"; }
          else if (e.type === "red") { cCenter = "RowRedCenter"; cLeft = "RowRed"; }
          else if (e.type === "sub") { cCenter = "RowSubCenter"; cLeft = "RowSub"; }
          
          xml += createExcelRow([
            {v: `${e.min}'`, s: cCenter}, 
            {v: teamName, s: cCenter}, 
            {v: e.player, s: cLeft}, 
            {v: eventDetail, s: cLeft}
          ], 26);
      });
    }
    
    xml += `
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <PageSetup>
          <Layout x:Orientation="Portrait" x:CenterHorizontal="1"/>
          <Header x:Margin="0.3"/>
          <Footer x:Margin="0.3"/>
          <PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5"/>
        </PageSetup>
        <FitToPage/>
        <Print>
          <FitWidth>1</FitWidth>
          <FitHeight>0</FitHeight>
          <ValidPrinterInfo/>
          <PaperSizeIndex>9</PaperSizeIndex>
        </Print>
      </WorksheetOptions>
    </Worksheet>`;

    // ──────────────────────────────────────────
    // HOJA 2: PLANTILLAS
    // ──────────────────────────────────────────
    xml += `<Worksheet ss:Name="2. Plantillas">
      <Table>
        <Column ss:Index="1" ss:Width="280"/>
        <Column ss:Index="2" ss:Width="40"/>
        <Column ss:Index="3" ss:Width="280"/>

        ${createExcelRow([{v: `LOCAL: ${match.home.name}`, s: "SectionTitle"}, {v:""}, {v: `VISITA: ${match.away.name}`, s: "SectionTitle"}], 35)}
        ${createExcelRow([{v: "TITULARES", s: "TableHeader"}, {v:""}, {v: "TITULARES", s: "TableHeader"}], 25)}
    `;

    const maxPlayers = Math.max(match.home.players.length, match.away.players.length);
    for(let i=0; i<maxPlayers; i++){
        const hp = match.home.players[i];
        const ap = match.away.players[i];
        const cLeft = i % 2 === 0 ? "DataLeft" : "DataLeftAlt";
        xml += createExcelRow([
            {v: hp ? `#${hp.number} - ${hp.name} (${hp.pos})` : "", s: cLeft}, 
            {v: ""}, 
            {v: ap ? `#${ap.number} - ${ap.name} (${ap.pos})` : "", s: cLeft}
        ], 22);
    }

    xml += `
        ${createExcelRow([""], 20)}
        ${createExcelRow([{v: "SUPLENTES", s: "SectionTitle"}, {v:""}, {v: "SUPLENTES", s: "SectionTitle"}], 35)}
        ${createExcelRow([{v: "BANQUILLO", s: "TableHeader"}, {v:""}, {v: "BANQUILLO", s: "TableHeader"}], 25)}
    `;

    const maxBench = Math.max(match.home.bench.length, match.away.bench.length);
    for(let i=0; i<maxBench; i++){
        const hp = match.home.bench[i];
        const ap = match.away.bench[i];
        const cLeft = i % 2 === 0 ? "DataLeft" : "DataLeftAlt";
        xml += createExcelRow([
            {v: hp ? `#${hp.number} - ${hp.name} (${hp.pos})` : "", s: cLeft}, 
            {v: ""}, 
            {v: ap ? `#${ap.number} - ${ap.name} (${ap.pos})` : "", s: cLeft}
        ], 22);
    }

    xml += `
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <PageSetup>
          <Layout x:Orientation="Portrait" x:CenterHorizontal="1"/>
          <PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5"/>
        </PageSetup>
        <FitToPage/>
        <Print>
          <FitWidth>1</FitWidth>
          <FitHeight>0</FitHeight>
          <PaperSizeIndex>9</PaperSizeIndex>
        </Print>
      </WorksheetOptions>
    </Worksheet>`;

    // ──────────────────────────────────────────
    // HOJA 3: ESTADISTICAS
    // ──────────────────────────────────────────
    xml += `<Worksheet ss:Name="3. Estadisticas">
      <Table>
        <Column ss:Index="1" ss:Width="200"/>
        <Column ss:Index="2" ss:Width="200"/>
        <Column ss:Index="3" ss:Width="200"/>

        ${createExcelRow([{v: "ESTADÍSTICAS COMPARATIVAS", s: "SectionTitle", span: 2}], 40)}
        ${createExcelRow([{v: match.home.name, s: "TableHeader"}, {v: "CONCEPTO", s: "TableHeader"}, {v: match.away.name, s: "TableHeader"}], 30)}
    `;

    const statData = [
      { key: 'shots_tot', label: 'Tiros Totales', h: stats.home.shots_on + stats.home.shots_off, a: stats.away.shots_on + stats.away.shots_off },
      ...STAT_ROWS.map(r => ({ key: r.key, label: r.label, h: stats.home[r.key], a: stats.away[r.key] }))
    ];

    statData.forEach((s, idx) => {
      const cCenter = idx % 2 === 0 ? "DataCenter" : "DataCenterAlt";
      xml += createExcelRow([{v: s.h, s: cCenter}, {v: s.label, s: cCenter}, {v: s.a, s: cCenter}], 26);
    });

    xml += `
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <PageSetup>
          <Layout x:Orientation="Portrait" x:CenterHorizontal="1"/>
          <PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5"/>
        </PageSetup>
        <FitToPage/>
        <Print>
          <FitWidth>1</FitWidth>
          <FitHeight>0</FitHeight>
          <PaperSizeIndex>9</PaperSizeIndex>
        </Print>
      </WorksheetOptions>
    </Worksheet>`;

    // ──────────────────────────────────────────
    // HOJA 4: TARJETAS
    // ──────────────────────────────────────────
    xml += `<Worksheet ss:Name="4. Disciplina">
      <Table>
        <Column ss:Index="1" ss:Width="80"/>
        <Column ss:Index="2" ss:Width="180"/>
        <Column ss:Index="3" ss:Width="200"/>
        <Column ss:Index="4" ss:Width="140"/>

        ${createExcelRow([{v: "REGISTRO DISCIPLINARIO", s: "SectionTitle", span: 3}], 40)}
        ${createExcelRow([{v:"MINUTO", s:"TableHeader"}, {v:"EQUIPO", s:"TableHeader"}, {v:"JUGADOR", s:"TableHeader"}, {v:"TARJETA", s:"TableHeader"}], 30)}
    `;
    
    const cards = events.filter(e => e.type === "yellow" || e.type === "red").sort((a,b)=>a.min - b.min);
    if(cards.length === 0) {
      xml += createExcelRow([{v: "Partido limpio. No hubo amonestaciones ni expulsiones.", s: "DataCenter", span: 3}], 35);
    } else {
      cards.forEach((e, idx) => {
          const teamName = e.team === 'home' ? match.home.name : match.away.name;
          const typeLabel = e.type === "yellow" ? "Tarjeta Amarilla" : "Tarjeta Roja";
          
          let cCenter = e.type === "yellow" ? "RowYellowCenter" : "RowRedCenter";
          let cLeft   = e.type === "yellow" ? "RowYellow" : "RowRed";

          xml += createExcelRow([
            {v: `${e.min}'`, s: cCenter}, 
            {v: teamName, s: cCenter}, 
            {v: e.player, s: cLeft}, 
            {v: typeLabel, s: cCenter}
          ], 26);
      });
    }

    xml += `
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <PageSetup>
          <Layout x:Orientation="Portrait" x:CenterHorizontal="1"/>
          <PageMargins x:Bottom="0.5" x:Left="0.5" x:Right="0.5" x:Top="0.5"/>
        </PageSetup>
        <FitToPage/>
        <Print>
          <FitWidth>1</FitWidth>
          <FitHeight>0</FitHeight>
          <PaperSizeIndex>9</PaperSizeIndex>
        </Print>
      </WorksheetOptions>
    </Worksheet>
  </Workbook>`;

    try {
      const blob = new Blob(["\ufeff" + xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `Acta_Oficial_LigaMaster_${match.home.abbr}_vs_${match.away.abbr}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("No se pudo descargar automáticamente. Asegúrate de tener permisos.");
    }
  };

  const StatBar = ({ label, hVal, aVal }) => {
    const tot = hVal + aVal || 0;
    const pH  = tot === 0 ? 50 : Math.round(hVal / tot * 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`font-black text-base w-8 tabular-nums ${hVal >= aVal ? "text-black" : "text-zinc-300"}`}>{hVal}</span>
          <span className="font-black text-[9px] tracking-widest text-zinc-400 uppercase flex-1 text-center">{label}</span>
          <span className={`font-black text-base w-8 text-right tabular-nums ${aVal > hVal ? "text-black" : "text-zinc-300"}`}>{aVal}</span>
        </div>
        <div className="h-1 bg-zinc-100 flex overflow-hidden">
          <div style={{ width: `${pH}%` }} className="bg-black transition-all duration-700" />
          <div style={{ flex: 1 }} className="bg-zinc-200 transition-all duration-700" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden z-50">

      {/* ══════ MODAL DE JUGADOR (DETALLE AL PINCHAR) ══════ */}
      {selectedPlayer && (
        <div className="absolute inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-white rounded shadow-2xl max-w-sm w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-black p-6 flex items-center gap-4 border-b-4 border-[#ccff00]">
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center font-black text-2xl shadow-inner">
                {selectedPlayer.number}
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-black text-xl uppercase leading-none mb-1">{selectedPlayer.name}</h3>
                <p className="text-[#ccff00] font-bold text-[10px] uppercase tracking-widest">{match[selectedPlayer.side].name} • {selectedPlayer.pos}</p>
              </div>
            </div>
            
            <div className="p-6 bg-zinc-50">
              <h4 className="font-black text-[10px] text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">Acciones en este partido</h4>
              {selectedPlayer.statInfo.pEvents.length === 0 && !selectedPlayer.statInfo.isSubbedOut && !selectedPlayer.statInfo.isSubbedIn ? (
                <p className="text-zinc-500 text-sm italic">Sin acciones registradas.</p>
              ) : (
                <div className="space-y-3">
                  {selectedPlayer.statInfo.isSubbedIn && (
                    <div className="flex items-center gap-3 bg-green-50 p-2 rounded border border-green-100"><span className="text-green-600">↑</span><span className="text-xs font-bold text-green-800 uppercase">Ingresó al campo de juego</span></div>
                  )}
                  {[...selectedPlayer.statInfo.pEvents].sort((a,b)=>a.min-b.min).map(ev => {
                    const t = EV_TYPES.find(x => x.id === ev.type);
                    return (
                      <div key={ev.id} className="flex items-center gap-4 bg-white p-3 border border-zinc-200 shadow-sm rounded-sm">
                        <span className="font-black text-red-500 w-6">{ev.min}'</span>
                        <span className="text-xl">{t?.emoji}</span>
                        <span className="font-black text-xs uppercase text-zinc-700">{t?.label}</span>
                      </div>
                    )
                  })}
                  {selectedPlayer.statInfo.isSubbedOut && (
                    <div className="flex items-center gap-3 bg-red-50 p-2 rounded border border-red-100"><span className="text-red-600">↓</span><span className="text-xs font-bold text-red-800 uppercase">Salió sustituido</span></div>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => setSelectedPlayer(null)} className="w-full py-4 bg-zinc-200 hover:bg-zinc-300 font-black text-xs uppercase tracking-widest transition-colors">Cerrar Perfil</button>
          </div>
        </div>
      )}

      {/* ══════ MODAL DE OBSERVACIONES ANTES DE FINALIZAR ══════ */}
      {showEndModal && (
        <div className="absolute inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-sm max-w-lg w-full shadow-2xl flex flex-col border-t-4 border-[#ccff00] animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-black text-2xl mb-1 text-black uppercase tracking-tight">Finalizar Partido</h3>
            <p className="text-zinc-500 text-xs mb-5 font-bold uppercase tracking-widest">
              Paso Final: Emitir Acta Oficial
            </p>
            
            <label className="block font-black text-[10px] tracking-widest text-zinc-800 uppercase mb-2">
              Observaciones del Comisionado (Opcional)
            </label>
            <textarea
              value={matchNotes}
              onChange={(e) => setMatchNotes(e.target.value)}
              placeholder="Ej: Se añadieron 5 minutos en el primer tiempo por lesión del arquero local..."
              className="w-full h-32 p-4 bg-zinc-50 border border-zinc-300 text-black text-sm mb-6 outline-none resize-none focus:border-black transition-colors"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmEndMatch}
                className="flex-1 bg-red-600 text-white font-black text-xs py-4 rounded-sm hover:bg-red-700 transition-colors uppercase tracking-widest shadow-lg"
              >
                Cerrar Partido
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 bg-zinc-200 text-black font-black text-xs py-4 rounded-sm hover:bg-zinc-300 transition-colors uppercase tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MODAL DE ACTA OFICIAL EN PANTALLA ══════ */}
      {showReport && (
        <div className="absolute inset-0 z-[100] bg-zinc-900/98 backdrop-blur-md overflow-y-auto p-4 sm:p-8">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-auto flex flex-col mb-16">
            
            {/* Header */}
            <div className="bg-black p-6 text-center border-b-4 border-[#ccff00] rounded-t-lg">
              <h2 className="font-black text-2xl text-white uppercase tracking-widest mb-1">Acta Oficial del Partido</h2>
              <p className="text-[#ccff00] text-xs font-bold tracking-widest uppercase">{match.jornada} • {match.estadio}</p>
            </div>

            {/* Contenido */}
            <div className="p-6 md:p-10 bg-zinc-50">
              
              <div className="flex justify-center items-center gap-6 mb-8 bg-white p-6 rounded border border-zinc-200 shadow-sm">
                <div className="text-right flex-1"><p className="font-black text-xl uppercase">{match.home.name}</p></div>
                <div className="px-6 py-2 bg-black rounded text-[#ccff00] font-black text-4xl font-mono">{homeScore} - {awayScore}</div>
                <div className="text-left flex-1"><p className="font-black text-xl uppercase">{match.away.name}</p></div>
              </div>

              <div className="flex items-center justify-around bg-zinc-100 border border-zinc-200 rounded p-4 mb-8 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                <span>Adición 1ER T: <span className="text-black font-black">+{addedTime[1]}'</span></span>
                <span className="w-px h-4 bg-zinc-300"></span>
                <span>Adición 2DO T: <span className="text-black font-black">+{addedTime[2]}'</span></span>
              </div>

              <div className="mb-8 bg-white rounded border border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-200 px-4 py-2 border-b border-zinc-300">
                  <h3 className="font-black text-xs text-zinc-700 uppercase tracking-widest">Observaciones del Comisionado</h3>
                </div>
                <div className="p-5 text-sm text-zinc-800 font-medium whitespace-pre-wrap bg-yellow-50/50 border-l-4 border-yellow-400 leading-relaxed">
                  {matchNotes.trim() !== "" ? matchNotes : <span className="text-zinc-400 italic">Sin observaciones registradas en este encuentro.</span>}
                </div>
              </div>

              <div className="mb-8 bg-white rounded border border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-200 px-4 py-2 border-b border-zinc-300">
                  <h3 className="font-black text-xs text-zinc-700 uppercase tracking-widest">Análisis Estadístico</h3>
                </div>
                <div className="p-6 space-y-4">
                  <StatBar label="TIROS TOTALES" hVal={stats.home.shots_on + stats.home.shots_off} aVal={stats.away.shots_on + stats.away.shots_off} />
                  <StatBar label="FALTAS" hVal={stats.home.fouls} aVal={stats.away.fouls} />
                  <StatBar label="AMARILLAS" hVal={stats.home.yellow} aVal={stats.away.yellow} />
                  <StatBar label="ROJAS" hVal={stats.home.red} aVal={stats.away.red} />
                </div>
              </div>

              <div className="bg-white rounded border border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-200 px-4 py-2 border-b border-zinc-300">
                  <h3 className="font-black text-xs text-zinc-700 uppercase tracking-widest">Desglose de Eventos</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200 text-xs">
                    <tr>
                      <th className="p-4 font-bold uppercase">Min</th>
                      <th className="p-4 font-bold uppercase">Equipo</th>
                      <th className="p-4 font-bold uppercase">Jugador</th>
                      <th className="p-4 font-bold uppercase">Evento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">Sin eventos registrados</td>
                      </tr>
                    ) : (
                      [...events].sort((a,b) => a.min - b.min).map(e => {
                        const tInfo = EV_TYPES.find(x => x.id === e.type);
                        return (
                          <tr key={e.id} className="hover:bg-zinc-50">
                            <td className="p-4 font-mono font-black text-red-600">{e.min}'</td>
                            <td className="p-4 font-black uppercase tracking-tight">{e.team === 'home' ? match.home.abbr : match.away.abbr}</td>
                            <td className="p-4 uppercase font-bold">{e.player}</td>
                            <td className="p-4 flex items-center gap-2">
                              <span className="text-lg">{tInfo?.emoji}</span> 
                              <span className="font-black uppercase text-xs tracking-wider">{tInfo?.label}</span>
                              {e.note && <span className="text-zinc-500 text-xs ml-1 font-medium">({e.note})</span>}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Botones Flotantes Inferiores */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-zinc-200 flex flex-col sm:flex-row gap-3 rounded-b-lg shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
              <button onClick={downloadEnterpriseExcel} className="flex-1 bg-[#ccff00] hover:bg-[#b3e600] text-black font-black text-sm py-5 uppercase tracking-widest transition-colors rounded-sm shadow-md">
                ⬇ DESCARGAR EXCEL OFICIAL
              </button>
              <button onClick={() => setShowReport(false)} className="px-8 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs py-5 uppercase tracking-widest transition-colors rounded-sm shadow-md">
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ TOP BAR ══════ */}
      <div className="flex items-center justify-between px-4 md:px-8 h-12 bg-black shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors shrink-0">
            ← VOLVER
          </button>
          <span className="text-zinc-700 hidden md:block">|</span>
          <span className="text-white font-black text-sm tracking-tighter hidden md:block">LIGA PRO</span>
          <span className="text-zinc-700 hidden md:block">|</span>
          <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest truncate hidden sm:block">
            {match.home.name} VS {match.away.name}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isLive && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-[#ccff00] font-black text-[9px] uppercase tracking-widest hidden sm:block">EN VIVO</span>
            </div>
          )}
          <button
            onClick={onToggleAdmin}
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
              isAdmin ? "border-red-500 bg-red-500 text-white" : "border-zinc-600 text-zinc-400 hover:border-white hover:text-white"
            }`}
          >
            {isAdmin ? "✦ COMISIONADO" : "PÚBLICO"}
          </button>
        </div>
      </div>

      {/* ══════ MARCADOR PRINCIPAL ══════ */}
      {(isAdmin || isLive) && (
        <div className="bg-black border-b-4 border-white shrink-0">
          <div className="text-center pt-1.5">
            <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
              {match.jornada} · {match.estadio}
            </span>
          </div>

          <div className="flex items-center justify-center px-4 md:px-10 py-2 md:py-3 gap-3 md:gap-6">
            <div className="flex-1 flex flex-col items-center md:items-end min-w-0">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-sm md:text-lg mb-1 shrink-0">
                {match.home.abbr[0]}
              </div>
              <span className="text-white font-black text-xs md:text-lg tracking-tight uppercase text-center md:text-right leading-none truncate w-full">
                {match.home.name}
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-5 shrink-0">
              <span className="text-white font-black text-4xl md:text-7xl tabular-nums tracking-tighter leading-none">{homeScore}</span>
              <div className="flex flex-col items-center gap-1">
                <div className={`font-black text-xs md:text-xl tabular-nums px-2 md:px-4 py-1 border-2 tracking-tighter transition-all flex items-center justify-center gap-1 ${
                  running ? "text-[#ccff00] border-[#ccff00] bg-[#ccff00]/10" : "text-zinc-500 border-zinc-700"
                }`}>
                  {fmtTime(seconds)}
                  {addedTime[half] > 0 && <span className="text-[10px] text-white">+{addedTime[half]}'</span>}
                </div>
                
                {/* 🔴 INDICADOR DE TIEMPOS 🔴 */}
                <div className="flex items-center gap-1 mt-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
                  <button 
                    onClick={() => changeHalf(1)} 
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-colors ${half === 1 ? "bg-[#ccff00] text-black" : "text-zinc-500 hover:text-white"}`}
                  >
                    1ER TIEMPO
                  </button>
                  <button 
                    onClick={() => changeHalf(2)} 
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-colors ${half === 2 ? "bg-[#ccff00] text-black" : "text-zinc-500 hover:text-white"}`}
                  >
                    2DO TIEMPO
                  </button>
                </div>

              </div>
              <span className="text-zinc-500 font-black text-4xl md:text-7xl tabular-nums tracking-tighter leading-none">{awayScore}</span>
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start min-w-0">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-300 flex items-center justify-center font-black text-sm md:text-lg mb-1 shrink-0">
                {match.away.abbr[0]}
              </div>
              <span className="text-zinc-500 font-black text-xs md:text-lg tracking-tight uppercase text-center md:text-left leading-none truncate w-full">
                {match.away.name}
              </span>
            </div>
          </div>

          {goals.length > 0 && (
            <div className="flex justify-center flex-wrap gap-3 pb-2 px-4">
              {goals.map(g => (
                <span key={g.id} className="text-[9px] font-bold text-zinc-500 flex items-center gap-1 uppercase tracking-widest">
                  <span className="text-green-400">⚽</span>
                  <span className="text-zinc-300">{g.player.split(" ").pop()}</span>
                  <span className="text-[#ccff00] font-black">{g.min}'</span>
                  <span className="text-zinc-700">· {g.team === "home" ? match.home.abbr : match.away.abbr}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════ ZONA PRINCIPAL ══════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-zinc-100">

        {isAdmin ? (
          /* ─────── PANEL COMISIONADO ─────── */
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white">

            {/* 🌟 BARRA DE CONTROL CENTRALIZADA Y ORDENADA 🌟 */}
            <div className="flex items-center justify-center shrink-0 border-b-2 border-black bg-black overflow-x-auto py-3 px-4 gap-4 sm:gap-8">
              
              {/* Botón Play/Pause */}
              <button
                onClick={() => { running ? setRunning(false) : (setRunning(true), setIsLive(true)); }}
                className={`flex items-center gap-2 px-6 py-3 font-black text-[10px] uppercase tracking-widest rounded-sm transition-all shadow-md ${
                  running ? "bg-[#ccff00] text-black hover:bg-[#b3e600]" : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${running ? "bg-black animate-pulse" : "bg-black"}`} />
                {running ? "PAUSAR RELOJ" : "INICIAR PARTIDO"}
              </button>
              
              {/* Controles Secundarios: Extra Time & Transmisión */}
              <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-sm p-1.5 shadow-inner">
                <div className="flex items-center px-2 gap-2 border-r border-zinc-800 pr-4">
                  <span className="text-zinc-500 font-black text-[8px] uppercase">EXTRA {half}T</span>
                  <div className="flex items-center bg-black rounded border border-zinc-700">
                    <span className="text-zinc-500 pl-2 font-bold text-[10px]">+</span>
                    <input 
                      type="number" 
                      min="0"
                      max="99"
                      value={addedTime[half] === 0 ? "" : addedTime[half]} 
                      onChange={(e) => setAddedTime(prev => ({...prev, [half]: Number(e.target.value) || 0}))}
                      className="w-6 h-6 sm:w-8 sm:h-7 bg-transparent text-[#ccff00] font-black text-xs text-center outline-none"
                      placeholder="0"
                    />
                    <span className="text-zinc-500 pr-2 font-bold text-[10px]">'</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsLive(v => !v)}
                  className={`flex items-center gap-2 px-3 font-black text-[9px] uppercase tracking-widest transition-all ${
                    isLive ? "text-[#ccff00]" : "text-zinc-600 hover:text-white"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[#ccff00] animate-pulse" : "bg-zinc-700"}`} />
                  {isLive ? "EN VIVO (ON)" : "OFFLINE"}
                </button>
              </div>

              {/* Botón Finalizar */}
              <button
                onClick={handleInitiateEndMatch}
                className="px-6 py-3 font-black text-[10px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white transition-colors rounded-sm shadow-md"
              >
                ■ FINALIZAR PARTIDO
              </button>
            </div>

            {/* Tabs */}
            <div className="flex shrink-0 border-b-2 border-black overflow-x-auto bg-white shadow-sm z-10">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 md:px-8 py-3 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    tab === t ? "text-black border-b-4 border-black" : "text-zinc-400 hover:text-black"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Contenido de herramientas (SIN SCROLL INFINITO HASTA ABAJO, DISTRIBUCIÓN EN PANELES) */}
            <div className="flex-1 overflow-y-auto bg-zinc-100 p-4">
              
              {/* PANEL DASHBOARD: ACCIONES DISTRIBUIDAS */}
              {tab === "EVENTOS" && (
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 h-full">
                  
                  {/* COLUMNA IZQUIERDA: BOTONERA TIPO CAJERO */}
                  <div className="w-full lg:w-5/12 bg-white border border-zinc-200 rounded shadow-sm flex flex-col">
                    <div className="bg-black text-white p-3 rounded-t flex items-center justify-between">
                      <span className="font-black text-[10px] uppercase tracking-widest">1. Seleccionar Evento</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3 flex-1 content-start">
                      {EV_TYPES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setEvType(t.id)}
                          style={evType === t.id ? { borderColor: t.accent, color: t.accent } : {}}
                          className={`py-4 px-2 border-2 flex flex-col items-center justify-center gap-2 transition-all rounded-sm ${
                            evType === t.id ? "bg-black shadow-lg scale-105 z-10" : "border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white"
                          }`}
                        >
                          <span className="text-3xl">{t.emoji}</span>
                          <span className={`font-black text-[10px] uppercase tracking-widest text-center leading-tight ${evType === t.id ? "" : "text-zinc-600"}`}>
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COLUMNA DERECHA: SELECCIÓN Y CONFIRMACIÓN */}
                  <div className="w-full lg:w-7/12 flex flex-col gap-4">
                    
                    <div className="bg-white border border-zinc-200 rounded shadow-sm">
                      <div className="bg-zinc-200 p-3 rounded-t border-b border-zinc-300">
                        <span className="font-black text-[10px] text-zinc-700 uppercase tracking-widest">2. Equipo</span>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        {["home", "away"].map(side => (
                          <button
                            key={side}
                            onClick={() => setEvTeam(side)}
                            className={`py-5 border-2 font-black text-sm uppercase tracking-widest transition-all rounded-sm ${
                              evTeam === side ? "border-black bg-black text-white shadow-md" : "border-zinc-200 text-zinc-500 hover:border-black hover:text-black bg-zinc-50"
                            }`}
                          >
                            {match[side].name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded shadow-sm flex-1 flex flex-col">
                      <div className="bg-zinc-200 p-3 rounded-t border-b border-zinc-300">
                        <span className="font-black text-[10px] text-zinc-700 uppercase tracking-widest">
                          3. Detalles: {evType === "sub" ? "Cambio de Jugadores" : "Protagonista y Minuto"}
                        </span>
                      </div>
                      
                      <div className="p-4 flex-1">
                        {evType === "sub" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-center">
                            <div>
                              <label className="block font-black text-[10px] tracking-widest text-red-600 uppercase mb-2">Sale de la cancha ↓</label>
                              <select value={subOut} onChange={e => setSubOut(e.target.value)}
                                className="w-full p-4 border-2 border-zinc-300 bg-white text-black font-bold text-sm outline-none focus:border-black transition-colors rounded-sm cursor-pointer shadow-inner">
                                <option value="">— Seleccionar —</option>
                                {curSide.players.map(p => <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block font-black text-[10px] tracking-widest text-green-600 uppercase mb-2">Entra a la cancha ↑</label>
                              <select value={subIn} onChange={e => setSubIn(e.target.value)}
                                className="w-full p-4 border-2 border-zinc-300 bg-white text-black font-bold text-sm outline-none focus:border-black transition-colors rounded-sm cursor-pointer shadow-inner">
                                <option value="">— Seleccionar —</option>
                                {curSide.bench.map(p => <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>)}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full content-center">
                            <div className="sm:col-span-2">
                              <label className="block font-black text-[10px] tracking-widest text-zinc-500 uppercase mb-2">Jugador Involucrado</label>
                              <select value={evPlayer} onChange={e => setEvPlayer(e.target.value)}
                                className="w-full p-4 border-2 border-zinc-300 bg-white text-black font-bold text-sm outline-none focus:border-black transition-colors rounded-sm cursor-pointer shadow-inner">
                                <option value="">— General / Todo el Equipo —</option>
                                {curSide.players.map(p => <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block font-black text-[10px] tracking-widest text-zinc-500 uppercase mb-2">Minuto (Opcional)</label>
                              <input
                                type="number"
                                placeholder={`${Math.floor(seconds / 60)}`}
                                value={evMin}
                                onChange={e => setEvMin(e.target.value)}
                                className="w-full p-4 border-2 border-zinc-300 bg-white text-black font-black text-center text-xl outline-none focus:border-black transition-colors rounded-sm shadow-inner"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-zinc-100 bg-zinc-50 rounded-b">
                        <button onClick={addEvent} className="w-full py-5 bg-[#ccff00] text-black font-black text-sm md:text-base uppercase tracking-widest hover:bg-black hover:text-[#ccff00] transition-colors flex items-center justify-center gap-3 shadow-xl rounded-sm">
                          <span className="text-xl leading-none mb-1">+</span> AGREGAR AL PARTIDO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🌟 PANEL DE PLANTILLAS AVANZADO 🌟 */}
              {tab === "PLANTILLAS" && (
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["home", "away"].map(side => (
                    <div key={side} className="bg-white border border-zinc-200 rounded shadow-sm overflow-hidden">
                      <div className="bg-black p-4 flex items-center justify-between border-b-4" style={{borderColor: match[side].colorHex}}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-white text-black`}>
                            {match[side].abbr[0]}
                          </div>
                          <span className="font-black text-lg uppercase tracking-tight text-white">{match[side].name}</span>
                        </div>
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Plantilla</span>
                      </div>
                      
                      <div className="p-4 bg-zinc-50">
                        <h4 className="font-black text-[10px] text-zinc-400 uppercase tracking-widest mb-2 pb-1 border-b border-zinc-200">11 Titular</h4>
                        {renderPlayerList(side, match[side].players)}
                        
                        <h4 className="font-black text-[10px] text-zinc-400 uppercase tracking-widest mb-2 mt-6 pb-1 border-b border-zinc-200">Banquillo / Suplentes</h4>
                        {renderPlayerList(side, match[side].bench, true)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "ESTADÍSTICAS" && (
                <div className="max-w-2xl mx-auto bg-white p-8 border border-zinc-200 rounded shadow-sm">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black gap-2">
                    <span className="font-black text-sm md:text-xl uppercase tracking-tight truncate">{match.home.name}</span>
                    <span className="font-black text-[10px] tracking-[0.2em] text-zinc-400 uppercase text-center shrink-0">COMPARATIVA</span>
                    <span className="font-black text-sm md:text-xl uppercase tracking-tight text-zinc-400 truncate text-right">{match.away.name}</span>
                  </div>
                  <StatBar label="TIROS TOTALES" hVal={stats.home.shots_on + stats.home.shots_off} aVal={stats.away.shots_on + stats.away.shots_off} />
                  {STAT_ROWS.map(r => (
                    <StatBar key={r.key} label={r.label.toUpperCase()} hVal={stats.home[r.key]} aVal={stats.away[r.key]} />
                  ))}
                </div>
              )}

              {tab === "TARJETAS" && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["home", "away"].map(side => {
                    const cards = events.filter(e => (e.type === "yellow" || e.type === "red") && e.team === side);
                    return (
                      <div key={side} className="bg-white p-6 border border-zinc-200 rounded shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-black">
                          <span className="font-black text-[10px] tracking-widest text-zinc-400 uppercase">AMONESTACIONES /</span>
                          <span className="font-black text-lg uppercase">{match[side].name}</span>
                        </div>
                        {cards.length === 0
                          ? <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded"><p className="font-black text-xs tracking-widest text-zinc-300 uppercase">EQUIPO LIMPIO</p></div>
                          : (
                            <div className="space-y-2">
                              {cards.map(e => (
                                <div key={e.id} className="flex items-center justify-between px-5 py-4 bg-zinc-50 border border-zinc-200 border-l-4 hover:border-l-black transition-colors rounded-sm group">
                                  <div className="flex items-center gap-4">
                                    <span className="text-2xl drop-shadow-sm">{e.type === "yellow" ? "🟨" : "🟥"}</span>
                                    <span className="font-black text-red-500 text-xl tabular-nums">{e.min}'</span>
                                    <span className="font-black text-sm uppercase text-zinc-800">{e.player}</span>
                                  </div>
                                  <button onClick={() => removeEvent(e.id)} className="text-zinc-300 hover:text-red-500 font-black text-xs px-3 py-1 bg-white border border-zinc-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">QUITAR</button>
                                </div>
                              ))}
                            </div>
                          )
                        }
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bitácora Inferior (Historial) */}
            <div className="h-32 bg-black border-t border-zinc-800 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-20 flex flex-col">
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-900 shrink-0 bg-zinc-950">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-pulse"></div>
                  <span className="font-black text-zinc-400 text-[9px] tracking-[0.2em] uppercase">TIMELINE DEL PARTIDO</span>
                </div>
                {events.length > 0 && (
                  <span className="font-black text-[9px] text-zinc-600 uppercase tracking-widest tabular-nums">{events.length} REGISTROS</span>
                )}
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-zinc-700">
                <div className="flex flex-row h-full items-center gap-2 px-4 min-w-max">
                  {events.length === 0 ? (
                    <div className="flex items-center justify-center px-10 w-full min-w-40 opacity-50">
                      <p className="font-black text-[9px] uppercase tracking-[0.2em] text-zinc-500">— LA BITÁCORA ESTÁ VACÍA —</p>
                    </div>
                  ) : (
                    [...events].reverse().map(ev => {
                      const def = EV_TYPES.find(t => t.id === ev.type) || EV_TYPES[0];
                      return (
                        <div key={ev.id} className="relative flex flex-col justify-between shrink-0 w-36 h-20 bg-zinc-900 border border-zinc-800 p-2.5 rounded-sm group hover:border-zinc-600 transition-colors">
                          <button 
                            onClick={() => removeEvent(ev.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-[10px] font-bold z-10"
                            title="Eliminar"
                          >
                            ✕
                          </button>
                          
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-white text-sm tabular-nums">{ev.min}'</span>
                            <span className="text-lg drop-shadow-md">{def.emoji}</span>
                          </div>
                          <div style={{ color: def.accent }} className="font-black text-[8px] uppercase tracking-widest mb-0.5 truncate pr-2 opacity-90">{def.label}</div>
                          <div className="font-bold text-[10px] text-white uppercase leading-tight truncate">{ev.player}</div>
                          <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: ev.team === 'home' ? match.home.colorHex : match.away.colorHex }}></div>
                        </div>
                      );
                    })
                  )}
                  <div ref={feedEndRef} />
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ─────── VISTA PÚBLICO ─────── */
          isLive
            ? <LiveTimeline
                match={match}
                events={events}
              />
            : <PreMatchWaiting match={match} />
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RAÍZ DEL COMPONENTE
// ─────────────────────────────────────────────────────────────────────────────
export default function LiveMatch() {
  const [isAdmin, setIsAdmin] = useState(false);
  const toggleRole = () => setIsAdmin(prev => !prev);
  
  const [screen, setScreen]           = useState("selector");
  const [activeMatch, setActiveMatch] = useState(null);

  const handleEnter = (m) => { setActiveMatch(m); setScreen("live"); };
  const handleBack  = ()  => { setActiveMatch(null); setScreen("selector"); };

  return (
    <>
      {screen === "selector"
        ? <MatchSelector onEnter={handleEnter} isAdmin={isAdmin} onToggleAdmin={toggleRole} />
        : <LiveCenter    match={activeMatch}   isAdmin={isAdmin} onToggleAdmin={toggleRole} onBack={handleBack} />
      }
    </>
  );
}