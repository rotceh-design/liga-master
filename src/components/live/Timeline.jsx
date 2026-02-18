import React from 'react';
import { useLiveMatch } from '../../context/LiveMatchContext';

export default function Timeline() {
  const { matchEvents } = useLiveMatch();

  // Función para darle un estilo/icono visual dependiendo del tipo de evento
  const renderEventIcon = (type) => {
    switch(type) {
      case 'GOL':
        return <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold">⚽</div>;
      case 'AMARILLA':
        return <div className="w-5 h-6 bg-yellow-400 rounded-sm shadow-sm border border-yellow-500 transform rotate-6"></div>;
      case 'ROJA':
        return <div className="w-5 h-6 bg-red-600 rounded-sm shadow-sm border border-red-700 transform rotate-6"></div>;
      case 'CAMBIO':
        return <div className="w-6 h-6 flex items-center justify-center text-green-600 text-lg font-black">⇄</div>;
      default:
        return <div className="w-3 h-3 bg-zinc-300 rounded-full"></div>;
    }
  };

  return (
    <div className="bg-white border border-zinc-200 h-full flex flex-col">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50">
        <h3 className="font-black text-sm uppercase tracking-widest text-zinc-800">
          Play-by-Play
        </h3>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[600px] flex-1">
        {matchEvents.length === 0 ? (
          <p className="text-zinc-400 text-sm text-center italic mt-10">Esperando el pitazo inicial...</p>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
            
            {matchEvents.map((event) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-slide-up">
                
                {/* Ícono central */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-zinc-50 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {renderEventIcon(event.type)}
                </div>
                
                {/* Tarjeta de texto */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 border border-zinc-100 rounded-none bg-white shadow-sm hover:border-black transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black bg-zinc-100 text-black px-2 py-0.5 tracking-wider font-mono">
                      {event.minute}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 font-medium leading-relaxed">
                    {event.text}
                  </p>
                </div>
                
              </div>
            ))}
            
          </div>
        )}
      </div>
    </div>
  );
}