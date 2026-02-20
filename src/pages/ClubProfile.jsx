import React, { useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#C8FF00'; // Lima brutalista

const FORMATIONS = {
  '4-3-3': {
    positions: [
      { id: 'POR',  label: 'Portero',        top: '88%', left: '50%' },
      { id: 'LD',   label: 'Lateral Der.',   top: '72%', left: '82%' },
      { id: 'DFC', label: 'Defensa Cen.',   top: '72%', left: '62%' },
      { id: 'DFC', label: 'Defensa Cen.',   top: '72%', left: '38%' },
      { id: 'LI',   label: 'Lateral Izq.',   top: '72%', left: '18%' },
      { id: 'MC',  label: 'Mediocampo',     top: '52%', left: '68%' },
      { id: 'MC',  label: 'Mediocampo',     top: '52%', left: '50%' },
      { id: 'MC',  label: 'Mediocampo',     top: '52%', left: '32%' },
      { id: 'EXD',  label: 'Extremo Der.',   top: '28%', left: '78%' },
      { id: 'DC',   label: 'Delantero',      top: '22%', left: '50%' },
      { id: 'EXI',  label: 'Extremo Izq.',   top: '28%', left: '22%' },
    ],
  },
  '4-4-2': {
    positions: [
      { id: 'POR',  label: 'Portero',        top: '88%', left: '50%' },
      { id: 'LD',   label: 'Lateral Der.',   top: '72%', left: '82%' },
      { id: 'DFC', label: 'Defensa Cen.',   top: '72%', left: '62%' },
      { id: 'DFC', label: 'Defensa Cen.',   top: '72%', left: '38%' },
      { id: 'LI',   label: 'Lateral Izq.',   top: '72%', left: '18%' },
      { id: 'MD',   label: 'Medio Der.',     top: '50%', left: '78%' },
      { id: 'MC',  label: 'Mediocampo',     top: '50%', left: '58%' },
      { id: 'MC',  label: 'Mediocampo',     top: '50%', left: '42%' },
      { id: 'MI',   label: 'Medio Izq.',     top: '50%', left: '22%' },
      { id: 'DC',  label: 'Delantero',      top: '24%', left: '62%' },
      { id: 'DC',  label: 'Delantero',      top: '24%', left: '38%' },
    ],
  },
  '3-5-2': {
    positions: [
      { id: 'POR',  label: 'Portero',        top: '88%', left: '50%' },
      { id: 'DFC1', label: 'Defensa Cen.',   top: '72%', left: '68%' },
      { id: 'DFC2', label: 'Defensa Cen.',   top: '72%', left: '50%' },
      { id: 'DFC3', label: 'Defensa Cen.',   top: '72%', left: '32%' },
      { id: 'CD',   label: 'Carrilero Der.', top: '52%', left: '85%' },
      { id: 'MC1',  label: 'Mediocampo',     top: '52%', left: '65%' },
      { id: 'MC2',  label: 'Pivote',         top: '52%', left: '50%' },
      { id: 'MC3',  label: 'Mediocampo',     top: '52%', left: '35%' },
      { id: 'CI',   label: 'Carrilero Izq.', top: '52%', left: '15%' },
      { id: 'DC1',  label: 'Delantero',      top: '24%', left: '62%' },
      { id: 'DC2',  label: 'Delantero',      top: '24%', left: '38%' },
    ],
  },
  '4-2-3-1': {
    positions: [
      { id: 'POR',  label: 'Portero',        top: '88%', left: '50%' },
      { id: 'LD',   label: 'Lateral Der.',   top: '72%', left: '82%' },
      { id: 'DFC1', label: 'Defensa Cen.',   top: '72%', left: '62%' },
      { id: 'DFC2', label: 'Defensa Cen.',   top: '72%', left: '38%' },
      { id: 'LI',   label: 'Lateral Izq.',   top: '72%', left: '18%' },
      { id: 'MCD1', label: 'Pivote',         top: '57%', left: '60%' },
      { id: 'MCD2', label: 'Pivote',         top: '57%', left: '40%' },
      { id: 'MCO1', label: 'Media punta',    top: '38%', left: '75%' },
      { id: 'MCO2', label: 'Enganche',       top: '38%', left: '50%' },
      { id: 'MCO3', label: 'Media punta',    top: '38%', left: '25%' },
      { id: 'DC',   label: 'Delantero',      top: '20%', left: '50%' },
    ],
  },
  '5-3-2': {
    positions: [
      { id: 'POR',  label: 'Portero',        top: '88%', left: '50%' },
      { id: 'CD',   label: 'Carrilero Der.', top: '72%', left: '88%' },
      { id: 'DFC1', label: 'Defensa Cen.',   top: '72%', left: '68%' },
      { id: 'DFC2', label: 'Defensa Cen.',   top: '72%', left: '50%' },
      { id: 'DFC3', label: 'Defensa Cen.',   top: '72%', left: '32%' },
      { id: 'CI',   label: 'Carrilero Izq.', top: '72%', left: '12%' },
      { id: 'MC1',  label: 'Mediocampo',     top: '50%', left: '65%' },
      { id: 'MC2',  label: 'Mediocampo',     top: '50%', left: '50%' },
      { id: 'MC3',  label: 'Mediocampo',     top: '50%', left: '35%' },
      { id: 'DC1',  label: 'Delantero',      top: '24%', left: '62%' },
      { id: 'DC2',  label: 'Delantero',      top: '24%', left: '38%' },
    ],
  },
};

const DEFAULT_SQUAD = [
  { id: 1,  number: 1,  name: 'González',  pos: 'POR' },
  { id: 2,  number: 4,  name: 'Ramírez',   pos: 'DEF' },
  { id: 3,  number: 5,  name: 'Torres',    pos: 'DEF' },
  { id: 4,  number: 6,  name: 'Mendoza',   pos: 'DEF' },
  { id: 5,  number: 3,  name: 'Herrera',   pos: 'DEF' },
  { id: 6,  number: 8,  name: 'López',     pos: 'MED' },
  { id: 7,  number: 10, name: 'Vargas',    pos: 'MED' },
  { id: 8,  number: 14, name: 'Ortiz',     pos: 'MED' },
  { id: 9,  number: 7,  name: 'Castillo',  pos: 'DEL' },
  { id: 10, number: 9,  name: 'Flores',    pos: 'DEL' },
  { id: 11, number: 11, name: 'Reyes',     pos: 'DEL' },
  { id: 12, number: 12, name: 'Medina',    pos: 'POR' },
  { id: 13, number: 15, name: 'Jiménez',   pos: 'DEF' },
  { id: 14, number: 16, name: 'Ruiz',      pos: 'MED' },
  { id: 15, number: 17, name: 'Morales',   pos: 'DEL' },
];

const ROLE_DEFS = [
  { key: 'captain',  label: '© Capitán',          color: '#eab308', bg: '#78350f' },
  { key: 'penalty1', label: '⚽ Penal #1',          color: '#ef4444', bg: '#7f1d1d' },
  { key: 'penalty2', label: '⚽ Penal #2',          color: '#f97316', bg: '#7c2d12' },
  { key: 'penalty3', label: '⚽ Penal #3',          color: '#fb923c', bg: '#7c2d12' },
  { key: 'penalty4', label: '⚽ Penal #4',          color: '#fbbf24', bg: '#713f12' },
  { key: 'penalty5', label: '⚽ Penal #5',          color: '#fde68a', bg: '#713f12' },
  { key: 'cornerR',  label: '🚩 Córner Derecho',    color: '#60a5fa', bg: '#1e3a5f' },
  { key: 'cornerL',  label: '🚩 Córner Izquierdo',  color: '#93c5fd', bg: '#1e3a5f' },
  { key: 'freekick', label: '🎯 Tiro Libre',         color: '#4ade80', bg: '#14532d' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES REUTILIZABLES
// ─────────────────────────────────────────────────────────────────────────────

function RolePill({ roleKey }) {
  const def = ROLE_DEFS.find(r => r.key === roleKey);
  if (!def) return null;
  return (
    <span
      className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 leading-none"
      style={{ color: def.color, background: def.bg }}
    >
      {def.label.replace(/^.+?\s/, '')}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANCHA VIRTUAL
// ─────────────────────────────────────────────────────────────────────────────
function VirtualPitch({ formation, lineup, roles, squad }) {
  const positions = FORMATIONS[formation]?.positions || [];

  return (
    <div
      className="relative w-full bg-emerald-800 overflow-hidden rounded-none border-4 border-black"
      style={{ paddingBottom: '145%' }}
    >
      {/* Césped */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 30px, transparent 30px, transparent 60px)',
        }}
      />
      {/* Líneas */}
      <div className="absolute inset-3 border-2 border-white/25 pointer-events-none" />
      <div className="absolute top-1/2 left-3 right-3 h-px bg-white/25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/25 pointer-events-none" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-28 border-2 border-white/25 pointer-events-none" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 h-14 border-2 border-white/25 pointer-events-none" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3/5 h-28 border-2 border-white/25 pointer-events-none" />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/3 h-14 border-2 border-white/25 pointer-events-none" />

      {/* Jugadores */}
      {positions.map((pos, idx) => {
        const playerId    = lineup[idx];
        const player      = squad.find(p => p.id === playerId);
        const playerRoles = roles[playerId] || [];
        const isCaptain   = playerRoles.includes('captain');

        return (
          <div
            key={pos.id}
            className="absolute flex flex-col items-center"
            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%,-50%)' }}
          >
            {/* Rol pills */}
            {playerRoles.length > 0 && (
              <div className="flex flex-wrap gap-0.5 mb-1 justify-center max-w-20">
                {playerRoles.slice(0, 1).map(r => <RolePill key={r} roleKey={r} />)}
              </div>
            )}

            {/* Disco */}
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-sm shadow-lg transition-all"
              style={{
                background: player ? '#000' : 'rgba(255,255,255,0.07)',
                borderColor: player ? (isCaptain ? ACCENT : '#fff') : 'rgba(255,255,255,0.2)',
                color: player ? (isCaptain ? ACCENT : '#fff') : 'rgba(255,255,255,0.2)',
                borderStyle: player ? 'solid' : 'dashed',
              }}
            >
              {player ? player.number : '?'}
            </div>

            {/* Nombre */}
            <div className="mt-1 px-1.5 py-0.5 bg-black/80 text-white font-black text-[7px] uppercase tracking-wider text-center max-w-20 leading-tight truncate">
              {player ? player.name : pos.id}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMARÍN COMPLETO
// ─────────────────────────────────────────────────────────────────────────────
function Camarin({ clubName }) {
  const [formation,   setFormation]   = useState('4-3-3');
  const [squad,       setSquad]       = useState(DEFAULT_SQUAD);
  const [lineup,      setLineup]      = useState(DEFAULT_SQUAD.slice(0, 11).map(p => p.id));
  const [roles,       setRoles]       = useState({});
  const [subTab,      setSubTab]      = useState('alineacion');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rolesOpen,   setRolesOpen]   = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [newP,        setNewP]        = useState({ number: '', name: '', pos: 'DEF' });
  const canvasRef = useRef(null);

  const positions = FORMATIONS[formation].positions;

  // ─ Cambiar formación ─
  const changeFormation = (f) => {
    setFormation(f);
    const newPositions = FORMATIONS[f].positions;
    const currentFilledIds = lineup.filter(Boolean);
    const newLineup = newPositions.map((_, i) => currentFilledIds[i] ?? null);
    setLineup(newLineup);
  };

  // ─ Asignar jugador a slot ─
  const assignToSlot = (slotIdx, playerId) => {
    setLineup(prev => {
      const next = [...prev];
      const existing = next.indexOf(playerId);
      if (existing !== -1) next[existing] = null;
      next[slotIdx] = playerId;
      return next;
    });
    setSelectedSlot(null);
  };

  // ─ Toggle rol ─
  const toggleRole = (playerId, key) => {
    const globalUnique = ['captain', 'cornerR', 'cornerL', 'freekick',
      'penalty1','penalty2','penalty3','penalty4','penalty5'];
    setRoles(prev => {
      let updated = { ...prev };
      // Quitarlo de quien ya lo tenga si es único global
      if (globalUnique.includes(key)) {
        Object.keys(updated).forEach(pid => {
          updated[pid] = (updated[pid] || []).filter(r => r !== key);
        });
      }
      const cur = updated[playerId] || [];
      if (cur.includes(key)) {
        updated[playerId] = cur.filter(r => r !== key);
      } else {
        updated[playerId] = [...cur, key];
      }
      return updated;
    });
  };

  // ─ Agregar jugador ─
  const addPlayer = () => {
    if (!newP.name.trim() || !newP.number) return;
    setSquad(prev => [...prev, { id: Date.now(), number: Number(newP.number), name: newP.name.trim(), pos: newP.pos }]);
    setNewP({ number: '', name: '', pos: 'DEF' });
    setShowAdd(false);
  };

  // ─ Remover jugador ─
  const removePlayer = (id) => {
    setSquad(prev => prev.filter(p => p.id !== id));
    setLineup(prev => prev.map(pid => pid === id ? null : pid));
    setRoles(prev => { const r = { ...prev }; delete r[id]; return r; });
  };

  // ─ Generar imagen 1080×1920 ─
  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 1080, H = 1920;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Fondo negro
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

    // Acento lima - borde izquierdo
    ctx.fillStyle = ACCENT; ctx.fillRect(0, 0, 12, H);

    // Encabezado
    ctx.fillStyle = '#fff';
    ctx.font = '900 110px "Arial Black", Arial';
    ctx.textAlign = 'left';
    ctx.fillText(clubName.toUpperCase(), 60, 150);

    ctx.fillStyle = ACCENT;
    ctx.font = 'bold 36px Arial';
    ctx.fillText('ALINEACIÓN CONFIRMADA', 60, 205);

    ctx.fillStyle = '#52525b';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('Formación ' + formation, 60, 255);

    // Línea separadora
    ctx.fillStyle = '#27272a'; ctx.fillRect(60, 275, 480, 2);

    // Lista de jugadores ordenados de portero a delantero
    const orderedPositions = [...positions].sort((a, b) => {
      return parseFloat(b.top) - parseFloat(a.top);
    });

    orderedPositions.forEach(({ id: posId, label }, i) => {
      const slotIdx  = positions.indexOf(positions.find(p => p.id === posId));
      const playerId = lineup[slotIdx];
      const player   = squad.find(p => p.id === playerId);
      const y        = 310 + i * 118;
      const isCapt   = (roles[playerId] || []).includes('captain');

      // Fondo alterno sutil
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(50, y - 18, 560, 110);
      }

      // Número
      ctx.fillStyle = player ? ACCENT : '#3f3f46';
      ctx.font = '900 52px "Arial Black", Arial';
      ctx.textAlign = 'left';
      ctx.fillText(player ? String(player.number).padStart(2, '0') : '--', 60, y + 42);

      // Nombre
      ctx.fillStyle = player ? '#ffffff' : '#3f3f46';
      ctx.font = 'bold 44px Arial';
      ctx.fillText(player ? player.name.toUpperCase() : label.toUpperCase(), 145, y + 42);

      // Posición
      ctx.fillStyle = '#52525b';
      ctx.font = 'bold 26px Arial';
      ctx.fillText(posId, 60, y + 78);

      // Insignia capitán
      if (isCapt) {
        ctx.fillStyle = ACCENT;
        ctx.font = '900 24px Arial';
        ctx.fillText('© CAPITÁN', 150, y + 78);
      }

      // Roles de penales / corners / tiro libre
      const pRoles = (roles[playerId] || []).filter(r => r !== 'captain');
      if (pRoles.length > 0) {
        ctx.fillStyle = '#71717a';
        ctx.font = 'bold 22px Arial';
        const roleLabels = pRoles.map(rk => {
          const def = ROLE_DEFS.find(d => d.key === rk);
          return def ? def.label.replace(/^.+?\s/, '') : rk;
        }).join(' · ');
        ctx.fillText(roleLabels, 150, y + 78 + (isCapt ? 0 : 0));
      }
    });

    // ── Silueta del jugador (derecha) ──
    const px = 840, py = 420;
    const drawPlayer = () => {
      // Sombra
      ctx.fillStyle = 'rgba(200,255,0,0.05)';
      ctx.beginPath();
      ctx.ellipse(px, 1650, 130, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pantalón
      ctx.fillStyle = '#111';
      ctx.fillRect(px - 58, py + 240, 50, 180);
      ctx.fillRect(px + 8,  py + 240, 50, 180);

      // Camiseta
      const shirt = ctx.createLinearGradient(px - 90, py + 60, px + 90, py + 240);
      shirt.addColorStop(0, '#1a1a1a');
      shirt.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = shirt;
      ctx.beginPath();
      ctx.moveTo(px - 90, py + 240);
      ctx.lineTo(px - 110, py + 70);
      ctx.lineTo(px - 30, py + 28);
      ctx.lineTo(px,      py + 46);
      ctx.lineTo(px + 30, py + 28);
      ctx.lineTo(px + 110, py + 70);
      ctx.lineTo(px + 90, py + 240);
      ctx.closePath();
      ctx.fill();

      // Número en camiseta
      ctx.fillStyle = ACCENT;
      ctx.font = '900 90px "Arial Black", Arial';
      ctx.textAlign = 'center';
      ctx.fillText(formation, px, py + 180);

      // Brazos
      ctx.fillStyle = '#1a1a1a';
      ctx.save();
      ctx.translate(px - 110, py + 70);
      ctx.rotate(0.3);
      ctx.fillRect(-20, 0, 40, 160);
      ctx.restore();
      ctx.save();
      ctx.translate(px + 110, py + 70);
      ctx.rotate(-0.3);
      ctx.fillRect(-20, 0, 40, 160);
      ctx.restore();

      // Cabeza
      ctx.fillStyle = '#c8956c';
      ctx.beginPath();
      ctx.arc(px, py - 10, 58, 0, Math.PI * 2);
      ctx.fill();
      // Pelo
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(px, py - 38, 48, Math.PI, 0);
      ctx.fill();

      // Piernas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(px - 58, py + 420, 50, 220);
      ctx.fillRect(px + 8,  py + 420, 50, 220);

      // Zapatos
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(px - 33, py + 645, 44, 18, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(px + 33, py + 645, 44, 18, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Balón
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px + 100, py + 580, 52, 0, Math.PI * 2);
      ctx.fill();
      // Patrón balón
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(px + 100, py + 580, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      for (let a = 0; a < 6; a++) {
        const angle = (a / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(px + 100, py + 580);
        ctx.lineTo(px + 100 + Math.cos(angle) * 52, py + 580 + Math.sin(angle) * 52);
        ctx.stroke();
      }
    };
    drawPlayer();

    // Footer
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 1840, W, 80);
    ctx.fillStyle = '#3f3f46';
    ctx.font = 'bold 28px Arial'; ctx.textAlign = 'center';
    ctx.fillText('LIGA PRO · ' + clubName.toUpperCase(), W / 2, 1888);

    // Descargar
    const a = document.createElement('a');
    a.download = `${clubName.replace(/\s/g, '-')}-alineacion.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }, [formation, lineup, squad, roles, positions, clubName]);

  const SUBTABS = [
    { id: 'alineacion', label: '⚽ Alineación' },
    { id: 'cancha',     label: '🏟 Cancha Virtual' },
    { id: 'plantel',    label: '👥 Plantel' },
    { id: 'roles',      label: '🎖 Roles' },
    { id: 'compartir',  label: '📲 Compartir' },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <canvas ref={canvasRef} className="hidden" />

      {/* Sub-tabs */}
      <div className="flex border-b-2 border-zinc-800 overflow-x-auto sticky top-14 z-10 bg-black">
        {SUBTABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className="px-5 md:px-7 py-3 font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all relative"
            style={{
              color: subTab === t.id ? ACCENT : '#52525b',
              borderBottom: subTab === t.id ? `3px solid ${ACCENT}` : '3px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-8">

        {/* ════ ALINEACIÓN ════ */}
        {subTab === 'alineacion' && (
          <div className="max-w-4xl mx-auto">

            {/* Selector formación */}
            <p className="font-black text-[9px] tracking-[0.3em] text-zinc-600 uppercase mb-3">FORMACIÓN</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.keys(FORMATIONS).map(f => (
                <button
                  key={f}
                  onClick={() => changeFormation(f)}
                  className="px-4 py-2 border-2 font-black text-sm uppercase tracking-widest transition-all"
                  style={{
                    borderColor: formation === f ? ACCENT : '#3f3f46',
                    color: formation === f ? ACCENT : '#52525b',
                    background: formation === f ? 'rgba(200,255,0,0.06)' : 'transparent',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Slots 11 titulares */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {positions.map((pos, idx) => {
                const playerId    = lineup[idx];
                const player      = squad.find(p => p.id === playerId);
                const playerRoles = roles[playerId] || [];

                return (
                  <div key={pos.id} className="flex items-center gap-3 p-3 border border-zinc-800 bg-zinc-950 hover:border-zinc-600 transition-colors">
                    {/* Pos label */}
                    <div className="w-14 shrink-0 text-center">
                      <div className="font-black text-[9px] uppercase tracking-widest" style={{ color: ACCENT }}>{pos.id}</div>
                      <div className="font-bold text-[7px] text-zinc-700 leading-tight mt-0.5">{pos.label}</div>
                    </div>

                    {/* Jugador */}
                    {player ? (
                      <div className="flex-1 flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-sm shrink-0">
                          {player.number}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-sm text-white uppercase truncate">{player.name}</div>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {playerRoles.map(r => <RolePill key={r} roleKey={r} />)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedSlot(idx)}
                        className="flex-1 text-left text-zinc-700 hover:text-zinc-300 font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        + Asignar
                      </button>
                    )}

                    <div className="flex gap-1 shrink-0">
                      {player && (
                        <button
                          onClick={() => setSelectedSlot(idx)}
                          title="Cambiar jugador"
                          className="w-7 h-7 border border-zinc-700 text-zinc-500 hover:border-zinc-300 hover:text-white text-xs flex items-center justify-center transition-all"
                        >↔</button>
                      )}
                      {player && (
                        <button
                          onClick={() => setLineup(prev => { const n = [...prev]; n[idx] = null; return n; })}
                          title="Quitar del 11"
                          className="w-7 h-7 border border-zinc-800 text-zinc-700 hover:border-red-500 hover:text-red-400 text-sm flex items-center justify-center transition-all"
                        >×</button>
                      )}
                      {!player && (
                        <button
                          onClick={() => setSelectedSlot(idx)}
                          className="w-7 h-7 border border-zinc-800 hover:border-zinc-400 text-zinc-700 hover:text-white text-xs flex items-center justify-center transition-all"
                        >+</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ CANCHA VIRTUAL ════ */}
        {subTab === 'cancha' && (
          <div className="max-w-xs mx-auto">
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {Object.keys(FORMATIONS).map(f => (
                <button
                  key={f}
                  onClick={() => changeFormation(f)}
                  className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 transition-all"
                  style={{
                    borderColor: formation === f ? ACCENT : '#3f3f46',
                    color: formation === f ? ACCENT : '#52525b',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <VirtualPitch formation={formation} lineup={lineup} roles={roles} squad={squad} />
            <p className="text-center font-bold text-[8px] tracking-widest text-zinc-700 uppercase mt-3">
              Asigna jugadores desde la pestaña Alineación
            </p>
          </div>
        )}

        {/* ════ PLANTEL ════ */}
        {subTab === 'plantel' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="font-black text-[9px] tracking-[0.3em] text-zinc-600 uppercase">{squad.length} Jugadores</p>
              <button
                onClick={() => setShowAdd(true)}
                className="px-4 py-2 font-black text-[10px] uppercase tracking-widest border-2 transition-all"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                + Agregar
              </button>
            </div>

            <div className="space-y-px">
              {squad.map(p => {
                const inLineup    = lineup.includes(p.id);
                const playerRoles = roles[p.id] || [];
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 border border-zinc-900 hover:border-zinc-700 transition-colors"
                    style={{ background: inLineup ? '#0a0a0a' : '#050505' }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                      style={{
                        background: inLineup ? ACCENT : '#27272a',
                        color: inLineup ? '#000' : '#71717a',
                      }}
                    >
                      {p.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm uppercase text-white">{p.name}</span>
                        <span className="font-bold text-[8px] uppercase tracking-widest text-zinc-600 border border-zinc-800 px-1.5 py-0.5">{p.pos}</span>
                        {inLineup && (
                          <span className="font-bold text-[8px] uppercase tracking-widest" style={{ color: ACCENT }}>● TITULAR</span>
                        )}
                      </div>
                      {playerRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {playerRoles.map(r => <RolePill key={r} roleKey={r} />)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { if (window.confirm(`¿Quitar a ${p.name}?`)) removePlayer(p.id); }}
                      className="w-7 h-7 border border-zinc-800 text-zinc-700 hover:border-red-500 hover:text-red-400 text-sm flex items-center justify-center transition-all shrink-0"
                    >×</button>
                  </div>
                );
              })}
            </div>

            {/* Modal agregar */}
            {showAdd && (
              <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-4" onClick={() => setShowAdd(false)}>
                <div className="bg-zinc-900 border-2 border-zinc-700 w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                  <p className="font-black uppercase tracking-widest mb-6" style={{ color: ACCENT }}>NUEVO JUGADOR</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-black text-[9px] tracking-widest text-zinc-500 uppercase mb-1.5">Apellido</label>
                      <input
                        type="text"
                        value={newP.name}
                        onChange={e => setNewP(p => ({ ...p, name: e.target.value }))}
                        placeholder="Ej: García"
                        className="w-full p-3 border-2 border-zinc-700 bg-zinc-950 text-white font-bold text-sm outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-black text-[9px] tracking-widest text-zinc-500 uppercase mb-1.5">Número</label>
                        <input
                          type="number"
                          value={newP.number}
                          onChange={e => setNewP(p => ({ ...p, number: e.target.value }))}
                          placeholder="10"
                          className="w-full p-3 border-2 border-zinc-700 bg-zinc-950 text-white font-black text-center text-lg outline-none focus:border-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-black text-[9px] tracking-widest text-zinc-500 uppercase mb-1.5">Posición</label>
                        <select
                          value={newP.pos}
                          onChange={e => setNewP(p => ({ ...p, pos: e.target.value }))}
                          className="w-full p-3 border-2 border-zinc-700 bg-zinc-950 text-white font-bold text-sm outline-none focus:border-white transition-colors"
                        >
                          {['POR','DEF','MED','DEL'].map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowAdd(false)} className="flex-1 py-3 border-2 border-zinc-700 text-zinc-500 font-black text-xs uppercase tracking-widest hover:border-zinc-400 transition-colors">Cancelar</button>
                      <button
                        onClick={addPlayer}
                        className="flex-1 py-3 font-black text-xs uppercase tracking-widest border-2 transition-all"
                        style={{ background: ACCENT, color: '#000', borderColor: ACCENT }}
                      >+ Agregar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ ROLES ════ */}
        {subTab === 'roles' && (
          <div className="max-w-4xl mx-auto">
            <p className="font-black text-[9px] tracking-[0.3em] text-zinc-600 uppercase mb-6">
              ASIGNAR RESPONSABILIDADES A CADA JUGADOR
            </p>

            {/* Lista acordeón de jugadores */}
            <div className="space-y-px mb-10">
              {squad.map(p => {
                const playerRoles = roles[p.id] || [];
                const open = rolesOpen === p.id;
                return (
                  <div key={p.id} className="border border-zinc-800 bg-zinc-950">
                    <button
                      onClick={() => setRolesOpen(open ? null : p.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-zinc-900 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-black text-sm shrink-0">
                        {p.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-white uppercase">{p.name}</div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {playerRoles.length > 0
                            ? playerRoles.map(r => <RolePill key={r} roleKey={r} />)
                            : <span className="font-bold text-[8px] text-zinc-700 uppercase tracking-widest">Sin roles</span>
                          }
                        </div>
                      </div>
                      <span className={`text-zinc-600 text-xs shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {open && (
                      <div className="border-t border-zinc-800 p-4 bg-zinc-900">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {ROLE_DEFS.map(({ key, label, color }) => {
                            const active = playerRoles.includes(key);
                            return (
                              <button
                                key={key}
                                onClick={() => toggleRole(p.id, key)}
                                className="py-2.5 px-3 border-2 font-black text-[9px] uppercase tracking-widest transition-all text-left"
                                style={{
                                  borderColor: active ? color : '#3f3f46',
                                  color: active ? color : '#52525b',
                                  background: active ? 'rgba(0,0,0,0.3)' : 'transparent',
                                }}
                              >
                                {active ? '✓ ' : ''}{label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Resumen visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Capitán */}
              <SummaryCard
                label="Capitán" squad={squad} roles={roles}
                predicate={r => r.includes('captain')}
              />
              {/* Tiro libre */}
              <SummaryCard
                label="Tiro Libre" squad={squad} roles={roles}
                predicate={r => r.includes('freekick')}
              />
              {/* Corner D */}
              <SummaryCard
                label="Córner Derecho" squad={squad} roles={roles}
                predicate={r => r.includes('cornerR')}
              />
              {/* Corner I */}
              <SummaryCard
                label="Córner Izquierdo" squad={squad} roles={roles}
                predicate={r => r.includes('cornerL')}
              />

              {/* Penales */}
              <div className="border border-zinc-800 p-4 bg-zinc-950 md:col-span-2">
                <p className="font-black text-[9px] tracking-widest text-zinc-600 uppercase mb-3">Orden de Penales</p>
                <div className="flex flex-wrap gap-2">
                  {[1,2,3,4,5].map(n => {
                    const holder = squad.find(p => (roles[p.id] || []).includes(`penalty${n}`));
                    return (
                      <div key={n} className="flex items-center gap-2 border border-zinc-800 bg-zinc-900 p-2.5 min-w-32">
                        <span className="font-black text-lg tabular-nums" style={{ color: ACCENT }}>#{n}</span>
                        {holder ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-black text-xs">{holder.number}</div>
                            <span className="font-black text-xs text-white uppercase">{holder.name}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-[9px] text-zinc-700 uppercase tracking-widest">— Libre</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ COMPARTIR ════ */}
        {subTab === 'compartir' && (
          <div className="max-w-2xl mx-auto">
            <p className="font-black text-[9px] tracking-[0.3em] text-zinc-600 uppercase mb-6">
              IMAGEN PARA REDES · 1080 × 1920
            </p>

            {/* Preview fiel */}
            <div className="border-2 border-zinc-800 mb-6 overflow-hidden" style={{ aspectRatio: '9/16', background: '#000', position: 'relative' }}>
              {/* Borde lima */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: ACCENT }} />

              {/* Mitad izquierda: lista */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 p-4 md:p-6 flex flex-col">
                  <div>
                    <p className="font-black text-white text-lg md:text-3xl uppercase tracking-tighter leading-none">{clubName}</p>
                    <p className="font-black text-[8px] tracking-[0.2em] uppercase mt-1" style={{ color: ACCENT }}>
                      ALINEACIÓN CONFIRMADA
                    </p>
                    <p className="font-bold text-zinc-600 text-[7px] uppercase tracking-widest">Formación {formation}</p>

                    <div className="mt-3 space-y-0.5">
                      {[...positions].sort((a, b) => parseFloat(b.top) - parseFloat(a.top)).map((pos, i) => {
                        const slotIdx  = positions.indexOf(pos);
                        const playerId = lineup[slotIdx];
                        const player   = squad.find(p => p.id === playerId);
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <span className="font-black text-[8px] w-5 tabular-nums" style={{ color: ACCENT }}>
                              {player ? String(player.number).padStart(2,'0') : '--'}
                            </span>
                            <span className={`font-black text-[8px] uppercase ${player ? 'text-white' : 'text-zinc-800'}`}>
                              {player ? player.name : pos.label}
                            </span>
                            {(roles[playerId] || []).includes('captain') && (
                              <span className="text-[8px] font-black" style={{ color: ACCENT }}>©</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-zinc-900 pt-2">
                    <p className="font-bold text-zinc-800 text-[6px] uppercase tracking-widest">LIGA PRO · {clubName}</p>
                  </div>
                </div>

                {/* Mitad derecha: silueta */}
                <div className="w-2/5 relative flex items-end justify-center pb-2">
                  <svg viewBox="0 0 120 310" className="w-full h-auto" fill="none">
                    {/* Sombra */}
                    <ellipse cx="60" cy="305" rx="45" ry="8" fill="rgba(200,255,0,0.06)" />
                    {/* Piernas */}
                    <rect x="35" y="195" width="18" height="85" rx="5" fill="#111" />
                    <rect x="57" y="195" width="18" height="85" rx="5" fill="#111" />
                    {/* Zapatos */}
                    <ellipse cx="44" cy="283" rx="20" ry="7" fill="#000" transform="rotate(-5 44 283)" />
                    <ellipse cx="66" cy="283" rx="20" ry="7" fill="#000" transform="rotate(5 66 283)" />
                    {/* Cuerpo */}
                    <path d="M28 195 L18 80 L35 68 L60 76 L85 68 L102 80 L92 195 Z" fill="#111" />
                    {/* Número camiseta */}
                    <text x="60" y="150" textAnchor="middle" fill={ACCENT} fontSize="22" fontWeight="900" fontFamily="Arial">{formation}</text>
                    {/* Brazos */}
                    <rect x="6" y="82" width="16" height="65" rx="6" fill="#111" transform="rotate(15 6 82)" />
                    <rect x="98" y="82" width="16" height="65" rx="6" fill="#111" transform="rotate(-15 98 82)" />
                    {/* Cuello */}
                    <rect x="50" y="48" width="20" height="26" rx="4" fill="#c8956c" />
                    {/* Cabeza */}
                    <circle cx="60" cy="34" r="26" fill="#c8956c" />
                    {/* Pelo */}
                    <path d="M34 26 Q60 4 86 26 L82 36 Q60 16 38 36 Z" fill="#1a1a1a" />
                    {/* Balón */}
                    <circle cx="98" cy="230" r="18" fill="white" />
                    <circle cx="98" cy="230" r="8" fill="#222" />
                    {[0,60,120,180,240,300].map(a => (
                      <line key={a}
                        x1="98" y1="230"
                        x2={98 + Math.cos(a * Math.PI/180) * 18}
                        y2={230 + Math.sin(a * Math.PI/180) * 18}
                        stroke="#ccc" strokeWidth="0.5"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <button
              onClick={generateImage}
              className="w-full py-4 font-black text-sm uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-3"
              style={{ background: ACCENT, color: '#000', borderColor: ACCENT }}
            >
              ⬇ DESCARGAR IMAGEN (1080×1920)
            </button>
            <p className="text-center font-bold text-[9px] text-zinc-700 uppercase tracking-widest mt-3">
              Lista para Instagram Stories · WhatsApp · Redes
            </p>

            {/* Resumen */}
            <div className="mt-8 border border-zinc-800 bg-zinc-950 p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-[8px] text-zinc-600 uppercase tracking-widest mb-1">Formación</p>
                <p className="font-black text-white text-xl">{formation}</p>
              </div>
              <div>
                <p className="font-bold text-[8px] text-zinc-600 uppercase tracking-widest mb-1">Titulares</p>
                <p className="font-black text-white text-xl">{lineup.filter(Boolean).length} / {positions.length}</p>
              </div>
              <div>
                <p className="font-bold text-[8px] text-zinc-600 uppercase tracking-widest mb-1">Capitán</p>
                {(() => {
                  const cap = squad.find(p => (roles[p.id] || []).includes('captain'));
                  return <p className="font-black text-sm uppercase" style={{ color: ACCENT }}>{cap ? cap.name : '—'}</p>;
                })()}
              </div>
              <div>
                <p className="font-bold text-[8px] text-zinc-600 uppercase tracking-widest mb-1">Penal #1</p>
                {(() => {
                  const pen = squad.find(p => (roles[p.id] || []).includes('penalty1'));
                  return <p className="font-black text-sm uppercase text-white">{pen ? pen.name : '—'}</p>;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal selector de jugador para slot */}
      {selectedSlot !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-4" onClick={() => setSelectedSlot(null)}>
          <div className="bg-zinc-900 border-2 border-zinc-700 w-full max-w-md max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
              <div>
                <p className="font-black text-[9px] text-zinc-500 uppercase tracking-widest">Asignar a posición</p>
                <p className="font-black text-white uppercase">{positions[selectedSlot]?.label}</p>
              </div>
              <button onClick={() => setSelectedSlot(null)} className="text-zinc-500 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-2">
              {squad.map(p => {
                const alreadyIn = lineup.includes(p.id) && lineup[selectedSlot] !== p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => assignToSlot(selectedSlot, p.id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors text-left ${alreadyIn ? 'opacity-40' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-sm shrink-0">
                      {p.number}
                    </div>
                    <div>
                      <div className="font-black text-sm text-white uppercase">{p.name}</div>
                      <div className="font-bold text-[9px] text-zinc-500 uppercase tracking-widest">{p.pos}</div>
                    </div>
                    {alreadyIn && <span className="ml-auto font-bold text-[8px] text-zinc-700 uppercase tracking-widest">Ya en cancha</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tarjeta resumen de rol
function SummaryCard({ label, squad, roles, predicate }) {
  const holder = squad.find(p => predicate(roles[p.id] || []));
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-black text-[9px] tracking-widest text-zinc-600 uppercase mb-2">{label}</p>
      {holder ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs">{holder.number}</div>
          <span className="font-black text-white uppercase text-sm">{holder.name}</span>
        </div>
      ) : (
        <span className="font-bold text-zinc-700 text-xs uppercase tracking-widest">— Sin asignar</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROSTER PÚBLICO (original brutalista con lima)
// ─────────────────────────────────────────────────────────────────────────────
function BrutalistPlayerList() {
  const defaultRoster = [
    { id: 1,  name: 'Carlos Mendoza',  number: '1',  pos: 'POR', stats: '12 PJ' },
    { id: 2,  name: 'Andrés Silva',    number: '4',  pos: 'DEF', stats: '2 G · 1 A' },
    { id: 3,  name: 'Roberto Gómez',   number: '5',  pos: 'DEF', stats: '5 TA' },
    { id: 4,  name: 'Felipe Vargas',   number: '8',  pos: 'MED', stats: '4 A' },
    { id: 5,  name: 'Martín Rojas',    number: '10', pos: 'MED', stats: '6 G · 5 A' },
    { id: 6,  name: 'Diego Torres',    number: '9',  pos: 'DEL', stats: '12 G' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between border-b border-black pb-4 mb-6">
        <h3 className="font-black text-2xl uppercase tracking-tighter">Plantel Activo</h3>
        <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Temporada 2026</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultRoster.map(player => (
          <div key={player.id} className="bg-white border border-zinc-200 hover:border-black transition-colors flex items-center p-4 group cursor-pointer">
            <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
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

// ─────────────────────────────────────────────────────────────────────────────
// PIZARRA TÁCTICA PÚBLICA (original)
// ─────────────────────────────────────────────────────────────────────────────
function BrutalistTacticalBoard() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-black pb-4 mb-6">
        <h3 className="font-black text-2xl uppercase tracking-tighter">Esquema Táctico</h3>
        <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Formación: 4-3-3</span>
      </div>
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-zinc-900 border-4 border-black overflow-hidden">
        <div className="absolute inset-0 border-[2px] border-zinc-700 m-4 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-zinc-700 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-[2px] border-zinc-700 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-48 border-[2px] border-zinc-700 pointer-events-none" />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-24 h-48 border-[2px] border-zinc-700 pointer-events-none" />
        {[
          { num:'1',  top:'50%', left:'12%', label:'POR' },
          { num:'4',  top:'20%', left:'30%', label:'LD'  },
          { num:'5',  top:'40%', left:'25%', label:'DFC' },
          { num:'2',  top:'60%', left:'25%', label:'DFC' },
          { num:'3',  top:'80%', left:'30%', label:'LI'  },
          { num:'8',  top:'35%', left:'50%', label:'MC'  },
          { num:'6',  top:'50%', left:'45%', label:'MCD' },
          { num:'10', top:'65%', left:'50%', label:'MCO' },
          { num:'7',  top:'25%', left:'75%', label:'ED'  },
          { num:'9',  top:'50%', left:'80%', label:'DC'  },
          { num:'11', top:'75%', left:'75%', label:'EI'  },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
            style={{ top: p.top, left: p.left }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-black text-black font-black text-sm md:text-lg flex items-center justify-center shadow-lg" style={{ background: ACCENT }}>
              {p.num}
            </div>
            <span className="mt-1 font-bold text-[9px] tracking-widest text-zinc-400 bg-black px-1.5 py-0.5 uppercase">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL: PERFIL DEL CLUB
// ─────────────────────────────────────────────────────────────────────────────
export default function ClubProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('plantel');

  const clubData = {
    name:      id ? id.toUpperCase() : 'PATRIOTAS FC',
    initial:   id ? id.charAt(0).toUpperCase() : 'P',
    founded:   '1998',
    category:  'Dorado',
    stadium:   'Estadio Olímpico de la Ciudad',
    headCoach: 'Martín Ramírez',
    description: 'Franquicia histórica de la liga. Conocidos por su férrea defensa y un ataque letal por las bandas. Siempre contendientes al título.',
    stats: { wins: 15, draws: 3, losses: 2, championships: 4 },
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-black pb-20">

      {/* Nav */}
      <div className="bg-white border-b border-zinc-200 h-14 flex items-center px-6 sticky top-0 z-20">
        <Link to="/posiciones" className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:text-black transition-colors flex items-center gap-2">
          ← Volver a Posiciones
        </Link>
      </div>

      {/* Hero */}
      <section className="bg-black relative overflow-hidden px-6 py-12 md:py-20 border-b-4" style={{ borderColor: ACCENT }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 47px,#fff 47px,#fff 48px),repeating-linear-gradient(90deg,transparent,transparent 47px,#fff 47px,#fff 48px)' }}
        />
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 font-black text-[120px] md:text-[200px] text-zinc-900 tracking-tighter whitespace-nowrap pointer-events-none select-none z-0">
          {clubData.name}
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 text-white">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white text-black rounded-full flex items-center justify-center font-black text-7xl md:text-9xl shrink-0 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            {clubData.initial}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <span className="font-black text-[10px] tracking-widest uppercase px-3 py-1 text-black" style={{ background: ACCENT }}>
                Categoría {clubData.category}
              </span>
              <span className="border border-zinc-700 text-zinc-400 font-bold text-[10px] tracking-widest uppercase px-3 py-1">
                Fundado en {clubData.founded}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-4">{clubData.name}</h1>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed mb-8">{clubData.description}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12 pt-6 border-t border-zinc-800">
              <div>
                <div className="font-black text-2xl md:text-3xl text-white">{clubData.stats.championships}</div>
                <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Títulos</div>
              </div>
              <div>
                <div className="font-black text-2xl md:text-3xl" style={{ color: ACCENT }}>{clubData.stats.wins}</div>
                <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Victorias</div>
              </div>
              <div>
                <div className="font-black text-lg text-white">{clubData.headCoach}</div>
                <div className="font-bold text-[9px] uppercase tracking-widest text-zinc-500">Director Técnico</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex overflow-x-auto border-b-2 border-zinc-200 no-scrollbar">
          {[
            { id: 'plantel',  label: 'Roster Oficial' },
            { id: 'tactica',  label: 'Pizarra Táctica' },
            { id: 'camarin',  label: '🔒 Camarín (Coach)' },
            { id: 'historial',label: 'Historial' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 md:px-8 py-4 font-black text-xs uppercase tracking-widest transition-colors whitespace-nowrap relative"
              style={{ color: activeTab === tab.id ? '#000' : '#a1a1aa' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-2px] left-0 w-full h-1" style={{ background: ACCENT }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className={activeTab !== 'camarin' ? 'max-w-6xl mx-auto px-6 pt-10' : ''}>
        {activeTab === 'plantel'   && <BrutalistPlayerList />}
        {activeTab === 'tactica'   && <BrutalistTacticalBoard />}
        {activeTab === 'camarin'   && <Camarin clubName={clubData.name} />}
        {activeTab === 'historial' && (
          <div className="py-20 text-center border-2 border-dashed border-zinc-300">
            <span className="text-4xl block mb-4 opacity-50">🏆</span>
            <h3 className="font-black text-2xl uppercase tracking-tighter text-zinc-400">Próximamente</h3>
            <p className="font-bold text-[10px] tracking-widest uppercase text-zinc-500 mt-2">
              El historial de partidos se conectará pronto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}