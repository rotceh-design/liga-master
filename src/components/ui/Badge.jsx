import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const baseStyle = "text-[10px] font-black px-2 py-1 uppercase tracking-widest inline-block";
  
  const variants = {
    default: "bg-zinc-100 text-zinc-500",
    live: "bg-green-500 text-black animate-pulse", // Verde neón estilo fitness
    diamante: "bg-black text-white",
    dorado: "border border-black text-black",
    superSenior: "bg-zinc-200 text-black",
  };

  return (
    <span className={`${baseStyle} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}