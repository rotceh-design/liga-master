import React from 'react';

export default function TacticalBoard({ starters }) {
  // Formación de prueba (posiciones relativas en % dentro de la cancha)
  const defaultStarters = [
    { id: 1, number: '12', name: 'Mendoza', top: '80%', left: '50%' }, // QB
    { id: 2, number: '24', name: 'Vargas', top: '90%', left: '50%' },  // RB
    { id: 3, number: '88', name: 'Silva', top: '65%', left: '15%' },   // WR
    { id: 4, number: '10', name: 'Pérez', top: '65%', left: '85%' },   // WR
    { id: 5, number: '77', name: 'Rojas', top: '65%', left: '50%' },   // C
    { id: 6, number: '65', name: 'Díaz', top: '65%', left: '35%' },    // LG
    { id: 7, number: '68', name: 'López', top: '65%', left: '65%' },   // RG
  ];

  const onField = starters || defaultStarters;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2">
        Esquema Táctico
      </h3>
      
      {/* Contenedor de la Cancha */}
      <div className="relative w-full h-[500px] bg-green-700 border-4 border-white rounded-lg shadow-inner overflow-hidden">
        
        {/* Líneas de la cancha dibujadas con CSS */}
        <div className="absolute top-0 w-full h-full flex flex-col justify-between py-8 opacity-40">
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
        </div>

        {/* Renderizado de Jugadores en el campo */}
        {onField.map((player) => (
          <div 
            key={player.id}
            className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ top: player.top, left: player.left }}
          >
            {/* Círculo del jugador */}
            <div className="w-10 h-10 bg-blue-900 border-2 border-white text-white rounded-full flex items-center justify-center font-bold shadow-lg">
              {player.number}
            </div>
            {/* Nombre debajo */}
            <span className="text-white text-xs font-semibold mt-1 bg-black bg-opacity-50 px-2 py-0.5 rounded">
              {player.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        * Las posiciones son ilustrativas y dependen de la jugada o esquema.
      </div>
    </div>
  );
}