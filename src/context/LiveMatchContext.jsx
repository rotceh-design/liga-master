import React, { createContext, useContext, useState } from 'react';

const LiveMatchContext = createContext();

export const useLiveMatch = () => useContext(LiveMatchContext);

export function LiveMatchProvider({ children }) {
  // Simulamos un partido de fútbol inicial
  const [activeMatch, setActiveMatch] = useState({
    status: 'EN JUEGO',
    period: '1T',
    home: { name: 'PATRIOTAS', score: 0 },
    away: { name: 'RIVAL FC', score: 0 }
  });

  const [loadingMatch, setLoadingMatch] = useState(false);
  
  // Estado para la Línea de Tiempo (Play-by-Play)
  const [matchEvents, setMatchEvents] = useState([
    { id: 1, minute: "00'", type: "INFO", text: "Inicio del primer tiempo. Mueve Patriotas." }
  ]);

  // Función para actualizar el marcador
  const updateScore = (teamId, pointsToAdd) => {
    setActiveMatch(prev => ({
      ...prev,
      [teamId]: { ...prev[teamId], score: prev[teamId].score + pointsToAdd }
    }));
  };

  // NUEVA FUNCIÓN: Agregar un evento a la línea de tiempo
  const addTimelineEvent = (minute, type, text) => {
    const newEvent = {
      id: Date.now(), // ID único temporal
      minute: minute.includes("'") ? minute : `${minute}'`, // Aseguramos que tenga el apóstrofe de minutos
      type,
      text
    };
    // Lo agregamos al principio de la lista para que el más reciente salga arriba
    setMatchEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const value = {
    activeMatch,
    loadingMatch,
    matchEvents,
    updateScore,
    addTimelineEvent
  };

  return (
    <LiveMatchContext.Provider value={value}>
      {children}
    </LiveMatchContext.Provider>
  );
}