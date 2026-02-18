import React, { useState } from 'react';
import { useLiveMatch } from '../../context/LiveMatchContext';
import { useMatchTime } from '../../hooks/useMatchTime';

export default function PanelComisionado({ homeName = "Local", awayName = "Visitante" }) {
  const { updateScore, addTimelineEvent } = useLiveMatch();
  const { formattedTime } = useMatchTime(); // Para sugerir el minuto actual
  
  // Estado para el formulario de la línea de tiempo
  const [eventText, setEventText] = useState('');
  const [eventType, setEventType] = useState('GOL');
  const [eventMinute, setEventMinute] = useState('');

  // Manejar el envío de un nuevo incidente
  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    if (!eventText.trim()) return;
    
    // Si no pone minuto, usamos uno por defecto o el del reloj
    const minuteToLog = eventMinute || formattedTime.split(':')[0] || "45"; 
    
    addTimelineEvent(minuteToLog, eventType, eventText);
    
    // Limpiar el formulario
    setEventText('');
    setEventMinute('');
  };

  const renderQuickControls = (teamName, teamId) => (
    <div className="flex-1 p-6 border border-zinc-200 bg-white">
      <h3 className="font-black text-xl text-center uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">{teamName}</h3>
      <button 
        onClick={() => {
          updateScore(teamId, 1);
          addTimelineEvent(formattedTime.split(':')[0], 'GOL', `¡GOL DE ${teamName}!`);
        }}
        className="w-full py-4 bg-black text-white font-black tracking-widest hover:bg-zinc-800 transition-colors mb-4"
      >
        + GOL
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button className="py-2 border border-yellow-400 text-yellow-600 font-bold text-sm tracking-wider hover:bg-yellow-50 transition-colors uppercase">
          Ambar
        </button>
        <button className="py-2 border border-red-500 text-red-600 font-bold text-sm tracking-wider hover:bg-red-50 transition-colors uppercase">
          Roja
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controles Rápidos de Marcador */}
      <div className="flex flex-col md:flex-row gap-4">
        {renderQuickControls(homeName, 'home')}
        {renderQuickControls(awayName, 'away')}
      </div>

      {/* REGISTRO DE INCIDENTES (TIMELINE LOGGER) */}
      <div className="bg-white border border-zinc-200 p-6">
        <h3 className="font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Bitácora del Partido
        </h3>
        
        <form onSubmit={handleIncidentSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-24">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Minuto</label>
            <input 
              type="text" 
              placeholder="Ej: 45'" 
              value={eventMinute}
              onChange={(e) => setEventMinute(e.target.value)}
              className="w-full p-3 border border-zinc-300 focus:border-black outline-none font-mono font-bold text-center"
            />
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tipo</label>
            <select 
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-3 border border-zinc-300 focus:border-black outline-none font-bold uppercase tracking-wider"
            >
              <option value="GOL">Gol</option>
              <option value="AMARILLA">T. Amarilla</option>
              <option value="ROJA">T. Roja</option>
              <option value="CAMBIO">Cambio</option>
              <option value="FALTA">Falta / Lesión</option>
              <option value="INFO">Info General</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Detalle de la acción</label>
            <input 
              type="text" 
              placeholder="Ej: Pase filtrado de Carlos, define al palo derecho..." 
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              className="w-full p-3 border border-zinc-300 focus:border-black outline-none font-medium"
            />
          </div>

          <button 
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-zinc-900 text-white font-black tracking-widest uppercase hover:bg-black transition-colors"
          >
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}