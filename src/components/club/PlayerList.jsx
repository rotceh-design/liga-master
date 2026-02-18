import React from 'react';
import playerPlaceholder from '../../assets/player-placeholder.png'; // Tu imagen local por defecto

export default function PlayerList({ players }) {
  // Datos de prueba por si no se le pasan jugadores por props
  const defaultRoster = [
    { id: 1, name: 'Carlos Mendoza', number: '12', position: 'QB', weight: '95kg', height: '1.88m' },
    { id: 2, name: 'Andrés Silva', number: '88', position: 'WR', weight: '88kg', height: '1.82m' },
    { id: 3, name: 'Roberto Gómez', number: '55', position: 'LB', weight: '105kg', height: '1.90m' },
    { id: 4, name: 'Felipe Vargas', number: '24', position: 'RB', weight: '92kg', height: '1.78m' },
  ];

  const roster = players || defaultRoster;

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-blue-200 pb-2">
        Plantel Activo
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {roster.map((player) => (
          <div 
            key={player.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center p-4"
          >
            {/* Foto del jugador */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-blue-50">
              <img 
                src={player.photo || playerPlaceholder} 
                alt={`Foto de ${player.name}`} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg=='; }}
              />
            </div>
            
            {/* Información */}
            <h4 className="font-bold text-lg text-gray-800 text-center">{player.name}</h4>
            
            <div className="flex items-center justify-center space-x-2 mt-2 w-full">
              <span className="bg-blue-900 text-white font-black text-sm px-3 py-1 rounded-md">
                #{player.number}
              </span>
              <span className="bg-gray-200 text-gray-700 font-bold text-sm px-3 py-1 rounded-md">
                {player.position}
              </span>
            </div>
            
            {/* Estadísticas físicas (Opcional) */}
            <div className="flex space-x-4 mt-4 text-xs text-gray-500">
              <span>{player.height}</span>
              <span>•</span>
              <span>{player.weight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}