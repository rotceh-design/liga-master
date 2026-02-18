import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Para desarrollo, iniciamos como Comisionado por defecto
  const [isAdmin, setIsAdmin] = useState(true); 

  // Esta es la nueva función mágica para cambiar de vista
  const toggleRole = () => {
    setIsAdmin(!isAdmin);
  };

  const value = {
    isAdmin,
    toggleRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}