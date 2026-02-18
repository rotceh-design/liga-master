import React from 'react';

export default function Card({ children, className = '', onClick }) {
  const interactiveStyles = onClick ? "cursor-pointer hover:border-black transition-colors" : "";

  return (
    <div 
      className={`bg-white border border-zinc-200 overflow-hidden ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}