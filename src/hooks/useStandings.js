import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export function useStandings(category) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no pasamos una categoría, no hacemos la consulta
    if (!category) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Referencia a la colección "teams" (equipos)
      const teamsRef = collection(db, 'teams');
      
      // Creamos la consulta: filtrar por categoría y ordenar por victorias
      const q = query(
        teamsRef, 
        where('category', '==', category),
        orderBy('wins', 'desc'),
        orderBy('pointsFor', 'desc') // Criterio de desempate
      );

      // onSnapshot mantiene la tabla actualizada en tiempo real
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const teamsData = [];
        snapshot.forEach((doc) => {
          teamsData.push({ id: doc.id, ...doc.data() });
        });

        // Si Firebase está vacío, inyectamos datos de prueba para que puedas diseñar
        if (teamsData.length === 0) {
          console.warn(`No hay equipos en Firebase para la categoría ${category}. Usando datos de prueba.`);
          const mockData = [
            { id: '1', name: 'Patriotas', wins: 5, losses: 1, ties: 0, pointsFor: 120, pointsAgainst: 45 },
            { id: '2', name: 'Cuervos', wins: 4, losses: 2, ties: 0, pointsFor: 98, pointsAgainst: 60 },
            { id: '3', name: 'Leones', wins: 3, losses: 3, ties: 0, pointsFor: 75, pointsAgainst: 80 },
            { id: '4', name: 'Titanes', wins: 1, losses: 5, ties: 0, pointsFor: 40, pointsAgainst: 148 },
          ];
          setStandings(mockData);
        } else {
          setStandings(teamsData);
        }
        
        setLoading(false);
      }, (err) => {
        console.error("Error al obtener posiciones:", err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
      
    } catch (err) {
      console.error("Error en la configuración de la consulta:", err);
      setError(err.message);
      setLoading(false);
    }

  }, [category]);

  return { standings, loading, error };
}