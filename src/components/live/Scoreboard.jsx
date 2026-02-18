import React from 'react';
import Badge from '../ui/Badge';
import logoLocal from '../../assets/logo.png';

export default function Scoreboard({ matchData }) {
  // Datos adaptados al Fútbol
  const defaultMatch = {
    category: 'Dorado',
    status: 'EN JUEGO',
    period: '2T',
    time: '68:45',
    home: { name: 'PATRIOTAS', score: 2, logo: logoLocal, color: 'bg-white' },
    away: { name: 'RIVAL FC', score: 1, logo: logoLocal, color: 'bg-zinc-800' }
  };

  const match = matchData || defaultMatch;

  return (
    <div className="bg-black text-white p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
      
      {/* Indicador superior */}
      <div className="absolute top-6 w-full px-8 flex justify-between items-center z-10">
        <Badge variant="dorado" className="border-zinc-700 text-zinc-300">{match.category}</Badge>
        <div className="flex items-center gap-3">
          <Badge variant="live">{match.status}</Badge>
        </div>
      </div>

      {/* Reloj Central de Fútbol */}
      <div className="text-center z-10 mb-8 mt-4">
        <span className="text-zinc-400 font-bold tracking-widest text-sm mr-4">{match.period}</span>
        <span className="text-5xl md:text-7xl font-black tabular-nums tracking-tighter">
          {match.time}
        </span>
      </div>

      {/* Marcador Principal */}
      <div className="flex justify-between items-center w-full max-w-2xl z-10">
        
        {/* Local */}
        <div className="flex flex-col items-center w-1/3">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full p-2 mb-4 flex items-center justify-center">
             <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain" />
          </div>
          <h2 className="text-lg md:text-xl font-black tracking-widest">{match.home.name}</h2>
        </div>

        {/* Goles */}
        <div className="flex items-center justify-center w-1/3 gap-4 md:gap-8">
          <span className="text-6xl md:text-8xl font-black">{match.home.score}</span>
          <span className="text-3xl text-zinc-700 pb-2">-</span>
          <span className="text-6xl md:text-8xl font-black">{match.away.score}</span>
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center w-1/3">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-zinc-900 rounded-full p-2 mb-4 flex items-center justify-center border border-zinc-800">
             <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain grayscale" />
          </div>
          <h2 className="text-lg md:text-xl font-black tracking-widest text-zinc-400">{match.away.name}</h2>
        </div>
      </div>

      {/* Fondo decorativo minimalista */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <div className="w-[120%] h-px bg-white transform rotate-45"></div>
        <div className="w-[120%] h-px bg-white transform -rotate-45 absolute"></div>
      </div>
    </div>
  );
}