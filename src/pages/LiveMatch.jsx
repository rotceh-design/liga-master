import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// BASE DE DATOS
// ─────────────────────────────────────────────────────────────────────────────
const MATCHES_DB = [
  {
    id: 1, jornada: "Jornada 14", hora: "16:00", estadio: "Estadio Olímpico",
    home: {
      name: "PATRIOTAS", full: "PATRIOTAS FC", abbr: "PAT",
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
      name: "RIVALS", full: "RIVALS FC", abbr: "RIV",
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
  {id:"goal",     emoji:"⚽", label:"Gol",         stat:"goals",     accent:"#22c55e", badge:"bg-green-500"},
  {id:"shot_on",  emoji:"🎯", label:"Tiro Arco",   stat:"shots_on",  accent:"#ffffff", badge:"bg-white"},
  {id:"shot_off", emoji:"💨", label:"Tiro Afuera", stat:"shots_off", accent:"#71717a", badge:"bg-zinc-500"},
  {id:"yellow",   emoji:"🟨", label:"Amarilla",    stat:"yellow",    accent:"#eab308", badge:"bg-yellow-500"},
  {id:"red",      emoji:"🟥", label:"Roja",        stat:"red",       accent:"#ef4444", badge:"bg-red-500"},
  {id:"sub",      emoji:"🔄", label:"Sustitución", stat:"subs",      accent:"#3b82f6", badge:"bg-blue-500"},
  {id:"corner",   emoji:"🚩", label:"Córner",      stat:"corners",   accent:"#f97316", badge:"bg-orange-500"},
  {id:"foul",     emoji:"🤜", label:"Falta",       stat:"fouls",     accent:"#fb923c", badge:"bg-orange-400"},
  {id:"offside",  emoji:"🚫", label:"Offside",     stat:"offsides",  accent:"#a1a1aa", badge:"bg-zinc-400"},
  {id:"penalty",  emoji:"⚠️", label:"Penal",       stat:"penalties", accent:"#f43f5e", badge:"bg-rose-500"},
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
// SELECTOR DE PARTIDO — estilo Nike
// ─────────────────────────────────────────────────────────────────────────────
function MatchSelector({ onEnter, isAdmin, onToggleAdmin }) {
  const [selected, setSelected] = useState(null);

  return (
    // FIX EXTENSIÓN: min-h-screen + w-full garantizan que ocupe toda la pantalla
    <div className="min-h-screen w-full bg-white flex flex-col">

      {/* Barra superior */}
      <div className="flex items-center justify-between px-6 md:px-10 h-14 bg-black">
        <span className="font-black text-white text-xl tracking-tighter uppercase">LIGA PRO</span>
        <button
          onClick={onToggleAdmin}
          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            isAdmin
              ? "border-red-500 bg-red-500 text-white"
              : "border-white text-white hover:bg-white hover:text-black"
          }`}
        >
          {isAdmin ? "✦ COMISIONADO" : "PÚBLICO"}
        </button>
      </div>

      {/* Hero header */}
      <div className="bg-black px-6 md:px-10 pt-10 pb-8 border-b-4 border-white">
        <p className="text-red-500 font-black text-xs tracking-[0.3em] uppercase mb-2">
          ● TEMPORADA ACTIVA
        </p>
        <h1 className="font-black text-white text-5xl md:text-8xl tracking-tighter uppercase leading-none">
          JORNADA<br />14
        </h1>
        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mt-4">
          Selecciona el encuentro
        </p>
      </div>

      {/* Cards de partidos */}
      <div className="flex-1 bg-zinc-100 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {MATCHES_DB.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className={`cursor-pointer bg-white border-2 transition-all duration-150 select-none ${
              selected?.id === m.id
                ? "border-black shadow-2xl -translate-y-0.5"
                : "border-transparent hover:border-black"
            }`}
          >
            {/* Top del card */}
            <div className={`flex justify-between items-center px-5 py-3 ${selected?.id === m.id ? "bg-black" : "bg-zinc-100"}`}>
              <span className={`font-black text-[10px] tracking-widest uppercase ${selected?.id === m.id ? "text-white" : "text-zinc-500"}`}>
                {m.jornada}
              </span>
              <span className={`font-black text-sm ${selected?.id === m.id ? "text-red-400" : "text-zinc-400"}`}>
                {m.hora}
              </span>
            </div>

            {/* Enfrentamiento */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-xl mb-2">
                    {m.home.abbr[0]}
                  </div>
                  <span className="font-black text-sm uppercase tracking-tight text-center">{m.home.name}</span>
                </div>
                <span className="font-black text-2xl text-zinc-200 px-4">VS</span>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-zinc-200 text-zinc-800 rounded-full flex items-center justify-center font-black text-xl mb-2">
                    {m.away.abbr[0]}
                  </div>
                  <span className="font-black text-sm uppercase tracking-tight text-center text-zinc-500">{m.away.name}</span>
                </div>
              </div>
              <div className="text-center bg-zinc-50 py-2 px-3 font-bold text-[10px] tracking-widest text-zinc-400 uppercase">
                🏟 {m.estadio}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer de acción */}
      <div className="bg-white border-t-2 border-black px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-black text-sm uppercase tracking-widest text-center sm:text-left">
          {selected ? (
            <span className="text-black">
              <span className="text-red-500 mr-2">✦</span>
              {selected.home.name} VS {selected.away.name}
            </span>
          ) : (
            <span className="text-zinc-300">SELECCIONA UN PARTIDO</span>
          )}
        </p>
        <button
          disabled={!selected}
          onClick={() => selected && onEnter(selected)}
          className="w-full sm:w-auto bg-black text-white font-black text-sm uppercase tracking-widest px-10 py-4 hover:bg-red-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ENTRAR AL LIVE CENTER →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRO EN VIVO — estilo Nike
// ─────────────────────────────────────────────────────────────────────────────
function LiveCenter({ match, isAdmin, onToggleAdmin, onBack }) {
  const [isLive, setIsLive]      = useState(false);
  const [seconds, setSeconds]    = useState(0);
  const [running, setRunning]    = useState(false);
  const [half, setHalf]          = useState(1);
  const [events, setEvents]      = useState([]);
  const [tab, setTab]            = useState("EVENTOS");

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
      note   = `Sale: ${subOut || "—"} · Entra: ${player}`;
    } else {
      player = evPlayer.trim() || "—";
      note   = "";
    }
    const newEv = { id: Date.now(), type: evType, team: evTeam, player, min, note, ts: seconds };
    setEvents(prev => [...prev, newEv].sort((a, b) => a.min - b.min || a.ts - b.ts));
    setEvPlayer(""); setEvMin(""); setSubOut(""); setSubIn("");
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
    /*
      FIX CLAVE DE EXTENSIÓN:
      - Usamos `position: fixed` con inset-0 en lugar de h-screen
        para que SIEMPRE ocupe exactamente toda la ventana sin importar
        cómo App.jsx envuelva el componente.
    */
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════
          1. TOP BAR — Negro Nike
      ══════════════════════════════════════ */}
      <div className="flex items-center justify-between px-4 md:px-8 h-12 bg-black shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors shrink-0"
          >
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
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-black text-[9px] uppercase tracking-widest hidden sm:block">EN VIVO</span>
            </div>
          )}
          <button
            onClick={onToggleAdmin}
            className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
              isAdmin
                ? "border-red-500 bg-red-500 text-white"
                : "border-zinc-600 text-zinc-400 hover:border-white hover:text-white"
            }`}
          >
            {isAdmin ? "✦ COMISIONADO" : "PÚBLICO"}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          2. MARCADOR — Bloque Nike bold
      ══════════════════════════════════════ */}
      <div className="bg-black border-b-4 border-white shrink-0">
        {/* Meta info */}
        <div className="text-center pt-2 pb-0">
          <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
            {match.jornada} · {match.estadio}
          </span>
        </div>

        {/* Equipos y marcador */}
        <div className="flex items-center justify-center px-4 md:px-10 py-3 md:py-4 gap-3 md:gap-6">

          {/* Local */}
          <div className="flex-1 flex flex-col items-center md:items-end min-w-0">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center font-black text-base md:text-xl mb-1 shrink-0">
              {match.home.abbr[0]}
            </div>
            <span className="text-white font-black text-xs md:text-xl tracking-tight uppercase text-center md:text-right leading-none truncate w-full">
              {match.home.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            <span className="text-white font-black text-5xl md:text-8xl tabular-nums tracking-tighter leading-none">
              {homeScore}
            </span>

            <div className="flex flex-col items-center gap-1">
              {/* Reloj */}
              <div className={`font-black text-sm md:text-2xl tabular-nums px-2 md:px-4 py-1 border-2 tracking-tighter transition-all ${
                running
                  ? "text-red-400 border-red-500 bg-red-500/10"
                  : "text-zinc-500 border-zinc-700"
              }`}>
                {fmtTime(seconds)}
              </div>
              <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">
                {half === 1 ? "1ER T" : half === 2 ? "2DO T" : "FINAL"}
              </span>
            </div>

            <span className="text-zinc-600 font-black text-5xl md:text-8xl tabular-nums tracking-tighter leading-none">
              {awayScore}
            </span>
          </div>

          {/* Visita */}
          <div className="flex-1 flex flex-col items-center md:items-start min-w-0">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-300 flex items-center justify-center font-black text-base md:text-xl mb-1 shrink-0">
              {match.away.abbr[0]}
            </div>
            <span className="text-zinc-500 font-black text-xs md:text-xl tracking-tight uppercase text-center md:text-left leading-none truncate w-full">
              {match.away.name}
            </span>
          </div>
        </div>

        {/* Goleadores */}
        {goals.length > 0 && (
          <div className="flex justify-center flex-wrap gap-3 pb-3 px-4">
            {goals.map(g => (
              <span key={g.id} className="text-[9px] font-bold text-zinc-500 flex items-center gap-1 uppercase tracking-widest">
                <span className="text-green-400">⚽</span>
                <span className="text-zinc-300">{g.player.split(" ").pop()}</span>
                <span className="text-red-400 font-black">{g.min}'</span>
                <span className="text-zinc-700">· {g.team === "home" ? match.home.abbr : match.away.abbr}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          3. ZONA PRINCIPAL: ACCIONES arriba + BITÁCORA abajo
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">

        {/* ── PANEL DE ACCIONES (toma todo el espacio disponible, scrollable) ── */}
        {isAdmin ? (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white">

            {/* Barra de control del reloj */}
            <div className="flex items-stretch shrink-0 border-b-2 border-black bg-black overflow-x-auto">
              {/* Iniciar / Pausar */}
              <button
                onClick={() => { running ? setRunning(false) : (setRunning(true), setIsLive(true)); }}
                className={`flex items-center gap-2 px-5 py-3 font-black text-[10px] uppercase tracking-widest border-r-2 border-zinc-800 transition-all whitespace-nowrap ${
                  running
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-white text-black hover:bg-zinc-100"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${running ? "bg-white animate-pulse" : "bg-black"}`} />
                {running ? "⏸ PAUSAR" : "▶ INICIAR"}
              </button>

              {/* Reset */}
              <button
                onClick={() => { setRunning(false); setSeconds(0); }}
                className="px-4 font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white border-r-2 border-zinc-800 transition-colors whitespace-nowrap"
              >
                ↺ RST
              </button>

              {/* Tiempos */}
              {[1, 2].map(h => (
                <button
                  key={h}
                  onClick={() => setHalf(h)}
                  className={`px-5 font-black text-[10px] uppercase tracking-widest border-r-2 border-zinc-800 transition-all whitespace-nowrap ${
                    half === h ? "bg-white text-black" : "text-zinc-600 hover:text-white"
                  }`}
                >
                  {h === 1 ? "1ER T" : "2DO T"}
                </button>
              ))}

              {/* TX */}
              <button
                onClick={() => setIsLive(v => !v)}
                className={`ml-auto flex items-center gap-2 px-5 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-l-2 border-zinc-800 ${
                  isLive ? "text-red-400 bg-red-500/10" : "text-zinc-600 hover:text-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-zinc-700"}`} />
                {isLive ? "TX ACTIVA" : "TX OFF"}
              </button>
            </div>

            {/* Tabs Nike */}
            <div className="flex shrink-0 border-b-2 border-black overflow-x-auto bg-white">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 md:px-8 py-3 font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap relative ${
                    tab === t ? "text-white bg-black" : "text-zinc-400 hover:text-black"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">

              {/* ─ TAB: EVENTOS ─ */}
              {tab === "EVENTOS" && (
                <div className="max-w-3xl mx-auto">

                  {/* Paso 1 — Tipo de evento */}
                  <p className="font-black text-[9px] tracking-[0.25em] text-zinc-400 uppercase mb-3">
                    01 · TIPO DE EVENTO
                  </p>
                  <div className="grid grid-cols-5 gap-1.5 mb-7">
                    {EV_TYPES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setEvType(t.id)}
                        style={evType === t.id ? { borderColor: t.accent, color: t.accent } : {}}
                        className={`py-3 px-1 border-2 flex flex-col items-center gap-1.5 transition-all ${
                          evType === t.id
                            ? "bg-black"
                            : "border-zinc-100 bg-zinc-50 hover:border-black hover:bg-white"
                        }`}
                      >
                        <span className="text-lg md:text-xl">{t.emoji}</span>
                        <span className={`font-black text-[7px] uppercase tracking-widest text-center leading-tight ${
                          evType === t.id ? "" : "text-zinc-500"
                        }`}>
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Paso 2 — Equipo */}
                  <p className="font-black text-[9px] tracking-[0.25em] text-zinc-400 uppercase mb-3">
                    02 · EQUIPO
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-7">
                    {["home", "away"].map(side => (
                      <button
                        key={side}
                        onClick={() => setEvTeam(side)}
                        className={`py-3 border-2 font-black text-xs md:text-sm uppercase tracking-widest transition-all ${
                          evTeam === side
                            ? "border-black bg-black text-white"
                            : "border-zinc-200 text-zinc-400 hover:border-black hover:text-black"
                        }`}
                      >
                        {match[side].name}
                      </button>
                    ))}
                  </div>

                  {/* Paso 3 — Jugador */}
                  <p className="font-black text-[9px] tracking-[0.25em] text-zinc-400 uppercase mb-3">
                    03 · {evType === "sub" ? "SUSTITUCIÓN" : "JUGADOR & MINUTO"}
                  </p>

                  {evType === "sub" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
                      <div>
                        <label className="block font-black text-[9px] tracking-widest text-zinc-400 uppercase mb-2">Sale ↑</label>
                        <select
                          value={subOut} onChange={e => setSubOut(e.target.value)}
                          className="w-full p-3 border-2 border-zinc-200 bg-white text-black font-bold text-sm outline-none focus:border-black transition-colors"
                        >
                          <option value="">— Seleccionar —</option>
                          {curSide.players.map(p => (
                            <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-black text-[9px] tracking-widest text-zinc-400 uppercase mb-2">Entra ↓</label>
                        <select
                          value={subIn} onChange={e => setSubIn(e.target.value)}
                          className="w-full p-3 border-2 border-zinc-200 bg-white text-black font-bold text-sm outline-none focus:border-black transition-colors"
                        >
                          <option value="">— Seleccionar —</option>
                          {curSide.bench.map(p => (
                            <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 mb-7">
                      <div className="col-span-2">
                        <label className="block font-black text-[9px] tracking-widest text-zinc-400 uppercase mb-2">Jugador</label>
                        <select
                          value={evPlayer} onChange={e => setEvPlayer(e.target.value)}
                          className="w-full p-3 border-2 border-zinc-200 bg-white text-black font-bold text-sm outline-none focus:border-black transition-colors"
                        >
                          <option value="">— General —</option>
                          {curSide.players.map(p => (
                            <option key={p.id} value={`#${p.number} ${p.name}`}>#{p.number} {p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-black text-[9px] tracking-widest text-zinc-400 uppercase mb-2">MIN</label>
                        <input
                          type="number"
                          placeholder={`${Math.floor(seconds / 60)}`}
                          value={evMin}
                          onChange={e => setEvMin(e.target.value)}
                          className="w-full p-3 border-2 border-zinc-200 bg-white text-black font-black text-center text-lg outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Botón publicar */}
                  <button
                    onClick={addEvent}
                    className="w-full py-4 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-3"
                  >
                    <span>+</span> PUBLICAR EN BITÁCORA
                  </button>
                </div>
              )}

              {/* ─ TAB: PLANTILLAS ─ */}
              {tab === "PLANTILLAS" && (
                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  {["home", "away"].map(side => (
                    <div key={side}>
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-black">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${side === "home" ? "bg-black text-white" : "bg-zinc-200 text-black"}`}>
                          {match[side].abbr[0]}
                        </div>
                        <span className="font-black text-base uppercase tracking-tight">{match[side].name}</span>
                      </div>
                      <div className="space-y-0.5 mb-5">
                        {match[side].players.map(p => (
                          <div key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 transition-colors">
                            <span className="font-black text-zinc-300 w-6 text-right text-sm">{p.number}</span>
                            <span className="font-bold text-[9px] text-zinc-400 w-8 uppercase tracking-widest">{p.pos}</span>
                            <span className="font-black text-sm flex-1 uppercase">{p.name}</span>
                          </div>
                        ))}
                      </div>
                      <p className="font-black text-[9px] tracking-widest text-zinc-300 uppercase mb-2">— SUPLENTES</p>
                      <div className="space-y-0.5">
                        {match[side].bench.map(p => (
                          <div key={p.id} className="flex items-center gap-3 px-3 py-1.5 opacity-40">
                            <span className="font-bold text-zinc-400 w-6 text-right text-sm">{p.number}</span>
                            <span className="font-bold text-[9px] text-zinc-400 w-8 uppercase tracking-widest">{p.pos}</span>
                            <span className="font-bold text-sm flex-1 uppercase">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─ TAB: ESTADÍSTICAS ─ */}
              {tab === "ESTADÍSTICAS" && (
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
                    <span className="font-black text-lg uppercase tracking-tight">{match.home.name}</span>
                    <span className="font-black text-[9px] tracking-widest text-zinc-400 uppercase">COMPARATIVA</span>
                    <span className="font-black text-lg uppercase tracking-tight text-zinc-400">{match.away.name}</span>
                  </div>
                  <StatBar label="TIROS TOTALES" hVal={stats.home.shots_on + stats.home.shots_off} aVal={stats.away.shots_on + stats.away.shots_off} />
                  {STAT_ROWS.map(r => (
                    <StatBar key={r.key} label={r.label.toUpperCase()} hVal={stats.home[r.key]} aVal={stats.away[r.key]} />
                  ))}
                </div>
              )}

              {/* ─ TAB: TARJETAS ─ */}
              {tab === "TARJETAS" && (
                <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  {["home", "away"].map(side => {
                    const cards = events.filter(e => (e.type === "yellow" || e.type === "red") && e.team === side);
                    return (
                      <div key={side}>
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-black">
                          <span className="font-black text-[9px] tracking-widest text-zinc-400 uppercase">AMONESTACIONES /</span>
                          <span className="font-black text-sm uppercase">{match[side].name}</span>
                        </div>
                        {cards.length === 0
                          ? <p className="font-black text-[10px] tracking-widest text-zinc-300 uppercase">SIN REGISTROS</p>
                          : (
                            <div className="space-y-1.5">
                              {cards.map(e => (
                                <div key={e.id} className="flex items-center gap-4 px-4 py-3 bg-zinc-50 border-l-4 border-black">
                                  <span className="text-xl">{e.type === "yellow" ? "🟨" : "🟥"}</span>
                                  <span className="font-black text-red-500 text-lg tabular-nums">{e.min}'</span>
                                  <span className="font-black text-sm uppercase">{e.player}</span>
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
          </div>
        ) : (
          /* ── VISTA PÚBLICO ── */
          <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
            <div className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center text-4xl mb-6 relative">
              ⚽
              {isLive && (
                <div className="absolute inset-[-10px] rounded-full border-2 border-red-500 animate-pulse" />
              )}
            </div>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2 text-black text-center">
              {isLive ? "PARTIDO EN CURSO" : "ESPERANDO INICIO"}
            </h2>
            <p className="font-bold text-xs tracking-widest text-zinc-400 uppercase mb-8 text-center">
              Sigue los detalles en la bitácora de abajo
            </p>
            {isLive && (
              <div className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                TRANSMISIÓN OFICIAL
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            BITÁCORA — franja fija abajo, scroll horizontal
        ══════════════════════════════════════ */}
        <div className="h-44 md:h-52 flex flex-col bg-black border-t-4 border-white shrink-0">

          {/* Header bitácora */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-black text-white text-[9px] tracking-[0.25em] uppercase">BITÁCORA</span>
              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <div className="flex items-center gap-4">
              {events.length > 0 && (
                <span className="font-bold text-[9px] text-zinc-600 uppercase tracking-widest tabular-nums">
                  {events.length} EVENTOS
                </span>
              )}
              <span className="font-black text-[9px] text-zinc-600 tracking-widest hidden sm:block">
                {fmtTime(seconds)} · {half === 1 ? "1ER T" : half === 2 ? "2DO T" : "FINAL"}
              </span>
            </div>
          </div>

          {/* Feed horizontal de tarjetas */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex flex-row h-full items-stretch gap-px p-2 min-w-max">
              {events.length === 0 ? (
                <div className="flex items-center justify-center px-10 w-full">
                  <p className="font-black text-[9px] uppercase tracking-[0.25em] text-zinc-700">
                    — SIN EVENTOS AÚN —
                  </p>
                </div>
              ) : (
                [...events].reverse().map(ev => {
                  const def = EV_TYPES.find(t => t.id === ev.type) || EV_TYPES[0];
                  return (
                    <div
                      key={ev.id}
                      className="flex flex-col justify-between shrink-0 w-32 md:w-36 bg-zinc-900 hover:bg-zinc-800 transition-colors p-3"
                    >
                      {/* Minuto + emoji */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-white text-sm tabular-nums">{ev.min}'</span>
                        <span className="text-base">{def.emoji}</span>
                      </div>

                      {/* Tipo */}
                      <div
                        style={{ color: def.accent }}
                        className="font-black text-[8px] uppercase tracking-widest mb-1"
                      >
                        {def.label}
                      </div>

                      {/* Jugador */}
                      <div className="font-black text-[10px] text-white uppercase leading-tight">
                        {ev.player}
                      </div>

                      {/* Equipo + nota */}
                      <div className="mt-1.5 pt-1.5 border-t border-zinc-700">
                        <span className="font-bold text-[8px] text-zinc-500 uppercase tracking-widest">
                          {ev.team === "home" ? match.home.abbr : match.away.abbr}
                        </span>
                        {ev.note && (
                          <p className="text-[7px] text-zinc-600 leading-tight mt-0.5">{ev.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={feedEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RAÍZ
// ─────────────────────────────────────────────────────────────────────────────
export default function LiveMatch() {
  const { isAdmin, toggleRole } = useAuth();
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