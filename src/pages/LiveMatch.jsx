import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// BASE DE DATOS Y CONFIGURACIÓN (FÚTBOL SOCCER)
// ─────────────────────────────────────────────────────────────────────────────
const MATCHES_DB = [
  {
    id: 1, jornada: "Jornada 14", hora: "16:00", estadio: "Estadio Olímpico",
    home: {
      name: "PATRIOTAS", full: "PATRIOTAS FC", abbr: "PAT", color: "#000000",
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
      name: "RIVALS", full: "RIVALS FC", abbr: "RIV", color: "#52525B",
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
  {id:"goal",     emoji:"⚽", label:"Gol",         stat:"goals",     color:"text-black"},
  {id:"shot_on",  emoji:"🎯", label:"Tiro al Arco",stat:"shots_on",  color:"text-zinc-600"},
  {id:"shot_off", emoji:"💨", label:"Tiro Afuera", stat:"shots_off", color:"text-zinc-400"},
  {id:"yellow",   emoji:"🟨", label:"Amarilla",    stat:"yellow",    color:"text-yellow-500"},
  {id:"red",      emoji:"🟥", label:"Roja",        stat:"red",       color:"text-red-600"},
  {id:"sub",      emoji:"🔄", label:"Sustitución", stat:"subs",      color:"text-blue-600"},
  {id:"corner",   emoji:"🚩", label:"Córner",      stat:"corners",   color:"text-zinc-800"},
  {id:"foul",     emoji:"🤜", label:"Falta",       stat:"fouls",     color:"text-orange-500"},
  {id:"offside",  emoji:"🚫", label:"Offside",     stat:"offsides",  color:"text-zinc-500"},
  {id:"penalty",  emoji:"⚠️", label:"Penal",       stat:"penalties", color:"text-red-500"},
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
  {key:"subs",     label:"Sustituciones"},
];

const TABS = ["Eventos", "Plantillas", "Estadísticas", "Tarjetas"];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function calcStats(events) {
  const zero = () => Object.fromEntries(STAT_ROWS.map(r=>[r.key,0]));
  const h = zero(), a = zero();
  for (const ev of events) {
    const def = EV_TYPES.find(t=>t.id===ev.type);
    if (!def?.stat) continue;
    if (ev.team==="home") h[def.stat]++; else a[def.stat]++;
  }
  return {home:h, away:a};
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE 1: SELECTOR DE PARTIDO
// ─────────────────────────────────────────────────────────────────────────────
function MatchSelector({ onEnter, isAdmin, onToggleAdmin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 h-14 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <span className="font-black text-xl tracking-tighter shrink-0">LIGA PRO</span>
          <span className="text-zinc-300 hidden sm:block">|</span>
          <span className="font-bold text-xs tracking-widest text-zinc-500 uppercase hidden sm:block">Selección de Partido</span>
        </div>
        {/* FIX: texto corto en móvil */}
        <button
          onClick={onToggleAdmin}
          className={`px-3 md:px-4 py-1.5 font-bold text-[10px] md:text-xs uppercase tracking-widest border transition-colors shrink-0 ${isAdmin ? 'border-black bg-black text-white' : 'border-zinc-300 text-zinc-500 hover:border-black hover:text-black'}`}
        >
          {isAdmin ? 'Comisionado' : 'Público'}
        </button>
      </div>

      {/* Header */}
      <div className="p-6 md:p-12 border-b border-zinc-200 bg-white">
        <h1 className="font-black text-3xl md:text-6xl tracking-tighter uppercase mb-2">Jornada 14</h1>
        <p className="font-bold text-xs md:text-sm tracking-widest text-zinc-400 uppercase">Elige el encuentro a transmitir</p>
      </div>

      {/* Grid de Partidos */}
      <div className="flex-1 p-4 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {MATCHES_DB.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className={`cursor-pointer bg-white border-2 transition-all duration-200 ${selected?.id === m.id ? 'border-black shadow-lg scale-[1.02]' : 'border-zinc-200 hover:border-zinc-400'}`}
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <span className="font-bold text-xs tracking-widest text-zinc-500 uppercase">{m.jornada}</span>
              <span className={`font-black text-sm tracking-wider ${selected?.id === m.id ? 'text-black' : 'text-zinc-400'}`}>{m.hora}</span>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-lg md:text-xl mb-2">{m.home.abbr[0]}</div>
                  <div className="font-black text-sm md:text-lg tracking-tight uppercase text-center">{m.home.name}</div>
                </div>
                <div className="flex flex-col items-center px-2 md:px-4">
                  <span className="font-black text-xl md:text-2xl text-zinc-300">VS</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-zinc-200 text-black rounded-full flex items-center justify-center font-black text-lg md:text-xl mb-2">{m.away.abbr[0]}</div>
                  <div className="font-black text-sm md:text-lg tracking-tight text-zinc-500 uppercase text-center">{m.away.name}</div>
                </div>
              </div>
              <div className="text-center bg-zinc-50 p-2 font-bold text-xs tracking-widest text-zinc-500 uppercase">
                🏟️ {m.estadio}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="p-4 md:p-6 bg-white border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-sm tracking-widest uppercase text-center md:text-left">
          {selected ? (
            <span className="text-black"><span className="text-green-500 mr-2">✓</span>{selected.home.name} vs {selected.away.name}</span>
          ) : (
            <span className="text-zinc-400">Selecciona un partido para continuar</span>
          )}
        </div>
        <button
          disabled={!selected}
          onClick={() => selected && onEnter(selected)}
          className="px-6 md:px-8 py-3 md:py-4 bg-black text-white font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors w-full md:w-auto"
        >
          Entrar al Live Center →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE 2: CENTRO EN VIVO
// ─────────────────────────────────────────────────────────────────────────────
function LiveCenter({ match, isAdmin, onToggleAdmin, onBack }) {
  const [isLive, setIsLive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [half, setHalf] = useState(1);
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState("Eventos");

  const [evType, setEvType] = useState("goal");
  const [evTeam, setEvTeam] = useState("home");
  const [evPlayer, setEvPlayer] = useState("");
  const [evNote, setEvNote] = useState("");
  const [evMin, setEvMin] = useState("");
  const [subOut, setSubOut] = useState("");
  const [subIn, setSubIn] = useState("");

  const timerRef = useRef(null);
  const feedEndRef = useRef(null);

  const stats = calcStats(events);
  const homeScore = stats.home.goals;
  const awayScore = stats.away.goals;

  useEffect(() => {
    if(running) timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => { feedEndRef.current?.scrollIntoView({behavior: "smooth"}); }, [events]);
  useEffect(() => { setEvPlayer(""); setSubOut(""); setSubIn(""); }, [evTeam, evType]);

  const addEvent = () => {
    const min = evMin !== "" ? Number(evMin) : Math.floor(seconds/60);
    let player, note;
    if(evType === "sub"){
      player = subIn.trim() || "—";
      note = `Sale: ${subOut||"—"} · Entra: ${player}`;
    } else {
      player = evPlayer.trim() || "—";
      note = evNote.trim();
    }
    const newEv = { id: Date.now(), type: evType, team: evTeam, player, min, note, ts: seconds };
    setEvents(prev => [...prev, newEv].sort((a,b) => a.min - b.min || a.ts - b.ts));
    setEvPlayer(""); setEvNote(""); setEvMin(""); setSubOut(""); setSubIn("");
  };

  const curSide = match[evTeam];
  const goals = events.filter(e => e.type === "goal");

  const StatBar = ({label, hVal, aVal}) => {
    const tot = hVal + aVal || 0;
    const pH = tot === 0 ? 50 : Math.round(hVal/tot*100);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className={`font-black text-sm ${hVal >= aVal ? 'text-black' : 'text-zinc-400'}`}>{hVal}</span>
          <span className="font-bold text-[10px] tracking-widest text-zinc-500 uppercase">{label}</span>
          <span className={`font-black text-sm ${aVal > hVal ? 'text-black' : 'text-zinc-400'}`}>{aVal}</span>
        </div>
        <div className="flex h-1.5 gap-1 bg-zinc-100 overflow-hidden">
          <div style={{width: `${pH}%`}} className="bg-black transition-all duration-500" />
          <div style={{flex: 1}} className="bg-zinc-300 transition-all duration-500" />
        </div>
      </div>
    );
  };

  return (
    // FIX 1: h-screen sin overflow-hidden para que el layout maneje bien el scroll en móvil
    <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden animate-fade-in">

      {/* ═══ TOP BAR ═══ */}
      {/* FIX 2: padding y elementos responsivos, texto truncado */}
      <div className="flex items-center justify-between px-3 md:px-6 h-14 bg-white border-b border-zinc-200 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors shrink-0">
            ← Volver
          </button>
          <span className="text-zinc-300 hidden md:block">|</span>
          <span className="font-black text-lg tracking-tighter hidden md:block">LIGA PRO</span>
          <span className="text-zinc-300 hidden md:block">|</span>
          <span className="font-bold text-xs tracking-widest text-zinc-900 uppercase truncate">{match.home.name} vs {match.away.name}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          {isLive && (
            <div className="flex items-center gap-1 md:gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-[10px] tracking-widest text-red-600 uppercase hidden sm:block">En Vivo</span>
            </div>
          )}
          <button onClick={onToggleAdmin} className={`px-2 md:px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest border transition-colors ${isAdmin ? 'border-black bg-black text-white' : 'border-zinc-300 text-zinc-500 hover:border-black hover:text-black'}`}>
            {isAdmin ? 'Comisionado' : 'Público'}
          </button>
        </div>
      </div>

      {/* ═══ MARCADOR ═══ */}
      {/* FIX 3: tamaños responsivos en todo el marcador */}
      <div className="bg-white border-b border-zinc-200 shrink-0 pb-4 md:pb-6">
        <div className="flex justify-center items-center gap-4 pt-3 md:pt-4 pb-2">
          <span className="font-bold text-[10px] tracking-widest text-zinc-400 uppercase text-center px-4">{match.jornada} · {match.estadio}</span>
        </div>

        <div className="flex justify-center items-center px-2 md:px-6">
          {/* Local */}
          <div className="flex flex-col items-center md:items-end flex-1 pr-2 md:pr-8">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-base md:text-xl mb-1 md:mb-2">
              {match.home.abbr[0]}
            </div>
            <span className="font-black text-xs md:text-2xl tracking-tighter uppercase text-center leading-tight">{match.home.name}</span>
          </div>

          {/* Puntaje y Reloj */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <span className="font-black text-4xl md:text-8xl tracking-tighter tabular-nums">{homeScore}</span>
            <div className="flex flex-col items-center px-1 md:px-4">
              <div className="font-mono font-black text-sm md:text-2xl bg-zinc-100 px-2 md:px-4 py-1 border border-zinc-200 mb-1">
                {fmtTime(seconds)}
              </div>
              <span className="font-bold text-[9px] md:text-[10px] text-zinc-400 tracking-widest uppercase text-center">
                {half===1 ? "1er T" : half===2 ? "2do T" : "Final"}
              </span>
            </div>
            <span className="font-black text-4xl md:text-8xl tracking-tighter tabular-nums text-zinc-400">{awayScore}</span>
          </div>

          {/* Visita */}
          <div className="flex flex-col items-center md:items-start flex-1 pl-2 md:pl-8">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-white border-2 border-zinc-200 text-black rounded-full flex items-center justify-center font-black text-base md:text-xl mb-1 md:mb-2">
              {match.away.abbr[0]}
            </div>
            <span className="font-black text-xs md:text-2xl tracking-tighter text-zinc-500 uppercase text-center leading-tight">{match.away.name}</span>
          </div>
        </div>

        {/* Goleadores */}
        {goals.length > 0 && (
          <div className="flex justify-center flex-wrap gap-3 md:gap-6 pt-3 md:pt-6 px-4">
            {goals.map(g => (
              <span key={g.id} className="font-bold text-xs tracking-wider text-zinc-600 flex items-center gap-1">
                ⚽ {g.player.split(" ").pop()} <span className="font-black text-black">{g.min}'</span>
                <span className="text-[9px] text-zinc-400">({g.team==="home"?"LOC":"VIS"})</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CUERPO PRINCIPAL ═══ */}
      {/* FIX 4: en móvil columna vertical, en desktop horizontal */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* ────── Panel izquierdo ────── */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 bg-white overflow-hidden">

          {isAdmin ? (
            <>
              {/* BARRA DE RELOJ */}
              <div className="flex items-stretch shrink-0 border-b border-zinc-200 bg-zinc-50 overflow-x-auto">
                <button
                  onClick={() => { running ? setRunning(false) : (setRunning(true), setIsLive(true)) }}
                  className={`px-4 md:px-6 font-black text-xs uppercase tracking-widest border-r border-zinc-200 transition-colors whitespace-nowrap ${running ? 'bg-white text-black' : 'bg-black text-white hover:bg-zinc-800'}`}
                >
                  {running ? '⏸ Pausar' : '▶ Iniciar'}
                </button>
                <button
                  onClick={() => { setRunning(false); setSeconds(0); }}
                  className="px-4 md:px-6 font-bold text-xs uppercase tracking-widest text-zinc-500 hover:text-black border-r border-zinc-200 transition-colors whitespace-nowrap"
                >
                  ↺ Reset
                </button>
                {[1, 2].map(h => (
                  <button
                    key={h}
                    onClick={() => setHalf(h)}
                    className={`px-4 md:px-6 font-black text-xs uppercase tracking-widest border-r border-zinc-200 transition-colors whitespace-nowrap ${half === h ? 'border-b-2 border-b-black text-black' : 'text-zinc-400 hover:text-black'}`}
                  >
                    {h}T
                  </button>
                ))}
                <button
                  onClick={() => setIsLive(v => !v)}
                  className={`ml-auto px-4 md:px-6 font-bold text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap ${isLive ? 'text-red-600 bg-red-50' : 'text-zinc-400 hover:text-black'}`}
                >
                  {isLive ? '● En Vivo' : '○ Activar'}
                </button>
              </div>

              {/* FIX 5: TABS con scroll horizontal y whitespace-nowrap */}
              <div className="flex shrink-0 border-b border-zinc-200 overflow-x-auto">
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 md:px-6 py-3 font-black text-[11px] uppercase tracking-widest transition-colors relative whitespace-nowrap ${tab === t ? 'text-black' : 'text-zinc-400 hover:text-zinc-700'}`}
                  >
                    {t}
                    {tab === t && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
                  </button>
                ))}
              </div>

              {/* CONTENIDO DE LAS TABS */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">

                {/* TAB: EVENTOS */}
                {tab === "Eventos" && (
                  <div className="max-w-3xl animate-fade-in">
                    <div className="font-bold text-[10px] tracking-widest text-zinc-400 uppercase mb-3">1. Tipo de Evento</div>
                    {/* FIX: grid 3 cols en móvil en vez de 2, se ve mejor */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6 md:mb-8">
                      {EV_TYPES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setEvType(t.id)}
                          className={`py-2 md:py-3 px-1 border flex flex-col items-center justify-center gap-1 transition-all ${evType === t.id ? 'border-black bg-zinc-50 shadow-sm scale-[1.02]' : 'border-zinc-200 hover:border-zinc-400'}`}
                        >
                          <span className="text-lg md:text-xl">{t.emoji}</span>
                          <span className={`font-black text-[8px] md:text-[9px] uppercase tracking-widest text-center ${evType === t.id ? 'text-black' : 'text-zinc-500'}`}>{t.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="font-bold text-[10px] tracking-widest text-zinc-400 uppercase mb-3">2. Equipo Involucrado</div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                      {["home", "away"].map(side => (
                        <button
                          key={side}
                          onClick={() => setEvTeam(side)}
                          className={`py-3 md:py-4 border-2 font-black text-xs md:text-sm uppercase tracking-widest transition-all ${evTeam === side ? 'border-black bg-zinc-50' : 'border-zinc-200 text-zinc-400 hover:border-zinc-400'}`}
                        >
                          {match[side].name}
                        </button>
                      ))}
                    </div>

                    {evType === "sub" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                        <div>
                          <label className="block font-bold text-[10px] tracking-widest text-zinc-400 uppercase mb-2">Sale (Titular)</label>
                          <select value={subOut} onChange={e => setSubOut(e.target.value)} className="w-full p-3 border border-zinc-300 bg-white outline-none focus:border-black font-bold text-sm">
                            <option value="">— Seleccionar —</option>
                            {curSide.players.map(p => <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-[10px] tracking-widest text-zinc-400 uppercase mb-2">Entra (Suplente)</label>
                          <select value={subIn} onChange={e => setSubIn(e.target.value)} className="w-full p-3 border border-zinc-300 bg-white outline-none focus:border-black font-bold text-sm">
                            <option value="">— Seleccionar —</option>
                            {curSide.bench.map(p => <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>)}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                        <div className="md:col-span-2">
                          <label className="block font-bold text-[10px] tracking-widest text-zinc-400 uppercase mb-2">Jugador (Opcional)</label>
                          <select value={evPlayer} onChange={e => setEvPlayer(e.target.value)} className="w-full p-3 border border-zinc-300 bg-white outline-none focus:border-black font-bold text-sm">
                            <option value="">— Equipo General —</option>
                            {curSide.players.map(p => <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-[10px] tracking-widest text-zinc-400 uppercase mb-2">Minuto</label>
                          <input
                            type="number"
                            placeholder={`${Math.floor(seconds/60)}`}
                            value={evMin}
                            onChange={e => setEvMin(e.target.value)}
                            className="w-full p-3 border border-zinc-300 bg-white outline-none focus:border-black font-mono font-black text-center"
                          />
                        </div>
                      </div>
                    )}

                    <button onClick={addEvent} className="w-full py-4 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                      + Publicar en Bitácora
                    </button>
                  </div>
                )}

                {/* TAB: PLANTILLAS */}
                {tab === "Plantillas" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-fade-in">
                    {["home", "away"].map(side => (
                      <div key={side}>
                        <h3 className="font-black text-base md:text-lg uppercase tracking-widest mb-4 border-b border-black pb-2">{match[side].name}</h3>
                        <div className="space-y-1 mb-6">
                          {match[side].players.map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-2 bg-zinc-50 border border-zinc-100">
                              <span className="font-black w-6 text-right text-zinc-400">{p.number}</span>
                              <span className="font-bold text-[10px] w-8 text-zinc-500 uppercase">{p.pos}</span>
                              <span className="font-black text-sm flex-1">{p.name}</span>
                            </div>
                          ))}
                        </div>
                        <h4 className="font-bold text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Suplentes</h4>
                        <div className="space-y-1">
                          {match[side].bench.map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-1 opacity-70">
                              <span className="font-bold text-xs w-6 text-right">{p.number}</span>
                              <span className="font-bold text-[10px] w-8 uppercase">{p.pos}</span>
                              <span className="font-bold text-xs flex-1">{p.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB: ESTADÍSTICAS */}
                {tab === "Estadísticas" && (
                  <div className="max-w-2xl mx-auto animate-fade-in">
                    <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-black pb-4">
                      <span className="font-black text-sm md:text-xl uppercase tracking-tighter">{match.home.name}</span>
                      <span className="font-bold text-[9px] md:text-[10px] tracking-widest text-zinc-400 uppercase text-center">Comparativa</span>
                      <span className="font-black text-sm md:text-xl uppercase tracking-tighter text-zinc-400">{match.away.name}</span>
                    </div>
                    <StatBar label="Tiros Totales" hVal={stats.home.shots_on+stats.home.shots_off} aVal={stats.away.shots_on+stats.away.shots_off} />
                    {STAT_ROWS.map(r => (
                      <StatBar key={r.key} label={r.label} hVal={stats.home[r.key]} aVal={stats.away[r.key]} />
                    ))}
                  </div>
                )}

                {/* TAB: TARJETAS */}
                {tab === "Tarjetas" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-fade-in">
                    {["home", "away"].map(side => {
                      const cards = events.filter(e => e.type === "yellow" || e.type === "red").filter(e => e.team === side);
                      return (
                        <div key={side}>
                          <h3 className="font-black text-base md:text-lg uppercase tracking-widest mb-4 border-b border-black pb-2">{match[side].name}</h3>
                          {cards.length === 0 ? (
                            <p className="text-sm font-bold text-zinc-400 italic">Equipo sin amonestaciones.</p>
                          ) : (
                            <div className="space-y-2">
                              {cards.map(e => (
                                <div key={e.id} className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200">
                                  <span className="text-xl">{e.type === "yellow" ? "🟨" : "🟥"}</span>
                                  <span className="font-black text-sm">{e.min}'</span>
                                  <span className="font-black text-sm uppercase">{e.player}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* VISTA PÚBLICO */
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-zinc-100">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-black flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 relative bg-white shadow-xl">
                ⚽
                {isLive && <div className="absolute inset-[-8px] rounded-full border-2 border-red-500 animate-pulse" />}
              </div>
              <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter mb-2 text-center">{isLive ? "Partido en Curso" : "Esperando Inicio"}</h2>
              <p className="font-bold text-xs md:text-sm tracking-widest text-zinc-500 uppercase mb-6 md:mb-8 text-center">Sigue los detalles en la bitácora lateral</p>
              {isLive && (
                <div className="px-4 md:px-6 py-2 bg-black text-white font-black text-xs uppercase tracking-widest animate-pulse flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Transmisión Oficial
                </div>
              )}
            </div>
          )}
        </div>

        {/* ────── DERECHA (Timeline / Bitácora) ────── */}
        {/* FIX 4 (continuación): en móvil altura fija 56, en desktop ancho fijo y auto-alto */}
        <div className="h-56 md:h-auto md:w-80 lg:w-96 flex flex-col bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-200 shrink-0">
          <div className="h-10 md:h-14 flex items-center justify-between px-4 md:px-6 border-b border-zinc-200 bg-white shrink-0">
            <span className="font-black text-xs md:text-sm uppercase tracking-widest">Play-by-Play</span>
            {events.length > 0 && (
              <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">{events.length}</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
            {events.length === 0 && (
              <p className="text-center font-bold text-xs uppercase tracking-widest text-zinc-400 mt-6 md:mt-10">Sin eventos aún</p>
            )}
            {[...events].reverse().map(ev => {
              const def = EV_TYPES.find(t => t.id === ev.type) || EV_TYPES[0];
              return (
                <div key={ev.id} className="bg-white border border-zinc-200 p-3 md:p-4 animate-slide-up hover:border-black transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm bg-zinc-100 px-1.5 py-0.5 border border-zinc-200">{ev.min}'</span>
                      <span className="text-base md:text-lg">{def.emoji}</span>
                    </div>
                    <span className="font-bold text-[9px] uppercase tracking-widest text-zinc-400">{ev.team === "home" ? "LOC" : "VIS"}</span>
                  </div>
                  <div className={`font-black text-[10px] uppercase tracking-widest mb-1 ${def.color}`}>{def.label}</div>
                  <div className="font-black text-xs md:text-sm uppercase leading-tight">{ev.player}</div>
                  {ev.note && (
                    <div className="font-medium text-xs text-zinc-500 mt-2 border-t border-zinc-100 pt-2">{ev.note}</div>
                  )}
                </div>
              );
            })}
            <div ref={feedEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE RAÍZ
// ─────────────────────────────────────────────────────────────────────────────
export default function LiveMatch() {
  const { isAdmin, toggleRole } = useAuth();
  const [screen, setScreen] = useState("selector");
  const [activeMatch, setActiveMatch] = useState(null);

  const handleEnter = (m) => { setActiveMatch(m); setScreen("live"); };
  const handleBack = () => { setActiveMatch(null); setScreen("selector"); };

  return (
    <>
      {screen === "selector"
        ? <MatchSelector onEnter={handleEnter} isAdmin={isAdmin} onToggleAdmin={toggleRole} />
        : <LiveCenter match={activeMatch} isAdmin={isAdmin} onToggleAdmin={toggleRole} onBack={handleBack} />
      }
    </>
  );
}